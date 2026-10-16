const express = require('express');
const { store } = require('../db/store');
const { authenticateUser, requireAuth } = require('../middleware/auth');
const { processPayment } = require('../services/paymentService');
const { sendOrderConfirmation } = require('../services/emailService');

const router = express.Router();

const SHIPPING_FEE = 1917;
const FREE_SHIPPING_THRESHOLD = 48000;
const TAX_RATE = 0.1; // 10%

/**
 * Place an Order / Checkout
 */
router.post('/', authenticateUser, async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod = 'cash_on_delivery',
      paymentDetails = {},
      couponCode,
      email: guestEmail
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty.' });
    }

    if (!shippingAddress || !shippingAddress.recipient_name || !shippingAddress.line1 || !shippingAddress.city || !shippingAddress.phone) {
      return res.status(400).json({ success: false, message: 'Please provide complete delivery details (Recipient, Phone, Address, City).' });
    }

    // Verify each item against real product catalog and calculate authoritative subtotal
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const pid = item.product_id || item.id || item.productId;
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const product = await store.getProductById(pid);

      if (!product) {
        return res.status(400).json({ success: false, message: `Product #${pid} not found.` });
      }

      if (product.stock_quantity < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.stock_quantity} available.`
        });
      }

      const lineTotal = product.price * qty;
      subtotal += lineTotal;

      validatedItems.push({
        product_id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: qty,
        line_total: lineTotal
      });
    }

    // Calculate coupon discount
    let discountTotal = 0;
    if (couponCode) {
      const coupon = await store.getCoupon(couponCode);
      if (coupon && (!coupon.min_spend || subtotal >= coupon.min_spend)) {
        if (coupon.discount_type === 'percentage') {
          discountTotal = (subtotal * coupon.discount_value) / 100;
        } else {
          discountTotal = Math.min(coupon.discount_value, subtotal);
        }
      }
    }
    discountTotal = Math.round(discountTotal);

    const discountedSubtotal = Math.max(0, subtotal - discountTotal);
    const shippingTotal = discountedSubtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const taxTotal = Math.round(discountedSubtotal * TAX_RATE);
    const grandTotal = Math.round(discountedSubtotal + shippingTotal + taxTotal);

    // Process payment
    const paymentResult = await processPayment({
      amount: grandTotal,
      currency: 'LKR',
      paymentMethod,
      paymentDetails
    });

    const userId = req.user ? req.user.id : null;
    const customerEmail = req.user ? req.user.email : guestEmail || 'customer@example.com';

    // Create persistent order
    const order = await store.createOrder({
      userId,
      items: validatedItems,
      shippingAddress: {
        recipient_name: shippingAddress.recipient_name,
        phone: shippingAddress.phone,
        line1: shippingAddress.line1,
        line2: shippingAddress.line2 || '',
        city: shippingAddress.city,
        postal_code: shippingAddress.postal_code || '',
        country_code: shippingAddress.country_code || 'LK'
      },
      subtotal,
      discountTotal,
      taxTotal,
      shippingTotal,
      total: grandTotal,
      paymentMethod: paymentResult.provider,
      couponCode: couponCode || null
    });

    if (paymentResult.status === 'paid') {
      order.status = 'paid';
    }

    // Save default address if user is logged in
    if (userId) {
      store.saveUserAddress(userId, shippingAddress).catch(() => {});
    }

    // Clear server cart if user or guest token
    const cartKey = req.user ? `user_${req.user.id}` : `guest_${req.headers['x-guest-token'] || 'guest_default'}`;
    store.clearCart(cartKey).catch(() => {});

    // Send confirmation email asynchronously
    sendOrderConfirmation(order, customerEmail).catch((err) =>
      console.warn('Order confirmation email failed:', err.message)
    );

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: {
        id: order.id,
        order_number: order.order_number,
        status: order.status,
        total: order.total,
        currency: order.currency,
        items_count: order.items.length,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        created_at: order.created_at
      }
    });
  } catch (err) {
    console.error('Checkout error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Could not process order.' });
  }
});

/**
 * Get current authenticated user's order history
 */
router.get('/my', requireAuth, async (req, res) => {
  try {
    const orders = await store.getUserOrders(req.user.id);
    return res.json({
      success: true,
      orders
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not fetch order history.' });
  }
});

/**
 * Get single order by order number or ID
 */
router.get('/:identifier', authenticateUser, async (req, res) => {
  try {
    const { identifier } = req.params;
    let order = null;

    if (!isNaN(identifier)) {
      order = await store.getOrderById(identifier);
    } else {
      order = await store.getOrderByNumber(identifier);
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Security check: non-admin can only view their own order
    if (order.user_id && req.user && req.user.role !== 'admin' && order.user_id !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to view this order.' });
    }

    return res.json({
      success: true,
      order
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not fetch order details.' });
  }
});

/**
 * Cancel a pending order
 */
router.post('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await store.getOrderById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    if (order.status !== 'pending' && order.status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already ${order.status}.`
      });
    }

    await store.updateOrderStatus(order.id, 'cancelled');

    return res.json({
      success: true,
      message: `Order #${order.order_number} has been cancelled.`
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not cancel order.' });
  }
});

module.exports = router;
