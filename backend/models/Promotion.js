const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  code: {
    type: String,
    unique: true,
    sparse: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed_amount', 'buy_x_get_y', 'free_shipping'],
    required: true
  },
  value: {
    type: Number,
    required: function() { return this.type !== 'free_shipping' && this.type !== 'buy_x_get_y'; }
  },
  buyQuantity: {
    type: Number,
    required: function() { return this.type === 'buy_x_get_y'; }
  },
  getQuantity: {
    type: Number,
    required: function() { return this.type === 'buy_x_get_y'; }
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  applicableTo: {
    type: String,
    enum: ['all', 'categories', 'products'],
    default: 'all'
  },
  categories: [String],
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  minPurchaseAmount: {
    type: Number,
    default: 0
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usageCount: {
    type: Number,
    default: 0
  },
  bannerImage: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Promotion', promotionSchema);
