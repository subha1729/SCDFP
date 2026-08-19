export const mockKpis = [
  { id: 'predicted_demand', label: 'Predicted Demand', value: '458,200', change: '+18.4%', isPositive: true, subtext: 'Units next 30 days', sparkline: [35, 38, 42, 40, 48, 52, 58] },
  { id: 'current_inventory', label: 'Current Inventory', value: '1,240,500', change: '-2.1%', isPositive: false, subtext: 'Total units in stock', sparkline: [60, 58, 56, 54, 52, 51, 50] },
  { id: 'stock_shortages', label: 'Stock Shortages', value: '14 SKUs', change: '+3 SKUs', isPositive: false, isAlert: true, subtext: 'Action required', sparkline: [8, 9, 10, 11, 12, 14, 14] },
  { id: 'overstock_items', label: 'Overstock Items', value: '28 SKUs', change: '-5 SKUs', isPositive: true, subtext: '$142k capital tied', sparkline: [35, 33, 31, 30, 29, 28, 28] },
  { id: 'pending_orders', label: 'Pending Purchase Orders', value: '38 POs', change: '$485,000', isPositive: true, subtext: '12 awaiting approval', sparkline: [20, 24, 28, 30, 34, 36, 38] },
  { id: 'revenue_forecast', label: 'Revenue Forecast', value: '$8.42M', change: '+12.6%', isPositive: true, subtext: 'Projected Q3 revenue', sparkline: [6.2, 6.5, 6.9, 7.3, 7.8, 8.1, 8.42] },
];

export const mockDailySales = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Actual Sales ($k)',
      data: [42, 48, 51, 56, 72, 85, 78],
      borderColor: '#4F46E5',
      backgroundColor: 'rgba(79, 70, 229, 0.2)',
      fill: true,
      tension: 0.4
    },
    {
      label: 'AI Forecasted ($k)',
      data: [40, 46, 53, 58, 70, 88, 80],
      borderColor: '#22C55E',
      borderDash: [5, 5],
      fill: false,
      tension: 0.4
    }
  ]
};

export const mockWeeklyForecast = {
  labels: ['Wk 31', 'Wk 32', 'Wk 33', 'Wk 34', 'Wk 35', 'Wk 36'],
  datasets: [
    {
      label: 'Baseline Demand',
      data: [1200, 1250, 1300, 1280, 1320, 1380],
      backgroundColor: '#3B82F6',
    },
    {
      label: 'Promotional Uplift',
      data: [180, 240, 310, 200, 450, 520],
      backgroundColor: '#22C55E',
    }
  ]
};

export const mockMonthlyDemand = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: '2025 Actual',
      data: [4.2, 4.5, 4.8, 5.1, 5.6, 6.0, 6.4, 6.8, 6.2, 6.7, 8.1, 9.5],
      borderColor: '#64748B',
      tension: 0.3
    },
    {
      label: '2026 AI Projection',
      data: [4.8, 5.2, 5.7, 6.1, 6.8, 7.3, 7.9, 8.4, 7.8, 8.2, 9.8, 11.2],
      borderColor: '#4F46E5',
      borderWidth: 3,
      tension: 0.3
    }
  ]
};

export const mockPromotionImpact = {
  labels: ['No Promo', '10% Off', '25% BOGO', 'Flash Sale', 'Holiday Special'],
  datasets: [
    {
      label: 'Lift Factor (%)',
      data: [0, 14.2, 38.5, 62.1, 85.0],
      backgroundColor: ['#64748B', '#3B82F6', '#818CF8', '#4F46E5', '#22C55E'],
      borderRadius: 8
    }
  ]
};

export const mockHolidayImpact = {
  labels: ['Super Bowl', 'Easter', 'Labor Day', 'Black Friday', 'Cyber Monday', 'Christmas'],
  datasets: [
    {
      label: 'Historical Spike Multiplier',
      data: [1.35, 1.20, 1.45, 2.85, 2.60, 2.40],
      borderColor: '#FACC15',
      backgroundColor: 'rgba(250, 204, 21, 0.15)',
      fill: true,
      pointRadius: 6
    }
  ]
};

