"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchLocations = void 0;
const Location_1 = require("../models/Location");
/**
 * @desc    Search locations for autocompletion
 * @route   GET /api/v1/locations/search
 */
const searchLocations = async (req, res) => {
    try {
        const { q, limit = '10' } = req.query;
        if (!q || typeof q !== 'string') {
            return res.status(400).json({ error: 'Query parameter q is required' });
        }
        // Attempt text search or regex based search
        // Text search if text indexes exist: $text: { $search: q }
        const locations = await Location_1.Location.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { buildingCode: { $regex: q, $options: 'i' } }
            ]
        }).limit(parseInt(limit));
        res.json(locations);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to search locations', details: error.message });
    }
};
exports.searchLocations = searchLocations;
