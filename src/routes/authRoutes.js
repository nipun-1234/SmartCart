const express = require('express');
const bcrypt = require('bcryptjs');
const { store } = require('../db/store');
const { generateToken, requireAuth } = require('../middleware/auth');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../services/emailService');

const router = express.Router();

/**
 * Register a new user
 */
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password || !firstName) {
      return res.status(400).json({ success: false, message: 'Please provide first name, email, and password.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const existing = await store.getUserByEmail(email);
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email address already exists.' });
    }

    const newUser = await store.createUser({
      email,
      password,
      firstName,
      lastName: lastName || '',
      phone: phone || ''
    });

    const token = generateToken(newUser);

    // Send verification email in background
    sendVerificationEmail(newUser.email, newUser.verification_token, req.headers.host).catch((err) =>
      console.warn('Verification email error:', err.message)
    );

    res.cookie('smartcart_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to SmartCart.',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        role: newUser.role,
        email_verified: false
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ success: false, message: 'Could not complete registration. Please try again.' });
  }
});

/**
 * Login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const user = await store.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    res.cookie('smartcart_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    return res.json({
      success: true,
      message: 'Login successful! Welcome back.',
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        phone: user.phone || '',
        email_verified: !!user.email_verified_at
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Login could not be completed.' });
  }
});

/**
 * Logout
 */
router.post('/logout', (_req, res) => {
  res.clearCookie('smartcart_token');
  return res.json({ success: true, message: 'Logged out successfully.' });
});

/**
 * Get current profile
 */
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await store.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const address = await store.getUserAddress(user.id);

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
        phone: user.phone || '',
        email_verified: !!user.email_verified_at,
        created_at: user.created_at
      },
      address: address || null
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not fetch profile.' });
  }
});

/**
 * Update profile & address
 */
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { firstName, lastName, phone, currentPassword, newPassword, address } = req.body;
    const user = await store.getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const updates = {};
    if (firstName) updates.first_name = firstName;
    if (lastName !== undefined) updates.last_name = lastName;
    if (phone !== undefined) updates.phone = phone;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password is required to set a new password.' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password does not match.' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
      }
      updates.password = newPassword;
    }

    const updatedUser = await store.updateUser(user.id, updates);

    let savedAddress = null;
    if (address && typeof address === 'object') {
      savedAddress = await store.saveUserAddress(user.id, address);
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        role: updatedUser.role,
        phone: updatedUser.phone
      },
      address: savedAddress
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Profile update failed.' });
  }
});

/**
 * Forgot password request
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your email address.' });
    }

    const user = await store.getUserByEmail(email);
    if (!user) {
      // Don't leak existence of email
      return res.json({ success: true, message: 'If an account matches that email, a password reset link has been dispatched.' });
    }

    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await store.updateUser(user.id, {
      reset_token: resetToken,
      reset_token_expires_at: expiresAt
    });

    await sendPasswordResetEmail(user.email, resetToken, req.headers.host);

    return res.json({
      success: true,
      message: 'Password reset link sent! Please check your email (or dev logs).'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to process password reset request.' });
  }
});

/**
 * Reset password using token
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: 'Token and new password are required.' });
    }

    const user = await store.getUserByResetToken(token);
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired password reset link.' });
    }

    await store.updateUser(user.id, {
      password: newPassword,
      reset_token: null,
      reset_token_expires_at: null
    });

    return res.json({ success: true, message: 'Password has been successfully reset! You can now log in.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Could not reset password.' });
  }
});

/**
 * Email verification endpoint
 */
router.get('/verify', async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send('<h1>Invalid Verification Link</h1><p>Missing token.</p>');
    }

    const user = await store.getUserByVerificationToken(token);
    if (!user) {
      return res.status(400).send('<h1>Verification Failed</h1><p>Link is invalid or has already been used.</p>');
    }

    await store.updateUser(user.id, {
      email_verified_at: new Date()
    });

    return res.redirect('/login.html?verified=true');
  } catch (err) {
    return res.status(500).send('<h1>Verification Error</h1><p>Could not verify email.</p>');
  }
});

module.exports = router;
