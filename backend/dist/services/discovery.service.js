"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPersonalizedRecommendations = exports.getTrendingClubs = exports.getTrendingEvents = void 0;
const Event_1 = require("../models/Event");
const RSVP_1 = require("../models/RSVP");
const User_1 = require("../models/User");
const ClubMembership_1 = require("../models/ClubMembership");
const redis_1 = require("../config/redis");
const mongoose_1 = __importDefault(require("mongoose"));
const CACHE_TTL = 1800; // 30 minutes
/**
 * Trending: High RSVP/Member growth in the last 48 hours
 */
const getTrendingEvents = async () => {
    const cacheKey = 'trending:events';
    const cached = await redis_1.redisClient.get(cacheKey);
    if (cached)
        return JSON.parse(cached);
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    // Velocity calculation: RSVPs created recently
    const trending = await RSVP_1.RSVP.aggregate([
        { $match: { createdAt: { $gte: fortyEightHoursAgo }, status: 'attending' } },
        { $group: { _id: '$event', velocity: { $sum: 1 } } },
        { $sort: { velocity: -1 } },
        { $limit: 10 },
        {
            $lookup: {
                from: 'events',
                localField: '_id',
                foreignField: '_id',
                as: 'details'
            }
        },
        { $unwind: '$details' },
        { $match: { 'details.status': 'published' } }
    ]);
    const results = trending.map(t => ({ ...t.details, velocity: t.velocity }));
    await redis_1.redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(results));
    return results;
};
exports.getTrendingEvents = getTrendingEvents;
const getTrendingClubs = async () => {
    const cacheKey = 'trending:clubs';
    const cached = await redis_1.redisClient.get(cacheKey);
    if (cached)
        return JSON.parse(cached);
    const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const trending = await ClubMembership_1.ClubMembership.aggregate([
        { $match: { createdAt: { $gte: fortyEightHoursAgo }, status: 'approved' } },
        { $group: { _id: '$club', velocity: { $sum: 1 } } },
        { $sort: { velocity: -1 } },
        { $limit: 10 },
        {
            $lookup: {
                from: 'clubs',
                localField: '_id',
                foreignField: '_id',
                as: 'details'
            }
        },
        { $unwind: '$details' },
        { $match: { 'details.status': 'active' } }
    ]);
    const results = trending.map(t => ({ ...t.details, velocity: t.velocity }));
    await redis_1.redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(results));
    return results;
};
exports.getTrendingClubs = getTrendingClubs;
/**
 * Recommendations: Content-based (similar tags) + Collaborative (what similar users liked)
 */
const getPersonalizedRecommendations = async (userId) => {
    const user = await User_1.User.findById(userId).lean();
    if (!user)
        return [];
    // 1. Content-based: Matching user interests
    const interests = user.interests || [];
    const contentResults = await Event_1.Event.find({
        status: 'published',
        date: { $gte: new Date() },
        $or: [
            { category: { $in: interests } },
            { tags: { $in: interests } }
        ]
    }).limit(10).lean();
    // 2. Collaborative Filtering (Basic): Events RSVP'd by users who share clubs with current user
    const myClubs = await ClubMembership_1.ClubMembership.find({ user: userId, status: 'approved' }).distinct('club');
    const similarUsers = await ClubMembership_1.ClubMembership.find({
        club: { $in: myClubs },
        user: { $ne: new mongoose_1.default.Types.ObjectId(userId) },
        status: 'approved'
    }).distinct('user');
    const collaborativeResults = await RSVP_1.RSVP.find({
        user: { $in: similarUsers },
        status: 'attending'
    })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('event')
        .then(rsvps => rsvps.map(r => r.event).filter(e => !!e && e.status === 'published'));
    // Merge and deduplicate
    const allResults = [...contentResults, ...collaborativeResults];
    const uniqueResults = Array.from(new Map(allResults.map(item => [String(item._id), item])).values());
    return uniqueResults.slice(0, 15);
};
exports.getPersonalizedRecommendations = getPersonalizedRecommendations;
