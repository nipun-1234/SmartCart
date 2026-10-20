<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=260&section=header&text=SmartCart&fontSize=84&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=Next-Gen%20E-Commerce%20Platform%20%E2%80%A2%20by%20Nipun%20Sudusinghe&descAlignY=60&descSize=20" alt="SmartCart - Next-Gen E-Commerce Platform" width="100%" />

<br/>

<a href="https://github.com/nipun-1234/SmartCart"><img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&duration=3200&pause=900&color=A78BFA&center=true&vCenter=true&width=720&lines=AI+Shopping+Assistant+%E2%80%A2+English+%26+Sinhala;Smart+Cart+%2B+Coupon+Engine+%2B+Free+Shipping;Real-Time+Admin+Analytics+Dashboard;Built+with+Node.js+%C2%B7+Express+%C2%B7+PostgreSQL" alt="Typing animation" /></a>

<br/>

<img src="https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Express-v5.2-000000?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/PostgreSQL-v14+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/Stripe-Sandbox-635BFF?style=for-the-badge&logo=stripe&logoColor=white" />

<img src="https://img.shields.io/badge/Tests-14%2F14%20Passing-22c55e?style=for-the-badge&logo=checkmarx&logoColor=white" />
<img src="https://img.shields.io/badge/Deploy-Vercel%20Ready-000000?style=for-the-badge&logo=vercel&logoColor=white" />
<img src="https://img.shields.io/badge/License-ISC-7c3aed?style=for-the-badge" />

<br/><br/>

