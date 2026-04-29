
const mongoose = require('mongoose');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

console.log('Starting script...');

const getTokens = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Get/Create Admin
    const adminEmail = 'admin@fit-aura.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
        console.error('Admin not found (run setup-admin.js first)');
        process.exit(1);
    }

    // 2. Get/Create Customer
    const customerEmail = 'customer@test.com';
    let customer = await User.findOne({ email: customerEmail });
    if (!customer) {
        customer = new User({
            name: 'Test Customer',
            email: customerEmail,
            password: 'password123', // In real app this should be hashed
            role: 'customer'
        });
        await customer.save();
        console.log('Created test customer');
    }

    // Generate Tokens
    const adminToken = jwt.sign(
        { id: admin._id, role: admin.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    const customerToken = jwt.sign(
        { id: customer._id, role: customer.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

    console.log('--- TOKENS ---');
    console.log('ADMIN_TOKEN=' + adminToken);
    console.log('CUSTOMER_TOKEN=' + customerToken);
    console.log('--- END TOKENS ---');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

getTokens();
