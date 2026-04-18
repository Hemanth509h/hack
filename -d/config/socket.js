import { Server as SocketServer } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import jwt from "jsonwebtoken";
import { Message } from "../models/Message";
import { Conversation } from "../models/Conversation";
import { User } from "../models/User";
import mongoose from "mongoose";

let io;

// Per-socket event rate limiter state
const rateLimitMap = new Map();

const RATE_LIMIT = { maxEvents: 30, windowMs: 10_000 }; // 30 events per 10s per socket

/**
 * Check if a socket is within its rate limit.
 * Returns true if allowed, false if throttled.
 */
const checkRateLimit = (socketId) => {
  const now = Date.now();
  const entry = rateLimitMap.get(socketId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(socketId, {
      count: 1,
      resetAt: now + RATE_LIMIT.windowMs,
    });
    return true;
  }

  if (entry.count >= RATE_LIMIT.maxEvents) return false;

  entry.count++;
  return true;
};

/** Format a standard room identifier string */
export const roomId = (type, id) => `${type}:${id}`;

export const initializeSocket = async (httpServer) => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60_000,
    pingInterval: 25_000,
  });

  // ---- Redis Adapter (horizontal scaling across multiple Node processes) ----
  try {
    const redisUrl = process.env.REDIS_URI || "redis://localhost:6379";
    const pubClient = createClient({
      url: redisUrl,
      socket: { reconnectStrategy: (retries) => (retries > 3 ? false : 100) },
    });
    const subClient = pubClient.duplicate();

    await Promise.all([pubClient.connect(), subClient.connect()]);
    io.adapter(createAdapter(pubClient, subClient));
    console.log("[socket]: Redis adapter attached for horizontal scaling");
  } catch (err) {
    console.warn(
      "[socket]: Redis adapter failed to connect. Falling back to local in-memory adapter.",
    );
  }

  // ---- JWT Authentication Middleware ----
  io.use((socket, next) => {
    // Check both handshake auth and headers (for flexibility across different client libraries)
    let token =
      socket.handshake.auth?.token || socket.handshake.headers["authorization"];
    if (token?.startsWith("Bearer ")) {
      token = token.slice(7);
    }

    if (!token) return next(new Error("AUTH_REQUIRED"));

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || "secret");
      socket.userId = payload.userId;
      socket.role = payload.role;
      next();
    } catch {
      next(new Error("INVALID_TOKEN"));
    }
  });

  // ---- Connection Handler ----
  io.on("connection", (socket) => {
    const userId = socket.userId;
    console.log(`[socket]: User ${userId} connected (${socket.id})`);

    // Auto-join personal private room
    socket.join(roomId("user", userId));

    // ----------------------------------------------------------------
    // ROOM MANAGEMENT
    // ----------------------------------------------------------------
    socket.on("room:join", (payload) => {
      if (!checkRateLimit(socket.id))
        return socket.emit("error", { code: "RATE_LIMITED" });
      const room = roomId(payload.type, payload.id);
      socket.join(room);
      socket.emit("room:joined", { room });
    });

    socket.on("room:leave", (payload) => {
      const room = roomId(payload.type, payload.id);
      socket.leave(room);
    });

    // ----------------------------------------------------------------
    // LIVE CHAT — send message to a room
    // ----------------------------------------------------------------
    socket.on("chat:send", async (payload) => {
      if (!checkRateLimit(socket.id))
        return socket.emit("error", { code: "RATE_LIMITED" });
      if (!payload.content?.trim()) return;

      try {
        const sender = await User.findById(userId).select("name avatar").lean();

        const message = await Message.create({
          roomType: payload.roomType,
          roomId: new mongoose.Types.ObjectId(payload.roomId),
          sender: new mongoose.Types.ObjectId(userId),
          content: payload.content.trim(),
          type: "text",
        });

        // Broadcast message to everyone in the room (including sender for confirmation)
        const room = roomId(payload.roomType, payload.roomId);
        io.to(room).emit("chat:message", {
          _id: message._id,
          content: message.content,
          roomType: message.roomType,
          roomId: message.roomId,
          type: message.type,
          sender,
          createdAt: message.createdAt,
        });

        // Update conversation if it's a direct message
        if (payload.roomType === "direct") {
          await Conversation.findByIdAndUpdate(payload.roomId, {
            lastMessage: message._id,
            updatedAt: new Date(),
          });
        }
      } catch (err) {
        socket.emit("error", {
          code: "CHAT_FAILED",
          message: "Message delivery failed",
        });
      }
    });

    // ----------------------------------------------------------------
    // TYPING INDICATORS
    // ----------------------------------------------------------------
    socket.on("chat:typing", (payload) => {
      if (!checkRateLimit(socket.id)) return;
      const room = roomId(payload.roomType, payload.roomId);
      socket.to(room).emit("chat:typing", { userId });
    });

    // ----------------------------------------------------------------
    // CHAT HISTORY — request recent messages for a room
    // ----------------------------------------------------------------
    socket.on("chat:history", async (payload) => {
      if (!checkRateLimit(socket.id))
        return socket.emit("error", { code: "RATE_LIMITED" });
      try {
        const messages = await Message.find({
          roomType: payload.roomType,
          roomId: new mongoose.Types.ObjectId(payload.roomId),
        })
          .sort({ createdAt: -1 })
          .limit(payload.limit || 50)
          .populate("sender", "name avatar")
          .lean();

        socket.emit("chat:history", {
          roomType: payload.roomType,
          roomId: payload.roomId,
          messages: messages.reverse(),
        });
      } catch (err) {
        socket.emit("error", {
          code: "HISTORY_FAILED",
          message: "Failed to load chat history",
        });
      }
    });

    // ----------------------------------------------------------------
    // DISCONNECT CLEANUP
    // ----------------------------------------------------------------
    socket.on("disconnect", (reason) => {
      rateLimitMap.delete(socket.id);
      console.log(`[socket]: User ${userId} disconnected — ${reason}`);
    });

    socket.on("error", (err) => {
      console.error(`[socket]: Socket error for user ${userId}:`, err.message);
    });
  });

  return io;
};

