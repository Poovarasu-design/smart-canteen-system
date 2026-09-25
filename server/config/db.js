import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { seedUsers, seedFoods, seedOrders, seedNotifications } from '../data/seedData.js';
import { UserModel, FoodModel, OrderModel, PaymentModel, NotificationModel } from '../models/schemas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_PATH = path.join(__dirname, '..', 'data', 'store.json');

let dbMode = 'fallback'; // 'mongo' or 'fallback'

// In-memory / file-backed fallback store
let store = {
  users: [],
  foods: [],
  orders: [],
  payments: [],
  notifications: []
};

// Save store to store.json
const saveStore = () => {
  try {
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save store.json:', err.message);
  }
};

// Load store from store.json or seed
const loadStore = async () => {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const data = fs.readFileSync(STORE_PATH, 'utf-8');
      store = JSON.parse(data);
      console.log('📦 Loaded existing data from store.json');
    } else {
      // Initialize with seed data and hashed passwords
      const hashedUsers = await Promise.all(
        seedUsers.map(async (u) => {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(u.password, salt);
          return { ...u, password: hashedPassword };
        })
      );

      store = {
        users: hashedUsers,
        foods: [...seedFoods],
        orders: [...seedOrders],
        payments: seedOrders
          .filter((o) => o.transactionId)
          .map((o) => ({
            id: 'PAY-' + o.transactionId,
            orderId: o.id,
            transactionId: o.transactionId,
            amount: o.totalAmount,
            method: o.paymentMethod,
            status: 'SUCCESS',
            createdAt: o.createdAt
          })),
        notifications: [...seedNotifications]
      };
      saveStore();
      console.log('🌱 Seeded initial data into store.json');
    }
  } catch (err) {
    console.error('Error loading fallback store:', err.message);
  }
};

export const initDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smart_canteen';
  try {
    console.log(`Checking MongoDB connection at ${mongoUri}...`);
    // Race connect with a 1500ms timeout so server never hangs if mongod is stopped
    const connectPromise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 1500,
      connectTimeoutMS: 1500
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timed out')), 1500)
    );

    await Promise.race([connectPromise, timeoutPromise]);

    dbMode = 'mongo';
    console.log('✅ Connected to MongoDB successfully!');

    // Check if Mongo is empty and needs seeding
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding MongoDB with initial data...');
      const hashedUsers = await Promise.all(
        seedUsers.map(async (u) => {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(u.password, salt);
          return { ...u, password: hashedPassword };
        })
      );
      await UserModel.insertMany(hashedUsers);
      await FoodModel.insertMany(seedFoods);
      await OrderModel.insertMany(seedOrders);
      await NotificationModel.insertMany(seedNotifications);
      console.log('✅ MongoDB seeded successfully!');
    }
  } catch (err) {
    console.warn('⚠️ MongoDB connection could not be established:', err.message);
    console.log('💡 Activating High-Reliability Persistent Storage Adapter (JSON store). Full functionality preserved!');
    dbMode = 'fallback';
    await loadStore();
  }
};

export const getDbMode = () => dbMode;

// Helper to filter objects matching query
const matchQuery = (item, query = {}) => {
  for (const key of Object.keys(query)) {
    if (item[key] !== query[key]) return false;
  }
  return true;
};

