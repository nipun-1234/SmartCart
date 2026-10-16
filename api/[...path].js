// Vercel catch-all for API routes below /api/*; pages remain static files.
require('dotenv').config();
const { createApp } = require('../src/app');

module.exports = createApp({ serveStatic: false });
