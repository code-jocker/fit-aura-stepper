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
    // Handle empty code for ad_only or auto-generated promos
    if (req.body.code === '') {
      delete req.body.code;
    }
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
    if (req.body.code === '') {
      delete req.body.code;
    }
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

// Validate promotion code (Customer)
router.post('/validate', async (req, res) => {
  try {
    const { code, items } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    const promotion = await Promotion.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    });

    if (!promotion) {
      return res.status(404).json({ message: 'Invalid or expired coupon code' });
    }

    // Check usage limit
    if (promotion.usageLimit !== null && promotion.usageCount >= promotion.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    // Check min purchase amount
    const subtotal = items.reduce((sum, item) => sum + ((item.salePrice || item.price) * item.quantity), 0);
    if (subtotal < promotion.minPurchaseAmount) {
      return res.status(400).json({ message: `Minimum purchase of ${promotion.minPurchaseAmount.toLocaleString()} RWF required` });
    }

    // Check if it's applicable to items
    let discount = 0;
    let applicableItemsCount = 0;

    if (promotion.applicableTo === 'all') {
      applicableItemsCount = items.length;
    } else if (promotion.applicableTo === 'categories') {
      applicableItemsCount = items.filter(item => 
        promotion.categories.includes(item.category)
      ).length;
    } else if (promotion.applicableTo === 'products') {
      applicableItemsCount = items.filter(item => 
        promotion.products.includes(item.productId)
      ).length;
    }

    if (applicableItemsCount === 0) {
      return res.status(400).json({ message: 'Coupon code not applicable to items in cart' });
    }

    // Calculate discount for applicable items
    items.forEach(item => {
      let isApplicable = false;
      if (promotion.applicableTo === 'all') isApplicable = true;
      else if (promotion.applicableTo === 'categories') isApplicable = promotion.categories.includes(item.category);
      else if (promotion.applicableTo === 'products') isApplicable = promotion.products.includes(item.productId);

      if (isApplicable) {
        const itemTotal = (item.salePrice || item.price) * item.quantity;
        if (promotion.type === 'percentage') {
          discount += (itemTotal * promotion.value) / 100;
        } else if (promotion.type === 'fixed_amount') {
          // If fixed amount, we apply it proportionally or once per order? 
          // Usually fixed amount is once per order if applicable.
          // Let's handle it as once per order for simplicity now.
        }
      }
    });

    if (promotion.type === 'fixed_amount') {
      discount = promotion.value;
    }

    res.json({
      valid: true,
      promotion: {
        _id: promotion._id,
        code: promotion.code,
        type: promotion.type,
        value: promotion.value,
        title: promotion.title
      },
      discount: Math.round(discount)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
