const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { validateUser, validateCart } = require('../middleware/validation');
const User = require('../models/User');
const Product = require('../models/Product');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User profile and cart management
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authorized
 */
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

/**
 * @swagger
 * /api/user/cart:
 *   post:
 *     summary: Add product to cart
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *               size:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cart updated successfully
 */
// Add to cart
router.post('/cart', auth, validateCart, async (req, res) => {
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

// Get all users (ADMIN/STAFF)
router.get('/', auth, async (req, res) => {
  try {
    const allowedRoles = ['super_admin', 'admin', 'staff', 'support'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized - Admin or Staff only' });
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

// Create a new staff/worker (SUPER_ADMIN/ADMIN)
router.post('/staff', auth, validateUser, async (req, res) => {
  try {
    const allowedAdminRoles = ['super_admin', 'admin'];
    if (!allowedAdminRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized - Admin privileges required' });
    }
    
    const { email, password, name, phone, location, role } = req.body;
    
    const validRoles = ['admin', 'delivery', 'staff', 'support'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }
    
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
      role: role || 'delivery'
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

// Delete a user (SUPER_ADMIN/ADMIN)
router.delete('/:id', auth, async (req, res) => {
  try {
    const allowedAdminRoles = ['super_admin', 'admin'];
    if (!allowedAdminRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Not authorized - Admin privileges required' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent deleting self
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    // Only super_admin can delete another super_admin or admin
    if (['super_admin', 'admin'].includes(user.role) && req.user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Only Super Admin can delete other admins' });
    }
    
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
