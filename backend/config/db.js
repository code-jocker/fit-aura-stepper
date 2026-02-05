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
    // Don't exit process in production to allow the server to stay alive and serve the static frontend
    if (process.env.NODE_ENV !== 'production') {
      // In development, it's often better to exit so the developer notices the error
      // process.exit(1); 
    }
  }
};

module.exports = connectDB;
