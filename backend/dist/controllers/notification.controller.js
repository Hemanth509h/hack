"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testNotification = exports.removeDeviceToken = exports.registerDeviceToken = exports.updatePreferences = exports.getPreferences = exports.deleteNotification = exports.markAllAsRead = exports.markAsRead = exports.getNotifications = void 0;
const Notification_1 = require("../models/Notification");
const User_1 = require("../models/User");
const notification_service_1 = require("../services/notification.service");
/**
 * @desc    List user notifications (paginated)
 * @route   GET /api/v1/notifications
 */
const getNotifications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const [notifications, total, unreadCount] = await Promise.all([
            Notification_1.Notification.find({ recipient: req.user.userId })
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Notification_1.Notification.countDocuments({ recipient: req.user.userId }),
            Notification_1.Notification.countDocuments({ recipient: req.user.userId, isRead: false }),
        ]);
        res.json({
            notifications,
            unreadCount,
            pagination: { total, page, pages: Math.ceil(total / limit) },
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};
exports.getNotifications = getNotifications;
/**
 * @desc    Mark a single notification as read
 * @route   PUT /api/v1/notifications/:id/read
 */
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification_1.Notification.findOneAndUpdate({ _id: req.params.id, recipient: req.user.userId }, { isRead: true }, { new: true });
        if (!notification)
            return res.status(404).json({ error: 'Notification not found' });
        res.json({ message: 'Marked as read', notification });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to mark as read' });
    }
};
exports.markAsRead = markAsRead;
/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/v1/notifications/read-all
 */
const markAllAsRead = async (req, res) => {
    try {
        await Notification_1.Notification.updateMany({ recipient: req.user.userId, isRead: false }, { isRead: true });
        res.json({ message: 'All notifications marked as read' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to mark all as read' });
    }
};
exports.markAllAsRead = markAllAsRead;
/**
 * @desc    Delete a single notification
 * @route   DELETE /api/v1/notifications/:id
 */
const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification_1.Notification.findOneAndDelete({
            _id: req.params.id,
            recipient: req.user.userId,
        });
        if (!notification)
            return res.status(404).json({ error: 'Notification not found' });
        res.json({ message: 'Notification deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete notification' });
    }
};
exports.deleteNotification = deleteNotification;
/**
 * @desc    Get notification preferences
 * @route   GET /api/v1/notifications/preferences
 */
const getPreferences = async (req, res) => {
    try {
        const user = await User_1.User.findById(req.user.userId).select('notificationPreferences');
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json({ preferences: user.notificationPreferences });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch preferences' });
    }
};
exports.getPreferences = getPreferences;
/**
 * @desc    Update notification preferences
 * @route   POST /api/v1/notifications/preferences
 */
const updatePreferences = async (req, res) => {
    try {
        const { email, push, inApp } = req.body;
        const user = await User_1.User.findByIdAndUpdate(req.user.userId, { $set: { notificationPreferences: { email, push, inApp } } }, { new: true }).select('notificationPreferences');
        res.json({ message: 'Preferences updated', preferences: user?.notificationPreferences });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update preferences' });
    }
};
exports.updatePreferences = updatePreferences;
/**
 * @desc    Register device token for push notifications
 * @route   POST /api/v1/notifications/device-token
 */
const registerDeviceToken = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token)
            return res.status(400).json({ error: 'Device token is required' });
        await User_1.User.findByIdAndUpdate(req.user.userId, {
            $addToSet: { deviceTokens: token },
        });
        res.json({ message: 'Device token registered' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to register device token' });
    }
};
exports.registerDeviceToken = registerDeviceToken;
/**
 * @desc    Remove device token (on logout)
 * @route   DELETE /api/v1/notifications/device-token
 */
const removeDeviceToken = async (req, res) => {
    try {
        const { token } = req.body;
        await User_1.User.findByIdAndUpdate(req.user.userId, {
            $pull: { deviceTokens: token },
        });
        res.json({ message: 'Device token removed' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to remove device token' });
    }
};
exports.removeDeviceToken = removeDeviceToken;
/**
 * @desc    Test notification (dev only)
 * @route   POST /api/v1/notifications/test
 */
const testNotification = async (req, res) => {
    if (process.env.NODE_ENV === 'production') {
        return res.status(403).json({ error: 'Not available in production' });
    }
    try {
        await (0, notification_service_1.sendNotification)({
            recipientId: req.user.userId,
            type: req.body.type || 'default',
            title: req.body.title || 'Test Notification 🧪',
            message: req.body.message || 'This is a test notification from The Quad.',
            ctaUrl: `${process.env.FRONTEND_URL}/notifications`,
        });
        res.json({ message: 'Test notification dispatched to all channels' });
    }
    catch (error) {
        res.status(500).json({ error: 'Test notification failed', details: error.message });
    }
};
exports.testNotification = testNotification;
