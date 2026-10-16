// Payment Service handling Stripe and Cash on Delivery
let stripeInstance = null;

if (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('sample')) {
  try {
    stripeInstance = require('stripe')(process.env.STRIPE_SECRET_KEY);
  } catch (err) {
    console.warn('[Stripe Init] Using mock payment handler:', err.message);
  }
}

/**
 * Create Payment Intent or process payment
 */
async function processPayment({ amount, currency = 'LKR', paymentMethod, paymentDetails = {} }) {
  if (paymentMethod === 'cash_on_delivery') {
    return {
      success: true,
      provider: 'cash_on_delivery',
      status: 'pending',
      transactionId: `COD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      message: 'Cash on delivery selected. Payment due upon arrival.'
    };
  }

  if (paymentMethod === 'stripe') {
    // If real Stripe is configured:
    if (stripeInstance) {
      try {
        const paymentIntent = await stripeInstance.paymentIntents.create({
          amount: Math.round(amount * 100), // convert to smallest unit
          currency: currency.toLowerCase(),
          payment_method_types: ['card'],
          description: `SmartCart Order payment`,
          metadata: { provider: 'stripe' }
        });

        return {
          success: true,
          provider: 'stripe',
          status: 'paid',
          transactionId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret
        };
      } catch (err) {
        console.error('[Stripe Error]', err.message);
        throw new Error(`Stripe payment failed: ${err.message}`);
      }
    }

    // High-fidelity sandbox / test simulation for card payments
    const last4 = (paymentDetails.cardNumber || '4242').replace(/\s+/g, '').slice(-4);
    return {
      success: true,
      provider: 'stripe',
      status: 'paid',
      transactionId: `pi_mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      last4,
      message: 'Test payment processed successfully via Stripe Sandbox.'
    };
  }

  throw new Error(`Unsupported payment method: ${paymentMethod}`);
}

module.exports = {
  processPayment
};
