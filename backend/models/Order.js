const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  customerName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    price: Number,
    size: String,
    color: String
  }],
  subtotal: {
    type: Number,
    required: true
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['momo', 'airtel', 'card', 'cash'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  deliveryAddress: {
    type: String,
    required: true
  },
  location: {
    lat: Number,
    lng: Number
  },
  deliveryPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  assignedAt: Date,
  deliveredAt: Date,
  phone: String,
  notes: String,
  adminNote: String,
  deliveryNote: String,
  transactionId: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
