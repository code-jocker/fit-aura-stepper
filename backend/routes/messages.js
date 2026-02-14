const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { auth, adminAuth } = require('../middleware/auth');

// Get messages for current user
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ senderId: req.user.id }, { receiverId: req.user.id }]
    })
    .populate('senderId', 'name role')
    .populate('receiverId', 'name role')
    .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get messages for a specific order
router.get('/order/:orderId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ orderId: req.params.orderId })
    .populate('senderId', 'name role')
    .populate('receiverId', 'name role')
    .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    let { receiverId, orderId, content, type } = req.body;
    
    // Handle 'admin' receiver by finding the first admin
    if (receiverId === 'admin') {
      const User = require('../models/User');
      const admin = await User.findOne({ role: 'admin' });
      if (admin) {
        receiverId = admin._id;
      } else {
        return res.status(404).json({ message: 'No admin found to receive message' });
      }
    }

    const message = new Message({
      senderId: req.user.id,
      receiverId,
      orderId,
      content,
      type: type || 'chat'
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Send automated motivation (Admin only)
router.post('/motivate', adminAuth, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const message = new Message({
      senderId: req.user.id,
      receiverId,
      content,
      type: 'motivation'
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
