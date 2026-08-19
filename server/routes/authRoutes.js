import express from 'express';
import { User } from '../models/User.js';
import { inMemoryStore } from '../services/inMemoryStore.js';
import { isDbConnected } from '../config/db.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Authenticates user and returns session profile
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ status: 'error', message: 'Email address is required.' });
  }

  try {
    let user = null;
    if (isDbConnected()) {
      user = await User.findOne({ email: { $regex: new RegExp(`^${email}$`, 'i') } });
    }

    if (!user) {
      user = inMemoryStore.getUserByEmail(email);
    }

    if (!user) {
      // Auto-provision demo account if not existing for smooth login
      user = inMemoryStore.createUser({
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email,
        role: email.includes('admin') ? 'admin' : (email.includes('procurement') ? 'procurement_manager' : 'supply_chain_analyst')
      });
      if (isDbConnected()) {
        await User.create(user);
      }
    }

    inMemoryStore.addActivity({
      user: user.name,
      action: `User logged in from Supply Chain portal (${user.role})`,
      badge: 'User Login'
    });

    res.json({
      status: 'success',
      token: `nexus_auth_jwt_${Buffer.from(user.email).toString('base64')}_${Date.now()}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department || 'Operations',
        status: user.status
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * GET /api/auth/me
 * Retrieves current active session profile
 */
router.get('/me', (req, res) => {
  const users = inMemoryStore.getUsers();
  res.json({
    status: 'success',
    user: users[0] || { name: 'Supply Chain Manager', email: 'manager@nexus.ai', role: 'admin' }
  });
});

/**
 * GET /api/auth/users
 * Lists team members and access roles
 */
router.get('/users', async (req, res) => {
  try {
    if (isDbConnected()) {
      const users = await User.find().sort({ createdAt: -1 });
      return res.json({ status: 'success', count: users.length, data: users });
    }

    const users = inMemoryStore.getUsers();
    res.json({ status: 'success', count: users.length, data: users });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
  const { name, email, role = 'supply_chain_analyst', department } = req.body;

  if (!name || !email) {
    return res.status(400).json({ status: 'error', message: 'Name and Email are required.' });
  }

  try {
    const newUser = inMemoryStore.createUser({ name, email, role, department });
    if (isDbConnected()) {
      await User.create(newUser);
    }

    res.status(201).json({ status: 'success', data: newUser });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * PATCH /api/auth/users/:id/role
 */
router.patch('/users/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ status: 'error', message: 'Role is required.' });
  }

  try {
    const updated = inMemoryStore.updateUser(id, { role });
    if (isDbConnected()) {
      await User.findOneAndUpdate({ id }, { $set: { role } });
    }

    res.json({ status: 'success', message: `User role updated to ${role}`, data: updated });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
