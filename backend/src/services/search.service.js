import { Event } from '../models/Event';
import { Club } from '../models/Club';
import { SearchHistory } from '../models/SearchHistory';
import mongoose from 'mongoose';

export 

export const trackSearch = async (userId, query, type: 'event' | 'club' | 'all') => {
  try {
    // Avoid spamming history with identical queries
    const lastSearch = await SearchHistory.findOne({ user: userId }).sort({ timestamp: -1 });
    if (lastSearch?.query === query) return;

    await SearchHistory.create({ user: new mongoose.Types.ObjectId(userId), query, type });
  } catch (err) {
    console.error('[search-service]: Tracking failed:', err);
  }
};

export const getRecentSearches = async (userId) => {
  return SearchHistory.find({ user: new mongoose.Types.ObjectId(userId) })
    .sort({ timestamp: -1 })
    .limit(10)
    .select('query type timestamp');
};

export const getAutocompleteSuggestions = async (q) => {
  const regex = new RegExp(`${q}`, 'i');

  const [events, clubs] = await Promise.all([
    Event.find({ status: 'published', title: regex }).limit(5).select('title category').lean(),
    Club.find({ status: 'active', name: regex }).limit(5).select('name category').lean()
  ]);

  return {
    events: events.map(e => ({ id: e._id, text: e.title, type: 'event', category: e.category })),
    clubs: clubs.map(c => ({ id: c._id, text: c.name, type: 'club', category: c.category }))
  };
};

export const performUnifiedSearch = async (q, type, filters, page = 1, limit = 10, sortBy = 'relevance') => {
  const query = {};
  let aggregateResults: any[] = [];
  let totalCount = 0;
  
  if (q) {
    query.$text = { $search: q };
  }

  // Sorting relevance ranking
  let sortParams = {};
  if (q && sortBy === 'relevance') {
    sortParams = { score: { $meta: 'textScore' } };
  } else if (sortBy === 'date') {
    sortParams = { date: 1 };
  } else if (sortBy === 'popularity') {
    sortParams = { rsvpCount: -1, memberCount: -1 };
  } else {
    sortParams = { createdAt: -1 };
  }

  if (type === 'event' || type === 'all') {
    const eventQuery = { ...query, status: 'published' };
    if (filters.category) eventQuery.category = filters.category;
    if (filters.club) eventQuery.club = filters.club;
    if (filters.startDate || filters.endDate) {
      eventQuery.date = {};
      if (filters.startDate) eventQuery.date.$gte = new Date(filters.startDate);
      if (filters.endDate) eventQuery.date.$lte = new Date(filters.endDate);
    }

    const events = await Event.find(eventQuery, q ? { score: { $meta: 'textScore' } } : {})
      .sort(sortParams)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('organizer', 'name avatar')
      .populate('club', 'name logo');

    const total = await Event.countDocuments(eventQuery);
    
    if (type === 'event') return { results: events, pagination: { total, page, pages: Math.ceil(total / limit) } };
    
    // If "all", store results
    aggregateResults.push(...events);
    totalCount += total;
  }

  if (type === 'club' || type === 'all') {
    const clubQuery = { ...query, status: 'active' };
    if (filters.category) clubQuery.category = filters.category;

    const clubs = await Club.find(clubQuery, q ? { score: { $meta: 'textScore' } } : {})
      .sort(sortParams)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Club.countDocuments(clubQuery);
    
    if (type === 'club') return { results: clubs, pagination: { total, page, pages: Math.ceil(total / limit) } };
    
    aggregateResults.push(...clubs);
    totalCount += total;
  }

  if (type === 'all') {
    // Basic array sorting by date just to interleave them nicely on the first unified page if requested
    if (sortBy === 'date') aggregateResults.sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());
    return { results: aggregateResults, pagination: { total: totalCount, page, pages: Math.ceil(totalCount / limit) } };
  }

  return { results: [], pagination: { total: 0, page, pages: 0 } };
};
