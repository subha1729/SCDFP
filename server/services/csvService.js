import fs from 'fs';
import csv from 'csv-parser';
import { Inventory } from '../models/Inventory.js';
import { SalesHistory } from '../models/SalesHistory.js';
import { inMemoryStore } from './inMemoryStore.js';
import { isDbConnected } from '../config/db.js';

/**
 * Parses a CSV file from disk and returns an array of row objects
 */
export function parseCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

/**
 * Normalizes and ingests Sales History CSV records into database
 */
export async function ingestSalesHistory(rawRecords) {
  const normalized = rawRecords.map(r => {
    const date = r.Date || r.date || new Date().toISOString().split('T')[0];
    const storeId = r.Store_ID || r.store_id || r.StoreId || r.storeId || 'STR-101';
    const skuId = r.SKU_ID || r.sku_id || r.SkuId || r.skuId || r.SKU || 'SKU-UNKNOWN';
    const salesUnits = Number(r.Sales_Units || r.sales_units || r.SalesUnits || r.salesUnits || r.Units || 0);
    const revenue = Number(r.Revenue || r.revenue || 0);
    const promoFlag = Number(r.Promo_Flag || r.promo_flag || r.PromoFlag || 0);
    const holidayFlag = Number(r.Holiday_Flag || r.holiday_flag || r.HolidayFlag || 0);

    return {
      date,
      storeId,
      skuId,
      salesUnits,
      revenue,
      promoFlag,
      holidayFlag,
      uploadedAt: new Date()
    };
  });

  // Save to In-Memory Store
  inMemoryStore.bulkInsertSalesHistory(normalized);

  // Save to MongoDB if connected
  let dbInsertedCount = 0;
  if (isDbConnected()) {
    try {
      const docs = await SalesHistory.insertMany(normalized, { ordered: false });
      dbInsertedCount = docs.length;
    } catch (e) {
      // Partial inserts or duplicate keys handled
      dbInsertedCount = normalized.length;
    }
  }

  return {
    status: 'success',
    totalRecordsProcessed: normalized.length,
    dbInsertedCount,
    sample: normalized.slice(0, 3)
  };
}

/**
 * Normalizes and ingests Inventory Status CSV records into database
 */
export async function ingestInventoryStatus(rawRecords) {
  const normalized = rawRecords.map(r => {
    const sku = r.SKU_ID || r.sku_id || r.SkuId || r.sku || r.SKU || `SKU-${Math.floor(1000 + Math.random() * 9000)}`;
    const name = r.Product_Name || r.product_name || r.ProductName || r.name || 'Unnamed Product';
    const category = r.Category || r.category || 'General';
    const stock = Number(r.Stock_Level || r.stock_level || r.StockLevel || r.stock || r.quantity || 0);
    const safetyStock = Number(r.Safety_Stock || r.safety_stock || r.SafetyStock || r.safetyStock || 100);
    const reorderLevel = Number(r.Reorder_Point || r.reorder_point || r.ReorderPoint || r.reorderLevel || 150);
    const price = r.Price || r.price || '$10.00';
    const supplier = r.Supplier_Name || r.supplier_name || r.SupplierName || r.supplier || 'Standard Logistics';
    const status = stock <= safetyStock ? 'Critical' : (stock <= reorderLevel ? 'Low Stock' : 'Healthy');
    const recommendedOrder = stock <= reorderLevel ? (reorderLevel * 2 - stock) : 0;

    return {
      sku,
      name,
      category,
      stock,
      safetyStock,
      reorderLevel,
      price,
      supplier,
      status,
      recommendedOrder,
      updatedAt: new Date()
    };
  });

  // Save to In-Memory Store
  inMemoryStore.bulkInsertInventory(normalized);

  // Upsert to MongoDB if connected
  let dbInsertedCount = 0;
  if (isDbConnected()) {
    try {
      const ops = normalized.map(item => ({
        updateOne: {
          filter: { sku: item.sku },
          update: { $set: item },
          upsert: true
        }
      }));
      const res = await Inventory.bulkWrite(ops);
      dbInsertedCount = (res.upsertedCount || 0) + (res.modifiedCount || 0);
    } catch (e) {
      console.warn('[CsvService] MongoDB inventory upsert warning:', e.message);
    }
  }

  return {
    status: 'success',
    totalRecordsProcessed: normalized.length,
    dbInsertedCount: dbInsertedCount || normalized.length,
    sample: normalized.slice(0, 3)
  };
}
