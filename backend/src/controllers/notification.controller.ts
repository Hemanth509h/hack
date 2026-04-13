import { Request, Response } from 'express';
import { Notification } from '../models/Notification';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth.middleware';
import { sendNotification } from '../services/notification.service';

/**
 * @desc    List user notifications (paginated)
 * @route   GET /api/v1/notifications
 */
export const getNotifications = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find({ recipient: req.user!.userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Notification.countDocuments({ recipient: req.user!.userId }),
      Notification.countDocuments({ recipient: req.user!.userId, isRead: false }),
    ]);

    res.json({
      notifications,
      unreadCount,
      pagination: { total, page, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

/**
 * @desc    Mark a single notification as read
 * @route   PUT /api/v1/notifications/:id/read
 */
export const markAsRead = async (req: AuthRequest, res: Response) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user!.userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json({ message: 'Marked as read', notification });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark as read' });
  }
};

/**
 * @desc    Mark all notifications as read
 * @route   PUT /api/v1/notifications/read-all
 */
export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  try {
    await Notification.updateMany(
      { recipient: req.user!.userId, isRead: false },
      { isRead: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
};

/**
 * @desc    Get notification preferences
 * @route   GET /api/v1/notifications/preferences
 */
export const getPreferences = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.userId).select('notificationPreferences');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ preferences: user.notificationPreferences });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
};

/**
 * @desc    Update notification preferences
 * @route   POST /api/v1/notifications/preferences
 */
export const updatePreferences = async (req: AuthRequest, res: Response) => {
  try {
    const { email, push, inApp } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user!.userId,
      { $set: { notificationPreferences: { email, push, inApp } } },
      { new: true }
    ).select('notificationPreferences');

    res.json({ message: 'Preferences updated', preferences: user?.notificationPreferences });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update preferences' });
  }
};

/**
 * @desc    Register device token for push notifications
 * @route   POST /api/v1/notifications/device-token
 */
export const registerDeviceToken = async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Device token is required' });

    await User.findByIdAndUpdate(req.user!.userId, {
      $addToSet: { deviceTokens: token },
    });

    res.json({ message: 'Device token registered' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register device token' });
  }
};

/**
 * @desc    Remove device token (on logout)
 * @route   DELETE /api/v1/notifications/device-token
 */
export const removeDeviceToken = async (req: AuthRequest, res: Response) => {
  try {
    const { token } = req.body;

    await User.findByIdAndUpdate(req.user!.userId, {
      $pull: { deviceTokens: token },
    });

    res.json({ message: 'Device token removed' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove device token' });
  }
};

/**
 * @desc    Test notification (dev only)
 * @route   POST /api/v1/notifications/test
 */
export const testNotification = async (req: AuthRequest, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Not available in production' });
  }

  try {
    await sendNotification({
      recipientId: req.user!.userId,
      type: req.body.type || 'default',
      title: req.body.title || 'Test Notification 🧪',
      message: req.body.message || 'This is a test notification from The Quad.',
      ctaUrl: `${process.env.FRONTEND_URL}/notifications`,
    });

    res.json({ message: 'Test notification dispatched to all channels' });
  } catch (error: any) {
    res.status(500).json({ error: 'Test notification failed', details: error.message });
  }
};
