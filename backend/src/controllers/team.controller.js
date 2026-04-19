import { User } from '../models/User.js';
import { TeamProject } from '../models/TeamProject.js';
import { sendNotification } from '../services/notification.service.js';
import mongoose from 'mongoose';
import { computeSkillScore, computeInterestScore, computeCollaborationScore, computeMatchScore, getCachedMatches, setCachedMatches, invalidateMatchCache, } from '../utils/matching.utils.js';
/**
 * @desc    Get top compatibility matches for the current user
 * @route   GET /api/v1/teams/matches
 */
export const getMatches = async (req, res) => {
    try {
        const userId = req.user.userId;
        // 1. Check Redis cache first
        const cached = await getCachedMatches(userId);
        if (cached)
            return res.json({ matches: cached, fromCache: true });
        // 2. Fetch current user profile
        const me = await User.findById(userId).populate('skills', 'name');
        if (!me)
            return res.status(404).json({ error: 'User not found' });
        const mySkillNames = me.skills.map((s) => s.name);
        const myInterests = me.interests || [];
        // 3. Fetch all completed projects I've led/joined (for collaboration history)
        const myCompletedProjects = await TeamProject.find({
            $or: [{ leader: userId }, { members: userId }],
            status: 'completed',
        }).select('members leader');
        const myCompletedMemberLists = myCompletedProjects.map((p) => [...p.members.map(String), String(p.leader)]);
        // 4. Fetch candidate pool — everyone except me
        // In production this would use a more targeted query (same college, same major range, etc.)
        const candidates = await User.find({ _id: { $ne: userId } })
            .populate('skills', 'name')
            .limit(200) // Batch size — prevents scanning entire collection on large campuses
            .lean();
        // 5. Detect candidates who are "available" (lead at least one open project or have skills)
        const openProjectLeaders = await TeamProject.find({ status: 'open' }).distinct('leader');
        const availableSet = new Set(openProjectLeaders.map(String));
        // 6. Score every candidate
        const scored = await Promise.all(candidates.map(async (candidate) => {
            const theirSkillNames = candidate.skills.map((s) => s.name);
            const theirInterests = candidate.interests || [];
            const [skillScore, interestScore] = await Promise.all([
                computeSkillScore(mySkillNames, theirSkillNames),
                Promise.resolve(computeInterestScore(myInterests, theirInterests)),
            ]);
            const collaborationScore = computeCollaborationScore(myCompletedMemberLists, String(candidate._id));
            const isAvailable = availableSet.has(String(candidate._id));
            const matchScore = computeMatchScore({
                skillScore,
                interestScore,
                collaborationScore,
                isAvailable,
            });
            return {
                user: {
                    _id: candidate._id,
                    name: candidate.name,
                    avatar: candidate.avatar,
                    major: candidate.major,
                    graduationYear: candidate.graduationYear,
                    bio: candidate.bio,
                    skills: candidate.skills,
                    interests: candidate.interests,
                },
                matchScore,
                breakdown: {
                    skillOverlap: Math.round(skillScore * 100),
                    interestAlignment: Math.round(interestScore * 100),
                    collaborationHistory: Math.round(collaborationScore * 100),
                    isAvailable,
                },
            };
        }));
        // 7. Sort by score descending, return top 20
        const topMatches = scored
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 20);
        // 8. Cache results
        await setCachedMatches(userId, topMatches);
        res.json({ matches: topMatches, fromCache: false });
    }
    catch (error) {
        res.status(500).json({ error: 'Matching engine failed', details: error.message });
    }
};
/**
 * @desc    Create a new team project
 * @route   POST /api/v1/teams/projects
 */
export const createProject = async (req, res) => {
    try {
        const project = await TeamProject.create({
            ...req.body,
            leader: req.user.userId,
            members: [req.user.userId],
        });
        // Creating a project means you're now "available" — invalidate match cache
        await invalidateMatchCache(req.user.userId);
        res.status(201).json({ message: 'Project created', project });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create project', details: error.message });
    }
};
/**
 * @desc    Get project details
 * @route   GET /api/v1/teams/projects/:id
 */
export const getProject = async (req, res) => {
    try {
        const project = await TeamProject.findById(req.params.id)
            .populate('leader', 'name avatar major')
            .populate('members', 'name avatar major skills')
            .populate('requiredSkills.skill', 'name category')
            .populate('associatedEvent', 'title date');
        if (!project)
            return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch project' });
    }
};
/**
 * @desc    Update project
 * @route   PUT /api/v1/teams/projects/:id
 */
export const updateProject = async (req, res) => {
    try {
        const project = await TeamProject.findById(req.params.id);
        if (!project)
            return res.status(404).json({ error: 'Project not found' });
        if (String(project.leader) !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Only the project leader can update this project' });
        }
        const updated = await TeamProject.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: 'Project updated', project: updated });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update project' });
    }
};
/**
 * @desc    Delete project
 * @route   DELETE /api/v1/teams/projects/:id
 */
