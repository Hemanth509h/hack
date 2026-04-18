import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as searchService from '../services/search.service';
import { Event } from '../models/Event';

/**
 * @desc    Unified search for events and clubs
 * @route   GET /api/v1/search
 */
export const searchAll = async (req, res) => {
  try {
    const { q, type = 'all', page = 1, limit = 10, sortBy, category, startDate, endDate, club } = req.query as any;

    const results = await searchService.performUnifiedSearch(
      q, 
      type, 
      { category, startDate, endDate, club }, 
      parseInt(page), 
      parseInt(limit), 
      sortBy
    );

    // Track search history asynchronously
    if (q && req.user) {
      searchService.trackSearch(req.user.userId, q, type);
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
};

/**
 * @desc    Autocomplete suggestions based on prefix
 * @route   GET /api/v1/search/autocomplete
 */
export const getAutocomplete = async (req, res) => {
  try {
    const { q } = req.query as any;
    if (!q || q.length < 2) return res.json({ events: [], clubs: [] });

    const suggestions = await searchService.getAutocompleteSuggestions(q);
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: 'Autocomplete failed' });
  }
};

/**
 * @desc    Get recent searches for the user
 * @route   GET /api/v1/search/recent
 */
export const getRecentSearches = async (req, res) => {
  try {
    const searches = await searchService.getRecentSearches(req.user!.userId);
    res.json({ recent: searches });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recent searches' });
  }
};

/**
 * @desc    Refined geospatial search
 * @route   GET /api/v1/search/nearby
 */
export const getNearby = async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query as any;

    if (!lat || !lng) return res.status(400).json({ error: 'Location required' });

    const nearbyEvents = await Event.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          distanceField: 'distance',
          maxDistance: parseInt(radius),
          spherical: true,
          query: { status: 'published', date: { $gte: new Date() } }
        }
      },
      {
        $lookup: { from: 'locations', localField: 'location', foreignField: '_id', as: 'locationInfo' }
      },
      { $limit: 20 }
    ]);

    res.json({ events: nearbyEvents });
  } catch (error) {
    res.status(500).json({ error: 'Nearby discovery failed' });
  }
};
