import { Inventory } from './models/Inventory.js';
import { PurchaseOrder } from './models/PurchaseOrder.js';
import { isDbConnected } from './config/db.js';

export async function seedDatabaseIfEmpty() {
  if (!isDbConnected()) return;
  try {
    const invCount = await Inventory.countDocuments();
    if (invCount === 0) {
      console.log('[Seed] Seeding default inventory items into MongoDB...');
      await Inventory.insertMany([
        { sku: 'SKU-8821', name: 'Organic Whole Milk 1L', category: 'Dairy', stock: 120, safetyStock: 300, reorderLevel: 250, price: '$2.80', supplier: 'Horizon Valley Farms', status: 'Critical', recommendedOrder: 330 },
        { sku: 'SKU-9943', name: 'Artisan Espresso Beans 1kg', category: 'Beverages', stock: 45, safetyStock: 80, reorderLevel: 60, price: '$18.50', supplier: 'Apex Roasters Co.', status: 'Critical', recommendedOrder: 45 },
        { sku: 'SKU-7732', name: 'Greek Yogurt 500g', category: 'Dairy', stock: 180, safetyStock: 200, reorderLevel: 220, price: '$3.40', supplier: 'Olympus Dairy Hub', status: 'Low Stock', recommendedOrder: 150 },
        { sku: 'SKU-4412', name: 'Sparkling Mineral Water 750ml', category: 'Beverages', stock: 520, safetyStock: 250, reorderLevel: 300, price: '$1.95', supplier: 'Alpine Springs Ltd.', status: 'Healthy', recommendedOrder: 0 },
        { sku: 'SKU-5521', name: 'Almond Butter 350g', category: 'Pantry', stock: 95, safetyStock: 120, reorderLevel: 140, price: '$6.20', supplier: 'NutriPure Foods', status: 'Low Stock', recommendedOrder: 80 }
      ]);
    }

    const orderCount = await PurchaseOrder.countDocuments();
    if (orderCount === 0) {
      console.log('[Seed] Seeding default purchase orders into MongoDB...');
      await PurchaseOrder.insertMany([
        { id: 'PO-2026-982', supplier: 'Horizon Valley Farms', itemsCount: 2, totalAmount: '$1,480.00', createdDate: '2026-08-14', expectedDelivery: '2026-08-18', priority: 'High', status: 'Pending', items: [{ sku: 'SKU-8821', name: 'Organic Whole Milk 1L', units: 330, unitCost: '$2.80', totalCost: '$924.00' }] },
        { id: 'PO-2026-981', supplier: 'Apex Roasters Co.', itemsCount: 1, totalAmount: '$832.50', createdDate: '2026-08-12', expectedDelivery: '2026-08-15', priority: 'Normal', status: 'Approved' },
        { id: 'PO-2026-980', supplier: 'Alpine Springs Ltd.', itemsCount: 3, totalAmount: '$2,150.00', createdDate: '2026-08-10', expectedDelivery: '2026-08-13', priority: 'Normal', status: 'Delivered' }
      ]);
    }
  } catch (err) {
    console.warn('[Seed] Seed notice:', err.message);
  }
}
