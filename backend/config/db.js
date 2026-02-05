const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      return;
    }
    
    // Disable buffering so that we get immediate errors instead of timeouts
    mongoose.set('bufferCommands', false);
    
    console.log('⏳ Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      autoIndex: true,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('ℹ️  ACTION REQUIRED: Ensure your IP is whitelisted in MongoDB Atlas (0.0.0.0/0 for Render).');
    throw error; // Rethrow to let server.js handle it
  }
};

module.exports = connectDB;
