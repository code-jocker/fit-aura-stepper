const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    brand: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    subcategory: {
      type: String
    },
    audience: {
      type: String,
      enum: ['men', 'women', 'kids', 'unisex'],
      default: 'unisex'
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    salePrice: {
      type: Number,
      min: 0
    },
    discountPercentage: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      required: true
    },
    shortDescription: {
      type: String
    },
    sku: {
      type: String,
      unique: true,
      sparse: true
    },
    tags: [String],
    images: [{
      type: String,
      required: true
    }],
    sizes: [String],
    colors: [String],
    variants: [
      {
        size: String,
        color: String,
        price: Number,
        stock: Number
      }
    ],
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    stockStatus: {
      type: String,
      enum: ['In stock', 'Out of stock', 'Low stock'],
      default: 'In stock'
    },
    lowStockThreshold: {
      type: Number,
      default: 5
    },
    isNew: {
      type: Boolean,
      default: true
    },
    isSale: {
      type: Boolean,
      default: false
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    slug: {
      type: String,
      unique: true,
      sparse: true
    },
    metaTitle: String,
    metaDescription: String,
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'published'
    },
    publishDate: {
      type: Date
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    suppressReservedKeysWarning: true
  }
);

// Pre-save middleware to calculate discount percentage and stock status
productSchema.pre('save', function(next) {
  // Auto-generate SKU if not provided or empty
  if (!this.sku || this.sku === '') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    this.sku = `SKU-${timestamp}-${random}`.toUpperCase();
  }
  
  if (this.price && this.salePrice && this.salePrice < this.price) {
    this.discountPercentage = Math.round(((this.price - this.salePrice) / this.price) * 100);
    this.isSale = true;
  } else {
    this.discountPercentage = 0;
    this.isSale = false;
  }
  
  if (this.stock <= 0) {
    this.stockStatus = 'Out of stock';
  } else if (this.stock <= this.lowStockThreshold) {
    this.stockStatus = 'Low stock';
  } else {
    this.stockStatus = 'In stock';
  }
  
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().split(' ').join('-');
  }
  
  next();
});

module.exports = mongoose.model('Product', productSchema);
