# SMART CANTEEN PRE-ORDERING SYSTEM 🍽️
> **“Because Good Food Shouldn’t Keep You Waiting!”**

A complete, modern full-stack web software prototype designed for college campuses to eliminate peak-hour canteen queues and waiting times through advance digital ordering, simulated UPI & Cash-at-Counter payments, dynamic QR token verification, live kitchen status tracking, and canteen operations management.

---

## 🎯 Project Overview & PBL Design Rationale

- **The Problem**: During peak intervals between lectures (12:00 PM – 2:00 PM lunch rush and 8:30 AM breakfast), hundreds of students crowd the canteen. Traditional counter lines cause 20–30 minutes of lost time, delayed food preparation, disordered token management, and students arriving late to class or missing meals.
- **The Solution**: A responsive pre-ordering web application where students browse the live catalog, order from their classrooms or hostels, pay via digital UPI or cash at counter, receive an encrypted QR bill token, and collect their hot meal within seconds at an express pickup counter.
- **The 4-Step Flow**:
  1. `01 Choose Your Meal`
  2. `02 Pay Securely (UPI / Cash)`
  3. `03 Get QR Token & Bill`
  4. `04 Collect Food with Zero Waiting`

---

## 🔑 Demo Login Credentials

For testing and live demonstration, the system comes preloaded with realistic demo profiles:

### 👨‍🍳 Canteen Staff / Admin Portal
- **Email**: `admin@college.edu`
- **Password**: `admin123`
- **Role**: `admin`
- **Name**: Rajan (Canteen Manager)
- **Features**: Live Kitchen Orders Feed, Order Status Updates, Staff QR Scanner, Menu Catalog CMS, Real-Time Sales Analytics.

### 🎓 Demo Student Profiles (5 Accounts)
| Student Name | College ID | Email | Password |
| :--- | :--- | :--- | :--- |
| **Aditya Sharma** *(Default)* | `2023CS0101` | `student@college.edu` | `student123` |
| **Priya Patel** | `2023IT0204` | `priya@college.edu` | `student123` |
| **Rahul Verma** | `2023EC0312` | `rahul@college.edu` | `student123` |
| **Ananya Iyer** | `2023ME0415` | `ananya@college.edu` | `student123` |
| **Arjun Reddy** | `2023EE0520` | `arjun@college.edu` | `student123` |

*(Note: There is also a **"✨ Demo Logins"** button right in the top navigation bar to switch accounts in 1-click without retyping credentials!)*

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 18 + Vite
  - Tailwind CSS (Emerald & Navy clean modern design)
  - Lucide React (feather-light modern icons)
  - `qrcode.react` (high-fidelity dynamic QR codes)
  - `html5-qrcode` (webcam & camera scanner for staff)
  - `canvas-confetti` (interactive order confirmation bursts)
  - React Router DOM v6
- **Backend**:
  - Node.js (v24 compatible)
  - Express.js (REST APIs)
  - JWT (JSON Web Tokens) for authentication
  - Bcrypt.js for secure password hashing
  - `qrcode` for server-side token generation
- **Database & Persistence**:
  - **MongoDB / Mongoose**: Standard production schemas for `Users`, `FoodItems`, `Orders`, `Payments`, and `Notifications`.
  - **Zero-Failure Hybrid Storage Adapter**: Attempts connection to MongoDB (`mongodb://127.0.0.1:27017/smart_canteen` or `MONGODB_URI`). If a local MongoDB daemon is not running on the evaluator's machine, it automatically and seamlessly operates on a built-in persistent JSON file store (`server/data/store.json`) with zero configuration or crashes.

---

## 📁 Project Directory Structure

