const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() { return !this.googleId; } // Only required if not a Google user
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple null values
  },
  role: {
    type: String,
    enum: ['customer', 'admin', 'delivery'],
    default: 'customer'
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: 'Kigali'
  },
  phone: {
    type: String
  },
  avatar: {
    type: String
  },
  cart: [{
    productId: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    size: String,
    color: String
  }],
  addresses: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
