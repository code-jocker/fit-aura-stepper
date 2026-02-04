const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');

// Get all testimonials
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create testimonial (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, location, quote, rating, image } = req.body;
    
    const testimonial = new Testimonial({
      name,
      location,
      quote,
      rating,
      image
    });
    
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