```
d:/project/
├── package.json                 # Root script runner (concurrent dev commands)
├── README.md                    # System documentation and execution guide
├── server/                      # Node.js + Express REST API Backend
│   ├── .env                     # Server environment settings
│   ├── package.json
│   ├── server.js                # Express app entry & route mounting
│   ├── config/
│   │   └── db.js                # MongoDB connection & hybrid persistent engine
│   ├── models/
│   │   └── schemas.js           # Mongoose schemas (User, FoodItem, Order, Payment, Notification)
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification & requireAdmin guards
│   ├── controllers/
│   │   ├── authController.js    # Login, signup, me, demo credentials
│   │   ├── foodController.js    # Catalog filtering, search, CRUD, availability
│   │   ├── orderController.js   # Order placement, QR token generation, status transitions
│   │   ├── paymentController.js # Simulated UPI gateway processing & TXN generation
│   │   ├── analyticsController.js # Daily revenue, peak rush hours, popular items
│   │   └── notificationController.js # In-app notification drawer & read marks
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── foodRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── analyticsRoutes.js
│   │   └── notificationRoutes.js
│   └── data/
│       ├── seedData.js          # Realistic preloaded students, food items & orders
│       └── store.json           # File-backed persistence data store
└── client/                      # React 18 + Vite + Tailwind CSS Frontend
    ├── package.json
    ├── vite.config.js           # Vite dev server with /api proxy to :5000
    ├── tailwind.config.js       # Modern college theme colors & extensions
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx              # Router & Route Guards (ProtectedRoute, AdminRoute)
        ├── index.css            # Tailwind directives, print styles for bill
        ├── services/
        │   └── api.js           # Centralized fetch client with JWT token injection
        ├── context/
        │   ├── AuthContext.jsx  # User session, login, logout, quick account switch
        │   └── CartContext.jsx  # Tray state, quantities, subtotal calculations
        ├── components/
        │   ├── Navbar.jsx       # Header, demo switcher, cart badge, notification bell
        │   ├── Footer.jsx       # Canteen hours, contacts, 4-step flow
        │   ├── FoodCard.jsx     # Food image, price, prep time, quantity stepper, add button
        │   ├── StatusBadge.jsx  # Visual badges for Order & Payment statuses
        │   └── BillModal.jsx    # Printable digital order receipt & token QR
        └── pages/
            ├── HomePage.jsx             # Hero, 4-step flow, Problem/Solution section
            ├── LoginPage.jsx            # Student & Staff login, sign up, demo buttons
            ├── DashboardPage.jsx        # Greeting, active kitchen order, quick ordering
            ├── MenuPage.jsx             # Search, category filter, price sorting, availability
            ├── CartPage.jsx             # Tray items, quantity updates, order summary
            ├── CheckoutPage.jsx         # Student details, UPI simulator modal, Cash option
            ├── ConfirmationPage.jsx     # Order confirmed, dynamic QR, confetti, print bill
            ├── TrackingPage.jsx         # Live progress timeline & step simulation helper
            ├── MyOrdersPage.jsx         # Student order history & past bills
            ├── AdminDashboardPage.jsx   # KPI cards, orders table, kitchen status actions
            ├── QRScannerPage.jsx        # Staff QR verification scanner (camera & lookup)
            ├── MenuManagementPage.jsx   # Admin Food CRUD & 1-click availability toggles
            └── AnalyticsPage.jsx        # Revenue charts, popular food items, peak hours
```

---

## 🍽️ Canteen Menu Catalog (Preloaded)

1. **Idli Sambar** — ₹30 *(Breakfast)*
2. **Veg Noodles** — ₹70 *(Meals)*
3. **Veg Sandwich** — ₹40 *(Snacks)*
4. **Veg Fried Rice** — ₹80 *(Meals)*
5. **Masala Dosa** — ₹40 *(Breakfast)*
6. **Lemon Rice** — ₹50 *(Meals)*
7. **Crispy Samosa (2 Pcs)** — ₹20 *(Snacks)*
8. **Masala Tea** — ₹15 *(Beverages)*
9. **South Indian Filter Coffee** — ₹20 *(Beverages)*
10. **Fresh Orange Juice** — ₹40 *(Beverages)*
11. **Paneer Kathi Roll** — ₹60 *(Snacks)*
12. **Chole Bhature** — ₹75 *(Meals)*

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/login` — Authenticate student or staff; returns JWT & profile
- `POST /api/auth/register` — Register student account
- `GET  /api/auth/me` — Get profile for active session
- `GET  /api/auth/demo-accounts` — List pre-seeded student and admin accounts
- `POST /api/auth/forgot-password` — Password recovery simulation

### Foods (`/api/foods`)
- `GET    /api/foods` — Filter by `?category=...`, `?search=...`, `?sort=...`, `?availableOnly=true`
- `GET    /api/foods/:id` — Get single food item
- `POST   /api/foods` — *(Admin)* Add new food item
- `PUT    /api/foods/:id` — *(Admin)* Update food details
- `PATCH  /api/foods/:id/toggle-availability` — *(Admin)* Toggle In-Stock / Sold-Out
- `DELETE /api/foods/:id` — *(Admin)* Remove food item

### Orders (`/api/orders`)
- `POST  /api/orders` — Place order; calculates totals, assigns Order ID, creates dynamic QR
- `GET   /api/orders/my-orders` — Student's personal order history
- `GET   /api/orders` — *(Admin)* All incoming and past canteen orders
- `GET   /api/orders/:id` — Order details
- `PATCH /api/orders/:id/status` — *(Admin)* Update status (`Preparing` → `Ready` → `Collected`)
- `POST  /api/orders/verify-qr` — *(Admin/Staff)* Scan / verify QR code
- `PATCH /api/orders/:id/collect` — *(Admin/Staff)* Hand over meal, mark collected & cash paid
- `POST  /api/orders/:id/simulate-next` — Demonstration helper to advance status step

### Payments (`/api/payments`)
- `POST /api/payments/simulate` — Safe UPI simulation gateway with unique `TXN...` generation

### Analytics (`/api/analytics`)
- `GET /api/analytics/stats` — *(Admin)* KPI statistics, 7-day revenue, popular meals, peak rush times

### Notifications (`/api/notifications`)
- `GET   /api/notifications` — In-app alerts for student order updates
- `PATCH /api/notifications/mark-read` — Mark notifications as read

---

## 🚀 How to Run the Application

### Option A: Run Both Together (Recommended)
From the project root directory (`d:\project`):

```bash
npm run dev
```
This concurrently starts:
- Backend Express Server at **`http://localhost:5000`**
- Frontend Vite App at **`http://localhost:5173`**

