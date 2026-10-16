require('dotenv').config();

const { createApp } = require('./src/app');
const { pool } = require('./src/config/database');

const app = createApp({ serveStatic: true });
const port = Number(process.env.PORT) || 3000;
const server = app.listen(port, () => {
  console.log(`Smart Cart is listening on http://localhost:${port}`);
});

async function shutdown(signal) {
  console.log(`${signal} received; shutting down Smart Cart`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
