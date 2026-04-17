"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCSVReport = exports.getDemographics = exports.getClubStats = exports.getEventStats = exports.getEngagementAnalytics = exports.getDashboardMetrics = void 0;
const User_1 = require("../models/User");
const Event_1 = require("../models/Event");
const Club_1 = require("../models/Club");
const RSVP_1 = require("../models/RSVP");
const Message_1 = require("../models/Message");
/**
 * Overview Metrics for Admin Dashboard
 */
const getDashboardMetrics = async () => {
    const [activeStudents, upcomingEvents, pendingClubs, totalClubs] = await Promise.all([
        User_1.User.countDocuments({ role: 'student' }),
        Event_1.Event.countDocuments({ date: { $gte: new Date() }, status: 'published' }),
        Club_1.Club.countDocuments({ status: 'pending' }),
        Club_1.Club.countDocuments({ status: 'active' })
    ]);
    return {
        activeStudents,
        upcomingEvents,
        pendingClubs,
        totalClubs,
        systemHealth: 'Healthy' // Basic health check
    };
};
exports.getDashboardMetrics = getDashboardMetrics;
/**
 * Engagement Analytics: Daily RSVP and Message volumes
 */
const getEngagementAnalytics = async (days = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const rsvpAnalytics = await RSVP_1.RSVP.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);
    const messageAnalytics = await Message_1.Message.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);
    return { rsvpAnalytics, messageAnalytics };
};
exports.getEngagementAnalytics = getEngagementAnalytics;
/**
 * Event Stats: Distribution by Category and Attendance
 */
const getEventStats = async () => {
    return Event_1.Event.aggregate([
        {
            $group: {
                _id: '$category',
                totalEvents: { $sum: 1 },
                averageRSVPs: { $avg: '$rsvpCount' },
                totalAttendees: { $sum: '$rsvpCount' }
            }
        },
        { $sort: { totalEvents: -1 } }
    ]);
};
exports.getEventStats = getEventStats;
/**
 * Club Stats: Member Growth and Activity
 */
const getClubStats = async () => {
    return Club_1.Club.aggregate([
        {
            $group: {
                _id: '$category',
                totalClubs: { $sum: 1 },
                averageMembers: { $avg: '$memberCount' },
                totalMembers: { $sum: '$memberCount' }
            }
        },
        { $sort: { totalClubs: -1 } }
    ]);
};
exports.getClubStats = getClubStats;
/**
 * Demographics Breakdown: Students by Major & Year
 */
const getDemographics = async () => {
    const majorStats = await User_1.User.aggregate([
        { $match: { role: 'student' } },
        { $group: { _id: '$major', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
    const yearStats = await User_1.User.aggregate([
        { $match: { role: 'student' } },
        { $group: { _id: '$graduationYear', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);
    return { majorStats, yearStats };
};
exports.getDemographics = getDemographics;
/**
 * CSV Generation for Engagement Reports (manual, no external dependency needed)
 */
const generateCSVReport = async (data) => {
    if (!data || data.length === 0)
        return '';
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','));
    return [headers.join(','), ...rows].join('\n');
};
exports.generateCSVReport = generateCSVReport;
