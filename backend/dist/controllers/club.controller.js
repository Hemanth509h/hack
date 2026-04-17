"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClubAnalytics = exports.sendClubAnnouncement = exports.updateMemberRole = exports.getClubMembers = exports.leaveClub = exports.joinClub = exports.deactivateClub = exports.updateClub = exports.getClubById = exports.createClub = exports.getFeaturedClubs = exports.getAllClubs = void 0;
const Club_1 = require("../models/Club");
const ClubMembership_1 = require("../models/ClubMembership");
const Notification_1 = require("../models/Notification");
const Event_1 = require("../models/Event");
const socket_1 = require("../config/socket");
/**
 * @desc    Get all active clubs with filters
 * @route   GET /api/v1/clubs
 */
const getAllClubs = async (req, res) => {
    try {
        const { page, limit, search, category, sortBy } = req.query;
        const query = { status: 'active' };
        if (search) {
            query.$text = { $search: search };
        }
        if (category) {
            query.category = category;
        }
        let sortOptions = {};
        if (sortBy === 'new')
            sortOptions = { createdAt: -1 };
        else if (sortBy === 'popular')
            sortOptions = { memberCount: -1 };
        else
            sortOptions = { memberCount: -1 };
        const clubs = await Club_1.Club.find(query)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(limit);
        const total = await Club_1.Club.countDocuments(query);
        res.json({
            clubs,
            pagination: { total, page, pages: Math.ceil(total / limit) }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch clubs' });
    }
};
exports.getAllClubs = getAllClubs;
/**
 * @desc    Get featured clubs
 * @route   GET /api/v1/clubs/featured
 */
const getFeaturedClubs = async (req, res) => {
    try {
        const clubs = await Club_1.Club.find({ status: 'active' })
            .sort({ memberCount: -1 })
            .limit(5);
        res.json({ featured: clubs });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch featured clubs' });
    }
};
exports.getFeaturedClubs = getFeaturedClubs;
/**
 * @desc    Create new club (requires admin approval later)
 * @route   POST /api/v1/clubs
 */
const createClub = async (req, res) => {
    try {
        // Generate Club with Status 'pending'
        const club = await Club_1.Club.create({
            ...req.body,
            status: 'pending' // Enforcing admin approval
        });
        // Make the creator the president instantly
        await ClubMembership_1.ClubMembership.create({
            user: req.user?.userId,
            club: club._id,
            role: 'president',
            status: 'approved' // Automatically bypass pending step for creators
        });
        res.status(201).json({ message: 'Club application submitted pending approval', club });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to submit club application', details: error.message });
    }
};
exports.createClub = createClub;
/**
 * @desc    Get club details
 * @route   GET /api/v1/clubs/:id
 */
const getClubById = async (req, res) => {
    try {
        const club = await Club_1.Club.findById(req.params.id);
        if (!club)
            return res.status(404).json({ error: 'Club not found' });
        // Auto-fetch leadership alongside the detailed look
        const leadership = await ClubMembership_1.ClubMembership.find({
            club: club._id,
            role: { $in: ['board', 'president'] },
            status: 'approved'
        }).populate('user', 'name avatar role');
        res.json({ club, leadership });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch club' });
    }
};
exports.getClubById = getClubById;
/**
 * @desc    Update club (Auth, Leader only)
 * @route   PUT /api/v1/clubs/:id
 */
const updateClub = async (req, res) => {
    try {
        // Verify Leader Status
        const membership = await ClubMembership_1.ClubMembership.findOne({
            user: req.user?.userId,
            club: req.params.id,
            role: { $in: ['board', 'president'] },
            status: 'approved'
        });
        if (!membership && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to configure club' });
        }
        const club = await Club_1.Club.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: 'Club updated successfully', club });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update club' });
    }
};
exports.updateClub = updateClub;
/**
 * @desc    Deactivate club (Auth, Admin only)
 * @route   DELETE /api/v1/clubs/:id
 */
