import express from 'express';
import { login, register, getMe, getDemoAccounts, forgotPassword } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticateToken, getMe);
router.get('/demo-accounts', getDemoAccounts);
router.post('/forgot-password', forgotPassword);

export default router;
