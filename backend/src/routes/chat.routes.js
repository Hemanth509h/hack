import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { getMessageHistory, deleteMessage, getConversations, getOrCreateConversation } from '../controllers/chat.controller.js';
const router = Router();
router.use(requireAuth);
// Get message history for any room type
router.get('/:roomType/:roomId', getMessageHistory);
// Get all conversations for the user
router.get('/conversations', getConversations);
// Find or create a conversation
router.post('/conversations', getOrCreateConversation);
// Delete a specific message
router.delete('/messages/:id', deleteMessage);
export default router;
