import { Request, Response } from 'express';
import { Event } from '../models/Event';
import { Club } from '../models/Club';
import { TeamProject } from '../models/TeamProject';
import { Message } from '../models/Message';

/**
 * @desc    Get consolidated campus activity feed
 * @route   GET /api/v1/feed
 */
export const getCampusFeed = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Fetch latest items from different collections
    const [events, clubs, projects] = await Promise.all([
      Event.find().sort({ createdAt: -1 }).limit(Number(limit)).populate('club', 'name logo'),
      Club.find({ status: 'approved' }).sort({ createdAt: -1 }).limit(Number(limit)),
      TeamProject.find({ status: 'open' }).sort({ createdAt: -1 }).limit(Number(limit)).populate('leader', 'name avatar'),
    ]);

    // Transform into unified feed items
    const feedItems = [
      ...events.map(e => ({
        id: e._id,
        type: 'event',
        title: e.title,
        description: e.description,
        timestamp: e.createdAt,
        image: e.coverImage,
        metadata: { club: e.club, location: e.location }
      })),
      ...clubs.map(c => ({
        id: c._id,
        type: 'club',
        title: c.name,
        description: c.description,
        timestamp: c.createdAt,
        image: c.logo,
        metadata: { category: c.category }
      })),
      ...projects.map(p => ({
        id: p._id,
        type: 'project',
        title: p.title,
        description: p.description,
        timestamp: p.createdAt,
        metadata: { leader: p.leader, requiredSkills: p.requiredSkills }
      }))
    ];

    // Sort by timestamp descending
    const sortedFeed = feedItems.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, Number(limit));

    res.json({
      items: sortedFeed,
      page: Number(page),
      hasMore: sortedFeed.length === Number(limit)
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch campus feed', details: error.message });
  }
};
