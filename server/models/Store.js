import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  region: { type: String, required: true },
  salesVelocity: { type: Number, required: true, default: 50 },
  priceElasticity: { type: Number, required: true, default: 1.0 },
  cluster: { type: String, enum: ['A', 'B', 'C'], default: 'A' },
  clusterName: { type: String, default: 'High Performing' },
  monthlyRevenue: { type: String, default: '$10,000' },
  status: { type: String, enum: ['Optimal', 'Low Stock', 'Critical'], default: 'Optimal' },
  inventoryLevel: { type: String, default: '1,200 Units' },
  leadTime: { type: String, default: '2 Days' },
  updatedAt: { type: Date, default: Date.now }
});

export const Store = mongoose.models.Store || mongoose.model('Store', storeSchema);
