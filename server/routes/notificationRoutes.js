import express from 'express';
import { getMyNotifications, markNotificationsRead } from '../controllers/notificationController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, getMyNotifications);
router.patch('/mark-read', authenticateToken, markNotificationsRead);

export default router;
