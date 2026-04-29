const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const emailToPromote = 'princeshyakaclever@gmail.com';

const promote = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOneAndUpdate(
      { email: emailToPromote.toLowerCase() },
      { role: 'admin' },
      { new: true }
    );

    if (user) {
      console.log(`Success! ${emailToPromote} is now an admin.`);
    } else {
      console.log(`User with email ${emailToPromote} not found. Make sure they have registered first.`);
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

promote();
