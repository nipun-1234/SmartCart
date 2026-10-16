const express = require('express');
const { store } = require('../db/store');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply requireAdmin to all admin endpoints
router.use(requireAdmin);

/**
 * Dashboard Overview & Statistics
 */
router.get('/stats', async (_req, res) => {
  try {
    const stats = await store.getDashboardStats();
    return res.json({ success: true, stats });
  } catch (err) {
    console.error('Admin stats error:', err);
    return res.status(500).json({ success: false, message: 'Could not fetch admin statistics.' });
  }
});

/**
 * Manage Products: List all
 */
router.get('/products', async (_req, res) => {
  try {
    const result = await store.getProducts({ limit: 1000 });
    return res.json({ success: true, products: result.products });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not load admin products.' });
  }
});

/**
 * Manage Products: Create
 */
router.post('/products', async (req, res) => {
  try {
    const { name, category, price, stock, image, description, brand } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Product name and price are required.' });
    }

    const categories = await store.getCategories();
    const cat = categories.find((c) => c.slug === category || c.name.toLowerCase() === (category || '').toLowerCase());

    const product = await store.createProduct({
      name,
      category: category || 'electronics',
      category_id: cat ? cat.id : 1,
      price: Number(price),
      stock_quantity: Number(stock || 0),
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
      description: description || `${name} available at SmartCart.`,
      brand: brand || 'SmartCart Originals'
    });

    return res.status(201).json({
      success: true,
      message: 'Product added successfully!',
      product
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create product.' });
  }
});

/**
 * Manage Products: Update
 */
router.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await store.updateProduct(id, req.body);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.json({
      success: true,
      message: 'Product updated successfully!',
      product: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
});

/**
 * Manage Products: Delete
 */
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await store.deleteProduct(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.json({ success: true, message: 'Product deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
});

/**
 * Manage Orders: List all
 */
router.get('/orders', async (req, res) => {
  try {
    const { status } = req.query;
    let orders = await store.getAllOrders();

    if (status && status !== 'all') {
      orders = orders.filter((o) => o.status.toLowerCase() === status.toLowerCase());
    }

    return res.json({ success: true, orders });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not load orders.' });
  }
});

/**
 * Manage Orders: Update Status (Pending, Paid, Shipped, Delivered, Cancelled)
 */
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    const updated = await store.updateOrderStatus(id, status.toLowerCase());
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    return res.json({
      success: true,
      message: `Order #${updated.order_number} status updated to ${status}.`,
      order: updated
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update order status.' });
  }
});

/**
 * Manage Users: List all users
 */
router.get('/users', async (_req, res) => {
  try {
    const users = await store.getAllUsers();
    return res.json({ success: true, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not fetch users.' });
  }
});

/**
 * Manage Categories: List, Add, Delete
 */
router.get('/categories', async (_req, res) => {
  try {
    const categories = await store.getCategories();
    return res.json({ success: true, categories });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not fetch categories.' });
  }
});

router.post('/categories', async (req, res) => {
  try {
    const { name, slug } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }
    const cat = await store.createCategory({ name, slug });
    return res.status(201).json({ success: true, message: 'Category created.', category: cat });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to create category.' });
  }
});

router.delete('/categories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await store.deleteCategory(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    return res.json({ success: true, message: 'Category deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete category.' });
  }
});

module.exports = router;
