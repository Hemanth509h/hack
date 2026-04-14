import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as aiService from '../services/ai.service';
import { ChatSession } from '../models/ChatSession';

/**
 * @desc    Send message and stream response from AI
 * @route   POST /api/v1/ai/chat
 */
export const chatWithNexus = async (req: AuthRequest, res: Response) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    // Set headers for Server-Sent Events (SSE) / Streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    await aiService.processChatMessage(req.user!.userId, message, res);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: 'AI processing failed' });
    }
  }
};

/**
 * @desc    Get Chat History
 * @route   GET /api/v1/ai/chat/history
 */
export const getChatHistory = async (req: AuthRequest, res: Response) => {
  try {
    const session = await ChatSession.findOne({ userId: req.user!.userId });
    
    if (!session) {
      return res.json({ messages: [] });
    }

    // Filter out system messages and tool calls before sending to frontend
    const displayMessages = session.messages.filter(m => 
      m.role === 'user' || (m.role === 'assistant' && !m.tool_calls)
    );

    res.json({ messages: displayMessages });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

/**
 * @desc    Clear Chat History
 * @route   DELETE /api/v1/ai/chat/history
 */
export const clearChatHistory = async (req: AuthRequest, res: Response) => {
  try {
    await ChatSession.findOneAndDelete({ userId: req.user!.userId });
    res.json({ message: 'Conversation memory cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear history' });
  }
};

/**
 * @desc    Provide feedback on a response
 * @route   POST /api/v1/ai/chat/feedback
 */
export const submitFeedback = async (req: AuthRequest, res: Response) => {
  try {
    // In a full implementation, you would store this in an AI_Feedback collection
    // linking the message ID (which we'd need to add to the schema) to the rating (thumbs up/down)
    const { rating, comment } = req.body;
    console.log(`[AI Feedback] User ${req.user!.userId}: Rating = ${rating}, Comment = ${comment}`);
    
    res.json({ message: 'Thank you for your feedback!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};
