import { inMemoryStore } from './inMemoryStore.js';
import { calculateAbcAnalysis, calculateEoq, calculateSafetyStockAudit } from './analyticsService.js';

/**
 * Converts array of objects into standard CSV string
 */
export function jsonToCsv(dataArray, customHeaders = null) {
  if (!dataArray || dataArray.length === 0) return '';

  const headers = customHeaders || Object.keys(dataArray[0]);
  const headerRow = headers.join(',');

  const rows = dataArray.map(row => {
    return headers.map(header => {
      let val = row[header];
      if (val === null || val === undefined) return '""';
      if (typeof val === 'object') val = JSON.stringify(val);
      const strVal = String(val).replace(/"/g, '""');
      return `"${strVal}"`;
    }).join(',');
  });

  return [headerRow, ...rows].join('\n');
}

/**
 * Generates formatted dataset for various report types
 */
export function generateExportData(reportType = 'inventory') {
  switch (reportType.toLowerCase()) {
    case 'inventory': {
      const items = inMemoryStore.getInventory();
      return {
        filename: `inventory_status_${Date.now()}.csv`,
        csv: jsonToCsv(items, ['sku', 'name', 'category', 'stock', 'safetyStock', 'reorderLevel', 'price', 'supplier', 'status', 'recommendedOrder']),
        json: items
      };
    }
    case 'stores': {
      const stores = inMemoryStore.getStores();
      return {
        filename: `store_network_${Date.now()}.csv`,
        csv: jsonToCsv(stores, ['id', 'name', 'region', 'type', 'sales', 'status', 'inventoryLevel', 'leadTime', 'cluster', 'salesVelocity', 'priceElasticity']),
        json: stores
      };
    }
    case 'purchase_orders': {
      const orders = inMemoryStore.getPurchaseOrders();
      return {
        filename: `purchase_orders_${Date.now()}.csv`,
        csv: jsonToCsv(orders, ['id', 'supplier', 'itemsCount', 'totalAmount', 'createdDate', 'expectedDelivery', 'status', 'priority']),
        json: orders
      };
    }
    case 'suppliers': {
      const suppliers = inMemoryStore.getSuppliers();
      return {
        filename: `supplier_scorecard_${Date.now()}.csv`,
        csv: jsonToCsv(suppliers, ['id', 'name', 'contactEmail', 'phone', 'leadTimeDays', 'onTimeDeliveryRate', 'qualityScore', 'paymentTerms', 'status']),
        json: suppliers
      };
    }
    case 'abc_analysis': {
      const abc = calculateAbcAnalysis();
      return {
        filename: `abc_pareto_analysis_${Date.now()}.csv`,
        csv: jsonToCsv(abc.items, ['sku', 'name', 'category', 'unitPrice', 'stock', 'annualValueFormatted', 'cumulativePercentage', 'abcClass', 'recommendedControlPolicy']),
        json: abc
      };
    }
    case 'eoq_analysis': {
      const eoq = calculateEoq();
      return {
        filename: `eoq_analysis_${Date.now()}.csv`,
        csv: jsonToCsv(eoq.items, ['sku', 'name', 'category', 'unitPrice', 'annualDemand', 'optimalOrderQuantity', 'ordersPerYear', 'orderCycleDays', 'totalAnnualInventoryCost']),
        json: eoq
      };
    }
    default:
      throw new Error(`Unsupported export type: ${reportType}`);
  }
}
