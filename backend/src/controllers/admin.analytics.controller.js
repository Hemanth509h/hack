import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as adminService from '../services/admin.service';

/**
 * @desc    Overview metrics for dashboard
 * @route   GET /api/v1/admin/dashboard
 */
export const getDashboardOverview = async (req, res) => {
  try {
    const metrics = await adminService.getDashboardMetrics();
    res.json(metrics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
};

/**
 * @desc    Engagement trends
 * @route   GET /api/v1/admin/analytics/engagement
 */
export const getEngagementTrends = async (req, res) => {
  try {
    const { days } = req.query as any;
    const trends = await adminService.getEngagementAnalytics(parseInt(days) || 30);
    res.json(trends);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch engagement trends' });
  }
};

/**
 * @desc    Event statistics
 * @route   GET /api/v1/admin/analytics/events
 */
export const getEventAnalytics = async (req, res) => {
  try {
    const stats = await adminService.getEventStats();
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch event statistics' });
  }
};

/**
 * @desc    Club statistics
 * @route   GET /api/v1/admin/analytics/clubs
 */
export const getClubAnalytics = async (req, res) => {
  try {
    const stats = await adminService.getClubStats();
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch club statistics' });
  }
};

/**
 * @desc    Demographics breakdown
 * @route   GET /api/v1/admin/analytics/demographics
 */
export const getDemographicsAnalytics = async (req, res) => {
  try {
    const demographics = await adminService.getDemographics();
    res.json(demographics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch demographics' });
  }
};

/**
 * @desc    Generate engagement CSV report
 * @route   POST /api/v1/admin/reports/engagement
 */
export const downloadEngagementReport = async (req, res) => {
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
  } catch (error) {
    res.status(500).json({ error: 'Report generation failed', details: error.message });
  }
};
