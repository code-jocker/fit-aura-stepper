
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
  try {
    if (!process.env.MONGODB_URI) {
        console.error('MONGODB_URI is missing');
        process.exit(1);
    }
    
    // Increased connection timeout for robustness
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@fit-aura.com'; // More generic email
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
        console.log('Admin user already exists:', adminEmail);
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('Updated role to admin just in case.');
    } else {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const newAdmin = new User({
            name: 'Support Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });
        await newAdmin.save();
        console.log('Created new admin user:', adminEmail);
        console.log('Password: password123');
    }

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();
