import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import * as analyticsController from '../controllers/admin.analytics.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();

// Global Admin Protection
router.use(requireAuth);
router.use(requireRole(['admin']));

/**
 * Analytics & Dashboard
 */
router.get('/dashboard', analyticsController.getDashboardOverview);
router.get('/analytics/engagement', analyticsController.getEngagementTrends);
router.get('/analytics/events', analyticsController.getEventAnalytics);
router.get('/analytics/clubs', analyticsController.getClubAnalytics);
router.get('/analytics/demographics', analyticsController.getDemographicsAnalytics);
router.post('/reports/engagement', analyticsController.downloadEngagementReport);

/**
 * User Management
 */
router.get('/users', adminController.getUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

/**
 * Club Workflow
 */
router.get('/clubs/pending', adminController.getPendingClubs);
router.put('/clubs/:id/:action', adminController.handleClubWorkflow); // action = approve | reject

/**
 * System Management
 */
router.post('/announcements', adminController.broadcastAnnouncement);
router.get('/audit-logs', adminController.getAuditLogs);
router.post('/cache/clear', adminController.clearCache);

export default router;
