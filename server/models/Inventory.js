import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  safetyStock: { type: Number, required: true, default: 100 },
  reorderLevel: { type: Number, required: true, default: 150 },
  price: { type: String, required: true, default: '$0.00' },
  supplier: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Healthy', 'Low Stock', 'Critical'],
    default: 'Healthy'
  },
  recommendedOrder: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

export const Inventory = mongoose.models.Inventory || mongoose.model('Inventory', inventorySchema);
