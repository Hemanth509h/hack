import { Router } from 'express';
import { getCampusFeed } from '../controllers/feed.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', requireAuth, getCampusFeed);

export default router;