export const mockStores = [
  { id: 'STR-101', name: 'Metro Flagship Hub', region: 'North America East', type: 'Superstore', sales: '$1,420,000', status: 'Optimal', inventoryLevel: '94%', leadTime: '2 Days' },
  { id: 'STR-102', name: 'Tech District Express', region: 'West Coast', type: 'Express Retail', sales: '$980,000', status: 'Optimal', inventoryLevel: '88%', leadTime: '1 Day' },
  { id: 'STR-103', name: 'Chicago Loop Retail', region: 'Midwest', type: 'Standard Store', sales: '$750,000', status: 'Low Stock', inventoryLevel: '62%', leadTime: '3 Days' },
  { id: 'STR-104', name: 'Austin South Hub', region: 'South', type: 'Warehouse Store', sales: '$1,150,000', status: 'Optimal', inventoryLevel: '91%', leadTime: '2 Days' },
  { id: 'STR-105', name: 'Miami Bayfront Outlet', region: 'Southeast', type: 'Outlet', sales: '$620,000', status: 'Critical', inventoryLevel: '45%', leadTime: '4 Days' },
  { id: 'STR-106', name: 'Seattle Downtown Plaza', region: 'Northwest', type: 'Superstore', sales: '$1,290,000', status: 'Optimal', inventoryLevel: '96%', leadTime: '1 Day' },
  { id: 'STR-107', name: 'Boston Commons Express', region: 'Northeast', type: 'Express Retail', sales: '$540,000', status: 'Low Stock', inventoryLevel: '58%', leadTime: '2 Days' },
];

export const mockForecastModels = {
  XGBoost: { rmse: '3.82', mae: '2.65', mape: '2.4%', accuracy: '97.6%', trainingTime: '1.2s' },
  LSTM: { rmse: '3.15', mae: '2.10', mape: '1.9%', accuracy: '98.1%', trainingTime: '8.4s' },
  Prophet: { rmse: '4.95', mae: '3.80', mape: '3.6%', accuracy: '96.4%', trainingTime: '0.8s' }
};

export const mockActualVsPredicted30Days = {
  labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
  actual: [120, 125, 118, 130, 142, 155, 160, 148, 135, 138, 145, 150, 168, 185, 178, 162, 158, 164, 170, 182, 195, 210, 205, 190, 184, 188, 192, 204, 220, 215],
  predicted: [118, 122, 120, 132, 140, 152, 158, 150, 136, 140, 144, 152, 165, 180, 175, 164, 160, 162, 172, 180, 192, 206, 202, 188, 186, 190, 195, 202, 218, 212],
  upperBound: [128, 132, 130, 142, 150, 162, 168, 160, 146, 150, 154, 162, 175, 190, 185, 174, 170, 172, 182, 190, 202, 216, 212, 198, 196, 200, 205, 212, 228, 222],
  lowerBound: [108, 112, 110, 122, 130, 142, 148, 140, 126, 130, 134, 142, 155, 170, 165, 154, 150, 152, 162, 170, 182, 196, 192, 178, 176, 180, 185, 192, 208, 202]
};

export const mockClusters = [
  { id: 'A', name: 'Cluster A: High Performing Metros', count: '42 Stores', avgRevenue: '$1.45M', promoSensitivity: 'Low', elasticity: '0.42', description: 'Dense urban stores with steady high-margin volume and minimal promotional dependency.' },
  { id: 'B', name: 'Cluster B: Promotion Sensitive Suburban', count: '78 Stores', avgRevenue: '$890K', promoSensitivity: 'High', elasticity: '1.85', description: 'Suburban locations with significant sales spikes during weekend circulars and digital coupons.' },
  { id: 'C', name: 'Cluster C: Seasonal & Resort Hubs', count: '25 Stores', avgRevenue: '$640K', promoSensitivity: 'Medium', elasticity: '1.20', description: 'Tourist destinations experiencing intense Q3/Q4 volume shifts and high inventory volatility.' },
];

