"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitFeedback = exports.clearChatHistory = exports.getChatHistory = exports.chatWithNexus = void 0;
const aiService = __importStar(require("../services/ai.service"));
const ChatSession_1 = require("../models/ChatSession");
/**
 * @desc    Send message and stream response from AI
 * @route   POST /api/v1/ai/chat
 */
const chatWithNexus = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message)
            return res.status(400).json({ error: 'Message is required' });
        // Set headers for Server-Sent Events (SSE) / Streaming
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        await aiService.processChatMessage(req.user.userId, message, res);
    }
    catch (error) {
        if (!res.headersSent) {
            res.status(500).json({ error: 'AI processing failed' });
        }
    }
};
exports.chatWithNexus = chatWithNexus;
/**
 * @desc    Get Chat History
 * @route   GET /api/v1/ai/chat/history
 */
const getChatHistory = async (req, res) => {
    try {
        const session = await ChatSession_1.ChatSession.findOne({ userId: req.user.userId });
        if (!session) {
            return res.json({ messages: [] });
        }
        // Filter out system messages and tool calls before sending to frontend
        const displayMessages = session.messages.filter(m => m.role === 'user' || (m.role === 'assistant' && !m.tool_calls));
        res.json({ messages: displayMessages });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};
exports.getChatHistory = getChatHistory;
/**
 * @desc    Clear Chat History
 * @route   DELETE /api/v1/ai/chat/history
 */
const clearChatHistory = async (req, res) => {
    try {
        await ChatSession_1.ChatSession.findOneAndDelete({ userId: req.user.userId });
        res.json({ message: 'Conversation memory cleared' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to clear history' });
    }
};
exports.clearChatHistory = clearChatHistory;
/**
 * @desc    Provide feedback on a response
 * @route   POST /api/v1/ai/chat/feedback
 */
const submitFeedback = async (req, res) => {
    try {
        // In a full implementation, you would store this in an AI_Feedback collection
        // linking the message ID (which we'd need to add to the schema) to the rating (thumbs up/down)
        const { rating, comment } = req.body;
        console.log(`[AI Feedback] User ${req.user.userId}: Rating = ${rating}, Comment = ${comment}`);
        res.json({ message: 'Thank you for your feedback!' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to submit feedback' });
    }
};
exports.submitFeedback = submitFeedback;
