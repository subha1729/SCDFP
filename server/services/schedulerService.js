import { inMemoryStore } from './inMemoryStore.js';
import { sendEmail } from './emailService.js';

let intervalId = null;

/**
 * Autonomous Stock & Safety Buffer Health Scanner
 */
export async function runStockHealthScan() {
  const inventory = inMemoryStore.getInventory();
  const criticalItems = inventory.filter(i => i.status === 'Critical');

  if (criticalItems.length > 0) {
    const unnotifiedCritical = criticalItems.filter(item => {
      const existingNotif = inMemoryStore.getNotifications().find(
        n => n.title.includes('Low Inventory') && n.message.includes(item.sku)
      );
      return !existingNotif;
    });

    for (const item of unnotifiedCritical) {
      inMemoryStore.createNotification({
        title: 'Low Inventory Alert',
        message: `${item.name} (${item.sku}) has dropped below safety stock (${item.stock} remaining).`,
        type: 'alert'
      });

      inMemoryStore.addActivity({
        user: 'Autonomous Health Monitor',
        action: `Detected critical safety stock breach on ${item.sku} (${item.name})`,
        badge: 'Safety Stock Alert'
      });
    }
  }

  return {
    scannedItems: inventory.length,
    criticalCount: criticalItems.length,
    timestamp: new Date().toISOString()
  };
}

/**
 * Purchase Order Lifecycle Auto-Delivery Simulator
 */
export function runPoStatusAdvancer() {
  const purchaseOrders = inMemoryStore.getPurchaseOrders();
  const approvedOrders = purchaseOrders.filter(p => p.status === 'Approved');

  let updatedCount = 0;
  for (const po of approvedOrders) {
    // Check if delivery date has passed
    const now = new Date();
    const deliveryDate = new Date(po.expectedDelivery);

    if (now >= deliveryDate) {
      inMemoryStore.updatePurchaseOrderStatus(po.id, 'Delivered');
      updatedCount++;

      inMemoryStore.addActivity({
        user: 'Logistics Tracker',
        action: `Purchase Order ${po.id} marked as Delivered from ${po.supplier}`,
        badge: 'PO Delivered'
      });

      inMemoryStore.createNotification({
        title: 'Purchase Order Delivered',
        message: `Shipment for ${po.id} from ${po.supplier} (${po.totalAmount}) has arrived in warehouse.`,
        type: 'success'
      });
    }
  }

  return {
    scannedOrders: purchaseOrders.length,
    updatedToDelivered: updatedCount,
    timestamp: new Date().toISOString()
  };
}

/**
 * Initializes Autonomous Background Scheduler
 */
export function startScheduler(intervalMs = 60000) { // Every 1 minute
  if (intervalId) return;

  console.log('[Scheduler] Background Autonomous Supply Chain Scheduler started.');

  // Run initial scan on startup
  runStockHealthScan();
  runPoStatusAdvancer();

  intervalId = setInterval(() => {
    try {
      runStockHealthScan();
      runPoStatusAdvancer();
    } catch (err) {
      console.warn('[Scheduler] Error in scheduler cycle:', err.message);
    }
  }, intervalMs);
}

/**
 * Stops scheduler
 */
export function stopScheduler() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('[Scheduler] Background scheduler stopped.');
  }
}
