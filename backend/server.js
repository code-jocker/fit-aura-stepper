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

dotenv.config();

const app = express();

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
  // Allow health check and flutterwave webhook even if DB is down
  if (req.path === '/health' || req.path === '/payments/webhook/flutterwave') {
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
try {
  // Apply dbCheckMiddleware to all /api routes except health check
  app.use('/api', dbCheckMiddleware);
  
  app.use('/api/products', require('./routes/products'));
  app.use('/api/categories', require('./routes/categories'));
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/user', require('./routes/user'));
  app.use('/api/orders', require('./routes/orders'));
  app.use('/api/subscribe', require('./routes/subscribe'));
  app.use('/api/testimonials', require('./routes/testimonials'));
  app.use('/api/reviews', require('./routes/reviews'));
  app.use('/api/chatbot', require('./routes/chatbot'));
  app.use('/api/contact', require('./routes/contact'));
  app.use('/api/settings', require('./routes/settings'));
  app.use('/api/promotions', require('./routes/promotions'));
  app.use('/api/messages', require('./routes/messages'));
  
  // Dynamic Sitemap Route
  app.get('/api/sitemap.xml', async (req, res) => {
    try {
      const Product = require('./models/Product');
      const Category = require('./models/Category');
      
      const products = await Product.find({ isPublished: true }).select('_id updatedAt');
      const categories = await Category.find().select('name updatedAt');
      
      const baseUrl = 'https://mbabazi-closet.onrender.com';
      
      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
      
      // Static Pages
      const staticPages = [
        { url: '', priority: '1.0', changefreq: 'daily' },
        { url: '/products', priority: '0.9', changefreq: 'weekly' },
        { url: '/categories', priority: '0.8', changefreq: 'weekly' },
        { url: '/about', priority: '0.7', changefreq: 'monthly' },
        { url: '/contact', priority: '0.7', changefreq: 'monthly' },
        { url: '/track-order', priority: '0.5', changefreq: 'monthly' },
        { url: '/portfolio', priority: '0.6', changefreq: 'monthly' }
      ];
      
      staticPages.forEach(page => {
        xml += `  <url>\n    <loc>${baseUrl}${page.url}</loc>\n    <priority>${page.priority}</priority>\n    <changefreq>${page.changefreq}</changefreq>\n  </url>\n`;
      });
      
      // Category Pages
      categories.forEach(cat => {
        xml += `  <url>\n    <loc>${baseUrl}/products?category=${encodeURIComponent(cat.name)}</loc>\n    <priority>0.8</priority>\n    <changefreq>weekly</changefreq>\n  </url>\n`;
      });
      
      // Product Pages
      products.forEach(prod => {
        xml += `  <url>\n    <loc>${baseUrl}/product/${prod._id}</loc>\n    <lastmod>${prod.updatedAt.toISOString().split('T')[0]}</lastmod>\n    <priority>0.8</priority>\n    <changefreq>weekly</changefreq>\n  </url>\n`;
      });
      
      xml += '</urlset>';
      
      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (err) {
      console.error('Sitemap Generation Error:', err);
      res.status(500).end();
    }
  });

  // Robots.txt Route
  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /delivery\nDisallow: /login\nDisallow: /register\nDisallow: /checkout\nDisallow: /order-confirmation\nDisallow: /profile\n\nUser-agent: Googlebot\nAllow: /\nDisallow: /admin\nDisallow: /delivery\nDisallow: /login\nDisallow: /register\nDisallow: /checkout\nDisallow: /order-confirmation\nDisallow: /profile\n\nSitemap: https://mbabazi-closet.onrender.com/api/sitemap.xml`);
  });

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
