import { db } from '../config/db.js';

export const getMyNotifications = async (req, res) => {
  try {
    const notifs = await db.notifications.find({ userId: req.user.id });
    const unreadCount = notifs.filter((n) => !n.read).length;
    res.json({ success: true, count: notifs.length, unreadCount, notifications: notifs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications.' });
  }
};

export const markNotificationsRead = async (req, res) => {
  try {
    await db.notifications.markAllAsRead(req.user.id);
    res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update notifications.' });
  }
};
