import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  role: { 
    type: String, 
    enum: ['admin', 'procurement_manager', 'store_manager', 'supply_chain_analyst'], 
    default: 'supply_chain_analyst' 
  },
  department: { type: String, default: 'Supply Chain Operations' },
  avatar: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  lastLogin: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
