import mongoose from 'mongoose';

const salesHistorySchema = new mongoose.Schema({
  date: { type: String, required: true, index: true },
  storeId: { type: String, required: true, index: true },
  skuId: { type: String, required: true, index: true },
  salesUnits: { type: Number, required: true },
  revenue: { type: Number, required: true },
  promoFlag: { type: Number, default: 0 },
  holidayFlag: { type: Number, default: 0 },
  uploadedAt: { type: Date, default: Date.now }
});

export const SalesHistory = mongoose.models.SalesHistory || mongoose.model('SalesHistory', salesHistorySchema);
