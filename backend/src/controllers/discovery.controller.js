import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as discoveryService from '../services/discovery.service';

/**
 * @desc    Get trending events
 * @route   GET /api/v1/trending/events
 */
export const getTrendingEvents = async (req, res) => {
  try {
    const trending = await discoveryService.getTrendingEvents();
    res.json({ trending });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending events' });
  }
};

/**
 * @desc    Get trending clubs
 * @route   GET /api/v1/trending/clubs
 */
export const getTrendingClubs = async (req, res) => {
  try {
    const trending = await discoveryService.getTrendingClubs();
    res.json({ trending });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending clubs' });
  }
};

/**
 * @desc    Get personalized recommendations (Events)
 * @route   GET /api/v1/recommendations/events
 */
export const getEventRecommendations = async (req, res) => {
  try {
    const recommendations = await discoveryService.getPersonalizedRecommendations(req.user!.userId);
    // Filter for events only if service returns mixed
    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate event recommendations' });
  }
};

/**
 * @desc    Get personalized recommendations (Clubs)
 * @route   GET /api/v1/recommendations/clubs
 */
export const getClubRecommendations = async (req, res) => {
  try {
    // Current service handles events primarily in collaborative, but we can return featured clubs as fallback
    const recommendations = await discoveryService.getTrendingClubs(); // Fallback for clubs recommendation
    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate club recommendations' });
  }
};
