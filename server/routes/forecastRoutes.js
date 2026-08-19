import express from 'express';
import { runPythonMlModel } from '../services/pythonBridge.js';

const router = express.Router();

/**
 * Get Demand Forecast Predictions (Daily & Weekly)
 */
router.get('/', async (req, res) => {
  try {
    const horizon = parseInt(req.query.horizon || '7', 10);
    const results = await runPythonMlModel({ action: 'forecast', horizon });
    res.json(results.data?.forecast || results.data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Trigger Forecast inference with specific store / SKU filter
 */
router.post('/predict', async (req, res) => {
  try {
    const { storeId, horizonDays = 7, csvPath = '' } = req.body;
    const results = await runPythonMlModel({ action: 'forecast', csvPath, horizon: horizonDays });
    res.json({
      success: true,
      storeId: storeId || 'All Stores',
      forecast: results.data?.forecast || results.data
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
