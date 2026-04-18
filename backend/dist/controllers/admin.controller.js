"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCache = exports.broadcastAnnouncement = exports.getAuditLogs = exports.handleClubWorkflow = exports.getPendingClubs = exports.deleteUser = exports.updateUserRole = exports.getUsers = void 0;
const User_1 = require("../models/User");
const Club_1 = require("../models/Club");
const AuditLog_1 = require("../models/AuditLog");
const Notification_1 = require("../models/Notification");
const auditService = __importStar(require("../services/audit.service"));
const redis_1 = require("../config/redis");
/**
 * @desc    List all users with filters
 * @route   GET /api/v1/admin/users
 */
const getUsers = async (req, res) => {
    try {
        const { page = 1, limit = 20, role, status } = req.query;
        const query = {};
        if (role)
            query.role = role;
        const users = await User_1.User.find(query)
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ createdAt: -1 });
        const total = await User_1.User.countDocuments(query);
        res.json({
            users,
            pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
exports.getUsers = getUsers;
/**
 * @desc    Update user role
 * @route   PUT /api/v1/admin/users/:id/role
 */
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User_1.User.findByIdAndUpdate(req.params.id, { role }, { new: true });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        await auditService.logAdminAction(req.user.userId, 'UPDATE_USER_ROLE', 'User', user._id.toString(), { newRole: role });
        res.json({ message: 'User role updated', user });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update role' });
    }
};
exports.updateUserRole = updateUserRole;
/**
 * @desc    Delete user
 * @route   DELETE /api/v1/admin/users/:id
 */
const deleteUser = async (req, res) => {
    try {
        const user = await User_1.User.findByIdAndDelete(req.params.id);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        await auditService.logAdminAction(req.user.userId, 'DELETE_USER', 'User', user._id.toString());
        res.json({ message: 'User account deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete user' });
    }
};
exports.deleteUser = deleteUser;
/**
 * @desc    Get pending club applications
 * @route   GET /api/v1/admin/clubs/pending
 */
const getPendingClubs = async (req, res) => {
    try {
        const pendingClubs = await Club_1.Club.find({ status: 'pending' })
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch pending clubs' });
    }
};
exports.getPendingClubs = getPendingClubs;
/**
 * @desc    Approve/Reject club application
 * @route   PUT /api/v1/admin/clubs/:id/:action
 */
const handleClubWorkflow = async (req, res) => {
    try {
        const { action } = req.params;
        const { reason } = req.body;
        const status = action === 'approve' ? 'active' : 'inactive';
        const club = await Club_1.Club.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!club)
            return res.status(404).json({ error: 'Club not found' });
        await auditService.logAdminAction(req.user.userId, action === 'approve' ? 'APPROVE_CLUB' : 'REJECT_CLUB', 'Club', club._id.toString(), { reason });
        res.json({ message: `Club ${action}d successfully`, club });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to process club workflow' });
    }
};
exports.handleClubWorkflow = handleClubWorkflow;
/**
 * @desc    Get Audit Logs
 * @route   GET /api/v1/admin/audit-logs
 */
const getAuditLogs = async (req, res) => {
    try {
        const logs = await AuditLog_1.AuditLog.find()
            .populate('adminId', 'name email')
            .sort({ timestamp: -1 })
            .limit(100);
        res.json({ logs });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch audit logs' });
    }
};
exports.getAuditLogs = getAuditLogs;
/**
 * @desc    System Announcement
 * @route   POST /api/v1/admin/announcements
 */
const broadcastAnnouncement = async (req, res) => {
    try {
        const { title, message } = req.body;
        // In a real app, this might trigger emails/push notifications to ALL users
        // For now, we'll create notification records for all active users
        const users = await User_1.User.find({ role: 'student' }).select('_id');
        const notifications = users.map(user => ({
            recipient: user._id,
            type: 'system_announcement',
            title,
            message
        }));
        await Notification_1.Notification.insertMany(notifications);
        await auditService.logAdminAction(req.user.userId, 'BROADCAST_ANNOUNCEMENT', 'System', undefined, { title });
        res.json({ message: 'Global announcement broadcasted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Broadcast failed' });
    }
};
exports.broadcastAnnouncement = broadcastAnnouncement;
/**
 * @desc    Clear Redis Cache
 * @route   POST /api/v1/admin/cache/clear
 */
const clearCache = async (req, res) => {
    try {
        await redis_1.redisClient.flushAll();
        await auditService.logAdminAction(req.user.userId, 'CLEAR_CACHE', 'System');
        res.json({ message: 'Global cache cleared successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Cache cleanup failed' });
    }
};
exports.clearCache = clearCache;
