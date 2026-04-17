"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNearby = exports.getRecentSearches = exports.getAutocomplete = exports.searchAll = void 0;
const searchService = __importStar(require("../services/search.service"));
const Event_1 = require("../models/Event");
/**
 * @desc    Unified search for events and clubs
 * @route   GET /api/v1/search
 */
const searchAll = async (req, res) => {
    try {
        const { q, type = 'all', page = 1, limit = 10, sortBy, category, startDate, endDate, club } = req.query;
        const results = await searchService.performUnifiedSearch(q, type, { category, startDate, endDate, club }, parseInt(page), parseInt(limit), sortBy);
        // Track search history asynchronously
        if (q && req.user) {
            searchService.trackSearch(req.user.userId, q, type);
        }
        res.json(results);
    }
    catch (error) {
        res.status(500).json({ error: 'Search failed', details: error.message });
    }
};
exports.searchAll = searchAll;
/**
 * @desc    Autocomplete suggestions based on prefix
 * @route   GET /api/v1/search/autocomplete
 */
const getAutocomplete = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 2)
            return res.json({ events: [], clubs: [] });
        const suggestions = await searchService.getAutocompleteSuggestions(q);
        res.json(suggestions);
    }
    catch (error) {
        res.status(500).json({ error: 'Autocomplete failed' });
    }
};
exports.getAutocomplete = getAutocomplete;
/**
 * @desc    Get recent searches for the user
 * @route   GET /api/v1/search/recent
 */
const getRecentSearches = async (req, res) => {
    try {
        const searches = await searchService.getRecentSearches(req.user.userId);
        res.json({ recent: searches });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch recent searches' });
    }
};
exports.getRecentSearches = getRecentSearches;
/**
 * @desc    Refined geospatial search
 * @route   GET /api/v1/search/nearby
 */
const getNearby = async (req, res) => {
    try {
        const { lat, lng, radius = 5000 } = req.query;
        if (!lat || !lng)
            return res.status(400).json({ error: 'Location required' });
        const nearbyEvents = await Event_1.Event.aggregate([
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
    }
    catch (error) {
        res.status(500).json({ error: 'Nearby discovery failed' });
    }
};
exports.getNearby = getNearby;
