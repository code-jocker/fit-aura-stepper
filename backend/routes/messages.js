const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { auth, adminAuth } = require('../middleware/auth');

// Get list of conversations (Admin only)
router.get('/conversations', adminAuth, async (req, res) => {
  try {
    // Find all messages where admin is sender or receiver
    // Group by the other user
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { receiverId: req.user.id }, // Admin received
            { senderId: req.user.id }    // Admin sent
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", req.user.id] },
              "$receiverId",
              "$senderId"
            ]
          },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                { 
                  $and: [
                    { $eq: ["$receiverId", req.user.id] },
                    { $eq: ["$isRead", false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          'user._id': 1,
          'user.name': 1,
          'user.email': 1,
          'user.role': 1,
          lastMessage: 1,
          unreadCount: 1
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get messages between admin and a specific user
router.get('/user/:userId', adminAuth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { senderId: req.user.id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user.id }
      ]
    })
    .populate('senderId', 'name role')
    .populate('receiverId', 'name role')
    .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

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

// Resolve problem
router.post('/resolve', auth, async (req, res) => {
  try {
    const { conversationId, problemType, resolutionNotes } = req.body;
    
    // Create a system message about resolution
    const resolutionMessage = new Message({
      senderId: req.user.id,
      receiverId: conversationId,
      content: `Problem resolved: ${problemType}\nResolution: ${resolutionNotes}`,
      type: 'system',
      isRead: false
    });
    
    await resolutionMessage.save();
    
    res.json({ message: 'Problem resolved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
