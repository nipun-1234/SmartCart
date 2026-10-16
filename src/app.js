const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

function createApp({ serveStatic = false } = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(express.json({ limit: '32kb' }));

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message: 'Too many attempts. Try again later.' }
  });

  app.get(['/healthz', '/api/healthz'], (_req, res) => res.json({ status: 'ok' }));

  // These legacy routes deliberately fail closed until real account storage and
  // secure session handling are added. Never report a demo login as successful.
  app.post(['/login', '/register', '/api/auth/login', '/api/auth/register'], authLimiter, (_req, res) => {
    res.status(501).json({
      success: false,
      message: 'Account services are not enabled yet. No account was created or authenticated.'
    });
  });

  if (serveStatic) {
    app.use(express.static(path.join(__dirname, '../public')));
    app.get('/', (_req, res) => res.sendFile(path.join(__dirname, '../public/index.html')));
  }

  app.use((_req, res) => res.status(404).json({ success: false, message: 'Not found' }));
  app.use((error, _req, res, _next) => {
    console.error('Request failed:', error.message);
    res.status(error.status || 500).json({ success: false, message: 'Request could not be completed.' });
  });

  return app;
}

module.exports = { createApp };
