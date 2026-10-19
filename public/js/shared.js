/**
 * SmartCart - Unified Shared Frontend Library
 * Handles Authentication state, Cart state, Notifications, Theme, and Navigation.
 */

const SMARTCART_TOKEN_KEY = 'smartcart_jwt_token';
const SMARTCART_USER_KEY  = 'smartcart_user_data';
const SMARTCART_CART_KEY  = 'smartcart_cart';
const SMARTCART_GUEST_KEY = 'smartcart_guest_token';

// Format currency in LKR: Rs. 25,597
function fmtLKR(amount) {
  const num = Math.round(Number(amount) || 0);
  return 'Rs. ' + num.toLocaleString('en-LK');
}

// Guest token generation / retrieval
function getGuestToken() {
  let token = localStorage.getItem(SMARTCART_GUEST_KEY);
  if (!token) {
    token = 'gst_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem(SMARTCART_GUEST_KEY, token);
  }
  return token;
}

// Authentication Helpers
function getAuthToken() {
  return localStorage.getItem(SMARTCART_TOKEN_KEY);
}

function getAuthUser() {
  try {
    const raw = localStorage.getItem(SMARTCART_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_e) {
    return null;
  }
}

function setAuth(token, user) {
  if (token) localStorage.setItem(SMARTCART_TOKEN_KEY, token);
  if (user)  localStorage.setItem(SMARTCART_USER_KEY, JSON.stringify(user));
  updateAuthNavigation();
  syncCartWithServer();
}

function clearAuth() {
  localStorage.removeItem(SMARTCART_TOKEN_KEY);
  localStorage.removeItem(SMARTCART_USER_KEY);
  updateAuthNavigation();
}

async function logoutUser() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (_e) {}
  clearAuth();
  showToast('Logged Out', 'You have been logged out safely.', 'info');
  setTimeout(() => {
    window.location.href = '/index.html';
  }, 500);
}

// Check session on page load
async function checkAuthSession() {
  const token = getAuthToken();
  if (!token) {
    updateAuthNavigation();
    return null;
  }

  try {
    const res = await fetch('/api/auth/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success && data.user) {
      localStorage.setItem(SMARTCART_USER_KEY, JSON.stringify(data.user));
      updateAuthNavigation();
      return data.user;
    } else {
      clearAuth();
      return null;
    }
  } catch (_e) {
    return getAuthUser();
  }
}

// Synchronize Navbar with Auth State
function updateAuthNavigation() {
  const user = getAuthUser();
  const navContainer = document.querySelector('.nav-links, .nav-buttons');
  const authSection = document.getElementById('authNavSection');

  if (authSection) {
    if (user) {
      authSection.innerHTML = `
        <div class="user-menu-dropdown" style="position: relative; display: inline-block;">
          <button type="button" class="user-profile-btn" style="background: linear-gradient(135deg, rgba(232, 112, 42,0.15), rgba(255, 184, 0,0.15)); border: 1px solid rgba(232, 112, 42,0.4); color: #fff; padding: 6px 14px; border-radius: 25px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600;">
            <i class="fas fa-user-circle" style="color: var(--lime-green, #E8702A); font-size: 1.1rem;"></i>
            <span>${user.first_name || 'Account'}</span>
            <i class="fas fa-chevron-down" style="font-size: 0.75rem; opacity: 0.7;"></i>
          </button>
          <div class="dropdown-content user-dropdown-menu" style="display: none; position: absolute; right: 0; top: 110%; background: rgba(10,10,26,0.96); backdrop-filter: blur(20px); border: 1px solid rgba(255, 184, 0,0.25); border-radius: 14px; min-width: 200px; padding: 8px; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div style="padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 5px;">
              <p style="margin: 0; font-size: 0.85rem; color: #fff; font-weight: 700;">${user.first_name} ${user.last_name || ''}</p>
              <p style="margin: 0; font-size: 0.75rem; color: rgba(255,255,255,0.6);">${user.email}</p>
              ${user.role === 'admin' ? '<span style="background: #FF3B30; color: #fff; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">Admin</span>' : ''}
            </div>
            <a href="/products.html#ordersPage" onclick="showCustomerOrders(); return false;" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; color: rgba(255,255,255,0.85); text-decoration: none; border-radius: 8px; transition: 0.2s;">
              <i class="fas fa-box" style="color: var(--electric-blue, #FFB800);"></i> My Orders
            </a>
            ${user.role === 'admin' ? `
            <a href="/admin.html" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; color: rgba(255,255,255,0.85); text-decoration: none; border-radius: 8px; transition: 0.2s;">
              <i class="fas fa-gauge-high" style="color: var(--neon-pink, #FF3B30);"></i> Admin Dashboard
            </a>` : ''}
            <a href="#" onclick="logoutUser(); return false;" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; color: #ff6b6b; text-decoration: none; border-radius: 8px; transition: 0.2s; border-top: 1px solid rgba(255,255,255,0.08); margin-top: 4px;">
              <i class="fas fa-right-from-bracket"></i> Sign Out
            </a>
          </div>
        </div>
      `;

      const profileBtn = authSection.querySelector('.user-profile-btn');
      const menu = authSection.querySelector('.user-dropdown-menu');
      if (profileBtn && menu) {
        profileBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
        document.addEventListener('click', () => {
          menu.style.display = 'none';
        });
      }
    } else {
      authSection.innerHTML = `
        <a href="/login.html" class="nav-auth-link" style="color: rgba(255,255,255,0.85); text-decoration: none; padding: 7px 15px; border-radius: 20px; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; border: 1px solid rgba(255,255,255,0.2);">
          <i class="fas fa-user"></i> Sign In
        </a>
      `;
    }
  }
}

