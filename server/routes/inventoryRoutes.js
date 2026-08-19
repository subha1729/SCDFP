import express from 'express';
import { Inventory } from '../models/Inventory.js';
import { isDbConnected } from '../config/db.js';

const router = express.Router();

// Fallback in-memory SKUs
const defaultSKUs = [
  { sku: 'SKU-8821', name: 'Organic Whole Milk 1L', category: 'Dairy', stock: 120, safetyStock: 300, reorderLevel: 250, price: '$2.80', supplier: 'Horizon Valley Farms', status: 'Critical', recommendedOrder: 330 },
  { sku: 'SKU-9943', name: 'Artisan Espresso Beans 1kg', category: 'Beverages', stock: 45, safetyStock: 80, reorderLevel: 60, price: '$18.50', supplier: 'Apex Roasters Co.', status: 'Critical', recommendedOrder: 45 },
  { sku: 'SKU-7732', name: 'Greek Yogurt 500g', category: 'Dairy', stock: 180, safetyStock: 200, reorderLevel: 220, price: '$3.40', supplier: 'Olympus Dairy Hub', status: 'Low Stock', recommendedOrder: 150 },
  { sku: 'SKU-4412', name: 'Sparkling Mineral Water 750ml', category: 'Beverages', stock: 520, safetyStock: 250, reorderLevel: 300, price: '$1.95', supplier: 'Alpine Springs Ltd.', status: 'Healthy', recommendedOrder: 0 },
  { sku: 'SKU-5521', name: 'Almond Butter 350g', category: 'Pantry', stock: 95, safetyStock: 120, reorderLevel: 140, price: '$6.20', supplier: 'NutriPure Foods', status: 'Low Stock', recommendedOrder: 80 }
];

/**
 * Get all Inventory SKUs
 */
router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      const items = await Inventory.find().lean();
      if (items && items.length > 0) {
        return res.json(items.map(i => ({ ...i, id: i.sku })));
      }
    }
    res.json(defaultSKUs.map(i => ({ ...i, id: i.sku })));
  } catch {
    res.json(defaultSKUs.map(i => ({ ...i, id: i.sku })));
  }
});

/**
 * Update stock level or reorder
 */
router.put('/:sku/reorder', async (req, res) => {
  const { sku } = req.params;
  const { units = 300 } = req.body;

  try {
    if (isDbConnected()) {
      await Inventory.findOneAndUpdate(
        { sku },
        { $inc: { stock: units }, $set: { status: 'Healthy' } }
      );
    }
    res.json({ success: true, message: `Reorder of ${units} units triggered for ${sku}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
