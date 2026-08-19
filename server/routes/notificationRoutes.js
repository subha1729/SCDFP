import express from 'express';
import { Notification } from '../models/Notification.js';
import { inMemoryStore } from '../services/inMemoryStore.js';
import { isDbConnected } from '../config/db.js';

const router = express.Router();

/**
 * GET /api/notifications
 */
router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      const notifs = await Notification.find().sort({ createdAt: -1 });
      const unreadCount = notifs.filter(n => !n.isRead).length;
      return res.json({ status: 'success', count: notifs.length, unreadCount, data: notifs });
    }

    const fallbackNotifs = inMemoryStore.getNotifications();
    const unreadCount = fallbackNotifs.filter(n => !n.isRead).length;
    res.json({ status: 'success', count: fallbackNotifs.length, unreadCount, data: fallbackNotifs });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * POST /api/notifications
 */
router.post('/', async (req, res) => {
  const notifData = req.body;
  if (!notifData.title || !notifData.message) {
    return res.status(400).json({ status: 'error', message: 'Title and message are required.' });
  }

  try {
    const created = inMemoryStore.createNotification(notifData);

    if (isDbConnected()) {
      await Notification.create(created);
    }

    res.status(201).json({ status: 'success', data: created });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * PATCH /api/notifications/:id/read
 */
router.patch('/:id/read', async (req, res) => {
  const { id } = req.params;

  try {
    inMemoryStore.markNotificationRead(id);

    if (isDbConnected()) {
      await Notification.findOneAndUpdate({ id }, { $set: { isRead: true } });
    }

    res.json({ status: 'success', message: `Notification ${id} marked as read.` });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * PATCH /api/notifications/read-all
 */
router.patch('/read-all', async (req, res) => {
  try {
    inMemoryStore.markAllNotificationsRead();

    if (isDbConnected()) {
      await Notification.updateMany({}, { $set: { isRead: true } });
    }

    res.json({ status: 'success', message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

/**
 * DELETE /api/notifications/:id
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    inMemoryStore.deleteNotification(id);

    if (isDbConnected()) {
      await Notification.findOneAndDelete({ id });
    }

    res.json({ status: 'success', message: `Notification ${id} deleted.` });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;