export const deleteProject = async (req, res) => {
    try {
        const project = await TeamProject.findById(req.params.id);
        if (!project)
            return res.status(404).json({ error: 'Project not found' });
        if (String(project.leader) !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Only the project leader can delete this project' });
        }
        await project.deleteOne();
        res.json({ message: 'Project deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
};
/**
 * @desc    Request to join a project
 * @route   POST /api/v1/teams/projects/:id/request
 */
export const requestToJoin = async (req, res) => {
    try {
        const userId = req.user.userId;
        const project = await TeamProject.findById(req.params.id);
        if (!project)
            return res.status(404).json({ error: 'Project not found' });
        if (project.status !== 'open') {
            return res.status(400).json({ error: 'Project is not open for new members' });
        }
        if (project.members.map(String).includes(userId)) {
            return res.status(400).json({ error: 'You are already a member of this project' });
        }
        if (project.pendingRequests.map(String).includes(userId)) {
            return res.status(400).json({ error: 'You already have a pending request' });
        }
        // Add to pending requests
        await TeamProject.findByIdAndUpdate(req.params.id, {
            $addToSet: { pendingRequests: new mongoose.Types.ObjectId(userId) },
        });
        // Notify the project leader
        const { message } = req.body;
        const requester = await User.findById(userId).select('name');
        await sendNotification({
            recipientId: String(project.leader),
            type: 'team_request',
            title: 'New Team Request',
            message: `${requester?.name} wants to join your project "${project.title}"${message ? `: "${message}"` : '.'}`,
            dataPayload: { projectId: project._id, requesterId: userId },
        });
        res.json({ message: 'Join request sent to project leader' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to send join request' });
    }
};
/**
 * @desc    Accept a team join request
 * @route   PUT /api/v1/teams/requests/:id/accept   (id = projectId, body has requesterId)
 */
export const acceptRequest = async (req, res) => {
    try {
        const { requesterId } = req.body;
        const project = await TeamProject.findById(req.params.id);
        if (!project)
            return res.status(404).json({ error: 'Project not found' });
        if (String(project.leader) !== req.user.userId) {
            return res.status(403).json({ error: 'Only the project leader can accept requests' });
        }
        if (!project.pendingRequests.map(String).includes(requesterId)) {
            return res.status(404).json({ error: 'No pending request from this user' });
        }
        await TeamProject.findByIdAndUpdate(req.params.id, {
            $pull: { pendingRequests: new mongoose.Types.ObjectId(requesterId) },
            $addToSet: { members: new mongoose.Types.ObjectId(requesterId) },
        });
        // Notify requester
        await sendNotification({
            recipientId: requesterId,
            type: 'team_request',
            title: 'Team Request Accepted 🎉',
            message: `You have been accepted into "${project.title}"!`,
            dataPayload: { projectId: project._id },
        });
        // Invalidate both users' match caches (collaboration history changed)
        await Promise.all([
            invalidateMatchCache(req.user.userId),
            invalidateMatchCache(requesterId),
        ]);
        res.json({ message: 'Request accepted, user added to team' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to accept request' });
    }
};
/**
 * @desc    Decline a team join request
 * @route   PUT /api/v1/teams/requests/:id/decline
 */
export const declineRequest = async (req, res) => {
    try {
        const { requesterId } = req.body;
        const project = await TeamProject.findById(req.params.id);
        if (!project)
            return res.status(404).json({ error: 'Project not found' });
        if (String(project.leader) !== req.user.userId) {
            return res.status(403).json({ error: 'Only the project leader can decline requests' });
        }
        await TeamProject.findByIdAndUpdate(req.params.id, {
            $pull: { pendingRequests: new mongoose.Types.ObjectId(requesterId) },
        });
        // Notify requester
        await sendNotification({
            recipientId: requesterId,
            type: 'team_request',
            title: 'Team Request Update',
            message: `Your request to join "${project.title}" was not accepted this time.`,
            dataPayload: { projectId: project._id },
        });
        res.json({ message: 'Request declined' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to decline request' });
    }
};
/**
 * @desc    Get current user's projects (leading + joined)
 * @route   GET /api/v1/teams/my-projects
 */
export const getMyProjects = async (req, res) => {
    try {
        const userId = req.user.userId;
        const projects = await TeamProject.find({
            $or: [{ leader: userId }, { members: userId }],
        })
            .populate('leader', 'name avatar')
            .populate('members', 'name avatar')
            .populate('requiredSkills.skill', 'name')
            .sort({ createdAt: -1 });
        res.json({ projects });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch your projects' });
    }
};
/**
 * @desc    Browse all open team projects
 * @route   GET /api/v1/teams/browse
 */
export const browseProjects = async (req, res) => {
    try {
        const { page = 1, limit = 10, skill, event } = req.query;
        const query = { status: 'open' };
        if (skill)
            query['requiredSkills.skill'] = new mongoose.Types.ObjectId(skill);
        if (event)
            query.associatedEvent = new mongoose.Types.ObjectId(event);
        const projects = await TeamProject.find(query)
            .populate('leader', 'name avatar major')
            .populate('requiredSkills.skill', 'name category')
            .populate('associatedEvent', 'title date')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const total = await TeamProject.countDocuments(query);
        res.json({
            projects,
            pagination: { total, page, pages: Math.ceil(total / limit) },
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to browse projects' });
    }
};
/**
 * @desc    Get all incoming requests for the user's projects
 * @route   GET /api/v1/teams/incoming-requests
 */
export const getIncomingRequests = async (req, res) => {
    try {
        const userId = req.user.userId;
        // Find projects where the user is the leader and there are pending requests
        const projects = await TeamProject.find({
            leader: userId,
            'pendingRequests.0': { $exists: true },
        })
            .populate('pendingRequests', 'name avatar major graduationYear bio skills')
            .select('title pendingRequests');
        // Flatten the requests into a single list
        const flattenedRequests = projects.flatMap((project) => project.pendingRequests.map((requester) => ({
            projectId: project._id,
            projectTitle: project.title,
            requester: {
                _id: requester._id,
                name: requester.name,
                avatar: requester.avatar,
                major: requester.major,
                graduationYear: requester.graduationYear,
                bio: requester.bio,
                skills: requester.skills,
            },
        })));
        res.json({ requests: flattenedRequests });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch incoming requests' });
    }
};
