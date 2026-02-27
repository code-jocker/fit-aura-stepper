const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { auth, adminAuth } = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');
const { validateProduct } = require('../middleware/validation');

// Image upload route (ADMIN)
router.post('/upload', adminAuth, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const urls = req.files.map(file => file.path);
    res.json({ urls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete image from Cloudinary (ADMIN)
router.post('/delete-image', adminAuth, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    // Extract public_id from Cloudinary URL
    // Format: https://res.cloudinary.com/cloud_name/image/upload/v12345678/folder/public_id.jpg
    const parts = url.split('/');
    const folderAndFile = parts.slice(parts.indexOf('upload') + 2).join('/');
    const publicId = folderAndFile.split('.')[0];

    await cloudinary.uploader.destroy(publicId);
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - brand
 *         - category
 *         - price
 *         - description
 *         - images
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the product
 *         name:
 *           type: string
 *         brand:
 *           type: string
 *         category:
 *           type: string
 *         subcategory:
 *           type: string
 *         audience:
 *           type: string
 *           enum: [men, women, kids, unisex]
 *         price:
 *           type: number
 *         salePrice:
 *           type: number
 *         description:
 *           type: string
 *         shortDescription:
 *           type: string
 *         sku:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         sizes:
 *           type: array
 *           items:
 *             type: string
 *         colors:
 *           type: array
 *           items:
 *             type: string
 *         stock:
 *           type: number
 *         status:
 *           type: string
 *           enum: [draft, published, out_of_stock]
 *         isFeatured:
 *           type: boolean
 *         isNew:
 *           type: boolean
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management API
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Returns the list of all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:            type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
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
    
    const limitValue = limit === 'all' ? 0 : parseInt(limit);
    
    const products = await Product.find(filter)
      .limit(limitValue)
      .sort(sort);
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 */
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

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Not authorized
 */
// Create product (ADMIN)
router.post('/', adminAuth, validateProduct, async (req, res) => {
  try {
    const { 
      name, brand, category, subcategory, audience, price, salePrice, 
      description, shortDescription, sku, tags, images, sizes, colors, 
      variants, weight, dimensions, stock, lowStockThreshold, 
      isFeatured, isNew, isPublished, metaTitle, metaDescription, slug, status 
    } = req.body;

    // Validation - use processed images from middleware
    if (!name || !brand || !category || !price || !description) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Images should already be validated and processed by middleware
    const productImages = req.body.images || [];
    if (productImages.length === 0) {
      return res.status(400).json({ message: 'At least one product image is required' });
    }

    // Auto-generate SKU if not provided or empty
    let productSku = sku;
    if (!productSku || productSku === '') {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substring(2, 8);
      productSku = `SKU-${timestamp}-${random}`.toUpperCase();
    }

    const product = new Product({
      name,
      brand,
      category,
      subcategory,
      audience: audience || 'unisex',
      price,
      salePrice,
      description,
      shortDescription,
      sku: productSku,
      tags: tags || [],
      images: productImages,
      sizes: sizes || [],
      colors: colors || [],
      variants: variants || [],
      weight,
      dimensions,
      stock: stock || 0,
      lowStockThreshold: lowStockThreshold || 5,
      isFeatured: isFeatured || false,
      isNew: isNew !== undefined ? isNew : true,
      isPublished: isPublished !== undefined ? isPublished : true,
      metaTitle,
      metaDescription,
      slug,
      status: status || 'published'
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update product (ADMIN)
router.put('/:id', adminAuth, validateProduct, async (req, res) => {
  try {
    const { 
      name, brand, category, subcategory, audience, price, salePrice, 
      description, shortDescription, sku, tags, images, sizes, colors, 
      variants, weight, dimensions, stock, lowStockThreshold, 
      isFeatured, isNew, isPublished, metaTitle, metaDescription, slug, status 
    } = req.body;

    // Find product and update
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields if provided
    if (name) product.name = name;
    if (brand) product.brand = brand;
    if (category) product.category = category;
    if (subcategory !== undefined) product.subcategory = subcategory;
    if (audience) product.audience = audience;
    if (price !== undefined) product.price = price;
    if (salePrice !== undefined) product.salePrice = salePrice;
    if (description) product.description = description;
    if (shortDescription !== undefined) product.shortDescription = shortDescription;
    // Handle SKU update - auto-generate if empty
    if (sku !== undefined) {
      if (sku === '') {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        product.sku = `SKU-${timestamp}-${random}`.toUpperCase();
      } else {
        product.sku = sku;
      }
    }
    if (tags) product.tags = tags;
    if (images) product.images = images;
    if (sizes) product.sizes = sizes;
    if (colors) product.colors = colors;
    if (variants) product.variants = variants;
    if (weight !== undefined) product.weight = weight;
    if (dimensions) product.dimensions = dimensions;
    if (stock !== undefined) product.stock = stock;
    if (lowStockThreshold !== undefined) product.lowStockThreshold = lowStockThreshold;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (isNew !== undefined) product.isNew = isNew;
    if (isPublished !== undefined) product.isPublished = isPublished;
    if (metaTitle !== undefined) product.metaTitle = metaTitle;
    if (metaDescription !== undefined) product.metaDescription = metaDescription;
    if (slug !== undefined) product.slug = slug;
    if (status) product.status = status;

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete product (ADMIN)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
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
