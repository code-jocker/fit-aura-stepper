const express = require('express');
const router = express.Router();
const { sendContactMessage } = require('../config/email');

// Handle contact form submission
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // In a real app, you might save this to a database too
    // For now, we'll just send an email to the admin
    await sendContactMessage(name, email, `${subject} (Phone: ${phone || 'N/A'}) \n\n ${message}`);
    
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

module.exports = router;
