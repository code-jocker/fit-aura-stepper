const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Database connection with improved error handling
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fit-aura-steppers';
    
    // Disable buffering so that we get immediate errors instead of timeouts
    mongoose.set('bufferCommands', false);
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('ℹ️  Make sure MongoDB is running or MongoDB Atlas is accessible');
    // Don't crash - allow server to run without DB initially
  }
};

connectDB();

// Routes
try {
  app.use('/api/products', require('./routes/products'));
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/user', require('./routes/user'));
  app.use('/api/orders', require('./routes/orders'));
  app.use('/api/payments', require('./routes/payments'));
  app.use('/api/subscribe', require('./routes/subscribe'));
  app.use('/api/testimonials', require('./routes/testimonials'));
  app.use('/api/chatbot', require('./routes/chatbot'));
  app.use('/api/contact', require('./routes/contact'));
  console.log('✅ All routes loaded successfully');
} catch (err) {
  console.error('❌ Error loading routes:', err.message);
}

// Health check
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'Server is running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production' || true) {
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
    }
  });
}

// WebSocket events
io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.id);
  });
  
  // Support chat
  socket.on('support_message', (message) => {
    console.log('💬 Support message:', message);
    io.emit('support_message', message);
  });
  
  // Stock updates
  socket.on('check_stock', (productId) => {
    // Emit stock updates in real-time
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📊 API Health: http://localhost:${PORT}/api/health\n`);
});

module.exports = app;

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please kill the process or change PORT.`);
  } else {
    console.error('❌ Server error:', err);
  }
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

module.exports = { app, io };
