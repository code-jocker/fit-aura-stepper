
const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

console.log('Starting script...');
dotenv.config();
console.log('Environment loaded');

const checkAdmin = async () => {
  try {
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is missing');
        // Try hardcoded connection string if env fails? No, that's bad practice.
        // Assume .env is loaded correctly.
        process.exit(1);
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      console.log(`Admin user found: ${admin.email} (ID: ${admin._id})`);
    } else {
      console.log('No admin user found!');
    }
  } catch (error) {
    console.error('Error checking admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

checkAdmin();
