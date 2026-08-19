import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  contactEmail: { type: String, required: true },
  phone: { type: String, default: '+1 (555) 019-2834' },
  address: { type: String, default: 'Global Logistics Hub' },
  leadTimeDays: { type: Number, default: 3 },
  onTimeDeliveryRate: { type: Number, default: 96.5 },
  qualityScore: { type: Number, default: 98.2 },
  paymentTerms: { type: String, default: 'Net 30' },
  categoriesSupplied: [{ type: String }],
  status: { type: String, enum: ['Active', 'Under Review', 'Suspended'], default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

export const Supplier = mongoose.models.Supplier || mongoose.model('Supplier', supplierSchema);