**[✨ Features](#-features)** &nbsp;•&nbsp; **[🚀 Quick Start](#-quick-start)** &nbsp;•&nbsp; **[🔑 Demo](#-demo-credentials)** &nbsp;•&nbsp; **[🧪 Tests](#-automated-testing)** &nbsp;•&nbsp; **[📁 Structure](#-project-structure)** &nbsp;•&nbsp; **[👨‍💻 Author](#-author)**

</div>

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=6,11,20&height=4&section=header" width="100%" />

## 📖 Overview

**SmartCart** is a production-grade, full-stack e-commerce platform built with **Node.js, Express, PostgreSQL and Vanilla Web Components**. It combines a luxury dark-mode, glassmorphic shopping experience with an interactive **AI Shopping Assistant**, a persistent hybrid cart, a dynamic coupon engine, order tracking, and a real-time admin analytics control center.

> 💡 **Zero-setup development.** No database? No problem. A resilient in-memory fallback store lets you run the entire app locally in under a minute.

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=6,11,20&height=4&section=header" width="100%" />

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🤖 AI Shopping Assistant
`POST /api/chat`

- Floating 24/7 glassmorphic chatbot
- **Natural-language search**: *"show me Dell laptops"*, *"Nike sneakers"*
- Rich product cards with **Add to Cart**
- **Order tracking** by ID (`SC-2026-1001` or `101`)
- **1-click coupons**: `SMART10`, `WELCOME500`, `SUPER20`
- FAQ in **English and Sinhala**: delivery, island-wide COD, 14-day returns, hotline

</td>
<td width="50%" valign="top">

### 🛍️ Premium Storefront
`/products.html`

- Luxury dark theme, HSL palette, glassmorphism
- Category dropdown with **live product counts**
- Multi-token keyword search and wishlist
- **Grid / List** view toggle
- Filters: Category, Brand, Rating, Price (LKR) with removable chips
- Smart **account pill**: `👤 FirstName ▾` when signed in, `👤` with Sign In / Register when not

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🛒 Cart, Coupons & Shipping

- **Hybrid cart**: guest `localStorage` merges into PostgreSQL on sign-in
- Live cart badges in navbar and floating buttons
- **Server-authoritative** tax/VAT, subtotal and shipping
- 🚚 **Free island-wide delivery** over **Rs. 48,000** (standard: Rs. 1,917)

</td>
<td width="50%" valign="top">

### 💳 Checkout & Orders

- **Cash on Delivery** with instant placement
- **Credit / Debit Cards** via Stripe sandbox
- Itemized **HTML email receipts** with tracking number
- Customer dashboard with live status badges:
  `Pending` · `Paid` · `Processing` · `Shipped` · `Delivered` · `Cancelled`

</td>
</tr>
</table>

<div align="center">

### 🎟️ Coupon Engine

| Code | Discount | Minimum Order |
| :---: | :---: | :---: |
| `SMART10` | **10% OFF** | Rs. 3,000 |
| `WELCOME500` | **Rs. 500 OFF** | Rs. 2,500 |
| `SUPER20` | **20% OFF** | Rs. 15,000 |

</div>

### 📊 Admin Control Center
`/admin.html`

| | |
| :--- | :--- |
| 📈 **Real-time analytics** | Total Revenue, Orders, Active Users, Catalog Items |
| 📉 **Visualizations** | 7-day sales trend (line) and category breakdown (doughnut) via Chart.js |
| 📦 **Product CRUD** | Add, edit, restock and delete products |
| 🚚 **Order management** | Filter orders and update fulfillment status |
| 👥 **User management** | Accounts, verification flags and roles |

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=6,11,20&height=4&section=header" width="100%" />

## 🛠️ Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=nodejs,express,postgres,js,html,css,vercel,git,github&theme=dark" alt="Tech stack icons" />

</div>

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Node.js (v20+), Express.js (v5.2), PostgreSQL (`pg`), RESTful APIs |
| **Security & Auth** | JWT (`jsonwebtoken`), `bcryptjs`, `helmet`, `express-rate-limit`, `cookie-parser` |
| **Frontend** | Semantic HTML5, Vanilla JavaScript (ES6+), Glassmorphic CSS3, Font Awesome 6, Chart.js |
| **Data & State** | PostgreSQL with in-memory offline fallback, `localStorage` client state |
| **Payments & Email** | Stripe sandbox, Cash on Delivery, HTML receipts |
| **Deployment** | Vercel serverless (`api/[...path].js`) or standalone Node.js |

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=6,11,20&height=4&section=header" width="100%" />

## 🚀 Quick Start

**Prerequisites:** Node.js `v20+` · PostgreSQL `v14+` *(optional)*

```bash
# 1. Clone & install
git clone https://github.com/nipun-1234/SmartCart.git
cd SmartCart
npm install

# 2. Configure environment (defaults work out of the box)
cp .env.example .env

# 3. (Optional) PostgreSQL setup
npm run db:migrate
npm run db:seed

# 4. Run
npm start              # production
npm run server:dev     # watch mode
```

Then open **http://localhost:3000**

| Page | URL |
| :--- | :--- |
| 🏠 Landing | `http://localhost:3000/index.html` |
| 🛍️ Storefront | `http://localhost:3000/products.html` |
| 📊 Admin | `http://localhost:3000/admin.html` |
| 🔐 Login | `http://localhost:3000/login.html` |
| 📝 Register | `http://localhost:3000/signup.html` |

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=6,11,20&height=4&section=header" width="100%" />

## 🔑 Demo Credentials

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| 👑 **Administrator** | `admin@smartcart.lk` | `admin123` | Admin Dashboard, Products, Orders, Users |
| 🙋 **Customer** | `demo@smartcart.lk` | `demo123` | Storefront, Cart, Orders, Checkout |

> ⚠️ **Local demo only.** Change or remove these accounts before any public deployment.

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=6,11,20&height=4&section=header" width="100%" />

## 🧪 Automated Testing

```bash
npm test
```

<details>
<summary><b>✅ 14 / 14 tests passing. Click to expand coverage</b></summary>

<br/>

| # | Area | Verified |
| :-: | :--- | :--- |
| 1 | Health check | `/healthz` returns 200 OK |
| 2 | Vercel route | `/api/healthz` handler works |
| 3 | Storefront | Homepage served at root |
| 4 | Auth failure | Invalid credentials rejected with 401 |
| 5 | Auth success | Signed JWT and user payload issued |
| 6 | Registration | User creation and email verification token |
| 7 | Catalog API | Filtering, pagination, multi-word search |
| 8 | Coupons | Minimum-spend rules and discount math |
| 9 | Cart & checkout | Add items, server sync, COD order creation |
| 10 | Admin protection | Bearer token and admin role on `/api/admin/stats` |
| 11 | 404 handling | Graceful fallback on unknown API routes |
| 12 | Dynamic categories | Category list with live counts |
| 13 | Multi-category filtering | Grocery, tech, fashion and beauty |
| 14 | Safe querying | Empty or new categories handled without errors |

</details>

## 🔒 Security

| 🔐 | |
| :--- | :--- |
| **Authentication** | JWT with `bcryptjs` password hashing |
| **HTTP hardening** | `helmet` secure headers |
| **Abuse protection** | `express-rate-limit` |
| **Access control** | Role-based guards on all admin endpoints |
| **Price integrity** | Server-side price, tax and coupon calculation |

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=6,11,20&height=4&section=header" width="100%" />

## 📁 Project Structure

<details>
<summary><b>📂 Click to expand repository tree</b></summary>

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
│   │   ├── main.css
│   │   └── smartcart-sections.css
│   ├── js/
│   │   └── shared.js          # Auth state, persistent cart, toasts
│   ├── admin.html             # Admin dashboard (Chart.js)
│   ├── index.html             # Landing page
│   ├── login.html             # Login & password reset
│   ├── products.html          # Catalog, cart view & AI chatbot
│   └── signup.html            # Registration
├── scripts/
│   ├── migrate.js
│   └── seed.js
├── src/
│   ├── config/                # Database pool connection
│   ├── db/store.js            # Data store with resilient fallback
│   ├── middleware/auth.js     # Auth & authorization guards
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── chatRoutes.js      # AI chatbot engine
│   │   ├── couponRoutes.js
│   │   ├── orderRoutes.js
│   │   └── productRoutes.js
│   ├── services/
│   │   ├── emailService.js
│   │   └── paymentService.js
│   └── app.js
├── test/
│   └── app.test.js
├── package.json
└── server.js
```

</details>

## ☁️ Deployment

- **Vercel (serverless):** the `api/` directory is already wired up. Import the repo, add environment variables, deploy.
- **Standalone Node.js:** run `npm start` behind PM2 or systemd with an Nginx reverse proxy.
- **Before going live:** set a strong JWT secret, use managed PostgreSQL, and replace the demo credentials.

## 🗺️ Roadmap

- [ ] Product reviews and ratings
- [ ] Live Stripe payments (production keys)
- [ ] Multi-currency support
- [ ] Customer order cancellation and returns
- [ ] Admin CSV export for orders and products

## 🤝 Contributing

Contributions, issues and feature requests are welcome.

1. Fork the repository
2. Create a branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m "Add amazing feature"`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request (make sure `npm test` passes)

<img src="https://capsule-render.vercel.app/api?type=rect&color=gradient&customColorList=6,11,20&height=4&section=header" width="100%" />

## 👨‍💻 Author

<div align="center">

### **Nipun Sudusinghe**
*Full-stack developer and creator of SmartCart*

<a href="https://github.com/nipun-1234"><img src="https://img.shields.io/badge/GitHub-nipun--1234-181717?style=for-the-badge&logo=github&logoColor=white" /></a>

<br/>

⭐ **If you like this project, give it a star!** ⭐

</div>

## 📄 License

Licensed under the **ISC License**. See [`LICENSE`](./LICENSE) for details.

<div align="center">
<br/>
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=130&section=footer&text=Developed%20with%20%E2%9D%A4%EF%B8%8F%20by%20Nipun%20Sudusinghe&fontSize=22&fontColor=ffffff&fontAlignY=72" width="100%" />
</div>