export const mockInventorySKUs = [
  { id: 'SKU-8821', name: 'Organic Whole Milk 1L', category: 'Dairy & Fresh', stock: 120, safetyStock: 250, reorderLevel: 300, price: '$4.20', status: 'Critical', supplier: 'Horizon Farms' },
  { id: 'SKU-9943', name: 'Artisan Espresso Beans 1kg', category: 'Beverages', stock: 480, safetyStock: 200, reorderLevel: 350, price: '$18.50', status: 'Healthy', supplier: 'Roastworks Co.' },
  { id: 'SKU-4412', name: 'Wireless Headphones ANC', category: 'Electronics', stock: 85, safetyStock: 100, reorderLevel: 150, price: '$149.00', status: 'Low Stock', supplier: 'SonicTech Logistics' },
  { id: 'SKU-3321', name: 'Electrolyte Energy Drink 24p', category: 'Beverages', stock: 1420, safetyStock: 400, reorderLevel: 500, price: '$28.00', status: 'Healthy', supplier: 'Hydrate Global' },
  { id: 'SKU-1192', name: 'Avocado Bag 5-Pack', category: 'Produce', stock: 95, safetyStock: 180, reorderLevel: 220, price: '$6.50', status: 'Critical', supplier: 'Valley Fresh Direct' },
  { id: 'SKU-5509', name: 'Smart Fitness Tracker V2', category: 'Electronics', stock: 310, safetyStock: 120, reorderLevel: 200, price: '$89.00', status: 'Healthy', supplier: 'SonicTech Logistics' },
];

export const mockProcurementItems = [
  { sku: 'SKU-8821', name: 'Organic Whole Milk 1L', currentStock: 120, forecast30Days: 450, recommendedOrder: 330, unitCost: '$2.80', supplier: 'Horizon Farms', deadline: 'This Friday' },
  { sku: 'SKU-1192', name: 'Avocado Bag 5-Pack', currentStock: 95, forecast30Days: 380, recommendedOrder: 285, unitCost: '$4.10', supplier: 'Valley Fresh Direct', deadline: 'Tomorrow' },
  { sku: 'SKU-4412', name: 'Wireless Headphones ANC', currentStock: 85, forecast30Days: 240, recommendedOrder: 155, unitCost: '$85.00', supplier: 'SonicTech Logistics', deadline: 'In 3 Days' }
];

export const mockPurchaseOrders = [
  { id: 'PO-2026-981', supplier: 'Horizon Farms Inc.', itemsCount: 3, totalAmount: '$1,480.00', createdDate: '2026-08-01', expectedDelivery: '2026-08-05', status: 'Pending', priority: 'High' },
  { id: 'PO-2026-980', supplier: 'SonicTech Logistics', itemsCount: 12, totalAmount: '$24,500.00', createdDate: '2026-07-30', expectedDelivery: '2026-08-04', status: 'Approved', priority: 'Medium' },
  { id: 'PO-2026-979', supplier: 'Roastworks Co.', itemsCount: 8, totalAmount: '$8,880.00', createdDate: '2026-07-28', expectedDelivery: '2026-08-02', status: 'Delivered', priority: 'Normal' },
  { id: 'PO-2026-978', supplier: 'Valley Fresh Direct', itemsCount: 5, totalAmount: '$3,150.00', createdDate: '2026-07-25', expectedDelivery: '2026-07-29', status: 'Cancelled', priority: 'Low' }
];

export const mockNotifications = [
  { id: 'notif-1', title: 'Low Inventory Alert', message: 'Organic Whole Milk 1L has dropped below safety stock (120 remaining).', time: '10 mins ago', type: 'alert', isRead: false },
  { id: 'notif-2', title: 'Demand Spike Detected', message: 'Electrolyte Energy Drink 24p demand increased +42% in West Coast Region.', time: '45 mins ago', type: 'info', isRead: false },
  { id: 'notif-3', title: 'Promotion Impact Triggered', message: 'Flash Sale Promo #82 active — uplift expected to reach +38.5% over weekend.', time: '2 hours ago', type: 'success', isRead: true },
  { id: 'notif-4', title: 'Purchase Order Approved', message: 'PO-2026-980 approved by Procurement Manager ($24,500.00).', time: '5 hours ago', type: 'success', isRead: true }
];

export const mockActivityFeed = [
  { id: 1, user: 'AI Forecasting Engine', action: 'Re-trained XGBoost model with latest weekend store velocity', time: '12m ago', badge: 'Model Updated' },
  { id: 2, user: 'Elena Vance (Procurement)', action: 'Approved Purchase Order PO-2026-980 for SonicTech Logistics', time: '42m ago', badge: 'PO Approved' },
  { id: 3, user: 'Automated Alert System', action: 'Triggered safety stock alert for SKU-8821 in Chicago Loop Store', time: '1h ago', badge: 'Alert' },
  { id: 4, user: 'Marcus Vance (Store Ops)', action: 'Updated store cluster assignment for STR-105 (Miami Bayfront)', time: '3h ago', badge: 'Store Update' }
];
