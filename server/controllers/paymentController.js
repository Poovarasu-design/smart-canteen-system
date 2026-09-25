import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.js';

export const simulatePayment = async (req, res) => {
  try {
    const { amount, method = 'GPay / UPI', shouldFail = false } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid payment amount.' });
    }

    // Allow user to trigger failure scenario to test error handling
    if (shouldFail) {
      return res.status(400).json({
        success: false,
        status: 'FAILED',
        message: 'Payment simulation declined by bank or user cancelled UPI authorization.'
      });
    }

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const randomSeq = Math.floor(1000 + Math.random() * 9000);
    const transactionId = `TXN${yyyy}${mm}${dd}${randomSeq}`;

    res.json({
      success: true,
      status: 'SUCCESS',
      transactionId,
      amount,
      method,
      message: 'Simulated payment completed successfully!'
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Payment gateway simulation error.' });
  }
};
