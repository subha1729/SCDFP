import express from 'express';
import { Store } from '../models/Store.js';
import { inMemoryStore } from '../services/inMemoryStore.js';
import { isDbConnected } from '../config/db.js';

const router = express.Router();

/**
 * GET /api/stores
 * List all stores with region and cluster filtering
 */
router.get('/', async (req, res) => {
  const { region, cluster, search } = req.query;

  try {
    if (isDbConnected()) {
      const query = {};
      if (region && region !== 'ALL') query.region = region;
      if (cluster && cluster !== 'ALL') query.cluster = cluster;
      if (search) {
        query.$or = [
          { id: { $regex: search, $options: 'i' } },
          { name: { $regex: search, $options: 'i' } }
        ];
      }
      const stores = await Store.find(query);
      return res.json({ status: 'success', count: stores.length, data: stores });
    }

    const fallbackStores = inMemoryStore.getStores({ region, cluster, search });
    res.json({ status: 'success', count: fallbackStores.length, data: fallbackStores });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * GET /api/stores/:id
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (isDbConnected()) {
      const store = await Store.findOne({ id });
      if (!store) return res.status(404).json({ status: 'error', message: 'Store not found' });
      return res.json({ status: 'success', data: store });
    }

    const store = inMemoryStore.getStoreById(id);
    if (!store) return res.status(404).json({ status: 'error', message: 'Store not found' });
    res.json({ status: 'success', data: store });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * POST /api/stores
 * Create new store location
 */
router.post('/', async (req, res) => {
  const storeData = req.body;
  if (!storeData.id || !storeData.name) {
    return res.status(400).json({ status: 'error', message: 'Store ID and Name are required.' });
  }

  try {
    inMemoryStore.createStore(storeData);

    if (isDbConnected()) {
      await Store.findOneAndUpdate(
        { id: storeData.id },
        { $set: storeData },
        { upsert: true, new: true }
      );
    }

    res.status(201).json({ status: 'success', message: 'Store created successfully.', data: storeData });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * PUT /api/stores/:id
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedFallback = inMemoryStore.updateStore(id, updates);

    if (isDbConnected()) {
      const updated = await Store.findOneAndUpdate(
        { id },
        { $set: { ...updates, updatedAt: new Date() } },
        { new: true }
      );
      if (!updated) return res.status(404).json({ status: 'error', message: 'Store not found' });
      return res.json({ status: 'success', data: updated });
    }

    if (!updatedFallback) return res.status(404).json({ status: 'error', message: 'Store not found' });
    res.json({ status: 'success', data: updatedFallback });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * DELETE /api/stores/:id
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    inMemoryStore.deleteStore(id);

    if (isDbConnected()) {
      await Store.findOneAndDelete({ id });
    }

    res.json({ status: 'success', message: `Store ${id} deleted successfully.` });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
