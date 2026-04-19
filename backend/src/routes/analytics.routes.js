import { Router } from 'express';
// analytics track route is intentionally public — no auth middleware needed
import { AnalyticsEvent } from '../models/AnalyticsEvent.js';
import mongoose from 'mongoose';
const router = Router();
/**
 * @desc    Ingest raw analytical web behavior. Gracefully fail silently (204) to avoid disrupting user experience if DB hits max threshold
 * @route   POST /api/v1/analytics/track
 */
router.post('/track', async (req, res) => {
    try {
        const { anonymousId, category, action, label, value, path, metadata } = req.body;
        // We don't force 'requireAuth' because anonymous sessions (login screen) still emit events.
        // However, if authenticate middleware is pushed globally higher up, we can pluck req.user.
        // For now we extract Authorization header manually if present to see if we can identify them
        const authHeader = req.headers.authorization;
        let userId;
        // We intentionally bypass standard 401 hooks here because tracking is opt-in and graceful
        if (authHeader && authHeader.startsWith('Bearer ')) {
            // Since the route isn't strictly walled by 'requireAuth', we will rely on frontend ID injection or decode the JWT here
            // For this simplified route, we check if the frontend passed 'userId' explicitly in metadata
            if (metadata?.userId) {
                userId = new mongoose.Types.ObjectId(metadata.userId);
            }
        }
        await AnalyticsEvent.create({
            user: userId,
            anonymousId,
            category,
            action,
            label,
            value: Number(value) || undefined,
            path,
            metadata,
            ipAddress: req.ip, // Important for geolocation distributions, but hashed in prod if GDPR requires
            userAgent: req.headers['user-agent']
        });
        res.status(204).end(); // Silent Success
    }
    catch (error) {
        res.status(204).end(); // Always silence failures on tracking 
    }
});
export default router;
