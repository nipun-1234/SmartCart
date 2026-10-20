<div align="center">

# 🛒 SmartCart

### Next-Gen E-Commerce Platform with an AI Shopping Assistant

*A luxury dark-mode storefront, smart cart and coupons, order tracking, and a full admin control center, built for Sri Lankan digital retail.*

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v14%2B-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tests](https://img.shields.io/badge/Tests-14%2F14%20Passing-brightgreen?logo=node.js&logoColor=white)](#-automated-testing)
[![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel%20Ready-000000?logo=vercel&logoColor=white)](#-deployment)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

[Features](#-features) · [Quick Start](#-quick-start) · [Demo Login](#-demo-credentials) · [Tests](#-automated-testing) · [Structure](#-project-structure) · [Author](#-author)

</div>

---

## 📖 Overview

**SmartCart** is a production-grade, full-stack e-commerce platform built with **Node.js, Express, PostgreSQL, and Vanilla Web technologies**. It pairs a polished glassmorphic shopping experience with an interactive **AI Shopping Assistant**, a persistent hybrid cart, a dynamic coupon engine, order tracking, and a real-time admin analytics dashboard.

> 💡 **Zero-setup development:** no database? No problem. SmartCart ships with a resilient in-memory fallback store, so you can run the whole app locally in under a minute.

---

## ✨ Features

### 🤖 AI Shopping Assistant (`POST /api/chat`)

| Capability | What it does |
| :--- | :--- |
| **Floating 24/7 chatbot** | Dark glassmorphic widget available anywhere in the catalog |
| **Natural-language discovery** | Ask *"show me Dell laptops"* or *"Nike sneakers"* and get rich product cards with images, discounts, and an **Add to Cart** button |
| **Instant order tracking** | Enter `SC-2026-1001` or `101` to see status, destination, item breakdown, and totals in chat |
| **1-click coupons** | Ask about offers and apply `SMART10`, `WELCOME500`, or `SUPER20` instantly |
| **Bilingual FAQ** | Delivery times, island-wide COD, 14-day returns, and hotline support in **English and Sinhala** |

### 🛍️ Storefront & Catalog (`/products.html`)

- **Luxury dark theme** with a tailored HSL palette, smooth gradients, and glassmorphism
- **Smart navigation:** category dropdown with live product counts, multi-token keyword search, wishlist shortcut
- **Dedicated cart icon** that opens in a new tab (`/products.html#cart`)
- **Dynamic account pill:**
  - *Logged in:* `[ 👤 FirstName ▾ ]` with **My Orders** and **Sign Out**
  - *Logged out:* a clean `👤` icon opening a welcome card with **Sign In** and **Register**
- **Grid / List view** toggle
- **Advanced multi-filter engine:** Category, Brand, Rating, and Price Range (LKR), with removable active-filter chips

### 🛒 Cart, Coupons & Shipping

- **Persistent hybrid cart:** guest items live in `localStorage` and merge into the user's PostgreSQL account on sign-in
- **Live cart badges** in the navbar and floating buttons
- **Server-authoritative pricing:** tax/VAT, subtotal, and shipping are always calculated on the server
- **Free island-wide delivery** above **Rs. 48,000** (standard delivery: Rs. 1,917)

| Coupon | Discount | Minimum Order |
| :--- | :--- | :--- |
| `SMART10` | 10% OFF | Rs. 3,000 |
| `WELCOME500` | Rs. 500 OFF (flat) | Rs. 2,500 |
| `SUPER20` | 20% OFF | Rs. 15,000 |

### 💳 Checkout & Orders

- **Cash on Delivery (COD):** instant placement, pay at your doorstep
- **Credit / Debit Cards:** Stripe sandbox integration
- **Email receipts:** itemized HTML receipts with tracking number and shipping address
- **Customer dashboard:** all past orders with live status badges: `Pending` · `Paid` · `Processing` · `Shipped` · `Delivered` · `Cancelled`

### 📊 Admin Control Center (`/admin.html`)

- **Real-time metrics:** Total Revenue, Total Orders, Active Users, Catalog Items
- **Chart.js visualizations:** 7-day sales trend (line) and category breakdown (doughnut)
- **Full CRUD:** add, edit, restock, and delete products
- **Order management:** filter orders and update fulfillment status
- **User management:** accounts, verification flags, and roles

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Node.js (v20+), Express.js (v5.2), PostgreSQL (`pg`), RESTful APIs |
| **Security & Auth** | JWT (`jsonwebtoken`), `bcryptjs`, `helmet`, `express-rate-limit`, `cookie-parser` |
| **Frontend** | Semantic HTML5, Vanilla JavaScript (ES6+), Glassmorphic CSS3, Font Awesome 6, Chart.js |
| **Data & State** | PostgreSQL with in-memory offline fallback, `localStorage` client state |
| **Payments & Email** | Stripe sandbox, Cash on Delivery, HTML email receipts |
| **Deployment** | Vercel serverless (`api/[...path].js`) or standalone Node.js server |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** `v20.0.0` or higher
- **PostgreSQL** `v14+` *(optional, the fallback store works without it)*

### 1. Clone & install

```bash
git clone https://github.com/nipun-1234/SmartCart.git
cd SmartCart
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

The default values work out of the box for local development.

### 3. (Optional) Set up PostgreSQL

```bash
npm run db:migrate   # apply versioned SQL migrations
npm run db:seed      # load demo products, users, and coupons
```

### 4. Run the server

```bash
npm start            # production mode
npm run server:dev   # watch mode for development
```

### 5. Open the app

| Page | URL |
| :--- | :--- |
| 🏠 Landing page | http://localhost:3000/index.html |
| 🛍️ Storefront & catalog | http://localhost:3000/products.html |
| 📊 Admin dashboard | http://localhost:3000/admin.html |
| 🔐 Login | http://localhost:3000/login.html |
| 📝 Register | http://localhost:3000/signup.html |

---

## 🔑 Demo Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| 👑 **Administrator** | `admin@smartcart.lk` | `admin123` | Admin Dashboard, Products, Orders, Users |
| 🙋 **Customer** | `demo@smartcart.lk` | `demo123` | Storefront, Cart, Orders, Checkout |

> ⚠️ **For local demo use only.** Change or remove these accounts before any public deployment.

---

## 🧪 Automated Testing

```bash
npm test
```

**14 / 14 tests passing:**

| # | Area | What is verified |
| :-: | :--- | :--- |
| 1 | Health check | `/healthz` returns 200 OK |
| 2 | Vercel route | `/api/healthz` handler works |
| 3 | Storefront | Homepage is served at root |
| 4 | Auth failure | Invalid credentials rejected with 401 |
| 5 | Auth success | Valid signed JWT and user payload issued |
| 6 | Registration | New user creation and email verification token |
| 7 | Catalog API | Filtering, pagination, multi-word search |
| 8 | Coupons | Minimum-spend rules and discount math |
| 9 | Cart & checkout | Add items, server sync, COD order creation |
| 10 | Admin protection | Bearer token and admin role enforced on `/api/admin/stats` |
| 11 | 404 handling | Graceful fallback for unknown API routes |
| 12 | Dynamic categories | Category list with live product counts |
| 13 | Multi-category filtering | Correct results across grocery, tech, fashion, beauty |
| 14 | Safe querying | Empty or new categories handled without errors |

---

## 🔒 Security

- **JWT authentication** with `bcryptjs` password hashing
- **`helmet`** secure HTTP headers
- **`express-rate-limit`** protection against brute-force and abuse
- **Role-based access control** on all admin endpoints
- **Server-side price, tax, and coupon calculation**, so clients cannot tamper with totals

---

## 📁 Project Structure

```text
SmartCart/
├── api/                       # Vercel serverless entrypoints
│   ├── [...path].js
│   └── index.js
├── migrations/                # Versioned PostgreSQL migrations
│   ├── 001_initial_schema.sql
│   └── 002_add_coupons_and_stripe.sql
├── public/                    # Static storefront assets
│   ├── css/
│   │   ├── main.css           # Core design tokens & variables
│   │   └── smartcart-sections.css
│   ├── js/
│   │   └── shared.js          # Auth state, persistent cart, toasts
│   ├── admin.html             # Admin dashboard (Chart.js analytics)
│   ├── index.html             # Landing page
│   ├── login.html             # Login & password reset
│   ├── products.html          # Catalog, cart view & AI chatbot
│   └── signup.html            # Customer registration
├── scripts/
│   ├── migrate.js             # Migration runner
│   └── seed.js                # Database seeder
├── src/
│   ├── config/                # Database pool connection
│   ├── db/store.js            # Data store with resilient fallback
│   ├── middleware/auth.js     # Authentication & authorization guards
│   ├── routes/
│   │   ├── adminRoutes.js     # Admin operations & analytics
│   │   ├── authRoutes.js      # Auth, profile, password reset
│   │   ├── cartRoutes.js      # Cart persistence
│   │   ├── chatRoutes.js      # AI chatbot engine
│   │   ├── couponRoutes.js    # Coupon validation
│   │   ├── orderRoutes.js     # Order placement & tracking
│   │   └── productRoutes.js   # Product catalog
│   ├── services/
│   │   ├── emailService.js    # HTML receipts & notifications
│   │   └── paymentService.js  # Stripe sandbox & COD
│   └── app.js                 # Express app factory & security middleware
├── test/
│   └── app.test.js            # Integration test suite
├── package.json
└── server.js                  # Application entry point
```

---

## ☁️ Deployment

SmartCart runs in two modes:

- **Vercel (serverless):** the `api/` directory is already wired up. Import the repo into Vercel, add your environment variables, and deploy.
- **Standalone Node.js:** run `npm start` behind a process manager such as PM2 or systemd, with a reverse proxy like Nginx.

For production, set a strong JWT secret, use a managed PostgreSQL instance, and replace the demo credentials.

---

## 🗺️ Roadmap

- [ ] Product reviews and ratings submission
- [ ] Live Stripe payments (production keys)
- [ ] Multi-currency support
- [ ] Order cancellation and return requests from the customer dashboard
- [ ] Admin CSV export for orders and products

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "Add amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please make sure `npm test` passes before submitting.

---

## 👨‍💻 Author

**Nipun Sudusinghe**
Full-stack developer and creator of SmartCart.

[![GitHub](https://img.shields.io/badge/GitHub-nipun--1234-181717?logo=github&logoColor=white)](https://github.com/nipun-1234)

---

## 📄 License

Licensed under the **ISC License**.

<div align="center">

Developed with ❤️ by **Nipun Sudusinghe** for next-generation digital retail in South Asia.

⭐ If you like this project, give it a star!

</div>
