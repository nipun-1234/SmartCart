const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('../src/app');

const app = createApp();

test('health endpoint responds with status ok', async () => {
  const response = await request(app).get('/healthz');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: 'ok' });
});

test('Vercel API health path responds with status ok', async () => {
  const response = await request(app).get('/api/healthz');
  assert.equal(response.status, 200);
  assert.deepEqual(response.body, { status: 'ok' });
});

test('local app serves the existing storefront homepage', async () => {
  const response = await request(createApp({ serveStatic: true })).get('/');
  assert.equal(response.status, 200);
  assert.match(response.text, /SMArtCart|SmartCart/i);
});

test('legacy login route fails closed instead of accepting arbitrary credentials', async () => {
  const response = await request(app)
    .post('/login')
    .send({ email: 'shopper@example.com', password: 'anything' });
  assert.equal(response.status, 501);
  assert.equal(response.body.success, false);
});

test('legacy registration route does not claim a user was created', async () => {
  const response = await request(app)
    .post('/register')
    .send({ email: 'shopper@example.com', password: 'long-password' });
  assert.equal(response.status, 501);
  assert.equal(response.body.success, false);
});

test('unknown endpoints return JSON 404', async () => {
  const response = await request(app).get('/not-a-route');
  assert.equal(response.status, 404);
  assert.equal(response.body.success, false);
});
