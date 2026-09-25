import express from 'express';
import {
  getAllFoods,
  getFoodById,
  createFood,
  updateFood,
  toggleAvailability,
  deleteFood
} from '../controllers/foodController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllFoods);
router.get('/:id', getFoodById);

// Admin-only endpoints
router.post('/', authenticateToken, requireAdmin, createFood);
router.put('/:id', authenticateToken, requireAdmin, updateFood);
router.patch('/:id/toggle-availability', authenticateToken, requireAdmin, toggleAvailability);
router.delete('/:id', authenticateToken, requireAdmin, deleteFood);

export default router;
