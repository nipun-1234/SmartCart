const express = require('express');
const { store } = require('../db/store');

const router = express.Router();

/**
 * SmartCart AI Live Chatbot Engine
 * Handles natural language questions regarding products, orders, coupons, delivery, returns, and support.
 */
router.post('/', async (req, res) => {
  try {
    const { message = '', history = [] } = req.body;
    const q = String(message).toLowerCase().trim();

    if (!q) {
      return res.json({
        success: true,
        reply: "👋 Hello! I am your SmartCart AI Assistant. How can I help you today? You can ask about products, track your delivery, or claim discount coupons!",
        type: 'text'
      });
    }

    // 1. Order Tracking by Pattern or Keyword
    const orderMatch = q.match(/sc-\d{4}-\d+/i) || q.match(/\b(10[1-9])\b/);
    if (orderMatch) {
      const orderId = orderMatch[0].toUpperCase();
      let order = await store.getOrderByNumber(orderId);
      if (!order && !isNaN(orderId)) {
        order = await store.getOrderById(orderId);
      }
      if (order) {
        return res.json({
          success: true,
          reply: `📦 Found details for Order **#${order.order_number}**! Status is currently **${order.status.toUpperCase()}**.`,
          type: 'order',
          data: {
            orderNumber: order.order_number,
            status: order.status,
            total: order.total,
            currency: order.currency || 'LKR',
            paymentMethod: order.payment_method,
            paymentStatus: order.payment_status,
            city: order.shipping_address ? order.shipping_address.city : 'Colombo',
            items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price || i.unit_price }))
          }
        });
      } else {
        return res.json({
          success: true,
          reply: `🔍 I checked our system, but could not locate Order **#${orderId}**. Please verify your order number on your receipt or sign in to view your order history.`,
          type: 'text'
        });
      }
    }

    if (q.includes('track') || q.includes('order') || q.includes('parcel') || q.includes('delivery status') || q.includes('koheth')) {
      return res.json({
        success: true,
        reply: "🚚 To track your package in real-time, please enter your **Order Number** (for example: `SC-2026-1001` or `101`). You can also view all your recent deliveries in the **Orders** tab at the top!",
        type: 'text'
      });
    }

    // 2. Coupons, Discounts, Promo Codes
    if (q.includes('coupon') || q.includes('promo') || q.includes('discount') || q.includes('voucher') || q.includes('offer') || q.includes('deal') || q.includes('adui') || q.includes('labai')) {
      return res.json({
        success: true,
        reply: "🎉 Here are today's **Active Discount Coupons** for SmartCart shoppers:\n\n• **SMART10** - 10% OFF on orders over Rs. 3,000\n• **WELCOME500** - Flat Rs. 500 OFF on orders over Rs. 2,500\n• **SUPER20** - 20% OFF on high-value orders over Rs. 15,000\n\nYou can apply any coupon directly during checkout in your Cart!",
        type: 'coupons',
        data: [
          { code: 'SMART10', desc: '10% OFF (Min Spend Rs. 3,000)', discount: '10%' },
          { code: 'WELCOME500', desc: 'Rs. 500 OFF (Min Spend Rs. 2,500)', discount: 'Rs. 500' },
          { code: 'SUPER20', desc: '20% OFF (Min Spend Rs. 15,000)', discount: '20%' }
        ]
      });
    }

    // 3. Return & Refund Policy
    if (q.includes('return') || q.includes('refund') || q.includes('exchange') || q.includes('damaged') || q.includes('defective') || q.includes('maru karanna')) {
      return res.json({
        success: true,
        reply: "🛡️ **SmartCart 14-Day Buyer Protection**:\n\nAll items are covered with our hassle-free return guarantee. If an item arrives defective, damaged, or does not match the description, you can initiate a return within 14 days from your Orders page for a full refund or exchange.",
        type: 'text'
      });
    }

    // 4. Shipping, Delivery Fees & Timelines
    if (q.includes('shipping') || q.includes('deliver') || q.includes('fee') || q.includes('charges') || q.includes('how long') || q.includes('kawadda')) {
      return res.json({
        success: true,
        reply: "🚚 **Delivery Information**:\n\n• **Western Province**: 24 - 48 Hours\n• **Island-wide Provinces**: 2 - 3 Business Days\n• **Shipping Fee**: Flat Rs. 1,917 (or **FREE Delivery** on orders exceeding Rs. 48,000!)\n\nAll orders are tracked end-to-end via SMS and email notifications.",
        type: 'text'
      });
    }

    // 5. Payment Methods
    if (q.includes('pay') || q.includes('card') || q.includes('cod') || q.includes('cash on delivery') || q.includes('stripe') || q.includes('apple pay') || q.includes('google pay')) {
      return res.json({
        success: true,
        reply: "💳 **Accepted Payment Methods**:\n\n1. **Cash on Delivery (COD)** - Pay securely upon doorstep delivery.\n2. **Credit & Debit Cards** - Visa, Mastercard, American Express via 256-bit encrypted gateway.\n3. **Apple Pay & Google Pay** - Instant 1-tap checkout.",
        type: 'text'
      });
    }

    // 6. Contact & Support Details
    if (q.includes('contact') || q.includes('support') || q.includes('agent') || q.includes('human') || q.includes('hotline') || q.includes('call') || q.includes('phone') || q.includes('email') || q.includes('help')) {
      return res.json({
        success: true,
        reply: "📞 **SmartCart Customer Support**:\n\n• **Hotline (24/7)**: +94 11 234 5678\n• **WhatsApp Support**: +94 77 000 1234\n• **Email**: support@smartcart.lk\n• **Address**: Level 14, World Trade Centre, Colombo 01, Sri Lanka.",
        type: 'text'
      });
    }

    // 7. Product Search & Catalog Query
    // Search words from query
    const cleanSearch = q
      .replace(/show me|find me|search for|looking for|price of|buy|products|product|catalog|have|do you/gi, '')
      .trim();

    if (cleanSearch.length >= 2) {
      const searchResult = await store.getProducts({ search: cleanSearch, limit: 3 });
      if (searchResult.products && searchResult.products.length > 0) {
        return res.json({
          success: true,
          reply: `✨ Here are the top items I found in our catalog for **"${cleanSearch}"**:`,
          type: 'products',
          data: searchResult.products.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            originalPrice: p.original_price,
            image: p.image,
            category: p.category,
            rating: p.rating,
            badge: p.badge
          }))
        });
      }
    }

    // 8. Greetings & Common Conversation
    if (q.match(/\b(hi|hello|hey|ayubowan|kohomada|good morning|good evening|good afternoon)\b/)) {
      return res.json({
        success: true,
        reply: "👋 Ayubowan & Hello! I'm your SmartCart AI Live Shopping Guide. Would you like me to find popular deals, help you track an existing package, or check coupon vouchers?",
        type: 'text'
      });
    }

    if (q.match(/\b(thank|thanks|sthuthi|bohoma sthuthi|great|awesome|cool)\b/)) {
      return res.json({
        success: true,
        reply: "You're very welcome! 😊 Always here to help you enjoy the best shopping experience on SmartCart. Let me know if you need anything else!",
        type: 'text'
      });
    }

    // 9. Default Helpful Fallback
    return res.json({
      success: true,
      reply: "I am here to assist your shopping experience! Here are quick things you can ask me:\n\n• 🔍 *\"Show me Dell laptop\"* or *\"Sneakers\"*\n• 📦 *\"Track SC-2026-1001\"*\n• 🏷️ *\"What coupons are available?\"*\n• 🚚 *\"What are your delivery charges?\"*\n• 🛡️ *\"How do returns work?\"*",
      type: 'text'
    });
  } catch (err) {
    console.error('Chat API error:', err);
    return res.status(500).json({
      success: false,
      message: 'Chat service temporarily unavailable.'
    });
  }
});

module.exports = router;
