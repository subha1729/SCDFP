import { Inventory } from '../models/Inventory.js';
import { Store } from '../models/Store.js';
import { PurchaseOrder } from '../models/PurchaseOrder.js';
import { Notification } from '../models/Notification.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { SalesHistory } from '../models/SalesHistory.js';
import { User } from '../models/User.js';
import { Supplier } from '../models/Supplier.js';
import { SystemConfig } from '../models/SystemConfig.js';
import { isDbConnected } from '../config/db.js';

// Default initial datasets
export const initialStores = [
  { id: 'STR-101', name: 'Metro Flagship Hub', region: 'North America East', type: 'Superstore', sales: '$1,420,000', status: 'Optimal', inventoryLevel: '94%', leadTime: '2 Days', cluster: 'Cluster A', salesVelocity: 91.5, priceElasticity: 0.42 },
  { id: 'STR-102', name: 'Tech District Express', region: 'West Coast', type: 'Express Retail', sales: '$980,000', status: 'Optimal', inventoryLevel: '88%', leadTime: '1 Day', cluster: 'Cluster A', salesVelocity: 88.0, priceElasticity: 0.48 },
  { id: 'STR-103', name: 'Chicago Loop Retail', region: 'Midwest', type: 'Standard Store', sales: '$750,000', status: 'Low Stock', inventoryLevel: '62%', leadTime: '3 Days', cluster: 'Cluster B', salesVelocity: 58.2, priceElasticity: 1.85 },
  { id: 'STR-104', name: 'Austin South Hub', region: 'South', type: 'Warehouse Store', sales: '$1,150,000', status: 'Optimal', inventoryLevel: '91%', leadTime: '2 Days', cluster: 'Cluster A', salesVelocity: 82.4, priceElasticity: 0.38 },
  { id: 'STR-105', name: 'Miami Bayfront Outlet', region: 'Southeast', type: 'Outlet', sales: '$620,000', status: 'Critical', inventoryLevel: '45%', leadTime: '4 Days', cluster: 'Cluster C', salesVelocity: 35.0, priceElasticity: 1.15 },
  { id: 'STR-106', name: 'Seattle Downtown Plaza', region: 'Northwest', type: 'Superstore', sales: '$1,290,000', status: 'Optimal', inventoryLevel: '96%', leadTime: '1 Day', cluster: 'Cluster A', salesVelocity: 94.0, priceElasticity: 0.45 },
  { id: 'STR-107', name: 'Boston Commons Express', region: 'Northeast', type: 'Express Retail', sales: '$540,000', status: 'Low Stock', inventoryLevel: '58%', leadTime: '2 Days', cluster: 'Cluster B', salesVelocity: 52.0, priceElasticity: 1.78 }
];

export const initialInventory = [
  { sku: 'SKU-8821', name: 'Organic Whole Milk 1L', category: 'Dairy & Fresh', stock: 120, safetyStock: 250, reorderLevel: 300, price: '$4.20', status: 'Critical', supplier: 'Horizon Farms Inc.', recommendedOrder: 330 },
  { sku: 'SKU-9943', name: 'Artisan Espresso Beans 1kg', category: 'Beverages', stock: 480, safetyStock: 200, reorderLevel: 350, price: '$18.50', status: 'Healthy', supplier: 'Roastworks Co.', recommendedOrder: 0 },
  { sku: 'SKU-4412', name: 'Wireless Headphones ANC', category: 'Electronics', stock: 85, safetyStock: 100, reorderLevel: 150, price: '$149.00', status: 'Low Stock', supplier: 'SonicTech Logistics', recommendedOrder: 155 },
  { sku: 'SKU-3321', name: 'Electrolyte Energy Drink 24p', category: 'Beverages', stock: 1420, safetyStock: 400, reorderLevel: 500, price: '$28.00', status: 'Healthy', supplier: 'Hydrate Global', recommendedOrder: 0 },
  { sku: 'SKU-1192', name: 'Avocado Bag 5-Pack', category: 'Produce', stock: 95, safetyStock: 180, reorderLevel: 220, price: '$6.50', status: 'Critical', supplier: 'Valley Fresh Direct', recommendedOrder: 285 },
  { sku: 'SKU-5509', name: 'Smart Fitness Tracker V2', category: 'Electronics', stock: 310, safetyStock: 120, reorderLevel: 200, price: '$89.00', status: 'Healthy', supplier: 'SonicTech Logistics', recommendedOrder: 0 }
];

