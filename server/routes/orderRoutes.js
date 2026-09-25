import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  verifyOrderQR,
  markOrderCollected,
  simulateNextStatus
} from '../controllers/orderController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticateToken, createOrder);
router.get('/my-orders', authenticateToken, getMyOrders);
router.get('/:id', authenticateToken, getOrderById);

// Staff / Admin endpoints
router.get('/', authenticateToken, requireAdmin, getAllOrders);
router.patch('/:id/status', authenticateToken, requireAdmin, updateOrderStatus);
router.post('/verify-qr', authenticateToken, requireAdmin, verifyOrderQR);
router.patch('/:id/collect', authenticateToken, requireAdmin, markOrderCollected);

// Simulation helper (available to student for their own order or admin for demoing)
router.post('/:id/simulate-next', authenticateToken, simulateNextStatus);

export default router;
