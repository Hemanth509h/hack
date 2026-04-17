"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const notification_controller_1 = require("../controllers/notification.controller");
const router = (0, express_1.Router)();
// All notification routes require authentication
router.use(auth_middleware_1.requireAuth);
// ---- Listing & Status ----
router.get('/', notification_controller_1.getNotifications);
router.put('/read-all', notification_controller_1.markAllAsRead);
router.put('/:id/read', notification_controller_1.markAsRead);
// ---- Preferences ----
router.get('/preferences', notification_controller_1.getPreferences);
router.post('/preferences', notification_controller_1.updatePreferences);
// ---- Device Token Management (FCM) ----
router.post('/device-token', notification_controller_1.registerDeviceToken);
router.delete('/device-token', notification_controller_1.removeDeviceToken);
// ---- Dev-only testing ----
router.post('/test', notification_controller_1.testNotification);
exports.default = router;
