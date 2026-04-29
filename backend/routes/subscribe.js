const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');

// Subscribe to newsletter
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }
    
    let subscription = await Subscription.findOne({ email });
    if (subscription) {
      subscription.isActive = true;
      await subscription.save();
      return res.json({ message: 'Already subscribed' });
    }
    
    subscription = new Subscription({ email });
    await subscription.save();
    
    // TODO: Send welcome email
    
    res.status(201).json({ message: 'Subscribed successfully', email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Unsubscribe
router.post('/unsubscribe', async (req, res) => {
  try {
    const { email } = req.body;
    await Subscription.findOneAndUpdate({ email }, { isActive: false });
    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
