const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth } = require('../middleware/auth');

// Get all products with filtering and search
router.get('/', async (req, res) => {
  try {
    const { category, sale, featured, isNew, comingSoon, limit = 10, sort = '-createdAt', search } = req.query;
    
    let filter = { isPublished: true };
    if (comingSoon === 'true') {
      filter = { isPublished: false };
    } else if (req.query.adminView === 'true') {
      delete filter.isPublished;
    }

    if (category) filter.category = category;
    if (sale) filter.isSale = true;
    if (featured) filter.isFeatured = true;
    if (isNew) filter.isNew = true;
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(filter)
      .limit(parseInt(limit))
      .sort(sort);
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product (ADMIN)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized - Admin only' });
    }
    
    const { name, brand, category, price, salePrice, description, images, sizes, colors, stock, isFeatured, isNew, isPublished } = req.body;

    // Validation
    if (!name || !brand || !category || !price || !description || !images || !images.length) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const product = new Product({
      name,
      brand,
      category,
      price,
      salePrice,
      description,
      images,
      sizes: sizes || [],
      colors: colors || [],
      stock: stock || 0,
      isFeatured: isFeatured || false,
      isNew: isNew !== undefined ? isNew : true,
      isPublished: isPublished !== undefined ? isPublished : true
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product (ADMIN)
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized - Admin only' });
    }

    const { name, brand, category, price, salePrice, description, images, sizes, colors, stock, rating, reviewsCount, isFeatured, isNew, isPublished } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields
    if (name) product.name = name;
    if (brand) product.brand = brand;
    if (category) product.category = category;
    if (price) product.price = price;
    if (salePrice !== undefined) product.salePrice = salePrice;
    if (description) product.description = description;
    if (images) product.images = images;
    if (sizes) product.sizes = sizes;
    if (colors) product.colors = colors;
    if (stock !== undefined) product.stock = stock;
    if (rating !== undefined) product.rating = rating;
    if (reviewsCount !== undefined) product.reviewsCount = reviewsCount;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (isNew !== undefined) product.isNew = isNew;
    if (isPublished !== undefined) product.isPublished = isPublished;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product (ADMIN)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized - Admin only' });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
