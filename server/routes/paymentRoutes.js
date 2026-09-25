import express from 'express';
import { simulatePayment } from '../controllers/paymentController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/simulate', authenticateToken, simulatePayment);

export default router;
