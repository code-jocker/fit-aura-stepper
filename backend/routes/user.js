const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Product = require('../models/Product');

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get cart
router.get('/cart', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to cart
router.post('/cart', auth, async (req, res) => {
  try {
    const { productId, quantity, size, color } = req.body;
    
    const user = await User.findById(req.user.id);
    const existingItem = user.cart.find(item => item.productId.toString() === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity, size, color });
    }
    
    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove from cart
router.delete('/cart/:itemId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(item => item._id.toString() !== req.params.itemId);
    await user.save();
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all users (ADMIN)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized - Admin only' });
    }
    const { role } = req.query;
    let query = {};
    if (role) query.role = role;
    
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new worker (ADMIN)
router.post('/workers', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized - Admin only' });
    }
    
    const { email, password, name, phone, location } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    const user = await User.create({
      email,
      password,
      name,
      phone,
      location,
      role: 'delivery'
    });
    
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle worker availability (DELIVERY)
router.put('/availability', auth, async (req, res) => {
  try {
    if (req.user.role !== 'delivery') {
      return res.status(401).json({ message: 'Not authorized - Delivery only' });
    }
    
    const { isAvailable } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { isAvailable },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update worker location (DELIVERY)
router.put('/location', auth, async (req, res) => {
  try {
    if (req.user.role !== 'delivery') {
      return res.status(401).json({ message: 'Not authorized - Delivery only' });
    }
    
    const { location } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { location },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a worker (ADMIN)
router.delete('/workers/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized - Admin only' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'delivery') {
      return res.status(404).json({ message: 'Worker not found' });
    }
    
    await user.deleteOne();
    res.json({ message: 'Worker deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
