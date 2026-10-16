const express = require('express');
const { store } = require('../db/store');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

function getCartKey(req) {
  if (req.user && req.user.id) {
    return `user_${req.user.id}`;
  }
  const guestToken = req.headers['x-guest-token'] || req.query.guest_token || 'guest_default';
  return `guest_${guestToken}`;
}

/**
 * Get current cart items and calculated subtotal
 */
router.get('/', authenticateUser, async (req, res) => {
  try {
    const cartKey = getCartKey(req);
    const cart = await store.getCart(cartKey);

    let subtotal = 0;
    const items = cart.map((item) => {
      const lineTotal = (item.product ? item.product.price : 0) * item.quantity;
      subtotal += lineTotal;
      return {
        product_id: item.product_id,
        name: item.product ? item.product.name : 'Unknown Product',
        price: item.product ? item.product.price : 0,
        image: item.product ? item.product.image : '',
        category: item.product ? item.product.category : '',
        stock: item.product ? item.product.stock_quantity : 0,
        quantity: item.quantity,
        line_total: lineTotal
      };
    });

    return res.json({
      success: true,
      items,
      item_count: items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal,
      currency: 'LKR'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not fetch cart.' });
  }
});

/**
 * Add or update item in cart
 */
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    const product = await store.getProductById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const cartKey = getCartKey(req);
    const existingRaw = (await store.getCart(cartKey)).map((i) => ({
      productId: i.product_id,
      quantity: i.quantity
    }));

    const index = existingRaw.findIndex((i) => i.productId === Number(productId));
    if (index > -1) {
      existingRaw[index].quantity += Number(quantity);
    } else {
      existingRaw.push({ productId: Number(productId), quantity: Number(quantity) });
    }

    await store.saveCart(cartKey, existingRaw);

    return res.json({
      success: true,
      message: `${product.name} added to cart!`,
      cart_key: cartKey
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not add item to cart.' });
  }
});

/**
 * Update exact item quantity
 */
router.put('/', authenticateUser, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || quantity === undefined) {
      return res.status(400).json({ success: false, message: 'Product ID and quantity are required.' });
    }

    const cartKey = getCartKey(req);
    let existingRaw = (await store.getCart(cartKey)).map((i) => ({
      productId: i.product_id,
      quantity: i.quantity
    }));

    const q = Number(quantity);
    if (q <= 0) {
      existingRaw = existingRaw.filter((i) => i.productId !== Number(productId));
    } else {
      const item = existingRaw.find((i) => i.productId === Number(productId));
      if (item) {
        item.quantity = q;
      } else {
        existingRaw.push({ productId: Number(productId), quantity: q });
      }
    }

    await store.saveCart(cartKey, existingRaw);

    return res.json({ success: true, message: 'Cart updated.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not update cart.' });
  }
});

/**
 * Remove single item from cart
 */
router.delete('/:productId', authenticateUser, async (req, res) => {
  try {
    const { productId } = req.params;
    const cartKey = getCartKey(req);
    let existingRaw = (await store.getCart(cartKey)).map((i) => ({
      productId: i.product_id,
      quantity: i.quantity
    }));

    existingRaw = existingRaw.filter((i) => i.productId !== Number(productId));
    await store.saveCart(cartKey, existingRaw);

    return res.json({ success: true, message: 'Item removed from cart.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not remove item.' });
  }
});

/**
 * Merge guest cart upon logging in
 */
router.post('/merge', authenticateUser, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User must be authenticated to merge cart.' });
    }

    const { guestItems = [] } = req.body;
    const userCartKey = `user_${req.user.id}`;
    const userCartRaw = (await store.getCart(userCartKey)).map((i) => ({
      productId: i.product_id,
      quantity: i.quantity
    }));

    for (const item of guestItems) {
      const pid = Number(item.id || item.product_id || item.productId);
      const qty = Number(item.quantity) || 1;
      const found = userCartRaw.find((i) => i.productId === pid);
      if (found) {
        found.quantity += qty;
      } else {
        userCartRaw.push({ productId: pid, quantity: qty });
      }
    }

    await store.saveCart(userCartKey, userCartRaw);

    return res.json({ success: true, message: 'Cart synced successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not merge cart.' });
  }
});

/**
 * Clear cart
 */
router.delete('/', authenticateUser, async (req, res) => {
  try {
    const cartKey = getCartKey(req);
    await store.clearCart(cartKey);
    return res.json({ success: true, message: 'Cart cleared.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not clear cart.' });
  }
});

module.exports = router;
