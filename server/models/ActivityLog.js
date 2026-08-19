import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  user: { type: String, required: true },
  action: { type: String, required: true },
  time: { type: String, default: 'Just now' },
  badge: { type: String, default: 'System Update' },
  createdAt: { type: Date, default: Date.now }
});

export const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', activityLogSchema);
