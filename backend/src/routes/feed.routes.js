import { Router } from 'express';
import { getCampusFeed } from '../controllers/feed.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
const router = Router();
router.get('/', requireAuth, getCampusFeed);
export default router;
