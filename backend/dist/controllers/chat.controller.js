"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.getMessageHistory = void 0;
const Message_1 = require("../models/Message");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * @desc    Get message history for a room
 * @route   GET /api/v1/chat/:roomType/:roomId
 */
const getMessageHistory = async (req, res) => {
    try {
        const { roomType, roomId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        if (!['event', 'club', 'project'].includes(roomType)) {
            return res.status(400).json({ error: 'Invalid room type. Must be event, club, or project.' });
        }
        const messages = await Message_1.Message.find({
            roomType,
            roomId: new mongoose_1.default.Types.ObjectId(roomId),
        })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('sender', 'name avatar');
        // Return in chronological order for the client
        res.json({ messages: messages.reverse() });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch message history', details: error.message });
    }
};
exports.getMessageHistory = getMessageHistory;
/**
 * @desc    Delete a chat message (owner or admin only)
 * @route   DELETE /api/v1/chat/messages/:id
 */
const deleteMessage = async (req, res) => {
    try {
        const message = await Message_1.Message.findById(req.params.id);
        if (!message)
            return res.status(404).json({ error: 'Message not found' });
        if (message.sender.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to delete this message' });
        }
        await message.deleteOne();
        res.json({ message: 'Message deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
};
exports.deleteMessage = deleteMessage;
