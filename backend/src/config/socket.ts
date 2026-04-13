import { Server as HTTPServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../utils/jwt.utils';

let io: SocketServer;

export const initializeSocket = (httpServer: HTTPServer): SocketServer => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  // JWT Authentication Middleware for every socket connection
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('Authentication required'));

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'secret') as TokenPayload;
      (socket as any).userId = payload.userId;
      (socket as any).role = payload.role;
      next();
    } catch {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId as string;
    console.log(`[socket]: User ${userId} connected (${socket.id})`);

    // Join a personal room — used to deliver private notifications
    socket.join(`user:${userId}`);

    // Room-based architecture: clients can join event/club/project rooms
    socket.on('join:room', (roomId: string) => {
      socket.join(roomId);
      console.log(`[socket]: User ${userId} joined room ${roomId}`);
    });

    socket.on('leave:room', (roomId: string) => {
      socket.leave(roomId);
    });

    socket.on('disconnect', () => {
      console.log(`[socket]: User ${userId} disconnected`);
    });
  });

  return io;
};

/** Emit a notification to a specific user's private Socket.io room */
export const emitToUser = (userId: string, event: string, data: any) => {
  if (!io) return;
  io.to(`user:${userId}`).emit(event, data);
};

/** Broadcast to a shared room (e.g. event room for live RSVP counts) */
export const emitToRoom = (roomId: string, event: string, data: any) => {
  if (!io) return;
  io.to(roomId).emit(event, data);
};

export const getIO = () => io;
