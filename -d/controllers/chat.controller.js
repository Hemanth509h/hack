import { Message } from "../models/Message";
import { Conversation } from "../models/Conversation";
import mongoose from "mongoose";

/**
 * @desc    Get message history for a room
 * @route   GET /api/v1/chat/:roomType/:roomId
 */
export const getMessageHistory = async (req, res) => {
  try {
    const { roomType, roomId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    if (!["event", "club", "project", "direct"].includes(roomType)) {
      return res
        .status(400)
        .json({
          error: "Invalid room type. Must be event, club, project, or direct.",
        });
    }

    const messages = await Message.find({
      roomType,
      roomId: new mongoose.Types.ObjectId(roomId),
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("sender", "name avatar");

    // Return in chronological order for the client
    res.json({ messages: messages.reverse() });
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to fetch message history",
        details: error.message,
      });
  }
};

/**
 * @desc    Delete a chat message (owner or admin only)
 * @route   DELETE /api/v1/chat/messages/:id
 */
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ error: "Message not found" });

    if (
      message.sender.toString() !== req.user.userId &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this message" });
    }

    await message.deleteOne();
    res.json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete message" });
  }
};
/**
 * @desc    Get all conversations for the user
 * @route   GET /api/v1/chat/conversations
 */
export const getConversations = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const conversations = await Conversation.find({ participants: userId })
      .populate("participants", "name avatar major")
      .populate({
        path: "lastMessage",
        populate: { path: "sender", select: "name" },
      })
      .sort({ updatedAt: -1 });

    res.json({ conversations });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch conversations", details: error.message });
  }
};

/**
 * @desc    Find or create a conversation between two users
 * @route   POST /api/v1/chat/conversations
 */
export const getOrCreateConversation = async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const otherId = new mongoose.Types.ObjectId(participantId);

    if (userId.equals(otherId)) {
      return res
        .status(400)
        .json({ error: "Cannot start conversation with yourself" });
    }

    // Find existing conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, otherId], $size: 2 },
    }).populate("participants", "name avatar major");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, otherId],
      });
      await conversation.populate("participants", "name avatar major");
    }

    res.json({ conversation });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to handle conversation", details: error.message });
  }
};
