import { Request, Response } from 'express';
import { User } from '../models/User';
import { Club } from '../models/Club';
import { AuditLog } from '../models/AuditLog';
import { Notification } from '../models/Notification';
import { AuthRequest } from '../middleware/auth.middleware';
import * as auditService from '../services/audit.service';
import { redisClient } from '../config/redis';

/**
 * @desc    List all users with filters
 * @route   GET /api/v1/admin/users
 */
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const { page = 1, limit = 20, role, status } = req.query as any;
    const query: any = {};
    if (role) query.role = role;
    
    const users = await User.find(query)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

/**
 * @desc    Update user role
 * @route   PUT /api/v1/admin/users/:id/role
 */
export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    
    if (!user) return res.status(404).json({ error: 'User not found' });

    await auditService.logAdminAction(
      req.user!.userId,
      'UPDATE_USER_ROLE',
      'User',
      user._id.toString(),
      { newRole: role }
    );

    res.json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update role' });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/v1/admin/users/:id
 */
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await auditService.logAdminAction(
      req.user!.userId,
      'DELETE_USER',
      'User',
      user._id.toString()
    );

    res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

/**
 * @desc    Get pending club applications
 * @route   GET /api/v1/admin/clubs/pending
 */
export const getPendingClubs = async (req: AuthRequest, res: Response) => {
  try {
    const pendingClubs = await Club.find({ status: 'pending' })
      .sort({ createdAt: -1 });

    // Format the response to match the frontend PendingClubDTO
    const formattedClubs = pendingClubs.map(club => ({
      id: club._id,
      name: club.name,
      category: club.category,
      description: club.description,
      proposedLeaders: [], // Assuming we don't fetch users here for simplicity, or we can fetch the president from ClubMembership
      expectedMembership: 0,
      applicationDate: club.createdAt
    }));

    res.json(formattedClubs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending clubs' });
  }
};

/**
 * @desc    Approve/Reject club application
 * @route   PUT /api/v1/admin/clubs/:id/:action
 */
export const handleClubWorkflow = async (req: AuthRequest, res: Response) => {
  try {
    const { action } = req.params;
    const { reason } = req.body;
    const status = action === 'approve' ? 'active' : 'inactive';

    const club = await Club.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!club) return res.status(404).json({ error: 'Club not found' });

    await auditService.logAdminAction(
      req.user!.userId,
      action === 'approve' ? 'APPROVE_CLUB' : 'REJECT_CLUB',
      'Club',
      club._id.toString(),
      { reason }
    );

    res.json({ message: `Club ${action}d successfully`, club });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process club workflow' });
  }
};

/**
 * @desc    Get Audit Logs
 * @route   GET /api/v1/admin/audit-logs
 */
export const getAuditLogs = async (req: AuthRequest, res: Response) => {
  try {
    const logs = await AuditLog.find()
      .populate('adminId', 'name email')
      .sort({ timestamp: -1 })
      .limit(100);
    res.json({ logs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
};

/**
 * @desc    System Announcement
 * @route   POST /api/v1/admin/announcements
 */
export const broadcastAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { title, message } = req.body;
    
    // In a real app, this might trigger emails/push notifications to ALL users
    // For now, we'll create notification records for all active users
    const users = await User.find({ role: 'student' }).select('_id');
    
    const notifications = users.map(user => ({
      recipient: user._id,
      type: 'system_announcement',
      title,
      message
    }));

    await Notification.insertMany(notifications);

    await auditService.logAdminAction(
      req.user!.userId,
      'BROADCAST_ANNOUNCEMENT',
      'System',
      undefined,
      { title }
    );

    res.json({ message: 'Global announcement broadcasted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Broadcast failed' });
  }
};

/**
 * @desc    Clear Redis Cache
 * @route   POST /api/v1/admin/cache/clear
 */
export const clearCache = async (req: AuthRequest, res: Response) => {
  try {
    await redisClient.flushAll();
    
    await auditService.logAdminAction(
      req.user!.userId,
      'CLEAR_CACHE',
      'System'
    );

    res.json({ message: 'Global cache cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Cache cleanup failed' });
  }
};
