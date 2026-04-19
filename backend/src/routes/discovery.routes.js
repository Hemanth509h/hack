import { Router } from 'express';
import * as discoveryController from '../controllers/discovery.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';
const router = Router();
router.get('/trending/events', requireAuth, discoveryController.getTrendingEvents);
router.get('/trending/clubs', requireAuth, discoveryController.getTrendingClubs);
router.get('/recommendations/events', requireAuth, discoveryController.getEventRecommendations);
router.get('/recommendations/clubs', requireAuth, discoveryController.getClubRecommendations);
export default router;
