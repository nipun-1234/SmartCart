// Vercel serverless endpoint. Static pages are served directly by Vercel.
require('dotenv').config();
const { createApp } = require('../src/app');

module.exports = createApp({ serveStatic: false });
