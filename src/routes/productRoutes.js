const express = require('express');
const { store } = require('../db/store');

const router = express.Router();

/**
 * List products with search, filters, sorting, and pagination
 */
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, rating, brand, sort, page = 1, limit = 12 } = req.query;

    const result = await store.getProducts({
      category,
      search,
      minPrice,
      maxPrice,
      rating,
      brand,
      sort,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    });

    return res.json({
      success: true,
      ...result
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ success: false, message: 'Could not load products.' });
  }
});

/**
 * Featured products for homepage
 */
router.get('/featured', async (_req, res) => {
  try {
    const result = await store.getProducts({ page: 1, limit: 8, sort: 'rating' });
    return res.json({
      success: true,
      products: result.products
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not load featured products.' });
  }
});

/**
 * Get distinct brands for filtering
 */
router.get('/brands', async (_req, res) => {
  try {
    const result = await store.getProducts({ limit: 1000 });
    const brands = [...new Set(result.products.map((p) => p.brand).filter(Boolean))].sort();
    return res.json({ success: true, brands });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not load brands.' });
  }
});
/**
 * Get all active categories with product counts
 */
router.get('/categories', async (_req, res) => {
  try {
    const categories = await store.getCategories();
    return res.json({ success: true, categories });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not load categories.' });
  }
});

/**
 * Get single product by ID or Slug
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let product = null;

    if (!isNaN(id)) {
      product = await store.getProductById(id);
    } else {
      product = await store.getProductBySlug(id);
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Related products in the same category
    const related = (await store.getProducts({ category: product.category, limit: 4 })).products.filter(
      (p) => p.id !== product.id
    );

    return res.json({
      success: true,
      product,
      related
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not load product details.' });
  }
});

module.exports = router;