// ================= CART CLIENT LOGIC =================

function getLocalCart() {
  try {
    const raw = localStorage.getItem(SMARTCART_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_e) {
    return [];
  }
}

function saveLocalCart(items) {
  localStorage.setItem(SMARTCART_CART_KEY, JSON.stringify(items));
  updateCartBadge();
}

function getCartCount() {
  const items = getLocalCart();
  return items.reduce((sum, item) => sum + (item.quantity || 1), 0);
}

function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-count, #cartCount, #navCartChip').forEach((badge) => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'inline-block' : 'none';
  });
}

// Add item to cart
async function addToCart(product, quantity = 1) {
  if (!product || !product.id) return;
  const qty = Number(quantity) || 1;

  let items = getLocalCart();
  const existing = items.find((i) => i.id === product.id);

  if (existing) {
    existing.quantity = (existing.quantity || 1) + qty;
  } else {
    items.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      category: product.category,
      sku: product.sku || '',
      quantity: qty
    });
  }

  saveLocalCart(items);
  showToast('Added to Cart', `${product.name} (x${qty}) added!`, 'success');

  // If user is authenticated, sync to server in background
  const token = getAuthToken();
  if (token) {
    fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId: product.id, quantity: qty })
    }).catch(() => {});
  }
}

// Update quantity
function updateCartItemQuantity(productId, delta) {
  let items = getLocalCart();
  const item = items.find((i) => i.id === Number(productId));
  if (!item) return;

  item.quantity = (item.quantity || 1) + delta;
  if (item.quantity <= 0) {
    items = items.filter((i) => i.id !== Number(productId));
  }

  saveLocalCart(items);

  // Sync with server if logged in
  const token = getAuthToken();
  if (token) {
    fetch('/api/cart', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ productId, quantity: item.quantity > 0 ? item.quantity : 0 })
    }).catch(() => {});
  }
}

