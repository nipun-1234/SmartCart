const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const { createApp } = require('../src/app');

const app = createApp();

test('health endpoint responds with status ok', async () => {
  const response = await request(app).get('/healthz');
  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'ok');
});

test('Vercel API health path responds with status ok', async () => {
  const response = await request(app).get('/api/healthz');
  assert.equal(response.status, 200);
  assert.equal(response.body.status, 'ok');
});

test('local app serves the existing storefront homepage', async () => {
  const response = await request(createApp({ serveStatic: true })).get('/');
  assert.equal(response.status, 200);
  assert.match(response.text, /SMArtCart|SmartCart/i);
});

test('login route rejects invalid credentials', async () => {
  const response = await request(app)
    .post('/login')
    .send({ email: 'shopper@example.com', password: 'wrongpassword' });
  assert.equal(response.status, 401);
  assert.equal(response.body.success, false);
});

test('login route succeeds with valid demo credentials', async () => {
  const response = await request(app)
    .post('/login')
    .send({ email: 'demo@smartcart.lk', password: 'demo123' });
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.ok(response.body.token);
  assert.equal(response.body.user.email, 'demo@smartcart.lk');
});

test('registration creates a new account and returns token', async () => {
  const uniqueEmail = `user_${Date.now()}@test.com`;
  const response = await request(app)
    .post('/register')
    .send({
      email: uniqueEmail,
      password: 'securepassword123',
      firstName: 'Test',
      lastName: 'Customer',
      phone: '+94 77 999 8888'
    });
  assert.equal(response.status, 201);
  assert.equal(response.body.success, true);
  assert.ok(response.body.token);
  assert.equal(response.body.user.email, uniqueEmail);
});

test('product catalog API returns active products and filters', async () => {
  const response = await request(app).get('/api/products?category=electronics&limit=5');
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.ok(Array.isArray(response.body.products));
  assert.ok(response.body.products.length > 0);
  assert.equal(response.body.products[0].category, 'electronics');
});

test('coupons API validates coupons correctly', async () => {
  const response = await request(app)
    .post('/api/coupons/validate')
    .send({ code: 'SMART10', subtotal: 10000 });
  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.coupon.code, 'SMART10');
  assert.equal(response.body.coupon.discount_amount, 1000);
});

test('cart workflow: add item, get cart, and checkout with COD', async () => {
  // 1. Add item to guest cart
  const addRes = await request(app)
    .post('/api/cart')
    .set('x-guest-token', 'test_guest_session_1')
    .send({ productId: 1, quantity: 2 });
  assert.equal(addRes.status, 200);
  assert.equal(addRes.body.success, true);

  // 2. Fetch cart
  const getRes = await request(app)
    .get('/api/cart')
    .set('x-guest-token', 'test_guest_session_1');
  assert.equal(getRes.status, 200);
  assert.equal(getRes.body.items.length, 1);
  assert.equal(getRes.body.items[0].product_id, 1);
  assert.equal(getRes.body.items[0].quantity, 2);

  // 3. Checkout with Cash on Delivery
  const orderRes = await request(app)
    .post('/api/orders')
    .set('x-guest-token', 'test_guest_session_1')
    .send({
      items: [{ product_id: 1, quantity: 2 }],
      shippingAddress: {
        recipient_name: 'Test Guest',
        phone: '+94 77 111 2233',
        line1: '10 Main St',
        city: 'Colombo',
        postal_code: '00100'
      },
      paymentMethod: 'cash_on_delivery',
      email: 'guest@smartcart.lk'
    });
  assert.equal(orderRes.status, 201);
  assert.equal(orderRes.body.success, true);
  assert.ok(orderRes.body.order.order_number);
  assert.equal(orderRes.body.order.status, 'pending');
});

test('admin stats require admin credentials', async () => {
  // Non-admin token or no token fails with 401
  const unauthRes = await request(app).get('/api/admin/stats');
  assert.equal(unauthRes.status, 401);

  // Login as admin
  const loginRes = await request(app)
    .post('/login')
    .send({ email: 'admin@smartcart.lk', password: 'admin123' });
  assert.equal(loginRes.status, 200);
  const adminToken = loginRes.body.token;

  // Access admin stats with bearer token
  const statsRes = await request(app)
    .get('/api/admin/stats')
    .set('Authorization', `Bearer ${adminToken}`);
  assert.equal(statsRes.status, 200);
  assert.equal(statsRes.body.success, true);
  assert.ok(statsRes.body.stats.totalProducts > 0);
  assert.ok(statsRes.body.stats.chart);
});

test('unknown endpoints return JSON 404', async () => {
  const response = await request(app).get('/api/not-a-route');
  assert.equal(response.status, 404);
  assert.equal(response.body.success, false);
});

test('categories endpoints return dynamic categories with product counts', async () => {
  const res1 = await request(app).get('/api/categories');
  assert.equal(res1.status, 200);
  assert.equal(res1.body.success, true);
  assert.ok(Array.isArray(res1.body.categories));
  assert.ok(res1.body.categories.length >= 7);

  const grocery = res1.body.categories.find((c) => c.slug === 'grocery');
  assert.ok(grocery);
  assert.equal(grocery.name, 'Grocery & Gourmet');
  assert.ok(grocery.product_count > 0);

  // Alias /api/products/categories works identically
  const res2 = await request(app).get('/api/products/categories');
  assert.equal(res2.status, 200);
  assert.equal(res2.body.success, true);
  assert.equal(res2.body.categories.length, res1.body.categories.length);
});

test('filtering products by grocery and stationery categories returns correct items', async () => {
  // Test grocery filter
  const groceryRes = await request(app).get('/api/products?category=grocery');
  assert.equal(groceryRes.status, 200);
  assert.equal(groceryRes.body.success, true);
  assert.ok(groceryRes.body.products.length > 0);
  groceryRes.body.products.forEach((p) => {
    assert.equal(p.category, 'grocery');
  });

  // Test stationery filter
  const stationeryRes = await request(app).get('/api/products?category=stationery');
  assert.equal(stationeryRes.status, 200);
  assert.equal(stationeryRes.body.success, true);
  assert.ok(stationeryRes.body.products.length > 0);
  stationeryRes.body.products.forEach((p) => {
    assert.equal(p.category, 'stationery');
  });
});

test('filtering by non-existent or newly added category safely returns empty catalog without error', async () => {
  const res = await request(app).get('/api/products?category=automotive');
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.products.length, 0);
  assert.equal(res.body.total, 0);
});

