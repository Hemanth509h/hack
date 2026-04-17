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
exports.getClubRecommendations = exports.getEventRecommendations = exports.getTrendingClubs = exports.getTrendingEvents = void 0;
const discoveryService = __importStar(require("../services/discovery.service"));
/**
 * @desc    Get trending events
 * @route   GET /api/v1/trending/events
 */
const getTrendingEvents = async (req, res) => {
    try {
        const trending = await discoveryService.getTrendingEvents();
        res.json({ trending });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch trending events' });
    }
};
exports.getTrendingEvents = getTrendingEvents;
/**
 * @desc    Get trending clubs
 * @route   GET /api/v1/trending/clubs
 */
const getTrendingClubs = async (req, res) => {
    try {
        const trending = await discoveryService.getTrendingClubs();
        res.json({ trending });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch trending clubs' });
    }
};
exports.getTrendingClubs = getTrendingClubs;
/**
 * @desc    Get personalized recommendations (Events)
 * @route   GET /api/v1/recommendations/events
 */
const getEventRecommendations = async (req, res) => {
    try {
        const recommendations = await discoveryService.getPersonalizedRecommendations(req.user.userId);
        // Filter for events only if service returns mixed
        res.json({ recommendations });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to generate event recommendations' });
    }
};
exports.getEventRecommendations = getEventRecommendations;
/**
 * @desc    Get personalized recommendations (Clubs)
 * @route   GET /api/v1/recommendations/clubs
 */
const getClubRecommendations = async (req, res) => {
    try {
        // Current service handles events primarily in collaborative, but we can return featured clubs as fallback
        const recommendations = await discoveryService.getTrendingClubs(); // Fallback for clubs recommendation
        res.json({ recommendations });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to generate club recommendations' });
    }
};
exports.getClubRecommendations = getClubRecommendations;