export const initialPurchaseOrders = [
  { 
    id: 'PO-2026-981', 
    supplier: 'Horizon Farms Inc.', 
    itemsCount: 3, 
    totalAmount: '$1,480.00', 
    createdDate: '2026-08-01', 
    expectedDelivery: '2026-08-05', 
    status: 'Pending', 
    priority: 'High',
    items: [
      { sku: 'SKU-8821', name: 'Organic Whole Milk 1L', quantity: 330, unitCost: '$2.80', total: '$924.00' },
      { sku: 'SKU-8822', name: 'Organic Greek Yogurt 500g', quantity: 150, unitCost: '$2.10', total: '$315.00' },
      { sku: 'SKU-8823', name: 'Almond Milk Unsweetened', quantity: 120, unitCost: '$2.01', total: '$241.00' }
    ],
    notes: 'Urgent weekend replenishment order.'
  },
  { 
    id: 'PO-2026-980', 
    supplier: 'SonicTech Logistics', 
    itemsCount: 12, 
    totalAmount: '$24,500.00', 
    createdDate: '2026-07-30', 
    expectedDelivery: '2026-08-04', 
    status: 'Approved', 
    priority: 'Medium',
    items: [
      { sku: 'SKU-4412', name: 'Wireless Headphones ANC', quantity: 150, unitCost: '$85.00', total: '$12,750.00' },
      { sku: 'SKU-5509', name: 'Smart Fitness Tracker V2', quantity: 180, unitCost: '$65.00', total: '$11,750.00' }
    ],
    notes: 'Standard quarterly tech inventory restock.'
  },
  { 
    id: 'PO-2026-979', 
    supplier: 'Roastworks Co.', 
    itemsCount: 8, 
    totalAmount: '$8,880.00', 
    createdDate: '2026-07-28', 
    expectedDelivery: '2026-08-02', 
    status: 'Delivered', 
    priority: 'Normal',
    items: [
      { sku: 'SKU-9943', name: 'Artisan Espresso Beans 1kg', quantity: 480, unitCost: '$12.50', total: '$6,000.00' }
    ],
    notes: 'Received and inspected in warehouse.'
  },
  { 
    id: 'PO-2026-978', 
    supplier: 'Valley Fresh Direct', 
    itemsCount: 5, 
    totalAmount: '$3,150.00', 
    createdDate: '2026-07-25', 
    expectedDelivery: '2026-07-29', 
    status: 'Cancelled', 
    priority: 'Low',
    items: [
      { sku: 'SKU-1192', name: 'Avocado Bag 5-Pack', quantity: 250, unitCost: '$4.10', total: '$1,025.00' }
    ],
    notes: 'Cancelled due to vendor logistical delay.'
  }
];

