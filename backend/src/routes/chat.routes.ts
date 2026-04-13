import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { getMessageHistory, deleteMessage } from '../controllers/chat.controller';

const router = Router();

router.use(requireAuth);

// Get message history for any room type
router.get('/:roomType/:roomId', getMessageHistory);

// Delete a specific message
router.delete('/messages/:id', deleteMessage);

export default router;
