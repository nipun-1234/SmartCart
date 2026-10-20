const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const couponRoutes = require('./routes/couponRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { store } = require('./db/store');

function createApp({ serveStatic = false } = {}) {
  const app = express();
  app.disable('x-powered-by');

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false
    })
  );

  app.use(cookieParser());
  app.use(express.json({ limit: '64kb' }));
  app.use(express.urlencoded({ extended: true, limit: '64kb' }));

  // Rate limiter for authentication endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 60,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message: 'Too many authentication attempts. Please try again later.' }
  });

  // Health checks
  app.get(['/healthz', '/api/healthz'], (_req, res) => {
    res.json({
      status: 'ok',
      service: 'SmartCart API',
      timestamp: new Date().toISOString()
    });
  });

  // Categories direct endpoint
  app.get('/api/categories', async (_req, res) => {
    try {
      const categories = await store.getCategories();
      res.json({ success: true, categories });
    } catch (_err) {
      res.status(500).json({ success: false, message: 'Could not load categories.' });
    }
  });

  // API Routes
  app.use('/api/auth', authLimiter, authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/coupons', couponRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/chat', chatRoutes);

  // Direct root compatibility aliases for forms pointing to /login and /register
  app.post('/login', authLimiter, (req, res, next) => {
    req.url = '/login';
    authRoutes(req, res, next);
  });

  app.post('/register', authLimiter, (req, res, next) => {
    req.url = '/register';
    authRoutes(req, res, next);
  });

  // Static files
  if (serveStatic) {
    app.use(express.static(path.join(__dirname, '../public')));
    app.get('/', (_req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));
    app.get('/products', (_req, res) => res.sendFile(path.join(__dirname, '../public/products.html')));
    app.get('/admin', (_req, res) => res.sendFile(path.join(__dirname, '../public/admin.html')));
    app.get('/login', (_req, res) => res.sendFile(path.join(__dirname, '../public/login.html')));
    app.get('/signup', (_req, res) => res.sendFile(path.join(__dirname, '../public/signup.html')));
  }

  // 404 handler for API routes
  app.use('/api', (_req, res) => res.status(404).json({ success: false, message: 'API route not found' }));

  if (serveStatic) {
    app.use((_req, res) => res.status(404).sendFile(path.join(__dirname, '../public/index.html')));
  } else {
    app.use((_req, res) => res.status(404).json({ success: false, message: 'Not found' }));
  }

  // Error handler
  app.use((error, _req, res, _next) => {
    console.error('API Error:', error.message);
    res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Request could not be completed.'
    });
  });

  return app;
}

module.exports = { createApp };
