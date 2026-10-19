

---

## 🌟 Implemented Core Real-World Features

### 1. User Accounts & Security
* **Registration & Login**: Secure password hashing with `bcryptjs` and session issuance via signed HTTP-only cookies and JWTs.
* **Email Verification**: Sends an email verification token with direct verification endpoint (`/api/auth/verify`).
* **Password Reset**: Automated password reset request with token generation (`/api/auth/forgot-password` and `/api/auth/reset-password`).
* **Customer Profile**: View and update customer details, phone number, and default delivery address.
* **Role-Based Authorization**: Distinct `customer` and `admin` roles protected by server-side middleware (`requireAuth`, `requireAdmin`).

### 2. Product Catalog & Discovery
* **REST API**: Fully powered by `/api/products` with parameterized database queries.
* **Filtering**: Real-time category filtering (Electronics, Clothing, Home, Sports, Books), brand selector, and price range controls (Min/Max LKR).
* **Search**: Live search by product name, description, and brand.
* **Sorting & Pagination**: Sort by Price (Low to High / High to Low), Top Customer Rated, and Newest with multi-page navigation.
* **Product Detail Modal**: High-res gallery image, brand, SKU, live stock badge (`In Stock`, `Only X Left`, `Sold Out`), star rating & reviews, detailed description, and quantity selector.

### 3. Shopping Cart & Coupons
* **Cart Persistence**: Automatically synchronizes to PostgreSQL for logged-in accounts, persists to `localStorage` for guests, and automatically merges guest items into user accounts upon sign-in.
* **Dynamic Calculations**: Real-time authoritative computation of line totals, 10% VAT/Tax, and delivery fees.
* **Free Shipping Threshold**: Free delivery on orders over **Rs. 48,000** (otherwise Rs. 1,917).
* **Coupon Engine**: Validates promo codes with minimum spend constraints and live discount feedback:
  * `SMART10`: 10% discount on orders over Rs. 3,000.
  * `WELCOME500`: Flat Rs. 500 discount on orders over Rs. 2,500.
  * `SUPER20`: 20% discount on orders over Rs. 15,000.

### 4. Checkout & Order Processing
* **Delivery Address Form**: Form with validation for recipient name, phone, street address, and city.
* **Payment Integrations**:
  * **Cash on Delivery (COD)**: Order placed in `pending` payment status, due upon parcel arrival.
  * **Credit / Debit Card (Stripe)**: Card fields with instant sandbox processing and tokenization.
* **Order Confirmation Email**: Dispatches itemized HTML invoice with delivery address snapshot and delivery details (logged to console in development, or sent via SMTP).

### 5. Order Management & Tracking
* **Order History**: Customers can view past and active orders via the storefront `Orders` tab.
* **Live Status Tracking**: Color-coded status badges: `Pending`, `Paid`, `Shipped`, `Delivered`, and `Cancelled`.
* **Cancellation**: Customers can safely cancel pending orders before shipment.

### 6. Admin Control Center (`/admin.html`)
* **Overview & Analytics**:
  * Real-time metrics: Total Paid Revenue, Total Orders, Pending Orders, Total Products, and Total Users.
  * Interactive **Sales Trend Chart** (last 7 days line chart) powered by Chart.js.
  * Interactive **Category Breakdown Chart** (doughnut chart).
* **Product Catalog Management**: Full CRUD operations (Add product with images, edit details, update stock, delete products).
* **Order Operations**: View all customer orders, filter by status, and update delivery status with live changes.
* **User Accounts View**: View all registered customers, email verification flags, and roles.
* **Category Management**: Create and delete store categories.

---

## 🚀 Quick Start & Local Setup

### Requirements
- **Node.js**: v20 or later
- **PostgreSQL**: v14 or later (Optional: Built-in high-performance fallback store enables instant offline development).

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` (pre-configured for local dev):
```bash
cp .env.example .env
```

### 3. (Optional) Run Database Migrations
If your local PostgreSQL server is active:
```bash
npm run db:migrate
npm run db:seed
```

### 4. Start the Application
```bash
npm start
# or for auto-reloading dev mode:
npm run dev
```

The application will be live at: **`http://localhost:3000`**

---

## 🔑 Default Demo Accounts

| Account Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@smartcart.lk` | `admin123` | Full Admin Dashboard (`/admin.html`), Products, Orders, Users |
| **Customer** | `demo@smartcart.lk` | `demo123` | Storefront (`/products.html`), Cart, Orders, Checkout |

---

## 🧪 Testing

Run the full end-to-end integration and smoke test suite:
```bash
npm test
```

All 11 unit and integration tests verify:
- Health check endpoints (`/healthz` and `/api/healthz`).
- Storefront HTML serving.
- Authentication validation, login credential verification, and user registration.
- REST product catalog filtering and pagination.
- Coupon code engine calculations.
- Cart workflow, guest cart management, and Cash on Delivery order creation.
- Protected admin routes with Bearer token authentication.

---

## 📁 Project Architecture

```text
SmartCart/
├── api/                       # Vercel serverless functions
│   ├── [...path].js
│   └── index.js
├── migrations/                # Versioned SQL migrations
│   ├── 001_initial_schema.sql # Core commerce database schema
│   └── 002_add_coupons_and_stripe.sql # Coupons, Stripe, and auth reset fields
├── public/                    # Static storefront & admin pages
│   ├── css/
│   │   └── main.css           # Core design system & shared master stylesheet
│   ├── js/
│   │   └── shared.js          # Unified auth state, persistent cart, toasts & navigation
│   ├── admin.html             # Admin Dashboard (Analytics, Products, Orders, Users)
│   ├── index.html             # High-converting landing page with featured products
│   ├── login.html             # Customer & admin login with password reset
│   ├── products.html          # Interactive catalog, cart view, and checkout modal
│   └── signup.html            # Customer registration
├── scripts/
│   ├── migrate.js             # PostgreSQL transaction migration runner
│   └── seed.js                # Database seeder with accounts and catalog
├── src/
│   ├── config/
│   │   └── database.js        # PostgreSQL pool configuration
│   ├── db/
│   │   └── store.js           # Authoritative database repository store
│   ├── middleware/
│   │   └── auth.js            # JWT verification, requireAuth, requireAdmin
│   ├── routes/
│   │   ├── adminRoutes.js     # Admin operations & analytics
│   │   ├── authRoutes.js      # Auth, register, login, profile, password reset
│   │   ├── cartRoutes.js      # Cart management & guest cart merging
│   │   ├── couponRoutes.js    # Coupon validation & promotion listing
│   │   ├── orderRoutes.js     # Checkout, order tracking, order cancellation
│   │   └── productRoutes.js   # Products listing, filters, search, and details
│   ├── services/
│   │   ├── emailService.js    # Order confirmation & verification templates
│   │   └── paymentService.js  # Stripe sandbox & Cash on Delivery handler
│   └── app.js                 # Shared Express app factory & security headers
├── test/
│   └── app.test.js            # End-to-end API test suite
├── .env                       # Local environment variables
└── server.js                  # Server entry point with graceful shutdown
```