// ----------------------------------------------------------------
// EMISSION HELPERS — called from controllers/services
// ----------------------------------------------------------------

/** Emit to a specific user's private room */
export const emitToUser = (userId, event, data) => {
  if (!io) return;
  io.to(roomId("user", userId)).emit(event, data);
};

/** Broadcast to a shared room (event/club/project/direct) */
export const emitToRoom = (type, id, event, data) => {
  if (!io) return;
  io.to(roomId(type, id)).emit(event, data);
};

/**
 * Emit live RSVP count update to everyone watching an event room.
 * Called from the RSVP controller after a successful RSVP action.
 */
export const emitRsvpUpdate = (eventId, rsvpCount, action) => {
  emitToRoom("event", eventId, "event:rsvp_update", {
    eventId,
    rsvpCount,
    action,
  });
};

/**
 * Emit event status change (live → completed/cancelled etc.)
 */
export const emitEventStatusChange = (eventId, status) => {
  emitToRoom("event", eventId, "event:status_change", { eventId, status });
};

/**
 * Broadcast a club announcement to the club room + persist as a Message.
 */
export const emitClubAnnouncement = async (
  clubId,
  senderId,
  title,
  content,
) => {
  // Persist as a system announcement message
  const message = await Message.create({
    roomType: "club",
    roomId: new mongoose.Types.ObjectId(clubId),
    sender: new mongoose.Types.ObjectId(senderId),
    content: `📣 ${title}: ${content}`,
    type: "announcement",
  });

  emitToRoom("club", clubId, "club:announcement", {
    _id: message._id,
    title,
    content,
    clubId,
    createdAt: message.createdAt,
  });
};

/**
 * Emit to users interested in a newly created event.
 */
export const emitNewEventMatch = (userIds, event) => {
  if (!io) return;
  userIds.forEach((userId) => {
    io.to(roomId("user", userId)).emit("event:new_match", {
      event: {
        _id: event._id,
        title: event.title,
        date: event.date,
        location: event.location,
        category: event.category,
      },
    });
  });
};

export const getIO = () => io;
