import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'smart_canteen_super_secure_secret_key_2026';

export const login = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or collegeId
    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide Email/College ID and Password.' });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const users = await db.users.find();
    const user = users.find(
      (u) => u.email.toLowerCase() === cleanIdentifier || u.collegeId.toLowerCase() === cleanIdentifier
    );

    if (!user) {
      return res.status(401).json({ success: false, message: 'Account not found with this Email or College ID.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        collegeId: user.collegeId,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

export const register = async (req, res) => {
  try {
    const { name, email, collegeId, phone, password, role } = req.body;

    if (!name || !email || !collegeId || !password) {
      return res.status(400).json({ success: false, message: 'Please provide Name, Email, College ID, and Password.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCollegeId = collegeId.trim().toUpperCase();

    const existingUser = (await db.users.find()).find(
      (u) => u.email.toLowerCase() === cleanEmail || u.collegeId.toUpperCase() === cleanCollegeId
    );

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A student account with this Email or College ID already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: 'usr_' + uuidv4().substring(0, 8),
      name: name.trim(),
      email: cleanEmail,
      collegeId: cleanCollegeId,
      phone: (phone || '').trim(),
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'student',
      createdAt: new Date().toISOString()
    };

    await db.users.create(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Account registered successfully!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        collegeId: newUser.collegeId,
        phone: newUser.phone,
        role: newUser.role
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await db.users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        collegeId: user.collegeId,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving user profile.' });
  }
};

export const getDemoAccounts = async (req, res) => {
  res.json({
    success: true,
    students: [
      { email: 'student@college.edu', collegeId: '2023CS0101', name: 'Aditya Sharma', password: 'student123' },
      { email: 'priya@college.edu', collegeId: '2023IT0204', name: 'Priya Patel', password: 'student123' },
      { email: 'rahul@college.edu', collegeId: '2023EC0312', name: 'Rahul Verma', password: 'student123' },
      { email: 'ananya@college.edu', collegeId: '2023ME0415', name: 'Ananya Iyer', password: 'student123' },
      { email: 'arjun@college.edu', collegeId: '2023EE0520', name: 'Arjun Reddy', password: 'student123' }
    ],
    admin: { email: 'admin@college.edu', collegeId: 'STAFF001', name: 'Canteen Staff Manager', password: 'admin123' }
  });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Please provide your registered email.' });
  }
  res.json({
    success: true,
    message: `Password reset link sent to ${email} (Simulated: For testing, your password is 'student123' or 'admin123')`
  });
};
