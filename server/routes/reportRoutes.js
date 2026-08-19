import express from 'express';
import { inMemoryStore } from '../services/inMemoryStore.js';

const router = express.Router();

const REPORT_DEFINITIONS = [
  {
    id: 'sales_report',
    title: 'Sales & Revenue Velocity Report',
    description: 'Comprehensive store-level sales breakdown, historical growth trajectory, and regional revenue comparison.',
    dateRange: 'Q2 - Q3 2026',
    badge: 'Executive Level'
  },
  {
    id: 'forecast_report',
    title: 'AI Forecast Accuracy Audit',
    description: 'Validation report evaluating XGBoost, LSTM, and Prophet model performance against actual velocity.',
    dateRange: 'Last 30 Days',
    badge: 'ML Diagnostic'
  },
  {
    id: 'inventory_report',
    title: 'Inventory Turnover & Health Report',
    description: 'Analysis of carrying costs, dead stock risks, safety buffer adequacy, and stockout incident logs.',
    dateRange: 'Current Quarter',
    badge: 'Supply Chain'
  },
  {
    id: 'cluster_report',
    title: 'Store Cluster & Elasticity Analysis',
    description: 'Deep dive into store clusters, price elasticity scores, and promotional sensitivity groupings.',
    dateRange: 'Annual 2026',
    badge: 'Segment Strategy'
  }
];

/**
 * GET /api/reports/summary
 */
router.get('/summary', (req, res) => {
  res.json({
    status: 'success',
    count: REPORT_DEFINITIONS.length,
    data: REPORT_DEFINITIONS
  });
});

/**
 * POST /api/reports/generate
 */
router.post('/generate', (req, res) => {
  const { reportId = 'sales_report', format = 'json' } = req.body;
  const def = REPORT_DEFINITIONS.find(r => r.id === reportId) || REPORT_DEFINITIONS[0];

  const inventory = inMemoryStore.getInventory();
  const stores = inMemoryStore.getStores();
  const po = inMemoryStore.getPurchaseOrders();

  const reportPayload = {
    reportId: def.id,
    title: def.title,
    generatedAt: new Date().toISOString(),
    executiveSummary: {
      totalStores: stores.length,
      totalInventorySkus: inventory.length,
      criticalStockouts: inventory.filter(i => i.status === 'Critical').length,
      pendingPurchaseOrders: po.filter(p => p.status === 'Pending').length,
      forecastAccuracy: '98.4%'
    },
    tables: {
      topCriticalInventory: inventory.filter(i => i.status === 'Critical'),
      storeClusters: stores
    }
  };

  res.json({
    status: 'success',
    format,
    report: reportPayload
  });
});

/**
 * GET /api/reports/export/:type
 * Returns raw CSV export
 */
router.get('/export/:type', (req, res) => {
  const { type } = req.params;

  if (type === 'inventory') {
    const items = inMemoryStore.getInventory();
    const csvHeaders = 'SKU,Name,Category,Stock,SafetyStock,ReorderLevel,Price,Supplier,Status\n';
    const csvRows = items.map(i => `"${i.sku}","${i.name}","${i.category}",${i.stock},${i.safetyStock},${i.reorderLevel},"${i.price}","${i.supplier}","${i.status}"`).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="inventory_report.csv"');
    return res.send(csvHeaders + csvRows);
  }

  if (type === 'stores') {
    const stores = inMemoryStore.getStores();
    const csvHeaders = 'StoreID,Name,Region,Type,Sales,Status,InventoryLevel,LeadTime,Cluster\n';
    const csvRows = stores.map(s => `"${s.id}","${s.name}","${s.region}","${s.type}","${s.sales}","${s.status}","${s.inventoryLevel}","${s.leadTime}","${s.cluster}"`).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="stores_report.csv"');
    return res.send(csvHeaders + csvRows);
  }

  res.status(400).json({ status: 'error', message: `Export type '${type}' not supported. Use 'inventory' or 'stores'.` });
});

export default router;
