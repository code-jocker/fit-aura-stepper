const mongoose = require('mongoose');

const connectDB = async (retryCount = 5) => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      console.error('❌ MONGODB_URI is not defined in environment variables');
      return;
    }
    
    // Disable buffering so that we get immediate errors instead of timeouts
    mongoose.set('bufferCommands', false);
    
    console.log(`⏳ Connecting to MongoDB Atlas (Attempt ${6 - retryCount}/5)...`);
    const conn = await mongoose.connect(mongoUri, {
      autoIndex: true,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    if (retryCount > 0) {
      console.log(`🔄 Retrying connection in 5 seconds... (${retryCount} retries left)`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return connectDB(retryCount - 1);
    }

    console.log('ℹ️  ACTION REQUIRED: Ensure your IP is whitelisted in MongoDB Atlas (0.0.0.0/0 for Render).');
    console.log('🔗 Whitelist Guide: https://www.mongodb.com/docs/atlas/security-whitelist/');
    throw error; // Rethrow to let server.js handle it
  }
};

module.exports = connectDB;
