import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required. Please login.' });
  }

  try {
    const secret = process.env.JWT_SECRET || 'smart_canteen_super_secure_secret_key_2026';
    const decoded = jwt.verify(token, secret);
    const user = await db.users.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid session or user not found.' });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      collegeId: user.collegeId,
      phone: user.phone,
      role: user.role
    };

    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied: Admin privileges required.' });
  }
  next();
};
