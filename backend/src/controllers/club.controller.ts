import { Request, Response } from 'express';
import { Club } from '../models/Club';
import { ClubMembership } from '../models/ClubMembership';
import { User } from '../models/User';
import { Notification } from '../models/Notification';
import { Event } from '../models/Event';
import { AuthRequest } from '../middleware/auth.middleware';
import { emitClubAnnouncement } from '../config/socket';

/**
 * @desc    Get all active clubs with filters
 * @route   GET /api/v1/clubs
 */
export const getAllClubs = async (req: Request, res: Response) => {
  try {
    const { page, limit, search, category, sortBy } = req.query as any;

    const query: any = { status: 'active' };

    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
      query.category = category;
    }

    let sortOptions: any = {};
    if (sortBy === 'new') sortOptions = { createdAt: -1 };
    else if (sortBy === 'popular') sortOptions = { memberCount: -1 };
    else sortOptions = { memberCount: -1 };

    const clubs = await Club.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Club.countDocuments(query);

    res.json({
      clubs,
      pagination: { total, page, pages: Math.ceil(total / limit) }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch clubs' });
  }
};

/**
 * @desc    Get featured clubs
 * @route   GET /api/v1/clubs/featured
 */
export const getFeaturedClubs = async (req: Request, res: Response) => {
  try {
    const clubs = await Club.find({ status: 'active' })
      .sort({ memberCount: -1 })
      .limit(5);
    res.json({ featured: clubs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch featured clubs' });
  }
};

/**
 * @desc    Create new club (Admin only, assigns student head)
 * @route   POST /api/v1/clubs
 */
export const createClub = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Only administrators can initialize new clubs.' });
    }

    const { headId, ...clubData } = req.body;

    if (!headId) {
      return res.status(400).json({ error: 'A student head must be assigned to the club.' });
    }

    // Verify head user exists
    const headUser = await User.findById(headId);
    if (!headUser) {
      return res.status(404).json({ error: 'Assigned student head not found.' });
    }

    // Create Club with Status 'active'
    const club = await Club.create({
      ...clubData,
      status: 'active'
    });

    // Make the assigned student the president
    await ClubMembership.create({
      user: headId,
      club: club._id,
      role: 'president',
      status: 'approved'
    });

    // Update user role to club_leader if they are currently a student
    if (headUser.role === 'student') {
      headUser.role = 'club_leader';
      await headUser.save();
    }

    res.status(201).json({ message: 'Club created and head assigned successfully', club });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create club', details: error.message });
  }
};

/**
 * @desc    Get club details
 * @route   GET /api/v1/clubs/:id
 */
export const getClubById = async (req: Request, res: Response) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ error: 'Club not found' });
    
    // Auto-fetch leadership alongside the detailed look
    const leadership = await ClubMembership.find({ 
      club: club._id, 
      role: { $in: ['board', 'president'] },
      status: 'approved'
    }).populate('user', 'name avatar role');

    res.json({ club, leadership });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch club' });
  }
};

/**
 * @desc    Update club (Auth, Leader only)
 * @route   PUT /api/v1/clubs/:id
 */
export const updateClub = async (req: AuthRequest, res: Response) => {
  try {
    // Verify Leader Status
    const membership = await ClubMembership.findOne({
      user: req.user?.userId,
      club: req.params.id,
      role: { $in: ['board', 'president'] },
      status: 'approved'
    });

    if (!membership && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to configure club' });
    }

    const club = await Club.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Club updated successfully', club });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update club' });
  }
};

/**
 * @desc    Deactivate club (Auth, Admin only)
 * @route   DELETE /api/v1/clubs/:id
 */
export const deactivateClub = async (req: Request, res: Response) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ error: 'Club not found' });

    club.status = 'inactive';
    await club.save();

    res.json({ message: 'Club has been deactivated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to deactivate club' });
  }
};

/**
 * @desc    Request to join
 * @route   POST /api/v1/clubs/:id/join
 */
export const joinClub = async (req: AuthRequest, res: Response) => {
  try {
    const existing = await ClubMembership.findOne({ user: req.user?.userId, club: req.params.id });
    if (existing) {
       return res.status(400).json({ error: `You already have a ${existing.status} request/membership` });
    }

    const membership = await ClubMembership.create({
      user: req.user?.userId,
      club: req.params.id,
      role: 'member',
      status: 'pending'
    });

    res.status(201).json({ message: 'Join request sent. Awaiting leadership approval.', membership });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit join workflow' });
  }
};

/**
 * @desc    Leave club
 * @route   DELETE /api/v1/clubs/:id/leave
 */
export const leaveClub = async (req: AuthRequest, res: Response) => {
  try {
    const membership = await ClubMembership.findOneAndDelete({ user: req.user?.userId, club: req.params.id });
    if (!membership) return res.status(404).json({ error: 'No active membership found' });

    res.json({ message: 'You have left the club.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to leave club' });
  }
};

/**
 * @desc    List members
 * @route   GET /api/v1/clubs/:id/members
 */
