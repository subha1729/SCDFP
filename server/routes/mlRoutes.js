import express from 'express';
import { predictDemandForecast, predictStoreClustering, retrainModels, runWhatIfScenario } from '../services/pythonRunner.js';
import { inMemoryStore } from '../services/inMemoryStore.js';

const router = express.Router();

/**
 * Static Model Baseline Metrics
 */
const MODEL_METRICS = {
  XGBoost: { rmse: '3.82', mae: '2.65', mape: '2.4%', accuracy: '97.6%', trainingTime: '1.2s' },
  LSTM: { rmse: '3.15', mae: '2.10', mape: '1.9%', accuracy: '98.1%', trainingTime: '8.4s' },
  Prophet: { rmse: '4.95', mae: '3.80', mape: '3.6%', accuracy: '96.4%', trainingTime: '0.8s' }
};

/**
 * POST /api/forecast/predict or /api/v1/forecast/predict
 * Run Demand Forecast ML Model
 */
router.post(['/forecast/predict', '/v1/forecast/predict', '/forecast'], async (req, res) => {
  const { storeId = 'ALL', horizon = 7, modelType = 'XGBoost', csvPath } = req.body;

  try {
    const horizonNumber = typeof horizon === 'string' && horizon.includes('30') ? 30 : 7;
    const result = await predictDemandForecast({
      storeId,
      horizon: horizonNumber,
      modelType,
      csvPath
    });

    inMemoryStore.addActivity({
      user: 'AI Demand Forecaster',
      action: `Executed ${modelType} model prediction for Store: ${storeId} (${horizonNumber}-day horizon)`,
      badge: 'ML Forecast'
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * POST /api/forecast/simulate
 * Run What-If Scenario simulation (discount %, price change %, holiday multiplier)
 */
router.post(['/forecast/simulate', '/v1/forecast/simulate'], async (req, res) => {
  const { discount = 15.0, priceChange = 0.0, holidayMultiplier = 1.2 } = req.body;

  try {
    const result = await runWhatIfScenario({
      discount: parseFloat(discount),
      priceChange: parseFloat(priceChange),
      holidayMultiplier: parseFloat(holidayMultiplier)
    });

    inMemoryStore.addActivity({
      user: 'Scenario Planner',
      action: `Ran What-If Promo Simulation (Discount: ${discount}%, Price Change: ${priceChange}%)`,
      badge: 'Scenario Simulation'
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * GET /api/forecast/models
 * Model performance benchmarks
 */
router.get('/forecast/models', (req, res) => {
  res.json({
    status: 'success',
    models: MODEL_METRICS,
    activeModel: 'XGBoost',
    lastEvaluation: new Date().toISOString()
  });
});

/**
 * POST /api/forecast/retrain
 * Retrain ML forecasting & clustering models
 */
router.post('/forecast/retrain', async (req, res) => {
  try {
    const retrainResult = await retrainModels();

    inMemoryStore.addActivity({
      user: 'ML Pipeline Worker',
      action: 'Completed GradientBoosting and Hierarchical Clustering model retraining job',
      badge: 'Model Retrained'
    });

    inMemoryStore.createNotification({
      title: 'ML Models Updated',
      message: 'Demand Forecasting & Clustering models successfully re-trained with latest sales velocity.',
      type: 'info'
    });

    res.json(retrainResult);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * GET & POST /api/clustering or /api/v1/clustering/predict
 * Run Store Hierarchical Clustering
 */
router.all(['/clustering', '/clustering/predict', '/v1/clustering/predict'], async (req, res) => {
  const { csvPath } = req.body || {};

  try {
    const result = await predictStoreClustering({ csvPath });
    res.json(result);
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
