import mongoose from 'mongoose';

// USER SCHEMA
export const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  collegeId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  createdAt: { type: Date, default: Date.now }
});

// FOOD ITEM SCHEMA
export const foodItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, enum: ['Breakfast', 'Meals', 'Snacks', 'Beverages'], required: true },
  price: { type: Number, required: true },
  prepTime: { type: String, default: '5-10 mins' },
  description: { type: String, default: '' },
  image: { type: String, required: true },
  availability: { type: Boolean, default: true },
  rating: { type: Number, default: 4.5 },
  isPopular: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// ORDER SCHEMA
export const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentCollegeId: { type: String, required: true },
  studentPhone: { type: String, default: '' },
  items: [
    {
      foodId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 },
      subtotal: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['GPay / UPI', 'Cash at Counter'], required: true },
  paymentStatus: { type: String, enum: ['PAID', 'PENDING', 'FAILED'], default: 'PENDING' },
  transactionId: { type: String, default: null },
  orderStatus: {
    type: String,
    enum: ['Order Placed', 'Payment Confirmed', 'Preparing', 'Ready for Pickup', 'Collected', 'Cancelled'],
    default: 'Order Placed'
  },
  estimatedPrepTime: { type: Number, default: 10 },
  qrData: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// PAYMENT SCHEMA
export const paymentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  transactionId: { type: String, required: true },
  amount: { type: Number, required: true },
  method: { type: String, required: true },
  status: { type: String, enum: ['SUCCESS', 'PENDING', 'FAILED'], default: 'SUCCESS' },
  createdAt: { type: Date, default: Date.now }
});

// NOTIFICATION SCHEMA
export const notificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  orderId: { type: String, default: null },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['placed', 'confirmed', 'preparing', 'ready', 'collected', 'alert'], default: 'alert' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const UserModel = mongoose.models.User || mongoose.model('User', userSchema);
export const FoodModel = mongoose.models.FoodItem || mongoose.model('FoodItem', foodItemSchema);
export const OrderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);
export const PaymentModel = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
export const NotificationModel = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
