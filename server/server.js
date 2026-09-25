import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDatabase, getDbMode } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);

// Healthcheck & System Info
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'Smart Canteen Pre-Ordering System',
    version: '1.0.0',
    databaseMode: getDbMode(),
    timestamp: new Date().toISOString()
  });
});

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');

// Serve frontend static build if available
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error', error: err.message });
});

// Initialize database and start listening
const startServer = async () => {
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`🚀 Smart Canteen Server running on http://localhost:${PORT}`);
    console.log(`📡 Storage Mode: ${getDbMode().toUpperCase()}`);
  });
};

startServer();