export const initialSuppliers = [
  { id: 'SUP-101', name: 'Horizon Farms Inc.', contactEmail: 'orders@horizonfarms.com', phone: '+1 (555) 234-5678', address: '450 Agriculture Way, Fresno, CA', leadTimeDays: 2, onTimeDeliveryRate: 98.4, qualityScore: 99.1, paymentTerms: 'Net 30', categoriesSupplied: ['Dairy & Fresh', 'Produce'], status: 'Active' },
  { id: 'SUP-102', name: 'SonicTech Logistics', contactEmail: 'supply@sonictech.com', phone: '+1 (555) 876-5432', address: '1200 Silicon Blvd, San Jose, CA', leadTimeDays: 4, onTimeDeliveryRate: 94.2, qualityScore: 97.5, paymentTerms: 'Net 45', categoriesSupplied: ['Electronics', 'Accessories'], status: 'Active' },
  { id: 'SUP-103', name: 'Roastworks Co.', contactEmail: 'b2b@roastworks.com', phone: '+1 (555) 345-6789', address: '88 Coffee Mill Lane, Seattle, WA', leadTimeDays: 3, onTimeDeliveryRate: 99.0, qualityScore: 99.5, paymentTerms: 'Net 30', categoriesSupplied: ['Beverages'], status: 'Active' },
  { id: 'SUP-104', name: 'Hydrate Global', contactEmail: 'dispatch@hydrateglobal.com', phone: '+1 (555) 901-2345', address: '77 Ocean Parkway, Miami, FL', leadTimeDays: 2, onTimeDeliveryRate: 96.8, qualityScore: 98.0, paymentTerms: 'Net 15', categoriesSupplied: ['Beverages'], status: 'Active' },
  { id: 'SUP-105', name: 'Valley Fresh Direct', contactEmail: 'sales@valleyfresh.com', phone: '+1 (555) 456-7890', address: '300 Orchard Road, Salinas, CA', leadTimeDays: 3, onTimeDeliveryRate: 91.5, qualityScore: 95.0, paymentTerms: 'Net 30', categoriesSupplied: ['Produce'], status: 'Under Review' }
];

export const initialUsers = [
  { id: 'USR-01', name: 'Alex Rivera', email: 'admin@nexus.ai', role: 'admin', department: 'Enterprise Supply Chain Leadership', avatar: '', status: 'active' },
  { id: 'USR-02', name: 'Elena Vance', email: 'elena.vance@nexus.ai', role: 'procurement_manager', department: 'Global Procurement', avatar: '', status: 'active' },
  { id: 'USR-03', name: 'Marcus Vance', email: 'marcus.v@nexus.ai', role: 'store_manager', department: 'Store Operations', avatar: '', status: 'active' },
  { id: 'USR-04', name: 'Sarah Chen', email: 'sarah.c@nexus.ai', role: 'supply_chain_analyst', department: 'Data & Forecasting', avatar: '', status: 'active' }
];

export const initialNotifications = [
  { id: 'notif-1', title: 'Low Inventory Alert', message: 'Organic Whole Milk 1L has dropped below safety stock (120 remaining).', time: '10 mins ago', type: 'alert', isRead: false, createdAt: new Date() },
  { id: 'notif-2', title: 'Demand Spike Detected', message: 'Electrolyte Energy Drink 24p demand increased +42% in West Coast Region.', time: '45 mins ago', type: 'info', isRead: false, createdAt: new Date(Date.now() - 45*60000) },
  { id: 'notif-3', title: 'Promotion Impact Triggered', message: 'Flash Sale Promo #82 active — uplift expected to reach +38.5% over weekend.', time: '2 hours ago', type: 'success', isRead: true, createdAt: new Date(Date.now() - 120*60000) },
  { id: 'notif-4', title: 'Purchase Order Approved', message: 'PO-2026-980 approved by Procurement Manager ($24,500.00).', time: '5 hours ago', type: 'success', isRead: true, createdAt: new Date(Date.now() - 300*60000) }
];

export const initialActivityLog = [
  { user: 'AI Forecasting Engine', action: 'Re-trained XGBoost model with latest weekend store velocity', time: '12m ago', badge: 'Model Updated', createdAt: new Date() },
  { user: 'Elena Vance (Procurement)', action: 'Approved Purchase Order PO-2026-980 for SonicTech Logistics', time: '42m ago', badge: 'PO Approved', createdAt: new Date(Date.now() - 42*60000) },
  { user: 'Automated Alert System', action: 'Triggered safety stock alert for SKU-8821 in Chicago Loop Store', time: '1h ago', badge: 'Alert', createdAt: new Date(Date.now() - 60*60000) },
  { user: 'Marcus Vance (Store Ops)', action: 'Updated store cluster assignment for STR-105 (Miami Bayfront)', time: '3h ago', badge: 'Store Update', createdAt: new Date(Date.now() - 180*60000) }
];

