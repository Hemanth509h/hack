import { User } from '../models/User.js';
import { Event } from '../models/Event.js';
import { Club } from '../models/Club.js';
import { RSVP } from '../models/RSVP.js';
import { Message } from '../models/Message.js';
/**
 * Overview Metrics for Admin Dashboard
 */
export const getDashboardMetrics = async () => {
    const [activeStudents, upcomingEvents, pendingClubs, totalClubs] = await Promise.all([
        User.countDocuments({ role: 'student' }),
        Event.countDocuments({ date: { $gte: new Date() }, status: 'published' }),
        Club.countDocuments({ status: 'pending' }),
        Club.countDocuments({ status: 'active' })
    ]);
    return {
        activeStudents,
        upcomingEvents,
        pendingClubs,
        totalClubs,
        systemHealth: 'Healthy' // Basic health check
    };
};
/**
 * Engagement Analytics: Daily RSVP and Message volumes
 */
export const getEngagementAnalytics = async (days = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const rsvpAnalytics = await RSVP.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                count: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);
    const messageAnalytics = await Message.aggregate([
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
/**
 * Event Stats: Distribution by Category and Attendance
 */
export const getEventStats = async () => {
    return Event.aggregate([
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
/**
 * Club Stats: Member Growth and Activity
 */
export const getClubStats = async () => {
    return Club.aggregate([
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
/**
 * Demographics Breakdown: Students by Major & Year
 */
export const getDemographics = async () => {
    const majorStats = await User.aggregate([
        { $match: { role: 'student' } },
        { $group: { _id: '$major', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
    const yearStats = await User.aggregate([
        { $match: { role: 'student' } },
        { $group: { _id: '$graduationYear', count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
    ]);
    return { majorStats, yearStats };
};
/**
 * CSV Generation for Engagement Reports (manual, no external dependency needed)
 */
export const generateCSVReport = async (data) => {
    if (!data || data.length === 0)
        return '';
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','));
    return [headers.join(','), ...rows].join('\n');
};
