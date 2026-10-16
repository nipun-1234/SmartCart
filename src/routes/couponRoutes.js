const express = require('express');
const { store } = require('../db/store');

const router = express.Router();

/**
 * Validate a coupon code and calculate discount
 */
router.post('/validate', async (req, res) => {
  try {
    const { code, subtotal = 0 } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required.' });
    }

    const coupon = await store.getCoupon(code);
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code.' });
    }

    const sub = Number(subtotal);
    if (coupon.min_spend && sub < coupon.min_spend) {
      return res.status(400).json({
        success: false,
        message: `This coupon requires a minimum subtotal of Rs. ${coupon.min_spend.toLocaleString('en-LK')}.`
      });
    }

    let discount = 0;
    if (coupon.discount_type === 'percentage') {
      discount = (sub * coupon.discount_value) / 100;
    } else {
      discount = Math.min(coupon.discount_value, sub);
    }

    return res.json({
      success: true,
      message: `Coupon "${coupon.code}" applied!`,
      coupon: {
        code: coupon.code,
        discount_type: coupon.discount_type,
        discount_value: coupon.discount_value,
        discount_amount: Math.round(discount)
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to validate coupon.' });
  }
});

/**
 * List available public promotions
 */
router.get('/', async (_req, res) => {
  try {
    const coupons = await store.getAllCoupons();
    return res.json({
      success: true,
      coupons: coupons.filter((c) => c.is_active).map((c) => ({
        code: c.code,
        type: c.discount_type,
        value: c.discount_value,
        min_spend: c.min_spend
      }))
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not load coupons.' });
  }
});

module.exports = router;
