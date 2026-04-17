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
exports.downloadEngagementReport = exports.getDemographicsAnalytics = exports.getClubAnalytics = exports.getEventAnalytics = exports.getEngagementTrends = exports.getDashboardOverview = void 0;
const adminService = __importStar(require("../services/admin.service"));
/**
 * @desc    Overview metrics for dashboard
 * @route   GET /api/v1/admin/dashboard
 */
const getDashboardOverview = async (req, res) => {
    try {
        const metrics = await adminService.getDashboardMetrics();
        res.json(metrics);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
    }
};
exports.getDashboardOverview = getDashboardOverview;
/**
 * @desc    Engagement trends
 * @route   GET /api/v1/admin/analytics/engagement
 */
const getEngagementTrends = async (req, res) => {
    try {
        const { days } = req.query;
        const trends = await adminService.getEngagementAnalytics(parseInt(days) || 30);
        res.json(trends);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch engagement trends' });
    }
};
exports.getEngagementTrends = getEngagementTrends;
/**
 * @desc    Event statistics
 * @route   GET /api/v1/admin/analytics/events
 */
const getEventAnalytics = async (req, res) => {
    try {
        const stats = await adminService.getEventStats();
        res.json({ stats });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch event statistics' });
    }
};
exports.getEventAnalytics = getEventAnalytics;
/**
 * @desc    Club statistics
 * @route   GET /api/v1/admin/analytics/clubs
 */
const getClubAnalytics = async (req, res) => {
    try {
        const stats = await adminService.getClubStats();
        res.json({ stats });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch club statistics' });
    }
};
exports.getClubAnalytics = getClubAnalytics;
/**
 * @desc    Demographics breakdown
 * @route   GET /api/v1/admin/analytics/demographics
 */
const getDemographicsAnalytics = async (req, res) => {
    try {
        const demographics = await adminService.getDemographics();
        res.json(demographics);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch demographics' });
    }
};
exports.getDemographicsAnalytics = getDemographicsAnalytics;
/**
 * @desc    Generate engagement CSV report
 * @route   POST /api/v1/admin/reports/engagement
 */
const downloadEngagementReport = async (req, res) => {
    try {
        const { days } = req.body;
        const { rsvpAnalytics } = await adminService.getEngagementAnalytics(days || 30);
        // Flatten data for CSV
        const reportData = rsvpAnalytics.map(item => ({
            ...item,
            type: 'RSVP'
        }));
        const csv = await adminService.generateCSVReport(reportData);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=engagement_report_${new Date().toISOString()}.csv`);
        res.status(200).send(csv);
    }
    catch (error) {
        res.status(500).json({ error: 'Report generation failed', details: error.message });
    }
};
exports.downloadEngagementReport = downloadEngagementReport;
