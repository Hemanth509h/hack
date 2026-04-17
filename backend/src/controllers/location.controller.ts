import { Request, Response } from 'express';
import { Location } from '../models/Location';

/**
 * @desc    Search locations for autocompletion
 * @route   GET /api/v1/locations/search
 */
export const searchLocations = async (req: Request, res: Response) => {
  try {
    const { q, limit = '10' } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Query parameter q is required' });
    }

    // Attempt text search or regex based search
    // Text search if text indexes exist: $text: { $search: q }
    const locations = await Location.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { buildingCode: { $regex: q, $options: 'i' } }
      ]
    }).limit(parseInt(limit as string));

    res.json(locations);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to search locations', details: error.message });
  }
};
