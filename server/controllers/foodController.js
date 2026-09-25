import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.js';

export const getAllFoods = async (req, res) => {
  try {
    const { category, search, sort, availableOnly } = req.query;
    let foods = await db.foods.find();

    if (category && category !== 'All') {
      foods = foods.filter((f) => f.category.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      foods = foods.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q) ||
          f.category.toLowerCase().includes(q)
      );
    }

    if (availableOnly === 'true') {
      foods = foods.filter((f) => f.availability === true);
    }

    if (sort === 'price_asc') {
      foods.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      foods.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      foods.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    res.json({
      success: true,
      count: foods.length,
      foods
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch food items.' });
  }
};

export const getFoodById = async (req, res) => {
  try {
    const food = await db.foods.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found.' });
    }
    res.json({ success: true, food });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error retrieving food item.' });
  }
};

export const createFood = async (req, res) => {
  try {
    const { name, category, price, description, image, availability, prepTime } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({ success: false, message: 'Name, Category, and Price are required.' });
    }

    const newFood = {
      id: 'food_' + uuidv4().substring(0, 8),
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      description: (description || '').trim(),
      prepTime: prepTime || '5-10 mins',
      image: image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      availability: availability !== undefined ? Boolean(availability) : true,
      rating: 4.8,
      isPopular: false,
      createdAt: new Date().toISOString()
    };

    const created = await db.foods.create(newFood);
    res.status(201).json({ success: true, message: 'Food item added successfully!', food: created });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create food item.' });
  }
};

export const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await db.foods.findById(id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found.' });
    }

    const updates = { ...req.body };
    if (updates.price) updates.price = Number(updates.price);
    if (updates.availability !== undefined) updates.availability = Boolean(updates.availability);

    const updated = await db.foods.findByIdAndUpdate(id, updates);
    res.json({ success: true, message: 'Food item updated successfully!', food: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update food item.' });
  }
};

export const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await db.foods.findById(id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found.' });
    }

    const newStatus = !food.availability;
    const updated = await db.foods.findByIdAndUpdate(id, { availability: newStatus });
    res.json({
      success: true,
      message: `Status updated: ${updated.name} is now ${newStatus ? 'Available' : 'Unavailable'}`,
      food: updated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to toggle availability.' });
  }
};

export const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await db.foods.findById(id);
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found.' });
    }

    await db.foods.findByIdAndDelete(id);
    res.json({ success: true, message: `${food.name} deleted successfully.` });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete food item.' });
  }
};
