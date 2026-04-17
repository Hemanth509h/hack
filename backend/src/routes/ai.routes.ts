import { Router } from 'express';
import * as aiController from '../controllers/ai.controller';
import { requireAuth } from '../middleware/auth.middleware';
import rateLimit from 'express-rate-limit';

const router = Router();

// Protect AI routes against excessive API cost utilization per user
const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // Limit each IP to 30 requests per windowMs
  message: { error: 'Too many requests to Nexus AI, please try again after an hour' }
});

router.use(requireAuth);

router.post('/chat', aiRateLimiter, aiController.chatWithNexus);
router.get('/chat/history', aiController.getChatHistory);
router.delete('/chat/history', aiController.clearChatHistory);
router.post('/chat/feedback', aiController.submitFeedback);

export default router;
