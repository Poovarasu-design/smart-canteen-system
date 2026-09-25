import express from 'express';
import { getDashboardStats } from '../controllers/analyticsController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', authenticateToken, requireAdmin, getDashboardStats);

export default router;