// Remove item
function removeCartItem(productId) {
  let items = getLocalCart();
  items = items.filter((i) => i.id !== Number(productId));
  saveLocalCart(items);

  const token = getAuthToken();
  if (token) {
    fetch(`/api/cart/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }).catch(() => {});
  }
}

// Clear cart
function clearEntireCart() {
  localStorage.removeItem(SMARTCART_CART_KEY);
  updateCartBadge();
  const token = getAuthToken();
  if (token) {
    fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    }).catch(() => {});
  }
}

// Sync guest cart upon login
async function syncCartWithServer() {
  const token = getAuthToken();
  if (!token) return;

  const localItems = getLocalCart();
  if (localItems.length > 0) {
    try {
      await fetch('/api/cart/merge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ guestItems: localItems })
      });
    } catch (_e) {}
  }

  // Fetch server authoritative cart
  try {
    const res = await fetch('/api/cart', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (data.success && Array.isArray(data.items)) {
      const formatted = data.items.map((i) => ({
        id: i.product_id,
        name: i.name,
        price: i.price,
        image: i.image,
        category: i.category,
        quantity: i.quantity
      }));
      localStorage.setItem(SMARTCART_CART_KEY, JSON.stringify(formatted));
      updateCartBadge();
    }
  } catch (_e) {}
}

// ================= TOAST NOTIFICATIONS (ENTERPRISE GLASSMORPHISM SYSTEM) =================

function ensureToastStyles() {
  if (document.getElementById('smartcart-toast-styles')) return;

  const style = document.createElement('style');
  style.id = 'smartcart-toast-styles';
  style.textContent = `
    #smartcart-toast-container {
      position: fixed;
      top: 80px;
      right: 18px;
      z-index: 9999999;
      display: flex;
      flex-direction: column;
      gap: 7px;
      pointer-events: none;
      max-width: 300px;
      width: calc(100vw - 32px);
    }
    @media (max-width: 640px) {
      #smartcart-toast-container {
        top: 68px;
        right: 12px;
        left: 12px;
        width: auto;
        max-width: 320px;
        margin: 0 auto;
      }
    }
    .sc-toast-item {
      position: relative;
      overflow: hidden;
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 9px;
      padding: 8px 11px 9px 9px;
      border-radius: 12px;
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
      box-sizing: border-box;
      backdrop-filter: blur(20px) saturate(190%);
      -webkit-backdrop-filter: blur(20px) saturate(190%);
      transform: translateX(112%) scale(0.95);
      opacity: 0;
      transition: transform 0.30s cubic-bezier(0.16, 1, 0.3, 1),
                  opacity 0.26s ease,
                  max-height 0.28s ease,
                  margin 0.24s ease,
                  box-shadow 0.22s ease;
      max-height: 110px;
      will-change: transform, opacity;
      cursor: default;
    }
    .sc-toast-item.sc-single-line {
      align-items: center;
      padding: 7px 10px 7px 9px;
    }
    .sc-toast-item.sc-toast-visible {
      transform: translateX(0) scale(1);
      opacity: 1;
    }
    .sc-toast-item.sc-toast-visible:hover {
      transform: translateY(-1px) scale(1.008);
    }
    .sc-toast-item.sc-toast-closing {
      transform: translateX(105%) scale(0.92);
      opacity: 0;
      max-height: 0 !important;
      margin-bottom: -7px !important;
      padding-top: 0 !important;
      padding-bottom: 0 !important;
    }

    /* Dark Theme (Default) */
    .sc-toast-dark {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%), rgba(11, 13, 23, 0.90);
      border: 1px solid rgba(255, 255, 255, 0.09);
      border-top-color: rgba(255, 255, 255, 0.18);
      box-shadow: 0 10px 26px -6px rgba(0, 0, 0, 0.72),
                  0 0 0 1px rgba(255, 255, 255, 0.03),
                  0 2px 6px rgba(0, 0, 0, 0.4);
      color: #FFFFFF;
    }

    /* Light Theme */
    .sc-toast-light {
      background: rgba(255, 255, 255, 0.96);
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-top-color: rgba(255, 255, 255, 0.8);
      box-shadow: 0 10px 24px -6px rgba(15, 23, 42, 0.14),
                  0 2px 6px rgba(15, 23, 42, 0.04);
      color: #0F172A;
    }

    /* Type Accents */
    .sc-toast-success.sc-toast-dark {
      border-color: rgba(0, 255, 133, 0.35);
      box-shadow: 0 10px 26px -6px rgba(0, 0, 0, 0.72), 0 0 16px -4px rgba(0, 255, 133, 0.22);
    }
    .sc-toast-error.sc-toast-dark {
      border-color: rgba(255, 51, 102, 0.38);
      box-shadow: 0 10px 26px -6px rgba(0, 0, 0, 0.72), 0 0 16px -4px rgba(255, 51, 102, 0.22);
    }
    .sc-toast-warning.sc-toast-dark {
      border-color: rgba(255, 184, 0, 0.38);
      box-shadow: 0 10px 26px -6px rgba(0, 0, 0, 0.72), 0 0 16px -4px rgba(255, 184, 0, 0.22);
    }
    .sc-toast-info.sc-toast-dark {
      border-color: rgba(0, 212, 255, 0.35);
      box-shadow: 0 10px 26px -6px rgba(0, 0, 0, 0.72), 0 0 16px -4px rgba(0, 212, 255, 0.22);
    }

    /* Light Theme Type Accents */
    .sc-toast-success.sc-toast-light { border-color: rgba(16, 185, 129, 0.4); }
    .sc-toast-error.sc-toast-light { border-color: rgba(239, 68, 68, 0.4); }
    .sc-toast-warning.sc-toast-light { border-color: rgba(245, 158, 11, 0.4); }
    .sc-toast-info.sc-toast-light { border-color: rgba(14, 165, 233, 0.4); }

    /* Ultra-Compact Micro Icon Badge */
    .sc-toast-icon-box {
      width: 25px;
      height: 25px;
      min-width: 25px;
      border-radius: 7px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.76rem;
      flex-shrink: 0;
    }
    .sc-toast-item:not(.sc-single-line) .sc-toast-icon-box {
      margin-top: 1px;
    }
    .sc-toast-success .sc-toast-icon-box {
      background: rgba(0, 255, 133, 0.12);
      color: #00FF85;
      border: 1px solid rgba(0, 255, 133, 0.24);
    }
    .sc-toast-error .sc-toast-icon-box {
      background: rgba(255, 51, 102, 0.12);
      color: #FF3366;
      border: 1px solid rgba(255, 51, 102, 0.24);
    }
    .sc-toast-warning .sc-toast-icon-box {
      background: rgba(255, 184, 0, 0.12);
      color: #FFB800;
      border: 1px solid rgba(255, 184, 0, 0.24);
    }
    .sc-toast-info .sc-toast-icon-box {
      background: rgba(0, 212, 255, 0.12);
      color: #00D4FF;
      border: 1px solid rgba(0, 212, 255, 0.24);
    }

    /* Text details */
    .sc-toast-content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .sc-toast-title {
      font-weight: 600;
      font-size: 0.79rem;
      line-height: 1.25;
      letter-spacing: -0.012em;
    }
    .sc-toast-dark .sc-toast-title { color: #FFFFFF; }
    .sc-toast-light .sc-toast-title { color: #0F172A; }

    .sc-toast-msg {
      font-size: 0.71rem;
      line-height: 1.32;
      margin-top: 2px;
      word-break: break-word;
    }
    .sc-toast-dark .sc-toast-msg { color: rgba(255, 255, 255, 0.70); }
    .sc-toast-light .sc-toast-msg { color: #475569; }

    /* Ultra-Compact Dismiss Button */
    .sc-toast-dismiss {
      background: none;
      border: none;
      width: 18px;
      height: 18px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 0.66rem;
      transition: all 0.2s;
      flex-shrink: 0;
      margin-right: -2px;
      padding: 0;
    }
    .sc-toast-item:not(.sc-single-line) .sc-toast-dismiss {
      margin-top: 1px;
    }
    .sc-toast-dark .sc-toast-dismiss {
      color: rgba(255, 255, 255, 0.38);
    }
    .sc-toast-dark .sc-toast-dismiss:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #FFFFFF;
    }
    .sc-toast-light .sc-toast-dismiss {
      color: rgba(15, 23, 42, 0.35);
    }
    .sc-toast-light .sc-toast-dismiss:hover {
      background: rgba(15, 23, 42, 0.08);
      color: #0F172A;
    }

    /* Hairline Progress Bar */
    .sc-toast-progress-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 2px;
      width: 100%;
      transform-origin: left;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
    }
    .sc-toast-success .sc-toast-progress-bar {
      background: linear-gradient(90deg, #00FF85, #00D4FF);
    }
    .sc-toast-error .sc-toast-progress-bar {
      background: linear-gradient(90deg, #FF3366, #FF7B00);
    }
    .sc-toast-warning .sc-toast-progress-bar {
      background: linear-gradient(90deg, #FFB800, #FF6B35);
    }
    .sc-toast-info .sc-toast-progress-bar {
      background: linear-gradient(90deg, #00D4FF, #9D00FF);
    }
  `;
  document.head.appendChild(style);
}

function showToast(title, message = '', type = 'info') {
  ensureToastStyles();

  let container = document.getElementById('smartcart-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'smartcart-toast-container';
    document.body.appendChild(container);
  }

  // Dismiss oldest toast if more than 4 on screen
  const existingToasts = container.querySelectorAll('.sc-toast-item:not(.sc-toast-closing)');
  if (existingToasts.length >= 4) {
    dismissToast(existingToasts[0]);
  }

  // Theme check
  const isLight = document.documentElement.getAttribute('data-theme') === 'light' || 
                  document.body.classList.contains('light-theme') ||
                  localStorage.getItem('sc-theme') === 'light';

  // Smart Icon Selection
  let iconClass = 'fa-circle-info';
  const lowerTitle = (title || '').toLowerCase();
  const lowerMsg = (message || '').toLowerCase();

  if (type === 'success') {
    if (lowerTitle.includes('wishlist') || lowerMsg.includes('wishlist')) {
      iconClass = 'fa-heart';
    } else if (lowerTitle.includes('cart') || lowerMsg.includes('cart')) {
      iconClass = 'fa-bag-shopping';
    } else {
      iconClass = 'fa-circle-check';
    }
  } else if (type === 'error') {
    iconClass = 'fa-circle-exclamation';
  } else if (type === 'warning') {
    iconClass = 'fa-triangle-exclamation';
  } else {
    // Info
    if (lowerTitle.includes('language') || lowerMsg.includes('language') || lowerMsg.includes('සිංහල') || lowerMsg.includes('tamil') || lowerMsg.includes('english')) {
      iconClass = 'fa-globe';
    } else if (lowerTitle.includes('wishlist')) {
      iconClass = 'fa-heart';
    } else if (lowerTitle.includes('cart')) {
      iconClass = 'fa-cart-shopping';
    } else if (lowerTitle.includes('credentials') || lowerTitle.includes('demo')) {
      iconClass = 'fa-key';
    } else {
      iconClass = 'fa-circle-info';
    }
  }

  const hasMsg = Boolean(message && String(message).trim().length > 0);
  const toast = document.createElement('div');
  toast.className = `sc-toast-item sc-toast-${type} ${isLight ? 'sc-toast-light' : 'sc-toast-dark'} ${hasMsg ? 'has-msg' : 'sc-single-line'}`;
  
  toast.innerHTML = `
    <div class="sc-toast-icon-box">
      <i class="fas ${iconClass}"></i>
    </div>
    <div class="sc-toast-content">
      <div class="sc-toast-title">${title || 'Notification'}</div>
      ${hasMsg ? `<div class="sc-toast-msg">${message}</div>` : ''}
    </div>
    <button type="button" class="sc-toast-dismiss" title="Close" aria-label="Close">
      <i class="fas fa-xmark"></i>
    </button>
    <div class="sc-toast-progress-bar"></div>
  `;

  const closeBtn = toast.querySelector('.sc-toast-dismiss');
  const progressBar = toast.querySelector('.sc-toast-progress-bar');
  container.appendChild(toast);

  // Entrance animation
  requestAnimationFrame(() => {
    toast.classList.add('sc-toast-visible');
  });

  // Duration & pause-on-hover logic
  const DURATION = 3800;
  let remainingTime = DURATION;
  let startTime = Date.now();
  let dismissTimer = null;

  function startTimer() {
    startTime = Date.now();
    progressBar.style.transition = `transform ${remainingTime}ms linear`;
    progressBar.style.transform = 'scaleX(0)';

    dismissTimer = setTimeout(() => {
      dismissToast(toast);
    }, remainingTime);
  }

  function pauseTimer() {
    clearTimeout(dismissTimer);
    const elapsed = Date.now() - startTime;
    remainingTime = Math.max(0, remainingTime - elapsed);
    const computedWidth = progressBar.getBoundingClientRect().width;
    const parentWidth = toast.getBoundingClientRect().width || 1;
    const currentScale = computedWidth / parentWidth;
    progressBar.style.transition = 'none';
    progressBar.style.transform = `scaleX(${currentScale})`;
  }

  toast.addEventListener('mouseenter', pauseTimer);
  toast.addEventListener('mouseleave', () => {
    if (remainingTime > 0) startTimer();
  });

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dismissToast(toast);
  });

  startTimer();
}

function dismissToast(toastEl) {
  if (!toastEl || toastEl.classList.contains('sc-toast-closing')) return;
  toastEl.classList.remove('sc-toast-visible');
  toastEl.classList.add('sc-toast-closing');
  setTimeout(() => {
    toastEl.remove();
  }, 360);
}

// Auto-run on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  checkAuthSession();
});
