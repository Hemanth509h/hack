import { Event } from '../models/Event';
import { Club } from '../models/Club';
import { RSVP } from '../models/RSVP';
import { User, IUser } from '../models/User';
import { ClubMembership } from '../models/ClubMembership';
import { redisClient } from '../config/redis';
import mongoose from 'mongoose';

const CACHE_TTL = 1800; // 30 minutes

/**
 * Trending: High RSVP/Member growth in the last 48 hours
 */
export const getTrendingEvents = async () => {
  const cacheKey = 'trending:events';
  const cached = await redisClient.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

  // Velocity calculation: RSVPs created recently
  const trending = await RSVP.aggregate([
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
  await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(results));
  return results;
};

export const getTrendingClubs = async () => {
  const cacheKey = 'trending:clubs';
  const cached = await redisClient.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

  const trending = await ClubMembership.aggregate([
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
  await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(results));
  return results;
};

/**
 * Recommendations: Content-based (similar tags) + Collaborative (what similar users liked)
 */
export const getPersonalizedRecommendations = async (userId: string) => {
  const user = await User.findById(userId).lean() as unknown as IUser;
  if (!user) return [];

  // 1. Content-based: Matching user interests
  const interests = user.interests || [];
  const contentResults = await Event.find({
    status: 'published',
    date: { $gte: new Date() },
    $or: [
      { category: { $in: interests } },
      { tags: { $in: interests } }
    ]
  }).limit(10).lean();

  // 2. Collaborative Filtering (Basic): Events RSVP'd by users who share clubs with current user
  const myClubs = await ClubMembership.find({ user: userId, status: 'approved' }).distinct('club');
  
  const similarUsers = await ClubMembership.find({ 
    club: { $in: myClubs }, 
    user: { $ne: new mongoose.Types.ObjectId(userId) },
    status: 'approved'
  }).distinct('user');

  const collaborativeResults = await RSVP.find({
    user: { $in: similarUsers },
    status: 'attending'
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('event')
    .then(rsvps => rsvps.map(r => r.event).filter(e => !!e && (e as any).status === 'published'));

  // Merge and deduplicate
  const allResults = [...contentResults, ...collaborativeResults];
  const uniqueResults = Array.from(new Map(allResults.map(item => [String(item._id), item])).values());

  return uniqueResults.slice(0, 15);
};
