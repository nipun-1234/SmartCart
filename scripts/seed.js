require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('../src/config/database');

const catalog = [
  { sku: 'SC-AUD-001', name: 'Wireless Headphones Pro', slug: 'wireless-headphones-pro', category: 'electronics', price: 25597, stock: 25, rating: 4.8, brand: 'SoundPeak', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80' },
  { sku: 'SC-WEA-001', name: 'Running Performance Jacket', slug: 'running-performance-jacket', category: 'clothing', price: 19197, stock: 18, rating: 4.5, brand: 'TrailForm', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80' },
  { sku: 'SC-HOM-001', name: 'Garden Tool Set Deluxe', slug: 'garden-tool-set-deluxe', category: 'home', price: 14717, stock: 12, rating: 4.7, brand: 'GreenNest', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80' },
  { sku: 'SC-TEC-001', name: 'Aluminum Ergonomic Laptop Stand', slug: 'aluminum-ergonomic-laptop-stand', category: 'electronics', price: 11197, stock: 67, rating: 4.6, brand: 'WorkSpace', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80' },
  { sku: 'SC-WEA-002', name: 'Apex Ultra Smart Watch', slug: 'apex-ultra-smart-watch', category: 'electronics', price: 63997, stock: 15, rating: 4.9, brand: 'SoundPeak', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80' },
  { sku: 'SC-WEA-003', name: 'Thermal Insulated Winter Coat', slug: 'thermal-insulated-winter-coat', category: 'clothing', price: 41597, stock: 14, rating: 4.6, brand: 'TrailForm', image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80' },
  { sku: 'SC-HOM-002', name: 'Modern Smart LED Desk Lamp', slug: 'modern-smart-led-desk-lamp', category: 'home', price: 12797, stock: 34, rating: 4.4, brand: 'BrightLiving', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80' },
  { sku: 'SC-AUD-002', name: 'Rugged Waterproof Bluetooth Speaker', slug: 'rugged-waterproof-bluetooth-speaker', category: 'electronics', price: 28797, stock: 28, rating: 4.5, brand: 'SoundPeak', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80' },
  { sku: 'SC-SPT-001', name: 'Eco-Friendly Non-Slip Yoga Mat', slug: 'eco-friendly-non-slip-yoga-mat', category: 'sports', price: 9597, stock: 35, rating: 4.3, brand: 'ActiveLife', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80' },
  { sku: 'SC-HOM-003', name: 'Ceramic Plant Pot Set (3-Pack)', slug: 'ceramic-plant-pot-set', category: 'home', price: 7997, stock: 22, rating: 4.6, brand: 'GreenNest', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=600&q=80' },
  { sku: 'SC-SPT-002', name: 'AeroCushion Sprint Running Shoes', slug: 'aerocushion-sprint-running-shoes', category: 'sports', price: 28797, stock: 19, rating: 4.7, brand: 'ActiveLife', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80' },
  { sku: 'SC-HOM-004', name: 'Barista Espresso & Coffee Maker', slug: 'barista-espresso-coffee-maker', category: 'home', price: 25597, stock: 16, rating: 4.7, brand: 'BrightLiving', image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&q=80' },
  { sku: 'SC-BOK-001', name: 'Atomic Habits by James Clear', slug: 'atomic-habits', category: 'books', price: 6077, stock: 40, rating: 5.0, brand: 'Penguin', image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=600&q=80' }
];

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error('Set DATABASE_URL and run npm run db:migrate before seeding.');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Seed Categories
    const categories = new Map();
    for (const name of ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books']) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const result = await client.query(
        'INSERT INTO categories (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name RETURNING id',
        [name, slug]
      );
      categories.set(slug, result.rows[0].id);
    }

    // 2. Seed Default Admin & Customer Accounts
    const adminPassHash = await bcrypt.hash('admin123', 10);
    const demoPassHash = await bcrypt.hash('demo123', 10);

    await client.query(`
      INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified_at)
      VALUES 
        ('admin@smartcart.lk', $1, 'SmartCart', 'Admin', 'admin', NOW()),
        ('demo@smartcart.lk', $2, 'Jane', 'Shopper', 'customer', NOW())
      ON CONFLICT (email) DO UPDATE SET 
        password_hash = EXCLUDED.password_hash,
        role = EXCLUDED.role;
    `, [adminPassHash, demoPassHash]);

    // 3. Seed Products
    for (const product of catalog) {
      const categorySlug = product.category === 'home' ? 'home-garden' : product.category;
      const result = await client.query(
        `INSERT INTO products (sku, name, slug, description, brand, category_id, price, stock_quantity, rating)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (sku) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug,
           description = EXCLUDED.description, brand = EXCLUDED.brand, category_id = EXCLUDED.category_id,
           price = EXCLUDED.price, stock_quantity = EXCLUDED.stock_quantity, rating = EXCLUDED.rating,
           updated_at = NOW()
         RETURNING id`,
        [product.sku, product.name, product.slug, `${product.name} from Smart Cart.`, product.brand,
          categories.get(categorySlug), product.price, product.stock, product.rating]
      );
      await client.query(
        `INSERT INTO product_images (product_id, image_url, alt_text, position)
         SELECT $1, $2, $3, 0 WHERE NOT EXISTS (
           SELECT 1 FROM product_images WHERE product_id = $1 AND image_url = $2
         )`,
        [result.rows[0].id, product.image, product.name]
      );
    }

    await client.query('COMMIT');
    console.log(`Successfully seeded sample catalog, admin, and demo users.`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());

