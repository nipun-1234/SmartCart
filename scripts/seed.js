require('dotenv').config();
const { pool } = require('../src/config/database');

const catalog = [
  { sku: 'SC-AUD-001', name: 'Wireless Headphones', slug: 'wireless-headphones', category: 'electronics', price: 25597, stock: 25, rating: 4.5, brand: 'SoundPeak', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80' },
  { sku: 'SC-WEA-001', name: 'Running Jacket', slug: 'running-jacket', category: 'clothing', price: 19197, stock: 18, rating: 4.2, brand: 'TrailForm', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80' },
  { sku: 'SC-HOM-001', name: 'Garden Tool Set', slug: 'garden-tool-set', category: 'home', price: 14717, stock: 12, rating: 4.7, brand: 'GreenNest', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500&q=80' },
  { sku: 'SC-TEC-001', name: 'Laptop Stand', slug: 'laptop-stand', category: 'electronics', price: 11197, stock: 67, rating: 4.4, brand: 'WorkSpace', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80' },
  { sku: 'SC-WEA-002', name: 'Smart Watch', slug: 'smart-watch', category: 'electronics', price: 63997, stock: 15, rating: 4.8, brand: 'SoundPeak', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80' },
  { sku: 'SC-HOM-002', name: 'LED Desk Lamp', slug: 'led-desk-lamp', category: 'home', price: 12797, stock: 34, rating: 4.3, brand: 'BrightLiving', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80' },
  { sku: 'SC-SPT-001', name: 'Yoga Mat', slug: 'yoga-mat', category: 'sports', price: 9597, stock: 35, rating: 4.1, brand: 'ActiveLife', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&q=80' },
  { sku: 'SC-BOK-001', name: 'Atomic Habits', slug: 'atomic-habits', category: 'books', price: 6077, stock: 30, rating: 5.0, brand: 'Penguin', image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&q=80' }
];

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error('Set DATABASE_URL and run npm run db:migrate before seeding.');
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const categories = new Map();
    for (const name of ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books']) {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const result = await client.query(
        'INSERT INTO categories (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name RETURNING id',
        [name, slug]
      );
      categories.set(slug, result.rows[0].id);
    }

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
    console.log(`Seeded ${catalog.length} sample products across ${categories.size} categories.`);
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