// UNIFIED DATA ADAPTER
export const db = {
  users: {
    find: async (query = {}) => {
      if (dbMode === 'mongo') return await UserModel.find(query).lean();
      return store.users.filter((u) => matchQuery(u, query));
    },
    findOne: async (query = {}) => {
      if (dbMode === 'mongo') return await UserModel.findOne(query).lean();
      return store.users.find((u) => matchQuery(u, query)) || null;
    },
    findById: async (id) => {
      if (dbMode === 'mongo') return await UserModel.findOne({ id }).lean();
      return store.users.find((u) => u.id === id) || null;
    },
    create: async (data) => {
      if (dbMode === 'mongo') {
        const user = new UserModel(data);
        await user.save();
        return user.toObject();
      }
      store.users.push(data);
      saveStore();
      return data;
    },
    findByIdAndUpdate: async (id, update) => {
      if (dbMode === 'mongo') {
        return await UserModel.findOneAndUpdate({ id }, { $set: update }, { new: true }).lean();
      }
      const idx = store.users.findIndex((u) => u.id === id);
      if (idx === -1) return null;
      store.users[idx] = { ...store.users[idx], ...update };
      saveStore();
      return store.users[idx];
    }
  },

  foods: {
    find: async (query = {}) => {
      if (dbMode === 'mongo') return await FoodModel.find(query).lean();
      return store.foods.filter((f) => matchQuery(f, query));
    },
    findOne: async (query = {}) => {
      if (dbMode === 'mongo') return await FoodModel.findOne(query).lean();
      return store.foods.find((f) => matchQuery(f, query)) || null;
    },
    findById: async (id) => {
      if (dbMode === 'mongo') return await FoodModel.findOne({ id }).lean();
      return store.foods.find((f) => f.id === id) || null;
    },
    create: async (data) => {
      if (dbMode === 'mongo') {
        const item = new FoodModel(data);
        await item.save();
        return item.toObject();
      }
      store.foods.push(data);
      saveStore();
      return data;
    },
    findByIdAndUpdate: async (id, update) => {
      if (dbMode === 'mongo') {
        return await FoodModel.findOneAndUpdate({ id }, { $set: update }, { new: true }).lean();
      }
      const idx = store.foods.findIndex((f) => f.id === id);
      if (idx === -1) return null;
      store.foods[idx] = { ...store.foods[idx], ...update };
      saveStore();
      return store.foods[idx];
    },
    findByIdAndDelete: async (id) => {
      if (dbMode === 'mongo') {
        return await FoodModel.findOneAndDelete({ id }).lean();
      }
      const idx = store.foods.findIndex((f) => f.id === id);
      if (idx === -1) return null;
      const removed = store.foods.splice(idx, 1)[0];
      saveStore();
      return removed;
    }
  },

  orders: {
    find: async (query = {}) => {
      if (dbMode === 'mongo') return await OrderModel.find(query).sort({ createdAt: -1 }).lean();
      return store.orders
        .filter((o) => matchQuery(o, query))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    findOne: async (query = {}) => {
      if (dbMode === 'mongo') return await OrderModel.findOne(query).lean();
      return store.orders.find((o) => matchQuery(o, query)) || null;
    },
    findById: async (id) => {
      if (dbMode === 'mongo') return await OrderModel.findOne({ id }).lean();
      return store.orders.find((o) => o.id === id || o.orderNumber === id) || null;
    },
    create: async (data) => {
      if (dbMode === 'mongo') {
        const order = new OrderModel(data);
        await order.save();
        return order.toObject();
      }
      store.orders.unshift(data);
      saveStore();
      return data;
    },
    findByIdAndUpdate: async (id, update) => {
      if (dbMode === 'mongo') {
        return await OrderModel.findOneAndUpdate({ id }, { $set: update }, { new: true }).lean();
      }
      const idx = store.orders.findIndex((o) => o.id === id || o.orderNumber === id);
      if (idx === -1) return null;
      store.orders[idx] = { ...store.orders[idx], ...update, updatedAt: new Date().toISOString() };
      saveStore();
      return store.orders[idx];
    }
  },

  payments: {
    find: async (query = {}) => {
      if (dbMode === 'mongo') return await PaymentModel.find(query).lean();
      return store.payments.filter((p) => matchQuery(p, query));
    },
    create: async (data) => {
      if (dbMode === 'mongo') {
        const payment = new PaymentModel(data);
        await payment.save();
        return payment.toObject();
      }
      store.payments.push(data);
      saveStore();
      return data;
    }
  },

  notifications: {
    find: async (query = {}) => {
      if (dbMode === 'mongo') return await NotificationModel.find(query).sort({ createdAt: -1 }).lean();
      return store.notifications
        .filter((n) => matchQuery(n, query))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    create: async (data) => {
      if (dbMode === 'mongo') {
        const notif = new NotificationModel(data);
        await notif.save();
        return notif.toObject();
      }
      store.notifications.unshift(data);
      saveStore();
      return data;
    },
    markAllAsRead: async (userId) => {
      if (dbMode === 'mongo') {
        await NotificationModel.updateMany({ userId }, { $set: { read: true } });
        return true;
      }
      store.notifications.forEach((n) => {
        if (n.userId === userId) n.read = true;
      });
      saveStore();
      return true;
    }
  }
};
