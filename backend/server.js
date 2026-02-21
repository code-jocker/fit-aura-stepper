const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const connectDB = require('./config/db');
const { swaggerUi, specs } = require('./config/swagger');

// Models (Early load to prevent issues)
const Product = require('./models/Product');
const Category = require('./models/Category');

dotenv.config();

const app = express();

// Sitemap and Robots.txt are served as static files in production
// The dynamic generation caused timeouts and errors for Googlebot
// See frontend/public/sitemap.xml and frontend/public/robots.txt

// Domain Redirection Middleware (Force mbabazi-closet.onrender.com)
app.use((req, res, next) => {
  const host = req.get('host');
  const targetHost = 'mbabazi-closet.onrender.com';
  
  if (process.env.NODE_ENV === 'production' && host && host.includes('fit-aura-steppers.onrender.com')) {
    return res.redirect(301, `https://${targetHost}${req.originalUrl}`);
  }
  next();
});

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

// Validate critical environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName] && process.env.NODE_ENV === 'production') {
    console.warn(`⚠️ Warning: ${varName} is not defined in environment variables`);
  }
});

// Flutterwave Webhook (Must be before dbCheckMiddleware if you want it to always work)
// Note: We use the router directly to handle the specific path
app.use('/api/payments', require('./routes/payments'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, // Increase to 2000 requests per window
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// Database connection check middleware for API routes
const dbCheckMiddleware = (req, res, next) => {
  // Allow health check, sitemap, and flutterwave webhook even if DB is down
  if (
    req.path === '/health' || 
    req.path === '/sitemap.xml' || 
    req.path === '/api/sitemap.xml' || 
    req.path === '/payments/webhook/flutterwave'
  ) {
    return next();
  }
  
  const state = mongoose.connection.readyState;
  if (state !== 1) {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting',
    };
    return res.status(503).json({
      message: `Database is ${states[state] || 'unknown'}. Please ensure your IP is whitelisted in MongoDB Atlas (0.0.0.0/0).`,
      status: 'error',
      dbStatus: state
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
// Apply dbCheckMiddleware to all /api routes except health check
app.use('/api', dbCheckMiddleware);

const registerRoute = (path, modulePath) => {
  try {
    app.use(path, require(modulePath));
    console.log(`✅ Route loaded: ${path}`);
  } catch (err) {
    console.error(`❌ Error loading route ${path}:`, err.message);
  }
};

registerRoute('/api/products', './routes/products');
registerRoute('/api/categories', './routes/categories');
registerRoute('/api/auth', './routes/auth');
registerRoute('/api/user', './routes/user');
registerRoute('/api/orders', './routes/orders');
registerRoute('/api/subscribe', './routes/subscribe');
registerRoute('/api/testimonials', './routes/testimonials');
registerRoute('/api/reviews', './routes/reviews');
registerRoute('/api/chatbot', './routes/chatbot');
registerRoute('/api/contact', './routes/contact');
registerRoute('/api/promotions', './routes/promotions');
registerRoute('/api/messages', './routes/messages');

// Catch-all for unmatched /api routes
app.use('/api/*', (req, res) => {
  console.warn(`⚠️ Unmatched API request: ${req.method} ${req.originalUrl}`);
  res.status(400).json({
    message: 'Invalid API endpoint',
    error: 'Bad Request'
  });
});

// Serve static assets in production
const frontendBuildPath = path.resolve(__dirname, '..', 'frontend', 'build');
console.log('Static assets path:', frontendBuildPath);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(frontendBuildPath));

  app.get('*', (req, res) => {
    // Only handle non-API routes
    if (!req.path.startsWith('/api')) {
      const indexPath = path.join(frontendBuildPath, 'index.html');
      // Explicitly allow indexing for the main pages
      res.header('X-Robots-Tag', 'index, follow');
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

const jwt = require('jsonwebtoken');

// WebSocket events
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: Token required"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

io.on('connection', (socket) => {
  console.log('🟢 User connected:', socket.user.id);
  
  // Join user's personal room
  socket.join(socket.user.id);

  // If user is admin, join admin room
  if (socket.user.role === 'admin') {
    socket.join('admin_room');
  }
  
  socket.on('disconnect', () => {
    console.log('🔴 User disconnected:', socket.user.id);
  });
  
  // Send message
  socket.on('send_message', async (data) => {
    const { receiverId, content, type } = data;
    const Message = require('./models/Message');
    const User = require('./models/User');

    try {
      let finalReceiverId = receiverId;

      // Handle sending to admin
      if (receiverId === 'admin') {
        const admin = await User.findOne({ role: 'admin' });
        if (admin) {
          finalReceiverId = admin._id.toString();
        } else {
          return; 
        }
      }

      const message = new Message({
        senderId: socket.user.id,
        receiverId: finalReceiverId,
        content,
        type: type || 'chat',
        isRead: false
      });
      await message.save();
      
      const populatedMessage = await message.populate('senderId receiverId', 'name role email');

      // Emit to receiver's room
      io.to(finalReceiverId).emit('receive_message', populatedMessage);
      
      // Also emit back to sender (for confirmation/UI update)
      io.to(socket.user.id).emit('receive_message', populatedMessage);

      // If sending to admin, also emit to admin_room
      if (receiverId === 'admin') {
        io.to('admin_room').emit('receive_message', populatedMessage);
        io.to('admin_room').emit('update_conversations', populatedMessage);
      } else {
        // If admin sending to user, also update admin conversations to show latest message
        // This ensures all admins see the sent message in their conversation list
        io.to('admin_room').emit('update_conversations', populatedMessage);
      }

    } catch (err) {
      console.error('Message save error:', err);
    }
  });

  // Mark messages as read
  socket.on('mark_read', async (data) => {
    const { senderId, receiverId } = data; // senderId is the person who sent the messages we are reading
    const Message = require('./models/Message');
    const User = require('./models/User');
    
    try {
      // Update all unread messages from senderId to receiverId (socket.user.id)
      
      let actualReceiverId = socket.user.id;
      let actualSenderId = senderId;

      // Handle 'admin' sender (user marking admin messages as read)
      if (senderId === 'admin') {
        const admin = await User.findOne({ role: 'admin' });
        if (admin) {
          actualSenderId = admin._id;
        }
      }
      
      // If the user is admin reading user messages, receiverId passed might be 'admin'
      // But actualReceiverId is the admin's personal ID (socket.user.id)
      
      await Message.updateMany(
        { senderId: actualSenderId, receiverId: actualReceiverId, isRead: false },
        { $set: { isRead: true } }
      );
      
      // Notify the sender that their messages were read
      if (senderId === 'admin') {
         // If sender was 'admin' (virtual), notify all admins
         io.to('admin_room').emit('messages_read', { by: socket.user.id });
      } else {
         io.to(senderId).emit('messages_read', { by: socket.user.id });
      }
      
      // If admin read it, update admin conversations (clear unread count)
      if (socket.user.role === 'admin') {
         // Broadcast to all admins that this conversation is read
         io.to('admin_room').emit('update_conversations', { 
           senderId: { _id: senderId }, // To match structure used in frontend
           isReadUpdate: true 
         });
      }
    } catch (err) {
      console.error('Mark read error:', err);
    }
  });
  
  // Stock updates
  socket.on('check_stock', (productId) => {
    // Emit stock updates in real-time
  });
});

const startServer = async () => {
  const PORT = process.env.PORT || 5000;
  
  // 1. Start Express server immediately to satisfy Render's port binding requirement
  server.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health\n`);
    
    // 2. Connect to Database in the background
    connectDB().catch(err => {
      console.error('❌ Background Database Connection Error:', err.message);
      if (process.env.NODE_ENV === 'production') {
        console.warn('⚠️ Server is running but database connection failed. Some features will be unavailable.');
      }
    });
  });
};

startServer();

module.exports = { app, io };
