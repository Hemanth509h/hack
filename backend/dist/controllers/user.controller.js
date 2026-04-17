"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLocation = exports.getPortfolio = exports.uploadAvatar = exports.getUserClubs = exports.getUserEvents = exports.updateInterests = exports.removeSkill = exports.addSkill = exports.updateProfile = exports.getProfile = void 0;
const User_1 = require("../models/User");
const Skill_1 = require("../models/Skill");
const RSVP_1 = require("../models/RSVP");
const ClubMembership_1 = require("../models/ClubMembership");
const upload_utils_1 = require("../utils/upload.utils");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * @desc    Get public user profile
 * @route   GET /api/v1/users/:id/profile
 */
const getProfile = async (req, res) => {
    try {
        const isOwner = req.user?.userId === req.params.id;
        const isAdmin = req.user?.role === 'admin';
        const user = await User_1.User.findById(req.params.id)
            .select('-password -resetPasswordToken -resetPasswordExpires -providers')
            .populate('skills', 'name category');
        if (!user)
            return res.status(404).json({ error: 'User not found' });
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to load profile' });
    }
};
exports.getProfile = getProfile;
/**
 * @desc    Update own profile
 * @route   PUT /api/v1/users/:id/profile
 */
const updateProfile = async (req, res) => {
    try {
        if (req.user?.userId !== req.params.id && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Cannot update another user\'s profile' });
        }
        const user = await User_1.User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true }).select('-password -resetPasswordToken -resetPasswordExpires');
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'Profile updated', user });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update profile', details: error.message });
    }
};
exports.updateProfile = updateProfile;
/**
 * @desc    Add skill to profile (with deduplication)
 * @route   POST /api/v1/users/:id/skills
 */
const addSkill = async (req, res) => {
    try {
        if (req.user?.userId !== req.params.id) {
            return res.status(403).json({ error: 'Cannot modify another user\'s skills' });
        }
        const { skillId } = req.body;
        // Verify skill exists
        const skillExists = await Skill_1.Skill.findById(skillId);
        if (!skillExists)
            return res.status(404).json({ error: 'Skill not found' });
        // $addToSet prevents duplicate ObjectId entries natively
        const user = await User_1.User.findByIdAndUpdate(req.params.id, { $addToSet: { skills: new mongoose_1.default.Types.ObjectId(skillId) } }, { new: true }).populate('skills', 'name category');
        res.json({ message: 'Skill added', skills: user?.skills });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add skill' });
    }
};
exports.addSkill = addSkill;
/**
 * @desc    Remove skill from profile
 * @route   DELETE /api/v1/users/:id/skills/:skillId
 */
const removeSkill = async (req, res) => {
    try {
        if (req.user?.userId !== req.params.id) {
            return res.status(403).json({ error: 'Cannot modify another user\'s skills' });
        }
        const user = await User_1.User.findByIdAndUpdate(req.params.id, { $pull: { skills: new mongoose_1.default.Types.ObjectId(req.params.skillId) } }, { new: true }).populate('skills', 'name category');
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json({ message: 'Skill removed', skills: user.skills });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to remove skill' });
    }
};
exports.removeSkill = removeSkill;
/**
 * @desc    Update user interests array
 * @route   PUT /api/v1/users/:id/interests
 */
const updateInterests = async (req, res) => {
    try {
        if (req.user?.userId !== req.params.id) {
            return res.status(403).json({ error: 'Cannot modify another user\'s interests' });
        }
        // Deduplicate interests before saving
        const deduped = [...new Set(req.body.interests.map(i => i.toLowerCase().trim()))];
        const user = await User_1.User.findByIdAndUpdate(req.params.id, { $set: { interests: deduped } }, { new: true });
        res.json({ message: 'Interests updated', interests: user?.interests });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update interests' });
    }
};
exports.updateInterests = updateInterests;
/**
 * @desc    Get user's RSVP'd events
 * @route   GET /api/v1/users/:id/events
 */
const getUserEvents = async (req, res) => {
    try {
        // Authenticated access — show own data, or allow admin view
        if (req.user?.userId !== req.params.id && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }
        const rsvps = await RSVP_1.RSVP.find({ user: req.params.id, status: 'attending' })
            .populate({
            path: 'event',
            select: 'title date category coverImage status rsvpCount',
            populate: { path: 'location', select: 'name buildingCode' }
        })
            .sort({ createdAt: -1 });
        res.json({ events: rsvps });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user events' });
    }
};
exports.getUserEvents = getUserEvents;
/**
 * @desc    Get user's club memberships
 * @route   GET /api/v1/users/:id/clubs
 */
const getUserClubs = async (req, res) => {
    try {
        const memberships = await ClubMembership_1.ClubMembership.find({ user: req.params.id, status: 'approved' })
            .populate('club', 'name logo category memberCount status')
            .sort({ createdAt: -1 });
        res.json({ clubs: memberships });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user clubs' });
    }
};
exports.getUserClubs = getUserClubs;
/**
 * @desc    Upload profile avatar
 * @route   POST /api/v1/users/:id/avatar
 */
const uploadAvatar = async (req, res) => {
    try {
        if (req.user?.userId !== req.params.id && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Cannot update another user\'s avatar' });
        }
        if (!req.file)
            return res.status(400).json({ error: 'No image file provided' });
        const avatarUrl = await (0, upload_utils_1.processAndUploadImage)(req.file.buffer, 'avatars');
        const user = await User_1.User.findByIdAndUpdate(req.params.id, { $set: { avatar: avatarUrl } }, { new: true }).select('name avatar');
        res.json({ message: 'Avatar uploaded successfully', avatar: user?.avatar });
    }
    catch (error) {
        res.status(500).json({ error: 'Avatar upload failed', details: error.message });
    }
};
exports.uploadAvatar = uploadAvatar;
/**
 * @desc    Get user's full portfolio (skills + events + clubs)
 * @route   GET /api/v1/users/:id/portfolio
 */
const getPortfolio = async (req, res) => {
    try {
        const [user, rsvps, memberships] = await Promise.all([
            User_1.User.findById(req.params.id)
                .select('name avatar bio major graduationYear skills interests portfolioLinks')
                .populate('skills', 'name category'),
            RSVP_1.RSVP.find({ user: req.params.id, isCheckedIn: true })
                .populate('event', 'title date category')
                .limit(20),
            ClubMembership_1.ClubMembership.find({ user: req.params.id, status: 'approved' })
                .populate('club', 'name logo category')
        ]);
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        res.json({
            profile: user,
            attendedEvents: rsvps,
            clubMemberships: memberships
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch portfolio' });
    }
};
exports.getPortfolio = getPortfolio;
/**
 * @desc    Update user home location
 * @route   POST /api/v1/users/:id/location
 */
const updateLocation = async (req, res) => {
    try {
        if (req.user?.userId !== req.params.id && req.user?.role !== 'admin') {
            return res.status(403).json({ error: 'Cannot update another user\'s location' });
        }
        const { latitude, longitude } = req.body;
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
            return res.status(400).json({ error: 'Invalid coordinates provided.' });
        }
        const user = await User_1.User.findByIdAndUpdate(req.params.id, {
            $set: {
                homeLocation: {
                    type: 'Point',
                    coordinates: [longitude, latitude] // GeoJSON expects [lng, lat]
                }
            }
        }, { new: true }).select('-password');
        res.json({ message: 'Location updated', homeLocation: user?.homeLocation });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update location' });
    }
};
exports.updateLocation = updateLocation;
