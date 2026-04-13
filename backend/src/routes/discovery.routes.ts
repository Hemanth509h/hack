import { Router } from 'express';
import * as discoveryController from '../controllers/discovery.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/trending/events', authenticate, discoveryController.getTrendingEvents);
router.get('/trending/clubs', authenticate, discoveryController.getTrendingClubs);
router.get('/recommendations/events', authenticate, discoveryController.getEventRecommendations);
router.get('/recommendations/clubs', authenticate, discoveryController.getClubRecommendations);

export default router;
