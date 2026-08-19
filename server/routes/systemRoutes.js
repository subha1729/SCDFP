import express from 'express';
import { inMemoryStore } from '../services/inMemoryStore.js';
import { isDbConnected } from '../config/db.js';
import { SystemConfig } from '../models/SystemConfig.js';
import { generateExportData } from '../services/exportService.js';
import { runStockHealthScan, runPoStatusAdvancer } from '../services/schedulerService.js';

const router = express.Router();

/**
 * GET /api/system/settings
 */
router.get('/settings', async (req, res) => {
  try {
    if (isDbConnected()) {
      const configs = await SystemConfig.find();
      return res.json({ status: 'success', data: configs });
    }

    const configs = inMemoryStore.getSystemConfigs();
    res.json({ status: 'success', data: configs });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * PUT /api/system/settings
 */
router.put('/settings', async (req, res) => {
  const { key, value } = req.body;
  if (!key) {
    return res.status(400).json({ status: 'error', message: 'Setting key is required.' });
  }

  try {
    const updated = inMemoryStore.updateSystemConfig(key, value);
    if (isDbConnected()) {
      await SystemConfig.findOneAndUpdate(
        { key },
        { $set: { value, updatedAt: new Date() } },
        { upsert: true, new: true }
      );
    }

    inMemoryStore.addActivity({
      user: 'System Admin',
      action: `Updated system configuration: ${key} = ${JSON.stringify(value)}`,
      badge: 'Config Changed'
    });

    res.json({ status: 'success', message: `Setting '${key}' updated.`, data: updated });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * GET /api/system/audit-logs
 */
router.get('/audit-logs', (req, res) => {
  const logs = inMemoryStore.getActivities();
  res.json({ status: 'success', count: logs.length, data: logs });
});

/**
 * GET /api/system/export/:type
 * Returns downloadable CSV or structured JSON
 */
router.get('/export/:type', (req, res) => {
  const { type } = req.params;
  const { format = 'csv' } = req.query;

  try {
    const exportResult = generateExportData(type);

    if (format === 'json') {
      return res.json({ status: 'success', data: exportResult.json });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${exportResult.filename}"`);
    res.send(exportResult.csv);
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
});

/**
 * POST /api/system/jobs/run-scan
 * Triggers autonomous stock and PO scan
 */
router.post('/jobs/run-scan', async (req, res) => {
  try {
    const stockScan = await runStockHealthScan();
    const poScan = runPoStatusAdvancer();

    res.json({
      status: 'success',
      message: 'Autonomous scan completed successfully.',
      stockScan,
      poScan
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
