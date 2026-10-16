// Email service for SmartCart: Order confirmations, Verification, Password Reset
const nodemailer = require('nodemailer');

let transporter = null;

if (process.env.SMTP_HOST && process.env.SMTP_USER) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

/**
 * Send an email or log it to the console in development
 */
async function sendMail({ to, subject, html, text }) {
  const from = process.env.EMAIL_FROM || 'orders@smartcart.lk';

  if (transporter) {
    try {
      const info = await transporter.sendMail({ from, to, subject, html, text });
      console.log(`[Email Sent] Message to ${to} id: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error('[Email Error] Failed to send via SMTP:', err.message);
    }
  }

  // Development logger preview
  console.log('--------------------------------------------------');
  console.log(`[DEV EMAIL NOTIFICATION]`);
  console.log(`To: ${to}`);
  console.log(`From: ${from}`);
  console.log(`Subject: ${subject}`);
  console.log(`Summary: ${text || subject}`);
  console.log('--------------------------------------------------');
  return { success: true, simulated: true };
}

/**
 * Send Order Confirmation Email
 */
async function sendOrderConfirmation(order, userEmail) {
  const itemsHtml = (order.items || [])
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.name || item.name_snapshot}</strong><br>
          <small style="color: #666;">SKU: ${item.sku || item.sku_snapshot || 'N/A'}</small>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${Number(item.price || item.unit_price).toLocaleString('en-LK')}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">Rs. ${(Number(item.price || item.unit_price) * item.quantity).toLocaleString('en-LK')}</td>
      </tr>`
    )
    .join('');

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #eef2f6;">
      <div style="background: linear-gradient(135deg, #0a0a1a 0%, #1a0828 50%, #0d1a2e 100%); padding: 30px; text-align: center; color: white;">
        <h1 style="margin: 0; font-size: 28px; letter-spacing: 1px;">SmartCart</h1>
        <p style="margin: 5px 0 0; color: #00FF85; font-size: 16px; font-weight: 600;">Order Confirmed!</p>
      </div>
      <div style="padding: 30px; color: #333;">
        <h2 style="color: #1a0828; margin-top: 0;">Thank you for your order!</h2>
        <p>Your order <strong>#${order.order_number}</strong> has been received and is currently being processed.</p>
        
        <div style="background: #f8fafc; border-radius: 8px; padding: 15px; margin: 20px 0;">
          <p style="margin: 4px 0;"><strong>Order Status:</strong> <span style="text-transform: capitalize; color: #0088cc; font-weight: bold;">${order.status}</span></p>
          <p style="margin: 4px 0;"><strong>Payment Method:</strong> ${order.payment_method === 'stripe' ? 'Credit/Debit Card (Stripe)' : 'Cash on Delivery (COD)'}</p>
          <p style="margin: 4px 0;"><strong>Date:</strong> ${new Date(order.created_at || Date.now()).toLocaleDateString()}</p>
        </div>

        <h3>Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #f1f5f9; text-align: left; font-size: 13px; color: #475569;">
              <th style="padding: 10px;">Item</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
              <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 8px 10px; text-align: right; color: #64748b;">Subtotal:</td>
              <td style="padding: 8px 10px; text-align: right;">Rs. ${Number(order.subtotal).toLocaleString('en-LK')}</td>
            </tr>
            ${order.discount_total > 0 ? `
            <tr>
              <td colspan="3" style="padding: 8px 10px; text-align: right; color: #10b981;">Discount:</td>
              <td style="padding: 8px 10px; text-align: right; color: #10b981;">-Rs. ${Number(order.discount_total).toLocaleString('en-LK')}</td>
            </tr>` : ''}
            <tr>
              <td colspan="3" style="padding: 8px 10px; text-align: right; color: #64748b;">Shipping:</td>
              <td style="padding: 8px 10px; text-align: right;">Rs. ${Number(order.shipping_total).toLocaleString('en-LK')}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 8px 10px; text-align: right; color: #64748b;">Tax (10%):</td>
              <td style="padding: 8px 10px; text-align: right;">Rs. ${Number(order.tax_total).toLocaleString('en-LK')}</td>
            </tr>
            <tr style="font-size: 17px; font-weight: bold; border-top: 2px solid #334155;">
              <td colspan="3" style="padding: 12px 10px; text-align: right;">Grand Total:</td>
              <td style="padding: 12px 10px; text-align: right; color: #00FF85; background: #0a0a1a;">Rs. ${Number(order.total).toLocaleString('en-LK')}</td>
            </tr>
          </tfoot>
        </table>

        ${order.shipping_address ? `
        <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <h4 style="margin: 0 0 10px; color: #1e293b;">Delivery Address</h4>
          <p style="margin: 3px 0; color: #475569;">${order.shipping_address.recipient_name || ''}</p>
          <p style="margin: 3px 0; color: #475569;">${order.shipping_address.line1 || ''} ${order.shipping_address.line2 || ''}</p>
          <p style="margin: 3px 0; color: #475569;">${order.shipping_address.city || ''}, ${order.shipping_address.postal_code || ''} (${order.shipping_address.country_code || 'LK'})</p>
          <p style="margin: 3px 0; color: #475569;">Phone: ${order.shipping_address.phone || ''}</p>
        </div>` : ''}

        <p style="margin-top: 30px; font-size: 13px; color: #94a3b8; text-align: center;">
          Have questions about your order? Reach our support at support@smartcart.lk.
        </p>
      </div>
    </div>
  `;

  return sendMail({
    to: userEmail,
    subject: `Order Confirmation #${order.order_number} - SmartCart`,
    html,
    text: `Thank you for your order #${order.order_number}! Total: Rs. ${Number(order.total).toLocaleString('en-LK')}. Track your order on SmartCart.`
  });
}

/**
 * Send Password Reset Email
 */
async function sendPasswordResetEmail(email, resetToken, host) {
  const resetLink = `http://${host}/login.html?reset_token=${resetToken}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 10px;">
      <h2 style="color: #FF0080;">SmartCart - Reset Your Password</h2>
      <p>We received a request to reset your password. Click the button below to set a new password:</p>
      <div style="text-align: center; margin: 25px 0;">
        <a href="${resetLink}" style="background: linear-gradient(135deg, #FF0080, #9D00FF); color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="font-size: 12px; color: #64748b;">Or copy this link in your browser: <br>${resetLink}</p>
      <p style="font-size: 12px; color: #94a3b8;">This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
    </div>
  `;

  return sendMail({
    to: email,
    subject: 'Password Reset Request - SmartCart',
    html,
    text: `Reset your SmartCart password using this link: ${resetLink}`
  });
}

/**
 * Send Email Verification Link
 */
async function sendVerificationEmail(email, token, host) {
  const verifyLink = `http://${host}/api/auth/verify?token=${token}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 10px;">
      <h2 style="color: #00FF85;">SmartCart - Verify Your Email</h2>
      <p>Welcome to SmartCart! Please verify your email address to activate all account features:</p>
      <div style="text-align: center; margin: 25px 0;">
        <a href="${verifyLink}" style="background: linear-gradient(135deg, #00FF85, #00D4FF); color: #000; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      <p style="font-size: 12px; color: #64748b;">Or click this link: <br>${verifyLink}</p>
    </div>
  `;

  return sendMail({
    to: email,
    subject: 'Verify your SmartCart account',
    html,
    text: `Verify your email for SmartCart by visiting: ${verifyLink}`
  });
}

module.exports = {
  sendOrderConfirmation,
  sendPasswordResetEmail,
  sendVerificationEmail
};
