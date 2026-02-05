const express = require('express');
const router = express.Router();
const { auth, optionalAuth, adminAuth } = require('../middleware/auth');
const Order = require('../models/Order');
const User = require('../models/User');

// Create order
router.post('/', optionalAuth, async (req, res) => {
  try {
    console.log('📦 Creating new order:', req.body);
    const { items, deliveryAddress, phone, paymentMethod, notes, customerName, email, paymentStatus, transactionId, location } = req.body;
    
    if (!items || !items.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate totals and format items
    let subtotal = 0;
    const formattedItems = items.map(item => {
      const price = Number(item.price);
      const quantity = Number(item.quantity);
      subtotal += price * quantity;
      
      return {
        productId: item.productId,
        quantity: quantity,
        price: price,
        size: item.size || 'N/A',
        color: item.color || 'N/A'
      };
    });
    
    // Check if Kigali for free delivery
    const isFreeDelivery = deliveryAddress?.toLowerCase().includes('kigali');
    const deliveryFee = isFreeDelivery ? 0 : 5000;
    const total = subtotal + deliveryFee;
    
    const orderData = {
      customerName,
      email,
      items: formattedItems,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress,
      phone,
      paymentMethod,
      paymentStatus: paymentStatus || 'pending',
      transactionId,
      location,
      notes,
      status: 'pending'
    };

    if (req.user) {
      orderData.userId = req.user.id;
    }
    
    const order = new Order(orderData);
    await order.save();
    console.log('✅ Order saved:', order._id);
    
    // Clear cart if user is logged in
    if (req.user) {
      try {
        const user = await User.findById(req.user.id);
        if (user) {
          user.cart = [];
          await user.save();
        }
      } catch (userErr) {
        console.error('Error clearing user cart:', userErr);
        // Don't fail the order if cart clearing fails
      }
    }
    
    res.status(201).json(order);
  } catch (error) {
    console.error('❌ Order creation error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get orders (User's own orders or ALL for Admin)
router.get('/', auth, async (req, res) => {
  try {
    let query = { userId: req.user.id };
    
    // If admin, get all orders
    if (req.user.role === 'admin') {
      query = {};
    }
    
    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get orders assigned to worker (DELIVERY)
router.get('/assigned', auth, async (req, res) => {
  try {
    if (req.user.role !== 'delivery') {
      return res.status(401).json({ message: 'Not authorized - Delivery only' });
    }
    
    const orders = await Order.find({ 
      deliveryPerson: req.user.id,
      status: { $in: ['shipped', 'delivered'] } 
    }).sort({ updatedAt: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single order
router.get('/:orderId', optionalAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // If order has a userId, only that user can see it
    if (order.userId && (!req.user || order.userId.toString() !== req.user.id)) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // If it's a guest order, anyone with the link can see it (or we could add a phone number check)
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order (ADMIN)
router.put('/:orderId', adminAuth, async (req, res) => {
  try {
    const { status, paymentStatus, deliveryAddress, phone, notes, deliveryPerson, assignedAt, adminNote } = req.body;
    
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (deliveryAddress) order.deliveryAddress = deliveryAddress;
    if (phone) order.phone = phone;
    if (notes) order.notes = notes;
    if (deliveryPerson) order.deliveryPerson = deliveryPerson;
    if (assignedAt) order.assignedAt = assignedAt;
    if (adminNote) order.adminNote = adminNote;
    
    order.updatedAt = Date.now();
    await order.save();
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
