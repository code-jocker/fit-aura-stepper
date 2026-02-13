const express = require('express');
const router = express.Router();
const Promotion = require('../models/Promotion');
const { adminAuth } = require('../middleware/auth');

// Get all promotions (Admin)
router.get('/', async (req, res) => {
  try {
    const { activeOnly } = req.query;
    let filter = {};
    if (activeOnly === 'true') {
      filter = { 
        isActive: true, 
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() }
      };
    }
    const promotions = await Promotion.find(filter).sort({ createdAt: -1 });
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single promotion
router.get('/:id', async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) return res.status(404).json({ message: 'Promotion not found' });
    res.json(promotion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create promotion (Admin)
router.post('/', adminAuth, async (req, res) => {
  try {
    const promotion = new Promotion(req.body);
    await promotion.save();
    res.status(201).json(promotion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update promotion (Admin)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!promotion) return res.status(404).json({ message: 'Promotion not found' });
    res.json(promotion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete promotion (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) return res.status(404).json({ message: 'Promotion not found' });
    res.json({ message: 'Promotion deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
