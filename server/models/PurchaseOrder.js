import mongoose from 'mongoose';

const lineItemSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  name: { type: String, required: true },
  units: { type: Number, required: true },
  unitCost: { type: String, default: '$0.00' },
  totalCost: { type: String, default: '$0.00' }
});

const purchaseOrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  supplier: { type: String, required: true },
  itemsCount: { type: Number, default: 1 },
  totalAmount: { type: String, required: true },
  createdDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
  expectedDelivery: { type: String, required: true },
  priority: { type: String, enum: ['High', 'Normal', 'Urgent'], default: 'Normal' },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  items: [lineItemSchema],
  approvedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export const PurchaseOrder = mongoose.models.PurchaseOrder || mongoose.model('PurchaseOrder', purchaseOrderSchema);
