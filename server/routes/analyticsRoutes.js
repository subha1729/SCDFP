import express from 'express';
import {
  calculateEoq,
  calculateSafetyStockAudit,
  calculateAbcAnalysis,
  calculateBullwhipIndex,
  calculateStockoutRiskMatrix
} from '../services/analyticsService.js';

const router = express.Router();

/**
 * GET /api/analytics/eoq
 * Economic Order Quantity calculation
 */
router.get('/eoq', (req, res) => {
  const { orderingCost, holdingRate, skuId } = req.query;
  const result = calculateEoq({
    orderingCost: orderingCost ? parseFloat(orderingCost) : 45.0,
    holdingRate: holdingRate ? parseFloat(holdingRate) : 0.22,
    skuId
  });
  res.json(result);
});

/**
 * GET /api/analytics/safety-stock-audit
 * Multi-service level safety stock evaluation (90%, 95%, 98%, 99%, 99.9%)
 */
router.get('/safety-stock-audit', (req, res) => {
  const { leadTimeDays, leadTimeStdDev } = req.query;
  const result = calculateSafetyStockAudit({
    leadTimeDays: leadTimeDays ? parseFloat(leadTimeDays) : 3,
    leadTimeStdDev: leadTimeStdDev ? parseFloat(leadTimeStdDev) : 0.8
  });
  res.json(result);
});

/**
 * GET /api/analytics/abc-analysis
 * Pareto ABC Inventory Categorization
 */
router.get('/abc-analysis', (req, res) => {
  const result = calculateAbcAnalysis();
  res.json(result);
});

/**
 * GET /api/analytics/bullwhip-index
 * Upstream demand distortion & volatility index
 */
router.get('/bullwhip-index', (req, res) => {
  const result = calculateBullwhipIndex();
  res.json(result);
});

/**
 * GET /api/analytics/stockout-risk
 * Probabilistic Stockout Probability Matrix
 */
router.get('/stockout-risk', (req, res) => {
  const result = calculateStockoutRiskMatrix();
  res.json(result);
});

export default router;