export const initialSalesHistory = [
  { date: '2026-08-10', storeId: 'STR-101', skuId: 'SKU-8821', salesUnits: 145, revenue: 609.0, promoFlag: 1, holidayFlag: 0 },
  { date: '2026-08-11', storeId: 'STR-101', skuId: 'SKU-8821', salesUnits: 130, revenue: 546.0, promoFlag: 0, holidayFlag: 0 },
  { date: '2026-08-12', storeId: 'STR-101', skuId: 'SKU-8821', salesUnits: 165, revenue: 693.0, promoFlag: 1, holidayFlag: 0 },
  { date: '2026-08-13', storeId: 'STR-102', skuId: 'SKU-9943', salesUnits: 88, revenue: 1628.0, promoFlag: 0, holidayFlag: 0 },
  { date: '2026-08-14', storeId: 'STR-103', skuId: 'SKU-4412', salesUnits: 42, revenue: 6258.0, promoFlag: 1, holidayFlag: 1 },
  { date: '2026-08-15', storeId: 'STR-104', skuId: 'SKU-3321', salesUnits: 210, revenue: 5880.0, promoFlag: 0, holidayFlag: 0 }
];

export const initialSystemConfigs = [
  { key: 'CRITICAL_STOCK_MULTIPLIER', value: 1.0, description: 'Threshold multiplier relative to Safety Stock for Critical status', category: 'inventory' },
  { key: 'LOW_STOCK_MULTIPLIER', value: 1.25, description: 'Threshold multiplier relative to Reorder Level for Low Stock status', category: 'inventory' },
  { key: 'AUTO_ORDER_ENABLED', value: true, description: 'Enable autonomous background PO generation', category: 'procurement' },
  { key: 'FORECAST_CONFIDENCE_LEVEL', value: 0.95, description: 'Default statistical confidence interval level', category: 'ml' },
  { key: 'DEFAULT_SERVICE_LEVEL', value: 0.95, description: 'Target fill rate service level for safety stock calculations', category: 'analytics' }
];

// In-Memory Database Store Class
class InMemoryStore {
  constructor() {
    this.stores = JSON.parse(JSON.stringify(initialStores));
    this.inventory = JSON.parse(JSON.stringify(initialInventory));
    this.purchaseOrders = JSON.parse(JSON.stringify(initialPurchaseOrders));
    this.suppliers = JSON.parse(JSON.stringify(initialSuppliers));
    this.users = JSON.parse(JSON.stringify(initialUsers));
    this.notifications = JSON.parse(JSON.stringify(initialNotifications));
    this.activityLog = JSON.parse(JSON.stringify(initialActivityLog));
    this.salesHistory = JSON.parse(JSON.stringify(initialSalesHistory));
    this.systemConfigs = JSON.parse(JSON.stringify(initialSystemConfigs));
  }

