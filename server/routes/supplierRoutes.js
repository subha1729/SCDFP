import express from 'express';
import { Supplier } from '../models/Supplier.js';
import { inMemoryStore } from '../services/inMemoryStore.js';
import { isDbConnected } from '../config/db.js';

const router = express.Router();

/**
 * GET /api/suppliers
 * List suppliers with search and status filter
 */
router.get('/', async (req, res) => {
  const { status, search } = req.query;

  try {
    if (isDbConnected()) {
      const query = {};
      if (status && status !== 'ALL') query.status = status;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { id: { $regex: search, $options: 'i' } },
          { contactEmail: { $regex: search, $options: 'i' } }
        ];
      }
      const suppliers = await Supplier.find(query);
      return res.json({ status: 'success', count: suppliers.length, data: suppliers });
    }

    const suppliers = inMemoryStore.getSuppliers({ status, search });
    res.json({ status: 'success', count: suppliers.length, data: suppliers });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * GET /api/suppliers/:id
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    if (isDbConnected()) {
      const sup = await Supplier.findOne({ id });
      if (!sup) return res.status(404).json({ status: 'error', message: 'Supplier not found' });
      return res.json({ status: 'success', data: sup });
    }

    const sup = inMemoryStore.getSupplierById(id);
    if (!sup) return res.status(404).json({ status: 'error', message: 'Supplier not found' });
    res.json({ status: 'success', data: sup });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * GET /api/suppliers/:id/performance
 * Supplier Scorecard & KPI breakdown
 */
router.get('/:id/performance', (req, res) => {
  const { id } = req.params;
  const sup = inMemoryStore.getSupplierById(id);

  if (!sup) {
    return res.status(404).json({ status: 'error', message: 'Supplier not found' });
  }

  const relatedPOs = inMemoryStore.getPurchaseOrders().filter(p => p.supplier.toLowerCase().includes(sup.name.toLowerCase()));

  res.json({
    status: 'success',
    supplierId: sup.id,
    supplierName: sup.name,
    scorecard: {
      onTimeDeliveryRate: `${sup.onTimeDeliveryRate}%`,
      qualityInspectionScore: `${sup.qualityScore}%`,
      averageLeadTime: `${sup.leadTimeDays} Days`,
      paymentTerms: sup.paymentTerms,
      rating: sup.onTimeDeliveryRate >= 95 ? 'Tier-1 Strategic Vendor' : 'Standard Preferred Vendor',
      totalOrdersFulfilled: relatedPOs.length + 12,
      activePOsCount: relatedPOs.filter(p => p.status === 'Pending' || p.status === 'Approved').length
    }
  });
});

/**
 * POST /api/suppliers
 */
router.post('/', async (req, res) => {
  const data = req.body;
  if (!data.name || !data.contactEmail) {
    return res.status(400).json({ status: 'error', message: 'Supplier Name and Email are required.' });
  }

  try {
    const newSup = inMemoryStore.createSupplier(data);
    if (isDbConnected()) {
      await Supplier.create(newSup);
    }

    inMemoryStore.addActivity({
      user: 'Procurement Admin',
      action: `Onboarded new Supplier: ${newSup.name} (${newSup.id})`,
      badge: 'Supplier Added'
    });

    res.status(201).json({ status: 'success', data: newSup });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * PUT /api/suppliers/:id
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updated = inMemoryStore.updateSupplier(id, updates);
    if (isDbConnected()) {
      await Supplier.findOneAndUpdate({ id }, { $set: updates });
    }

    if (!updated) return res.status(404).json({ status: 'error', message: 'Supplier not found' });
    res.json({ status: 'success', data: updated });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * DELETE /api/suppliers/:id
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    inMemoryStore.deleteSupplier(id);
    if (isDbConnected()) {
      await Supplier.findOneAndDelete({ id });
    }

    res.json({ status: 'success', message: `Supplier ${id} removed.` });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