const deactivateClub = async (req, res) => {
    try {
        const club = await Club_1.Club.findById(req.params.id);
        if (!club)
            return res.status(404).json({ error: 'Club not found' });
        club.status = 'inactive';
        await club.save();
        res.json({ message: 'Club has been deactivated' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to deactivate club' });
    }
};
exports.deactivateClub = deactivateClub;
/**
 * @desc    Request to join
 * @route   POST /api/v1/clubs/:id/join
 */
const joinClub = async (req, res) => {
    try {
        const existing = await ClubMembership_1.ClubMembership.findOne({ user: req.user?.userId, club: req.params.id });
        if (existing) {
            return res.status(400).json({ error: `You already have a ${existing.status} request/membership` });
        }
        const membership = await ClubMembership_1.ClubMembership.create({
            user: req.user?.userId,
            club: req.params.id,
            role: 'member',
            status: 'pending'
        });
        res.status(201).json({ message: 'Join request sent. Awaiting leadership approval.', membership });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to submit join workflow' });
    }
};
exports.joinClub = joinClub;
/**
 * @desc    Leave club
 * @route   DELETE /api/v1/clubs/:id/leave
 */
const leaveClub = async (req, res) => {
    try {
        const membership = await ClubMembership_1.ClubMembership.findOneAndDelete({ user: req.user?.userId, club: req.params.id });
        if (!membership)
            return res.status(404).json({ error: 'No active membership found' });
        res.json({ message: 'You have left the club.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to leave club' });
    }
};
exports.leaveClub = leaveClub;
/**
 * @desc    List members
 * @route   GET /api/v1/clubs/:id/members
 */
const getClubMembers = async (req, res) => {
    try {
        // Determine context... If pending, block unless Admin/Board. Wait, keep it simple: any student can see approved, leaders can see pending.
        const isLeader = await ClubMembership_1.ClubMembership.findOne({
            user: req.user?.userId,
            club: req.params.id,
            role: { $in: ['president', 'board'] }
        }) || req.user?.role === 'admin';
        const filter = { club: req.params.id };
        if (!isLeader) {
            filter.status = 'approved';
        }
        const members = await ClubMembership_1.ClubMembership.find(filter)
            .populate('user', 'name major avatar')
            .sort({ status: 1, role: 1 }); // Sort by pending first, then by authority
        res.json({ members });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch members list' });
    }
};
exports.getClubMembers = getClubMembers;
/**
 * @desc    Update role (e.g. approve join request or demote)
 * @route   PUT /api/v1/clubs/:id/members/:userId/role
 */
const updateMemberRole = async (req, res) => {
    try {
        // Verification
        const commander = await ClubMembership_1.ClubMembership.findOne({
            user: req.user?.userId,
            club: req.params.id,
            role: 'president',
            status: 'approved'
        });
        if (!commander && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Only club presidents can modify member structures' });
        }
        const { role, status } = req.body;
        // Find and update
        const targetMember = await ClubMembership_1.ClubMembership.findOne({ user: req.params.userId, club: req.params.id });
        if (!targetMember)
            return res.status(404).json({ error: 'Member not found in context' });
        if (role)
            targetMember.role = role;
        if (status)
            targetMember.status = status;
        await targetMember.save();
        res.json({ message: 'Member successfully updated', membership: targetMember });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to process member update' });
    }
};
exports.updateMemberRole = updateMemberRole;
/**
 * @desc    Send announcement
 * @route   POST /api/v1/clubs/:id/announcements
 */
const sendClubAnnouncement = async (req, res) => {
    try {
        const { title, message } = req.body;
        // Auth Check
        const isLeader = await ClubMembership_1.ClubMembership.findOne({
            user: req.user?.userId, club: req.params.id, role: { $in: ['president', 'board'] }
        });
        if (!isLeader && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to broadcast' });
        }
        // Find all active members
        const members = await ClubMembership_1.ClubMembership.find({ club: req.params.id, status: 'approved' });
        // Fan-out notifications to all active members inherently
        const notifications = members.map(m => ({
            recipient: m.user,
            type: 'club_announcement',
            title,
            message,
            dataPayload: { clubId: req.params.id }
        }));
        await Notification_1.Notification.insertMany(notifications);
        // Emit via Socket.io to all users currently in the club room
        await (0, socket_1.emitClubAnnouncement)(req.params.id, req.user.userId, title, message);
        res.json({ message: 'Announcement blast delivered successfully.' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to deliver notifications' });
    }
};
exports.sendClubAnnouncement = sendClubAnnouncement;
/**
 * @desc    Engagement analytics (Pipeline)
 * @route   GET /api/v1/clubs/:id/analytics
 */
const getClubAnalytics = async (req, res) => {
    try {
        const clubId = new (require('mongoose').Types.ObjectId)(req.params.id);
        // Security Check
        const isLeader = await ClubMembership_1.ClubMembership.findOne({
            user: req.user?.userId, club: clubId, role: { $in: ['president', 'board'] }
        });
        if (!isLeader && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Analytics strictly locked to internal leadership' });
        }
        // Pipeline 1: Membership Dispension
        const membershipPipeline = await ClubMembership_1.ClubMembership.aggregate([
            { $match: { club: clubId } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        // Pipeline 2: Events Overview
        const eventsPipeline = await Event_1.Event.aggregate([
            { $match: { club: clubId } },
            { $group: { _id: '$status', totalEvents: { $sum: 1 }, totalRSVPsGained: { $sum: '$rsvpCount' } } }
        ]);
        res.json({
            metrics: {
                memberships: membershipPipeline,
                events: eventsPipeline
            }
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Analytics process failed', details: error.message });
    }
};
exports.getClubAnalytics = getClubAnalytics;
