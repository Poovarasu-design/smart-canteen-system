import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.js';

// Helper to generate sequential-looking Order ID
const generateOrderId = async () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const dateStr = `${yyyy}${mm}${dd}`;

  const allOrders = await db.orders.find();
  const nextSeq = String(allOrders.length + 1).padStart(3, '0');
  return `ORD-${dateStr}-${nextSeq}`;
};

export const createOrder = async (req, res) => {
  try {
    const { items, paymentMethod, studentName, studentPhone, studentCollegeId, transactionId } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Your cart is empty. Add food items first.' });
    }

    if (!['GPay / UPI', 'Cash at Counter'].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Invalid payment method selected.' });
    }

    // Verify all items exist and are available
    let totalAmount = 0;
    const verifiedItems = [];

    for (const item of items) {
      const food = await db.foods.findById(item.foodId || item.id);
      if (!food) {
        return res.status(400).json({ success: false, message: `Item "${item.name}" is no longer in the menu.` });
      }
      if (!food.availability) {
        return res.status(400).json({
          success: false,
          message: `Sorry, "${food.name}" is currently sold out / unavailable.`
        });
      }

      const qty = Math.max(1, Number(item.quantity) || 1);
      const subtotal = food.price * qty;
      totalAmount += subtotal;

      verifiedItems.push({
        foodId: food.id,
        name: food.name,
        price: food.price,
        quantity: qty,
        subtotal
      });
    }

    const orderId = await generateOrderId();
    const isPaid = paymentMethod === 'GPay / UPI';
    const finalTxnId = isPaid ? transactionId || `TXN${Date.now().toString().slice(-9)}` : null;

    // Build QR payload
    const qrPayload = {
      orderId,
      collegeId: studentCollegeId || req.user.collegeId,
      studentName: studentName || req.user.name,
      totalAmount,
      paymentMethod,
      paymentStatus: isPaid ? 'PAID' : 'PENDING',
      timestamp: new Date().toISOString()
    };

    const qrDataString = JSON.stringify(qrPayload);
    const qrCodeDataUrl = await QRCode.toDataURL(qrDataString, {
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 320,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    });

    const newOrder = {
      id: orderId,
      orderNumber: orderId,
      userId: req.user.id,
      studentName: studentName || req.user.name,
      studentCollegeId: studentCollegeId || req.user.collegeId,
      studentPhone: studentPhone || req.user.phone || '',
      items: verifiedItems,
      totalAmount,
      paymentMethod,
      paymentStatus: isPaid ? 'PAID' : 'PENDING',
      transactionId: finalTxnId,
      orderStatus: isPaid ? 'Payment Confirmed' : 'Order Placed',
      estimatedPrepTime: 10,
      qrData: qrDataString,
      qrCodeImage: qrCodeDataUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const createdOrder = await db.orders.create(newOrder);

    // If paid via UPI, record payment
    if (isPaid && finalTxnId) {
      await db.payments.create({
        id: 'PAY-' + finalTxnId,
        orderId,
        transactionId: finalTxnId,
        amount: totalAmount,
        method: paymentMethod,
        status: 'SUCCESS',
        createdAt: new Date().toISOString()
      });
    }

    // Trigger Notification for the student
    await db.notifications.create({
      id: 'notif_' + uuidv4().substring(0, 8),
      userId: req.user.id,
      orderId,
      title: 'Order Confirmed! 🎉',
      message: `Your order ${orderId} for ₹${totalAmount} has been placed. Current status: ${newOrder.orderStatus}.`,
      type: 'placed',
      read: false,
      createdAt: new Date().toISOString()
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: createdOrder
    });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ success: false, message: 'Failed to place order.' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await db.orders.find({ userId: req.user.id });
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving your orders.' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, search } = req.query;
    let orders = await db.orders.find();

    if (status && status !== 'All') {
      orders = orders.filter((o) => o.orderStatus.toLowerCase() === status.toLowerCase());
    }

    if (paymentStatus && paymentStatus !== 'All') {
      orders = orders.filter((o) => o.paymentStatus.toLowerCase() === paymentStatus.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      orders = orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.studentName.toLowerCase().includes(q) ||
          o.studentCollegeId.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching canteen orders.' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await db.orders.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Ensure student only views their own order unless admin
    if (req.user.role !== 'admin' && order.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view this order.' });
    }

    // Ensure qrCodeImage is generated
    if (!order.qrCodeImage && order.qrData) {
      order.qrCodeImage = await QRCode.toDataURL(order.qrData, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 320,
        color: { dark: '#0f172a', light: '#ffffff' }
      });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve order details.' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await db.orders.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const updates = {};
    if (orderStatus) updates.orderStatus = orderStatus;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    if (orderStatus === 'Ready for Pickup') {
      updates.estimatedPrepTime = 0;
    } else if (orderStatus === 'Collected') {
      updates.estimatedPrepTime = 0;
      if (order.paymentMethod === 'Cash at Counter') {
        updates.paymentStatus = 'PAID';
      }
    }

    const updated = await db.orders.findByIdAndUpdate(id, updates);

    // Create notification for student
    let notifTitle = 'Order Update';
    let notifMessage = `Your order ${order.orderNumber} status changed to ${orderStatus}.`;
    let notifType = 'alert';

    if (orderStatus === 'Preparing') {
      notifTitle = 'Food is Being Prepared 🍳';
      notifMessage = `Chef is preparing your meal (${order.items.map((i) => i.name).join(', ')}).`;
      notifType = 'preparing';
    } else if (orderStatus === 'Ready for Pickup') {
      notifTitle = 'Ready for Pickup! 🔔';
      notifMessage = `Your order ${order.orderNumber} is hot & ready! Please show your QR code at the counter.`;
      notifType = 'ready';
    } else if (orderStatus === 'Collected') {
      notifTitle = 'Order Collected ✅';
      notifMessage = `Order ${order.orderNumber} has been verified and collected. Enjoy your meal!`;
      notifType = 'collected';
    }

    await db.notifications.create({
      id: 'notif_' + uuidv4().substring(0, 8),
      userId: order.userId,
      orderId: order.id,
      title: notifTitle,
      message: notifMessage,
      type: notifType,
      read: false,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: `Order status updated to ${updated.orderStatus}`,
      order: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
};

export const verifyOrderQR = async (req, res) => {
  try {
    const { qrData, orderId } = req.body;

    let targetOrderId = orderId;
    if (!targetOrderId && qrData) {
      try {
        const parsed = JSON.parse(qrData);
        targetOrderId = parsed.orderId;
      } catch (e) {
        targetOrderId = qrData.trim();
      }
    }

    if (!targetOrderId) {
      return res.status(400).json({ success: false, message: 'Please provide QR data or Order ID to verify.' });
    }

    const order = await db.orders.findById(targetOrderId.trim());
    if (!order) {
      return res.status(404).json({
        success: false,
        valid: false,
        message: 'Invalid or Expired Order. No matching order found in the canteen system.'
      });
    }

    const isAlreadyCollected = order.orderStatus === 'Collected';

    res.json({
      success: true,
      valid: true,
      isAlreadyCollected,
      message: isAlreadyCollected
        ? `Order already collected on ${new Date(order.updatedAt).toLocaleTimeString()}`
        : 'ORDER VERIFIED: Valid Student Canteen Order',
      order
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'QR verification failed.' });
  }
};

export const markOrderCollected = async (req, res) => {
  try {
    const { id } = req.params;
    const { markPaid } = req.body;

    const order = await db.orders.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.orderStatus === 'Collected') {
      return res.status(400).json({ success: false, message: 'This order was already marked as collected.' });
    }

    const updates = {
      orderStatus: 'Collected',
      estimatedPrepTime: 0
    };

    if (markPaid || order.paymentMethod === 'Cash at Counter') {
      updates.paymentStatus = 'PAID';
    }

    const updated = await db.orders.findByIdAndUpdate(id, updates);

    await db.notifications.create({
      id: 'notif_' + uuidv4().substring(0, 8),
      userId: order.userId,
      orderId: order.id,
      title: 'Order Collected ✅',
      message: `Your food has been collected. Thank you for dining with us!`,
      type: 'collected',
      read: false,
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Order verified and marked as COLLECTED successfully!',
      order: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to mark order as collected.' });
  }
};

// Simulation helper to advance order status for demonstrations
export const simulateNextStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await db.orders.findById(id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    const statusFlow = ['Order Placed', 'Payment Confirmed', 'Preparing', 'Ready for Pickup', 'Collected'];
    let currentIndex = statusFlow.indexOf(order.orderStatus);
    if (currentIndex === -1) currentIndex = 0;

    if (currentIndex >= statusFlow.length - 1) {
      return res.json({ success: true, message: 'Order is already in the final state (Collected).', order });
    }

    const nextStatus = statusFlow[currentIndex + 1];
    const updates = { orderStatus: nextStatus };
    if (nextStatus === 'Ready for Pickup' || nextStatus === 'Collected') {
      updates.estimatedPrepTime = 0;
    }
    if (nextStatus === 'Collected' && order.paymentMethod === 'Cash at Counter') {
      updates.paymentStatus = 'PAID';
    }

    const updated = await db.orders.findByIdAndUpdate(id, updates);
    res.json({
      success: true,
      message: `Advanced to "${nextStatus}"!`,
      order: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Simulation error.' });
  }
};
