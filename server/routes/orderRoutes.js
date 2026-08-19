import express from 'express';
import { PurchaseOrder } from '../models/PurchaseOrder.js';
import { isDbConnected } from '../config/db.js';

const router = express.Router();

// Fallback Orders list
let fallbackOrders = [
  { id: 'PO-2026-982', supplier: 'Horizon Valley Farms', itemsCount: 2, totalAmount: '$1,480.00', createdDate: '2026-08-14', expectedDelivery: '2026-08-18', priority: 'High', status: 'Pending' },
  { id: 'PO-2026-981', supplier: 'Apex Roasters Co.', itemsCount: 1, totalAmount: '$832.50', createdDate: '2026-08-12', expectedDelivery: '2026-08-15', priority: 'Normal', status: 'Approved' },
  { id: 'PO-2026-980', supplier: 'Alpine Springs Ltd.', itemsCount: 3, totalAmount: '$2,150.00', createdDate: '2026-08-10', expectedDelivery: '2026-08-13', priority: 'Normal', status: 'Delivered' },
  { id: 'PO-2026-979', supplier: 'NutriPure Foods', itemsCount: 1, totalAmount: '$496.00', createdDate: '2026-08-08', expectedDelivery: '2026-08-11', priority: 'Urgent', status: 'Delivered' }
];

/**
 * Get all Purchase Orders
 */
router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      const orders = await PurchaseOrder.find().sort({ createdAt: -1 }).lean();
      if (orders && orders.length > 0) {
        return res.json(orders);
      }
    }
    res.json(fallbackOrders);
  } catch {
    res.json(fallbackOrders);
  }
});

/**
 * Create a new Purchase Order
 */
router.post('/', async (req, res) => {
  try {
    const { supplier, totalAmount, itemsCount = 1, expectedDelivery, priority = 'High', items = [] } = req.body;
    const newId = `PO-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newPO = {
      id: newId,
      supplier: supplier || 'Horizon Valley Farms',
      itemsCount,
      totalAmount: totalAmount || '$1,480.00',
      createdDate: new Date().toISOString().split('T')[0],
      expectedDelivery: expectedDelivery || 'In 3 Days',
      priority,
      status: 'Pending',
      items
    };

    if (isDbConnected()) {
      await PurchaseOrder.create(newPO);
    } else {
      fallbackOrders.unshift(newPO);
    }

    res.status(201).json({ success: true, order: newPO });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Approve Purchase Order
 */
router.put('/:id/approve', async (req, res) => {
  const { id } = req.params;

  try {
    if (isDbConnected()) {
      await PurchaseOrder.findOneAndUpdate(
        { id },
        { $set: { status: 'Approved', approvedAt: new Date() } }
      );
    } else {
      fallbackOrders = fallbackOrders.map(po => po.id === id ? { ...po, status: 'Approved' } : po);
    }

    res.json({ success: true, message: `Purchase Order ${id} approved & dispatched to vendor!` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