  // --- INVENTORY ---
  getInventory(filters = {}) {
    let result = [...this.inventory];
    if (filters.category && filters.category !== 'ALL') {
      result = result.filter(item => item.category === filters.category);
    }
    if (filters.status && filters.status !== 'ALL') {
      result = result.filter(item => item.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(item => 
        item.sku.toLowerCase().includes(q) || 
        item.name.toLowerCase().includes(q) || 
        item.supplier.toLowerCase().includes(q)
      );
    }
    return result;
  }

  getInventoryBySku(sku) {
    return this.inventory.find(i => i.sku === sku);
  }

  createInventory(item) {
    const existingIndex = this.inventory.findIndex(i => i.sku === item.sku);
    const newItem = {
      ...item,
      stock: Number(item.stock || 0),
      safetyStock: Number(item.safetyStock || 100),
      reorderLevel: Number(item.reorderLevel || 150),
      status: item.stock <= item.safetyStock ? 'Critical' : (item.stock <= item.reorderLevel ? 'Low Stock' : 'Healthy'),
      updatedAt: new Date()
    };
    if (existingIndex >= 0) {
      this.inventory[existingIndex] = newItem;
    } else {
      this.inventory.unshift(newItem);
    }
    return newItem;
  }

  updateInventory(sku, updates) {
    const idx = this.inventory.findIndex(i => i.sku === sku);
    if (idx >= 0) {
      const updated = { ...this.inventory[idx], ...updates, updatedAt: new Date() };
      if (updated.stock !== undefined && updated.safetyStock !== undefined) {
        updated.status = updated.stock <= updated.safetyStock ? 'Critical' : (updated.stock <= updated.reorderLevel ? 'Low Stock' : 'Healthy');
      }
      this.inventory[idx] = updated;
      return updated;
    }
    return null;
  }

  deleteInventory(sku) {
    const idx = this.inventory.findIndex(i => i.sku === sku);
    if (idx >= 0) {
      return this.inventory.splice(idx, 1)[0];
    }
    return null;
  }

  bulkInsertInventory(items) {
    let count = 0;
    for (const item of items) {
      this.createInventory(item);
      count++;
    }
    return count;
  }

  // --- STORES ---
  getStores(filters = {}) {
    let result = [...this.stores];
    if (filters.region && filters.region !== 'ALL') {
      result = result.filter(s => s.region === filters.region);
    }
    if (filters.cluster && filters.cluster !== 'ALL') {
      result = result.filter(s => s.cluster === filters.cluster);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
    }
    return result;
  }

  getStoreById(id) {
    return this.stores.find(s => s.id === id);
  }

  createStore(store) {
    const idx = this.stores.findIndex(s => s.id === store.id);
    if (idx >= 0) {
      this.stores[idx] = { ...this.stores[idx], ...store, updatedAt: new Date() };
      return this.stores[idx];
    }
    this.stores.unshift(store);
    return store;
  }

  updateStore(id, updates) {
    const idx = this.stores.findIndex(s => s.id === id);
    if (idx >= 0) {
      this.stores[idx] = { ...this.stores[idx], ...updates, updatedAt: new Date() };
      return this.stores[idx];
    }
    return null;
  }

  deleteStore(id) {
    const idx = this.stores.findIndex(s => s.id === id);
    if (idx >= 0) {
      return this.stores.splice(idx, 1)[0];
    }
    return null;
  }

  // --- PURCHASE ORDERS ---
  getPurchaseOrders(filters = {}) {
    let result = [...this.purchaseOrders];
    if (filters.status && filters.status !== 'ALL') {
      result = result.filter(po => po.status.toUpperCase() === filters.status.toUpperCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(po => po.id.toLowerCase().includes(q) || po.supplier.toLowerCase().includes(q));
    }
    return result;
  }

  getPurchaseOrderById(id) {
    return this.purchaseOrders.find(po => po.id === id);
  }

  createPurchaseOrder(po) {
    const id = po.id || `PO-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newPO = {
      ...po,
      id,
      createdDate: po.createdDate || new Date().toISOString().split('T')[0],
      status: po.status || 'Pending',
      itemsCount: po.items ? po.items.length : (po.itemsCount || 1)
    };
    this.purchaseOrders.unshift(newPO);
    return newPO;
  }

  updatePurchaseOrderStatus(id, status) {
    const po = this.getPurchaseOrderById(id);
    if (po) {
      po.status = status;
      return po;
    }
    return null;
  }

  deletePurchaseOrder(id) {
    const idx = this.purchaseOrders.findIndex(p => p.id === id);
    if (idx >= 0) {
      return this.purchaseOrders.splice(idx, 1)[0];
    }
    return null;
  }

  // --- SUPPLIERS ---
  getSuppliers(filters = {}) {
    let result = [...this.suppliers];
    if (filters.status && filters.status !== 'ALL') {
      result = result.filter(s => s.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.id.toLowerCase().includes(q));
    }
    return result;
  }

  getSupplierById(id) {
    return this.suppliers.find(s => s.id === id);
  }

  createSupplier(sup) {
    const id = sup.id || `SUP-${Math.floor(100 + Math.random() * 900)}`;
    const newSup = { ...sup, id, createdAt: new Date() };
    this.suppliers.unshift(newSup);
    return newSup;
  }

  updateSupplier(id, updates) {
    const idx = this.suppliers.findIndex(s => s.id === id);
    if (idx >= 0) {
      this.suppliers[idx] = { ...this.suppliers[idx], ...updates };
      return this.suppliers[idx];
    }
    return null;
  }

  deleteSupplier(id) {
    const idx = this.suppliers.findIndex(s => s.id === id);
    if (idx >= 0) {
      return this.suppliers.splice(idx, 1)[0];
    }
    return null;
  }

  // --- USERS & AUTH ---
  getUsers() {
    return this.users;
  }

  getUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id) {
    return this.users.find(u => u.id === id);
  }

  createUser(userData) {
    const id = userData.id || `USR-${Math.floor(10 + Math.random() * 90)}`;
    const newUser = { ...userData, id, createdAt: new Date(), lastLogin: new Date() };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id, updates) {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx >= 0) {
      this.users[idx] = { ...this.users[idx], ...updates };
      return this.users[idx];
    }
    return null;
  }

  // --- NOTIFICATIONS ---
  getNotifications() {
    return this.notifications;
  }

  createNotification(notif) {
    const newNotif = {
      id: notif.id || `notif-${Date.now()}`,
      title: notif.title,
      message: notif.message,
      time: notif.time || 'Just now',
      type: notif.type || 'info',
      isRead: notif.isRead || false,
      createdAt: new Date()
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }

  markNotificationRead(id) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.isRead = true;
      return notif;
    }
    return null;
  }

  markAllNotificationsRead() {
    this.notifications.forEach(n => { n.isRead = true; });
    return this.notifications;
  }

  deleteNotification(id) {
    const idx = this.notifications.findIndex(n => n.id === id);
    if (idx >= 0) {
      return this.notifications.splice(idx, 1)[0];
    }
    return null;
  }

  // --- ACTIVITY FEED ---
  getActivities() {
    return this.activityLog;
  }

  addActivity(act) {
    const newAct = {
      user: act.user || 'System',
      action: act.action,
      time: 'Just now',
      badge: act.badge || 'Activity',
      createdAt: new Date()
    };
    this.activityLog.unshift(newAct);
    if (this.activityLog.length > 50) {
      this.activityLog.pop();
    }
    return newAct;
  }

  // --- SALES HISTORY ---
  getSalesHistory(filters = {}) {
    let result = [...this.salesHistory];
    if (filters.storeId) {
      result = result.filter(s => s.storeId === filters.storeId);
    }
    if (filters.skuId) {
      result = result.filter(s => s.skuId === filters.skuId);
    }
    return result;
  }

  bulkInsertSalesHistory(records) {
    for (const r of records) {
      this.salesHistory.push(r);
    }
    return records.length;
  }

  // --- SYSTEM CONFIGS ---
  getSystemConfigs() {
    return this.systemConfigs;
  }

  getSystemConfigByKey(key) {
    return this.systemConfigs.find(c => c.key === key);
  }

  updateSystemConfig(key, value) {
    const idx = this.systemConfigs.findIndex(c => c.key === key);
    if (idx >= 0) {
      this.systemConfigs[idx].value = value;
      this.systemConfigs[idx].updatedAt = new Date();
      return this.systemConfigs[idx];
    }
    const newConfig = { key, value, description: 'Custom setting', category: 'custom', updatedAt: new Date() };
    this.systemConfigs.push(newConfig);
    return newConfig;
  }

  // --- DASHBOARD KPIS & CHARTS ---
  getDashboardKpis() {
    const totalInventoryUnits = this.inventory.reduce((acc, curr) => acc + (curr.stock || 0), 0);
    const criticalSkus = this.inventory.filter(i => i.status === 'Critical').length;
    const overstockSkus = this.inventory.filter(i => i.stock > i.safetyStock * 3).length;
    const pendingPOs = this.purchaseOrders.filter(p => p.status === 'Pending').length;

    return [
      { id: 'predicted_demand', label: 'Predicted Demand', value: '458,200', change: '+18.4%', isPositive: true, subtext: 'Units next 30 days', sparkline: [35, 38, 42, 40, 48, 52, 58] },
      { id: 'current_inventory', label: 'Current Inventory', value: totalInventoryUnits ? `${totalInventoryUnits.toLocaleString()} units` : '1,240,500', change: '-2.1%', isPositive: false, subtext: 'Total units in stock', sparkline: [60, 58, 56, 54, 52, 51, 50] },
      { id: 'stock_shortages', label: 'Stock Shortages', value: `${criticalSkus || 14} SKUs`, change: '+3 SKUs', isPositive: false, isAlert: true, subtext: 'Action required', sparkline: [8, 9, 10, 11, 12, 14, 14] },
      { id: 'overstock_items', label: 'Overstock Items', value: `${overstockSkus || 28} SKUs`, change: '-5 SKUs', isPositive: true, subtext: '$142k capital tied', sparkline: [35, 33, 31, 30, 29, 28, 28] },
      { id: 'pending_orders', label: 'Pending Purchase Orders', value: `${pendingPOs || 4} POs`, change: '$485,000', isPositive: true, subtext: `${pendingPOs} awaiting approval`, sparkline: [20, 24, 28, 30, 34, 36, 38] },
      { id: 'revenue_forecast', label: 'Revenue Forecast', value: '$8.42M', change: '+12.6%', isPositive: true, subtext: 'Projected Q3 revenue', sparkline: [6.2, 6.5, 6.9, 7.3, 7.8, 8.1, 8.42] },
    ];
  }
}

export const inMemoryStore = new InMemoryStore();

// Seed MongoDB if empty when connected
export async function seedMongoDBIfEmpty() {
  if (!isDbConnected()) return;

  try {
    const invCount = await Inventory.countDocuments();
    if (invCount === 0) {
      console.log('[Seeder] Seeding default Inventory items into MongoDB...');
      await Inventory.insertMany(initialInventory);
    }

    const storeCount = await Store.countDocuments();
    if (storeCount === 0) {
      console.log('[Seeder] Seeding default Stores into MongoDB...');
      await Store.insertMany(initialStores);
    }

    const poCount = await PurchaseOrder.countDocuments();
    if (poCount === 0) {
      console.log('[Seeder] Seeding default Purchase Orders into MongoDB...');
      await PurchaseOrder.insertMany(initialPurchaseOrders);
    }

    const supCount = await Supplier.countDocuments();
    if (supCount === 0) {
      console.log('[Seeder] Seeding default Suppliers into MongoDB...');
      await Supplier.insertMany(initialSuppliers);
    }

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Seeder] Seeding default Users into MongoDB...');
      await User.insertMany(initialUsers);
    }

    const notifCount = await Notification.countDocuments();
    if (notifCount === 0) {
      console.log('[Seeder] Seeding default Notifications into MongoDB...');
      await Notification.insertMany(initialNotifications);
    }

    const actCount = await ActivityLog.countDocuments();
    if (actCount === 0) {
      console.log('[Seeder] Seeding default Activity Logs into MongoDB...');
      await ActivityLog.insertMany(initialActivityLog);
    }

    const salesCount = await SalesHistory.countDocuments();
    if (salesCount === 0) {
      console.log('[Seeder] Seeding initial Sales History into MongoDB...');
      await SalesHistory.insertMany(initialSalesHistory);
    }

    const configCount = await SystemConfig.countDocuments();
    if (configCount === 0) {
      console.log('[Seeder] Seeding default System Configurations into MongoDB...');
      await SystemConfig.insertMany(initialSystemConfigs);
    }
  } catch (err) {
    console.warn('[Seeder] Notice during seeding:', err.message);
  }
}