export const getClubMembers = async (req: AuthRequest, res: Response) => {
  try {
    // Determine context... If pending, block unless Admin/Board. Wait, keep it simple: any student can see approved, leaders can see pending.
    const isLeader = await ClubMembership.findOne({ 
      user: req.user?.userId, 
      club: req.params.id, 
      role: { $in: ['president', 'board'] } 
    }) || req.user?.role === 'admin';

    const filter: any = { club: req.params.id };
    if (!isLeader) {
      filter.status = 'approved';
    }

    const members = await ClubMembership.find(filter)
      .populate('user', 'name major avatar')
      .sort({ status: 1, role: 1 }); // Sort by pending first, then by authority

    res.json({ members });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch members list' });
  }
};

/**
 * @desc    Update role (e.g. demote or promote)
 * @route   PUT /api/v1/clubs/:id/members/:userId/role
 */
export const updateMemberRole = async (req: AuthRequest, res: Response) => {
  try {
    // Verification
    const commander = await ClubMembership.findOne({
      user: req.user?.userId,
      club: req.params.id,
      role: 'president',
      status: 'approved'
    });

    if (!commander && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Only club heads can modify member structures' });
    }

    const { role } = req.body; 

    // Find and update
    const targetMember = await ClubMembership.findOne({ user: req.params.userId, club: req.params.id });
    if (!targetMember) return res.status(404).json({ error: 'Member not found in context' });

    if (role) targetMember.role = role;
    await targetMember.save();

    res.json({ message: 'Member role successfully updated', membership: targetMember });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process member update' });
  }
};

/**
 * @desc    Approve join request
 * @route   POST /api/v1/clubs/:id/members/:userId/approve
 */
export const approveMember = async (req: AuthRequest, res: Response) => {
  try {
    const isHead = await ClubMembership.findOne({
      user: req.user?.userId,
      club: req.params.id,
      role: 'president',
      status: 'approved'
    });

    if (!isHead && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Only the club head can approve members.' });
    }

    const membership = await ClubMembership.findOne({ user: req.params.userId, club: req.params.id });
    if (!membership) return res.status(404).json({ error: 'Membership request not found.' });

    membership.status = 'approved';
    await membership.save();

    res.json({ message: 'Member approved successfully', membership });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve member' });
  }
};

/**
 * @desc    Reject join request
 * @route   POST /api/v1/clubs/:id/members/:userId/reject
 */
export const rejectMember = async (req: AuthRequest, res: Response) => {
  try {
    const isHead = await ClubMembership.findOne({
      user: req.user?.userId,
      club: req.params.id,
      role: 'president',
      status: 'approved'
    });

    if (!isHead && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Only the club head can reject members.' });
    }

    const membership = await ClubMembership.findOne({ user: req.params.userId, club: req.params.id });
    if (!membership) return res.status(404).json({ error: 'Membership request not found.' });

    membership.status = 'rejected';
    await membership.save();

    res.json({ message: 'Member request rejected', membership });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject member' });
  }
};

/**
 * @desc    Send announcement
 * @route   POST /api/v1/clubs/:id/announcements
 */
export const sendClubAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const { title, message } = req.body;
    
    // Auth Check
    const isLeader = await ClubMembership.findOne({ 
      user: req.user?.userId, club: req.params.id, role: { $in: ['president', 'board'] } 
    });

    if (!isLeader && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to broadcast' });
    }

    // Find all active members
    const members = await ClubMembership.find({ club: req.params.id, status: 'approved' });

    // Fan-out notifications to all active members inherently
    const notifications = members.map(m => ({
      recipient: m.user,
      type: 'club_announcement',
      title,
      message,
      dataPayload: { clubId: req.params.id }
    }));

    await Notification.insertMany(notifications);

    // Emit via Socket.io to all users currently in the club room
    await emitClubAnnouncement(req.params.id, req.user!.userId, title, message);

    res.json({ message: 'Announcement blast delivered successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to deliver notifications' });
  }
};

/**
 * @desc    Engagement analytics (Pipeline)
 * @route   GET /api/v1/clubs/:id/analytics
 */
export const getClubAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const clubId = new (require('mongoose').Types.ObjectId)(req.params.id);

    // Security Check
    const isLeader = await ClubMembership.findOne({ 
      user: req.user?.userId, club: clubId, role: { $in: ['president', 'board'] } 
    });
    if (!isLeader && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Analytics strictly locked to internal leadership' });
    }

    // Pipeline 1: Membership Dispension
    const membershipPipeline = await ClubMembership.aggregate([
      { $match: { club: clubId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Pipeline 2: Events Overview
    const eventsPipeline = await Event.aggregate([
      { $match: { club: clubId } },
      { $group: { _id: '$status', totalEvents: { $sum: 1 }, totalRSVPsGained: { $sum: '$rsvpCount' } } }
    ]);

    res.json({
      metrics: {
        memberships: membershipPipeline,
        events: eventsPipeline
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Analytics process failed', details: error.message });
  }
};
