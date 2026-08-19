import express from 'express';
import { runPythonMlModel } from '../services/pythonBridge.js';

const router = express.Router();

/**
 * Get Hierarchical (Agglomerative) Clustering and Dendrogram Tree Linkages
 */
router.get('/hierarchical', async (req, res) => {
  try {
    const results = await runPythonMlModel({ action: 'clustering' });
    res.json(results.data?.clustering || results.data);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
