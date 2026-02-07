const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const connectDB = require('./config/db');

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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Flutterwave Webhook (Must be before dbCheckMiddleware if you want it to always work)
app.post('/api/payments/webhook/flutterwave', express.json(), require('./routes/payments'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Increase to 2000 requests per window
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// Database connection
// Removed redundant call - handled by server.listen wrapper below

// Database connection check middleware for API routes
const dbCheckMiddleware = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: 'Database connection is not established. Please ensure your IP is whitelisted in MongoDB Atlas (0.0.0.0/0).',
      status: 'error',
      dbStatus: mongoose.connection.readyState
    });
  }
  next();
};

// Health check (before middleware so it's always accessible)
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'Server is running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Routes
try {
  // Apply dbCheckMiddleware to all /api routes except health check
  app.use('/api', dbCheckMiddleware);
  
  app.use('/api/products', require('./routes/products'));
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/user', require('./routes/user'));
  app.use('/api/orders', require('./routes/orders'));
  app.use('/api/payments', require('./routes/payments'));
  app.use('/api/subscribe', require('./routes/subscribe'));
  app.use('/api/testimonials', require('./routes/testimonials'));
  app.use('/api/reviews', require('./routes/reviews'));
  app.use('/api/chatbot', require('./routes/chatbot'));
  app.use('/api/contact', require('./routes/contact'));
  console.log('✅ All routes loaded successfully');

  // Catch-all for unmatched /api routes
  app.use('/api/*', (req, res) => {
    console.warn(`⚠️ Unmatched API request: ${req.method} ${req.originalUrl}`);
    res.status(400).json({
      message: 'Invalid API endpoint',
      error: 'Bad Request'
    });
  });
} catch (err) {
  console.error('❌ Error loading routes:', err.message);
}

// Serve static assets in production
const frontendBuildPath = path.resolve(__dirname, '..', 'frontend', 'build');
console.log('Static assets path:', frontendBuildPath);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(frontendBuildPath));

  app.get('*', (req, res) => {
    // Only handle non-API routes
    if (!req.path.startsWith('/api')) {
      const indexPath = path.join(frontendBuildPath, 'index.html');
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error('Error sending index.html:', err);
          res.status(500).send('Frontend build not found. Please ensure the build command succeeded.');
        }
      });
    }
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong on the server!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

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

const startServer = async () => {
  const PORT = process.env.PORT || 5000;
  try {
    // 1. Connect to Database FIRST
    await connectDB();
    
    // 2. Start Express server
    server.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📊 API Health: http://localhost:${PORT}/api/health\n`);
    });
  } catch (err) {
    console.error('❌ Critical Startup Error:', err.message);
    
    // Exit process on database connection failure in production
    if (process.env.NODE_ENV === 'production') {
      console.error('💥 Production shutdown: Database must be available.');
      process.exit(1);
    } else {
      // In development, start server in degraded mode for debugging
      server.listen(PORT, () => {
        console.log(`\n⚠️  Server running in DEGRADED MODE (No DB) on port ${PORT}`);
      });
    }
  }
};

startServer();

module.exports = { app, io };
