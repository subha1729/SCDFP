import express from 'express';
import { inMemoryStore } from '../services/inMemoryStore.js';
import { isDbConnected } from '../config/db.js';
import { ActivityLog } from '../models/ActivityLog.js';

const router = express.Router();

/**
 * GET /api/dashboard/kpis
 */
router.get('/kpis', (req, res) => {
  try {
    const kpis = inMemoryStore.getDashboardKpis();
    res.json({ status: 'success', data: kpis });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * GET /api/dashboard/charts
 */
router.get('/charts', (req, res) => {
  res.json({
    status: 'success',
    data: {
      dailySales: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        actual: [42, 48, 51, 56, 72, 85, 78],
        forecasted: [40, 46, 53, 58, 70, 88, 80]
      },
      weeklyForecast: {
        labels: ['Wk 31', 'Wk 32', 'Wk 33', 'Wk 34', 'Wk 35', 'Wk 36'],
        baseline: [1200, 1250, 1300, 1280, 1320, 1380],
        promoUplift: [180, 240, 310, 200, 450, 520]
      },
      monthlyDemand: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        actual2025: [4.2, 4.5, 4.8, 5.1, 5.6, 6.0, 6.4, 6.8, 6.2, 6.7, 8.1, 9.5],
        projected2026: [4.8, 5.2, 5.7, 6.1, 6.8, 7.3, 7.9, 8.4, 7.8, 8.2, 9.8, 11.2]
      },
      promotionImpact: {
        labels: ['No Promo', '10% Off', '25% BOGO', 'Flash Sale', 'Holiday Special'],
        liftFactors: [0, 14.2, 38.5, 62.1, 85.0]
      },
      holidayImpact: {
        labels: ['Super Bowl', 'Easter', 'Labor Day', 'Black Friday', 'Cyber Monday', 'Christmas'],
        spikeMultipliers: [1.35, 1.20, 1.45, 2.85, 2.60, 2.40]
      }
    }
  });
});

/**
 * GET /api/dashboard/activities
 */
router.get('/activities', async (req, res) => {
  try {
    if (isDbConnected()) {
      const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(10);
      return res.json({ status: 'success', data: logs });
    }

    const fallbackLogs = inMemoryStore.getActivities();
    res.json({ status: 'success', data: fallbackLogs });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
