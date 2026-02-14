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

// Sitemap Generation Helper
const generateSitemap = async (req, res) => {
  console.log(`🔍 Sitemap requested: ${req.url}`);
  let products = [];
  let categories = [];
  
  try {
    // Use maxTimeMS instead of timeout for Mongoose queries
    products = await Product.find({ isPublished: true }).select('_id updatedAt').maxTimeMS(5000).catch((e) => {
      console.warn('⚠️ Product fetch failed for sitemap:', e.message);
      return [];
    });
    categories = await Category.find().select('name updatedAt').maxTimeMS(5000).catch((e) => {
      console.warn('⚠️ Category fetch failed for sitemap:', e.message);
      return [];
    });
  } catch (err) {
    console.error('❌ Sitemap Data Error:', err.message);
  }

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
  if (categories && categories.length > 0) {
    categories.forEach(cat => {
      xml += `  <url>\n    <loc>${baseUrl}/products?category=${encodeURIComponent(cat.name)}</loc>\n    <priority>0.8</priority>\n    <changefreq>weekly</changefreq>\n  </url>\n`;
    });
  }
  
  // Product Pages
  if (products && products.length > 0) {
    products.forEach(prod => {
      const updatedAt = prod.updatedAt ? prod.updatedAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      xml += `  <url>\n    <loc>${baseUrl}/product/${prod._id}</loc>\n    <lastmod>${updatedAt}</lastmod>\n    <priority>0.8</priority>\n    <changefreq>weekly</changefreq>\n  </url>\n`;
    });
  }
  
  xml += '</urlset>';
  
  res.header('Content-Type', 'text/xml');
  res.header('X-Robots-Tag', 'index, follow');
  res.header('Cache-Control', 'public, max-age=0, must-revalidate');
  res.status(200).send(xml.trim());
};

// Robots.txt Route - FIRST to avoid any middleware/blocking
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.header('Cache-Control', 'public, max-age=0, must-revalidate');
  res.header('Vary', 'User-Agent');
  res.send('User-agent: *\r\nAllow: /\r\nAllow: /sitemap.xml\r\nDisallow: /admin\r\nDisallow: /delivery\r\nDisallow: /login\r\nDisallow: /register\r\nDisallow: /checkout\r\nDisallow: /order-confirmation\r\nDisallow: /profile\r\n\r\nSitemap: https://mbabazi-closet.onrender.com/sitemap.xml');
});

// Sitemap routes - also at the top
app.get('/sitemap.xml', generateSitemap);
app.get('/api/sitemap.xml', generateSitemap);

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