---

### Option B: Run Individually

#### 1. Start Backend:
```bash
cd server
npm start
# Server listens on http://localhost:5000
```

#### 2. Start Frontend:
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

Open your browser and navigate to:
👉 **`http://localhost:5173`**

---

## 🧪 Step-by-Step Prototype Walkthrough Guide

1. **Visit Landing Page (`/`)**:
   - Observe the project hero, tagline *“Because Good Food Shouldn’t Keep You Waiting!”*, the 4-step pre-ordering process, and the Problem / Solution rationale card.
2. **Login as Student (`/login`)**:
   - Click the **"Student Demo"** quick button (or enter `student@college.edu` / `student123`).
   - You are redirected to the **Student Dashboard (`/dashboard`)**.
3. **Explore Menu & Add Food (`/menu`)**:
   - Filter by categories: *Breakfast*, *Meals*, *Snacks*, *Beverages*.
   - Use the price sorting and search bar (e.g. search "Dosa" or "Noodles").
   - Adjust quantities using `+` / `-` and click **"Add to Cart"**.
4. **View Cart Tray (`/cart`)**:
   - Inspect selected items, update quantity, verify student fee waiver (₹0 service fee).
   - Click **"Proceed to Checkout"**.
5. **Checkout & Payment (`/checkout`)**:
   - Review pre-filled student details (*Aditya Sharma*, *2023CS0101*).
   - Test **GPay / UPI**:
     - Click "Proceed to UPI Payment".
     - Select Google Pay / PhonePe, click **"Pay Now"**.
     - Experience the animated processing spinner and instant approval with a generated `TXN...` reference!
   - *(Alternatively, test **Cash at Counter** for "Payment Pending" flow).*
6. **Order Confirmation & Dynamic QR (`/confirmation/:id`)**:
   - Observe confetti burst, unique Order ID (e.g., `ORD-20260922-011`), and the dynamic QR Code.
   - Click **"Download Bill / Print Receipt"** to view and print the formatted college canteen bill.
7. **Live Order Tracking (`/tracking/:id`)**:
   - Watch the multi-step timeline: `Order Placed` → `Payment Confirmed` → `Preparing` → `Ready for Pickup` → `Collected`.
   - Click **"Simulate Next Status →"** to watch the kitchen advance the order in real time!
8. **Staff Admin Dashboard (`/admin`)**:
   - Switch to admin via the **"Demo Logins"** header modal or login with `admin@college.edu` / `admin123`.
   - View KPI numbers: Today's Orders, Pending, Preparing, Ready, Completed, Total Sales.
   - Use action buttons on any incoming order: *Accept & Prepare*, *Mark Ready*, *Mark Collected*.
9. **Staff QR Verification Scanner (`/admin/scanner`)**:
   - Enter an Order ID (or click any order from the Quick Test Picker on the left).
   - See the green **"ORDER VERIFIED"** banner, student name, and food items checklist.
   - Click **"Mark as Collected"** to fulfill and complete the token.
10. **Menu Management (`/admin/menu`)**:
    - Add a new dish or click the availability toggle on any item (e.g., toggle *Masala Dosa* to "Sold Out").
    - Open the student menu in another tab to observe immediate availability synchronization!
11. **Sales Analytics (`/admin/analytics`)**:
    - View 7-day revenue trend bar charts, order volume charts, top 5 popular food ranking, and peak rush hour distributions.

---

## 🛡️ Security & Reliability Implementations

- **Password Hashing**: Bcrypt with 10 salt rounds for all user accounts.
- **Session Tokens**: Cryptographically signed JSON Web Tokens (JWT) with 7-day expiry.
- **Route Authorization**: Strict role checks preventing students from accessing staff controls or modifying canteen catalog data.
- **Simulation Safety**: UPI payments are simulated safely for evaluation without storing sensitive financial credentials.
- **Dual Database Fallback**: Uninterrupted functionality regardless of whether MongoDB service is installed or active.
