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
      enum: ['shoes', 'clothes', 'accessories'],
      required: true
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
    description: {
      type: String,
      required: true
    },
    images: [{
      type: String,
      required: true
    }],
    sizes: [String],
    colors: [String],
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

module.exports = mongoose.model('Product', productSchema);
