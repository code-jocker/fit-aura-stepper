const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');

// Get all reviews (for admin)
router.get('/all', auth, async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('product', 'name images')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a review
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { productId, rating, comment, userName } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let finalUserName = userName || 'Anonymous';
    let userId = null;

    if (req.user) {
      userId = req.user.id;
      const user = await User.findById(userId);
      if (user) {
        finalUserName = user.name;
      }
    }

    const review = new Review({
      product: productId,
      user: userId,
      userName: finalUserName,
      rating,
      comment,
      isVerified: !!userId // Basic verification logic
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a review (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
