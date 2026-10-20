# 🛒 SmartCart - Next-Gen E-Commerce Platform

[![Node.js Version](https://img.shields.io/badge/Node.js-v20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express-v5.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v14%2B-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tests](https://img.shields.io/badge/Tests-14%2F14%20Passing-brightgreen?logo=node.js&logoColor=white)](https://github.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

A production-grade, full-stack digital commerce platform engineered with **Node.js, Express, PostgreSQL, and high-performance Vanilla Web Components**. SmartCart combines a luxury dark-mode shopping experience with an interactive **AI Shopping Assistant**, persistent cart synchronization, dynamic coupon calculation, order tracking, and an extensive admin analytics control center.

---

## 🌟 Key Highlights & Real-World Features

### 🤖 1. Live AI Shopping Assistant (`POST /api/chat`)
* **Floating 24/7 Chatbot**: Dark glassmorphic interface accessible from anywhere on the catalog via the floating action widget.
* **Natural Language Product Discovery**: Type queries like *"show me Dell laptops"* or *"Nike sneakers"* to receive rich interactive cards with images, discounts, and direct `[ Add to Cart ]` actions.
* **Instant Order Tracking**: Enter order IDs like `SC-2026-1001` or `101` to view live shipping status, destination, item breakdowns, and totals inside the chat.
* **1-Click Coupon Claim**: Inquiring about offers returns active codes (`SMART10`, `WELCOME500`, `SUPER20`) with 1-click apply buttons.
* **FAQ & Policy Guidance**: Answers queries regarding delivery times, island-wide COD, 14-day return policies, and hotline support in both **English and Sinhala**.

### 🛍️ 2. Premium Storefront & Catalog Experience (`/products.html`)
* **Luxury Dark Theme & Glassmorphism**: Tailored HSL color palette, smooth gradients, and ambient lighting with zero viewport overflow.
* **Dynamic Header & Navigation**:
  * Quick Category dropdown menu with live product counts.
  * Direct search bar with multi-token keyword matching.
  * Wishlist quick access.
  * Dedicated Cart icon that opens in a **new tab** (`/products.html#cart`).
  * **Dynamic Account Profile Pill**:
    * **Logged In**: Displays `[ 👤 FirstName ▾ ]` with dropdown for *My Orders* and *Sign Out*.
    * **Logged Out**: Displays a clean `👤` circular icon that opens a welcome card with a prominent **Sign In** button and **Register** link.
* **Dual View Catalog**: Instant toggle between **Grid View** and **List View**.
* **Advanced Multi-Filter Engine**: Filter simultaneously by Category, Brand, Rating, and Price Range (Min/Max LKR) with active filter chip removal.

### 🛒 3. Cart, Coupons & Free Shipping
* **Persistent Hybrid Cart**:
  * Guest items saved to `localStorage` and automatically merged to the user's PostgreSQL account upon sign-in.
  * Live cart counter badges in the navbar and floating buttons.
* **Automated Calculations**: Authoritative server-side tax/VAT, subtotal, and shipping fee calculation.
* **Free Delivery Threshold**: Free island-wide shipping on orders exceeding **Rs. 48,000** (standard delivery: Rs. 1,917).
* **Coupon Validation Engine**:
  * `SMART10`: 10% OFF on orders over Rs. 3,000.
  * `WELCOME500`: Flat Rs. 500 OFF on orders over Rs. 2,500.
  * `SUPER20`: 20% OFF on orders over Rs. 15,000.

### 💳 4. Checkout & Order Lifecycle
* **Flexible Payment Methods**:
  * **Cash on Delivery (COD)**: Instant order placement with payment due upon doorstep delivery.
  * **Credit / Debit Cards**: Integrated Stripe sandbox processing.
* **Email Notifications**: Generates itemized HTML receipts with delivery tracking numbers and shipping addresses.
* **Customer Orders Dashboard**: View all past deliveries with live status badges (`Pending`, `Paid`, `Processing`, `Shipped`, `Delivered`, `Cancelled`).

### 📊 5. Administrative Control Center (`/admin.html`)
* **Real-Time Analytics**: Live metrics for Total Revenue, Total Orders, Active Users, and Catalog Items.
* **Interactive Data Visualizations**: Sales Trend 7-day line chart and Category Breakdown doughnut chart powered by Chart.js.
* **Full CRUD Management**:
  * Add, edit, update stock, and delete products.
  * Filter and update order fulfillment statuses.
  * Manage customer accounts, verification flags, and roles.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Node.js (v20+), Express.js (v5.2), PostgreSQL (`pg`), RESTful APIs |
| **Security & Auth** | JWT (`jsonwebtoken`), `bcryptjs`, `helmet`, `express-rate-limit`, `cookie-parser` |
| **Frontend** | Semantic HTML5, Vanilla JavaScript (ES6+), Glassmorphic CSS3, Font Awesome 6 |
| **Data & State** | PostgreSQL with resilient in-memory offline fallback store, `localStorage` client state |
| **Deployment** | Vercel Serverless Ready (`api/[...path].js`) or Node.js standalone daemon |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: `v20.0.0` or higher
* **PostgreSQL**: `v14` or higher *(Optional: The built-in resilient fallback store enables immediate offline development without requiring a live database).*

### 1. Clone & Install
```bash
git clone https://github.com/nipun-1234/SmartCart.git
cd SmartCart
npm install
```

### 2. Configure Environment
Create your `.env` configuration file:
```bash
cp .env.example .env
```
*(The pre-configured default values work out of the box for local development).*

### 3. (Optional) Database Setup
If running against a local or remote PostgreSQL instance:
```bash
npm run db:migrate
npm run db:seed
```

### 4. Run the Server
```bash
# Start production server
npm start

# Or start in watch mode
npm run server:dev
```
Open **`http://localhost:3000`** in your browser:
* **Landing Page**: `http://localhost:3000/index.html`
* **Catalog & Storefront**: `http://localhost:3000/products.html`
* **Admin Dashboard**: `http://localhost:3000/admin.html`
* **Login / Register**: `http://localhost:3000/login.html` & `http://localhost:3000/signup.html`

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@smartcart.lk` | `admin123` | Full Admin Dashboard (`/admin.html`), Products, Orders, Users |
| **Customer** | `demo@smartcart.lk` | `demo123` | Storefront (`/products.html`), Cart, Orders, Checkout |

---

## 🧪 Automated Testing

SmartCart includes an end-to-end integration and smoke test suite:
```bash
npm test
```

### Test Coverage (14 / 14 Suites Passing):
1. **Health Check Endpoint**: `/healthz` status 200 OK.
2. **Vercel Serverless Route**: `/api/healthz` handler verification.
3. **Storefront Serving**: Homepage root availability.
4. **Auth Failure**: Rejects invalid or malformed credentials with 401.
5. **Auth Success**: Issues valid signed JWT and user payload.
6. **Registration Workflow**: Validates new user creation and email verification token.
7. **Catalog API**: Parameterized filtering, pagination, and multi-word searches.
8. **Coupons Engine**: Minimum spend validation and discount mathematics.
9. **Cart & Checkout**: Item addition, server synchronization, and Cash on Delivery order creation.
10. **Admin Protection**: Enforces Bearer token and admin role permissions on `/api/admin/stats`.
11. **404 Route Handling**: Graceful fallback on undefined API routes.
12. **Dynamic Categories**: Category list with real-time product counts.
13. **Multi-Category Filtering**: Correct items returned across grocery, tech, fashion, and beauty.
14. **Safe Querying**: Gracefully handles non-existent or newly initialized categories without errors.

---

## 📁 Repository Structure

```text
SmartCart/
├── api/                       # Vercel serverless function entrypoints
│   ├── [...path].js
│   └── index.js
├── migrations/                # Versioned SQL migrations for PostgreSQL
│   ├── 001_initial_schema.sql
│   └── 002_add_coupons_and_stripe.sql
├── public/                    # Static web assets & storefront templates
│   ├── css/
│   │   ├── main.css           # Core styling tokens & variables
│   │   └── smartcart-sections.css
│   ├── js/
│   │   └── shared.js          # Unified auth state, persistent cart & toast notifications
│   ├── admin.html             # Admin dashboard with Chart.js analytics
│   ├── index.html             # Storefront landing page
│   ├── login.html             # Authentication & password reset
│   ├── products.html          # Redesigned catalog, cart view, and AI Chatbot
│   └── signup.html            # Customer registration
├── scripts/
│   ├── migrate.js             # Migration runner script
│   └── seed.js                # Database seeder
├── src/
│   ├── config/                # Database pool connection
│   ├── db/
│   │   └── store.js           # Central data store with resilient fallback
│   ├── middleware/
│   │   └── auth.js            # Authentication & authorization guards
│   ├── routes/
│   │   ├── adminRoutes.js     # Admin operations & analytics
│   │   ├── authRoutes.js      # Auth, profile, and password reset endpoints
│   │   ├── cartRoutes.js      # Shopping cart persistence
│   │   ├── chatRoutes.js      # SmartCart AI Live Chatbot engine
│   │   ├── couponRoutes.js    # Coupon validation
│   │   ├── orderRoutes.js     # Order placement & tracking
│   │   └── productRoutes.js   # Product catalog endpoints
│   ├── services/
│   │   ├── emailService.js    # HTML receipt and notification dispatcher
│   │   └── paymentService.js  # Stripe sandbox & Cash on Delivery
│   └── app.js                 # Express application factory & security middleware
├── test/
│   └── app.test.js            # Automated integration test suite
├── package.json               # Dependencies & scripts
└── server.js                  # Application entry point
```

---

## 📄 License

This project is licensed under the **ISC License**. Developed with ❤️ for next-generation digital retail in South Asia.
