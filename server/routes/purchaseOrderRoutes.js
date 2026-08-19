import express from 'express';
import { PurchaseOrder } from '../models/PurchaseOrder.js';
import { inMemoryStore } from '../services/inMemoryStore.js';
import { isDbConnected } from '../config/db.js';
import { sendEmail } from '../services/emailService.js';

const router = express.Router();

/**
 * GET /api/purchase-orders
 * List purchase orders with status filtering & search
 */
router.get('/', async (req, res) => {
  const { status, search } = req.query;

  try {
    if (isDbConnected()) {
      const query = {};
      if (status && status !== 'ALL') query.status = status;
      if (search) {
        query.$or = [
          { id: { $regex: search, $options: 'i' } },
          { supplier: { $regex: search, $options: 'i' } }
        ];
      }
      const orders = await PurchaseOrder.find(query).sort({ createdAt: -1 });
      return res.json({ status: 'success', count: orders.length, data: orders });
    }

    const fallbackOrders = inMemoryStore.getPurchaseOrders({ status, search });
    res.json({ status: 'success', count: fallbackOrders.length, data: fallbackOrders });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * GET /api/purchase-orders/:id
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (isDbConnected()) {
      const po = await PurchaseOrder.findOne({ id });
      if (!po) return res.status(404).json({ status: 'error', message: 'PO not found' });
      return res.json({ status: 'success', data: po });
    }

    const po = inMemoryStore.getPurchaseOrderById(id);
    if (!po) return res.status(404).json({ status: 'error', message: 'PO not found' });
    res.json({ status: 'success', data: po });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * POST /api/purchase-orders
 * Create a new Purchase Order
 */
router.post('/', async (req, res) => {
  const poData = req.body;
  const id = poData.id || `PO-2026-${Math.floor(100 + Math.random() * 900)}`;

  const newPO = {
    ...poData,
    id,
    createdDate: poData.createdDate || new Date().toISOString().split('T')[0],
    expectedDelivery: poData.expectedDelivery || new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    status: poData.status || 'Pending',
    itemsCount: poData.items ? poData.items.length : (poData.itemsCount || 1),
    totalAmount: poData.totalAmount || '$1,250.00'
  };

  try {
    inMemoryStore.createPurchaseOrder(newPO);

    if (isDbConnected()) {
      await PurchaseOrder.create(newPO);
    }

    // Add activity log
    inMemoryStore.addActivity({
      user: 'Procurement Officer',
      action: `Created Purchase Order ${newPO.id} for ${newPO.supplier}`,
      badge: 'PO Created'
    });

    res.status(201).json({ status: 'success', message: `Purchase order ${newPO.id} created.`, data: newPO });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * PATCH /api/purchase-orders/:id/status
 * Update PO Status (e.g. Approve, Deliver, Cancel)
 */
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, user = 'Procurement Manager' } = req.body;

  if (!status) {
    return res.status(400).json({ status: 'error', message: 'Status field is required.' });
  }

  try {
    const updatedFallback = inMemoryStore.updatePurchaseOrderStatus(id, status);

    let updatedDb = null;
    if (isDbConnected()) {
      updatedDb = await PurchaseOrder.findOneAndUpdate({ id }, { $set: { status } }, { new: true });
    }

    const currentPO = updatedDb || updatedFallback;
    if (!currentPO) {
      return res.status(404).json({ status: 'error', message: 'PO not found' });
    }

    // Log Activity & Create Notification
    inMemoryStore.addActivity({
      user,
      action: `${status === 'Approved' ? 'Approved' : 'Updated'} Purchase Order ${id} (${currentPO.supplier})`,
      badge: `PO ${status}`
    });

    if (status === 'Approved') {
      inMemoryStore.createNotification({
        title: 'Purchase Order Approved',
        message: `${id} has been approved for vendor dispatch to ${currentPO.supplier} (${currentPO.totalAmount}).`,
        type: 'success'
      });

      // Dispatch simulated email notification to vendor/manager
      sendEmail({
        subject: `Purchase Order Approved: ${id}`,
        message: `Purchase Order ${id} totaling ${currentPO.totalAmount} has been approved for dispatch to ${currentPO.supplier}.`,
        reportType: 'PURCHASE_ORDER',
        details: {
          orderId: id,
          vendor: currentPO.supplier,
          amount: currentPO.totalAmount,
          expectedDelivery: currentPO.expectedDelivery
        }
      });
    }

    res.json({ status: 'success', message: `Purchase Order ${id} is now ${status}.`, data: currentPO });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * POST /api/purchase-orders/auto-generate
 * Automatically drafts replenishment POs for critical / low-stock items
 */
router.post('/auto-generate', async (req, res) => {
  try {
    const inventory = inMemoryStore.getInventory();
    const criticalItems = inventory.filter(i => i.status === 'Critical' || i.status === 'Low Stock');

    if (criticalItems.length === 0) {
      return res.json({ status: 'success', message: 'All inventory stock levels are healthy. No POs generated.', count: 0 });
    }

    // Group by supplier
    const supplierMap = {};
    for (const item of criticalItems) {
      if (!supplierMap[item.supplier]) supplierMap[item.supplier] = [];
      const orderQty = item.recommendedOrder || (item.reorderLevel * 2 - item.stock);
      const unitCostNum = parseFloat(item.price.replace('$', '')) * 0.65; // Estimated wholesale cost
      supplierMap[item.supplier].push({
        sku: item.sku,
        name: item.name,
        quantity: orderQty,
        unitCost: `$${unitCostNum.toFixed(2)}`,
        total: `$${(orderQty * unitCostNum).toFixed(2)}`
      });
    }

    const createdPOs = [];
    for (const [supplier, items] of Object.entries(supplierMap)) {
      const totalAmountNum = items.reduce((acc, curr) => acc + parseFloat(curr.total.replace('$', '')), 0);
      const poObj = {
        id: `PO-2026-${Math.floor(100 + Math.random() * 900)}`,
        supplier,
        itemsCount: items.length,
        totalAmount: `$${totalAmountNum.toFixed(2)}`,
        createdDate: new Date().toISOString().split('T')[0],
        expectedDelivery: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
        status: 'Pending',
        priority: 'High',
        items,
        notes: 'Auto-generated replenishment order based on ML demand surge and safety stock buffer.'
      };

      inMemoryStore.createPurchaseOrder(poObj);
      if (isDbConnected()) {
        await PurchaseOrder.create(poObj);
      }
      createdPOs.push(poObj);
    }

    res.json({
      status: 'success',
      message: `Generated ${createdPOs.length} replenishment purchase orders.`,
      count: createdPOs.length,
      orders: createdPOs
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * DELETE /api/purchase-orders/:id
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    inMemoryStore.deletePurchaseOrder(id);

    if (isDbConnected()) {
      await PurchaseOrder.findOneAndDelete({ id });
    }

    res.json({ status: 'success', message: `Purchase Order ${id} deleted.` });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
