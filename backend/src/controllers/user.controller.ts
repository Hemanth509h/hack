import { Request, Response } from 'express';
import { User } from '../models/User';
import { Skill } from '../models/Skill';
import { RSVP } from '../models/RSVP';
import { ClubMembership } from '../models/ClubMembership';
import { AuthRequest } from '../middleware/auth.middleware';
import { uploadMiddleware, processAndUploadImage } from '../utils/upload.utils';
import mongoose from 'mongoose';

/**
 * @desc    Get public user profile
 * @route   GET /api/v1/users/:id/profile
 */
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const isOwner = req.user?.userId === req.params.id;
    const isAdmin = req.user?.role === 'admin';

    const user = await User.findById(req.params.id)
      .select('-password -resetPasswordToken -resetPasswordExpires -providers')
      .populate('skills', 'name category');

    if (!user) return res.status(404).json({ error: 'User not found' });

    // If not the owner or admin, strip private fields
    if (!isOwner && !isAdmin) {
      const publicProfile = {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        bio: user.bio,
        major: user.major,
        graduationYear: user.graduationYear,
        skills: user.skills,
        interests: user.interests,
        role: user.role,
      };
      return res.json(publicProfile);
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load profile' });
  }
};

/**
 * @desc    Update own profile
 * @route   PUT /api/v1/users/:id/profile
 */
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.userId !== req.params.id && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Cannot update another user\'s profile' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -resetPasswordExpires');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Profile updated', user });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
};

/**
 * @desc    Add skill to profile (with deduplication)
 * @route   POST /api/v1/users/:id/skills
 */
export const addSkill = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.userId !== req.params.id) {
      return res.status(403).json({ error: 'Cannot modify another user\'s skills' });
    }

    const { skillId } = req.body;

    // Verify skill exists
    const skillExists = await Skill.findById(skillId);
    if (!skillExists) return res.status(404).json({ error: 'Skill not found' });

    // $addToSet prevents duplicate ObjectId entries natively
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { skills: new mongoose.Types.ObjectId(skillId) } },
      { new: true }
    ).populate('skills', 'name category');

    res.json({ message: 'Skill added', skills: user?.skills });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add skill' });
  }
};

/**
 * @desc    Remove skill from profile
 * @route   DELETE /api/v1/users/:id/skills/:skillId
 */
export const removeSkill = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.userId !== req.params.id) {
      return res.status(403).json({ error: 'Cannot modify another user\'s skills' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $pull: { skills: new mongoose.Types.ObjectId(req.params.skillId) } },
      { new: true }
    ).populate('skills', 'name category');

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Skill removed', skills: user.skills });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove skill' });
  }
};

/**
 * @desc    Update user interests array
 * @route   PUT /api/v1/users/:id/interests
 */
export const updateInterests = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.userId !== req.params.id) {
      return res.status(403).json({ error: 'Cannot modify another user\'s interests' });
    }

    // Deduplicate interests before saving
    const deduped = [...new Set((req.body.interests as string[]).map(i => i.toLowerCase().trim()))];

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { interests: deduped } },
      { new: true }
    );

    res.json({ message: 'Interests updated', interests: user?.interests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update interests' });
  }
};

/**
 * @desc    Get user's RSVP'd events
 * @route   GET /api/v1/users/:id/events
 */
export const getUserEvents = async (req: AuthRequest, res: Response) => {
  try {
    // Authenticated access — show own data, or allow admin view
    if (req.user?.userId !== req.params.id && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const rsvps = await RSVP.find({ user: req.params.id, status: 'attending' })
      .populate({
        path: 'event',
        select: 'title date category coverImage status rsvpCount',
        populate: { path: 'location', select: 'name buildingCode' }
      })
      .sort({ createdAt: -1 });

    res.json({ events: rsvps });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user events' });
  }
};

/**
 * @desc    Get user's club memberships
 * @route   GET /api/v1/users/:id/clubs
 */
export const getUserClubs = async (req: AuthRequest, res: Response) => {
  try {
    const memberships = await ClubMembership.find({ user: req.params.id, status: 'approved' })
      .populate('club', 'name logo category memberCount status')
      .sort({ createdAt: -1 });

    res.json({ clubs: memberships });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user clubs' });
  }
};

/**
 * @desc    Upload profile avatar
 * @route   POST /api/v1/users/:id/avatar
 */
export const uploadAvatar = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.userId !== req.params.id && req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Cannot update another user\'s avatar' });
    }

    if (!req.file) return res.status(400).json({ error: 'No image file provided' });

    const avatarUrl = await processAndUploadImage(req.file.buffer, 'avatars');

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: { avatar: avatarUrl } },
      { new: true }
    ).select('name avatar');

    res.json({ message: 'Avatar uploaded successfully', avatar: user?.avatar });
  } catch (error: any) {
    res.status(500).json({ error: 'Avatar upload failed', details: error.message });
  }
};

/**
 * @desc    Get user's full portfolio (skills + events + clubs)
 * @route   GET /api/v1/users/:id/portfolio
 */
export const getPortfolio = async (req: Request, res: Response) => {
  try {
    const [user, rsvps, memberships] = await Promise.all([
      User.findById(req.params.id)
        .select('name avatar bio major graduationYear skills interests portfolioLinks')
        .populate('skills', 'name category'),
      RSVP.find({ user: req.params.id, isCheckedIn: true })
        .populate('event', 'title date category')
        .limit(20),
      ClubMembership.find({ user: req.params.id, status: 'approved' })
        .populate('club', 'name logo category')
    ]);

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      profile: user,
      attendedEvents: rsvps,
      clubMemberships: memberships
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
};
