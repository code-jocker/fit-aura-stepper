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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  app.use('/api/chatbot', require('./routes/chatbot'));
  app.use('/api/contact', require('./routes/contact'));
  console.log('✅ All routes loaded successfully');

  // Catch-all for unmatched /api routes
  app.use('/api/*', (req, res) => {
    console.warn(`⚠️ Unmatched API request: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
      message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
      error: 'Not Found'
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

const PORT = process.env.PORT || 5000;

// Connect to Database BEFORE starting server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health\n`);
  });
}).catch(err => {
  console.error('❌ Critical Error: Failed to connect to database on startup');
  console.error(err);
  // Still start the server so the frontend can show a meaningful error message
  server.listen(PORT, () => {
    console.log(`\n⚠️  Server running in degraded mode (No Database) on port ${PORT}`);
  });
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
