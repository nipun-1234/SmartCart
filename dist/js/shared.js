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
          <button type="button" class="user-profile-btn" style="background: linear-gradient(135deg, rgba(0,255,133,0.15), rgba(0,212,255,0.15)); border: 1px solid rgba(0,255,133,0.4); color: #fff; padding: 6px 14px; border-radius: 25px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600;">
            <i class="fas fa-user-circle" style="color: var(--lime-green, #00FF85); font-size: 1.1rem;"></i>
            <span>${user.first_name || 'Account'}</span>
            <i class="fas fa-chevron-down" style="font-size: 0.75rem; opacity: 0.7;"></i>
          </button>
          <div class="dropdown-content user-dropdown-menu" style="display: none; position: absolute; right: 0; top: 110%; background: rgba(10,10,26,0.96); backdrop-filter: blur(20px); border: 1px solid rgba(0,212,255,0.25); border-radius: 14px; min-width: 200px; padding: 8px; z-index: 1000; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <div style="padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 5px;">
              <p style="margin: 0; font-size: 0.85rem; color: #fff; font-weight: 700;">${user.first_name} ${user.last_name || ''}</p>
              <p style="margin: 0; font-size: 0.75rem; color: rgba(255,255,255,0.6);">${user.email}</p>
              ${user.role === 'admin' ? '<span style="background: #FF0080; color: #fff; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; font-weight: bold; text-transform: uppercase;">Admin</span>' : ''}
            </div>
            <a href="/products.html#ordersPage" onclick="showCustomerOrders(); return false;" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; color: rgba(255,255,255,0.85); text-decoration: none; border-radius: 8px; transition: 0.2s;">
              <i class="fas fa-box" style="color: var(--electric-blue, #00D4FF);"></i> My Orders
            </a>
            ${user.role === 'admin' ? `
            <a href="/admin.html" style="display: flex; align-items: center; gap: 8px; padding: 8px 12px; color: rgba(255,255,255,0.85); text-decoration: none; border-radius: 8px; transition: 0.2s;">
              <i class="fas fa-gauge-high" style="color: var(--neon-pink, #FF0080);"></i> Admin Dashboard
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
  document.querySelectorAll('.cart-count, #cartCount').forEach((badge) => {
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

// ================= TOAST NOTIFICATIONS =================

function showToast(title, message, type = 'info') {
  let container = document.getElementById('smartcart-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'smartcart-toast-container';
    container.style.cssText = `
      position: fixed;
      top: 25px;
      right: 25px;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bg =
    type === 'success'
      ? 'linear-gradient(135deg, rgba(0, 255, 133, 0.95), rgba(0, 212, 255, 0.95))'
      : type === 'error'
      ? 'linear-gradient(135deg, rgba(255, 0, 128, 0.95), rgba(255, 75, 75, 0.95))'
      : 'linear-gradient(135deg, rgba(157, 0, 255, 0.95), rgba(0, 212, 255, 0.95))';

  const icon =
    type === 'success'
      ? 'fa-circle-check'
      : type === 'error'
      ? 'fa-circle-xmark'
      : 'fa-bell';

  toast.style.cssText = `
    background: ${bg};
    color: ${type === 'success' ? '#000' : '#fff'};
    padding: 14px 20px;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.35);
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 280px;
    max-width: 380px;
    pointer-events: auto;
    font-family: 'Segoe UI', system-ui, sans-serif;
    transform: translateX(120%);
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
    border: 1px solid rgba(255,255,255,0.25);
  `;

  toast.innerHTML = `
    <i class="fas ${icon}" style="font-size: 1.4rem;"></i>
    <div style="flex: 1;">
      <div style="font-weight: 700; font-size: 0.95rem;">${title}</div>
      ${message ? `<div style="font-size: 0.85rem; opacity: 0.95; margin-top: 2px;">${message}</div>` : ''}
    </div>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// Auto-run on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  checkAuthSession();
});
