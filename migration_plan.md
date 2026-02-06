# Migration Plan: Al-Fanous Pastry Museum

This document outlines the plan to migrate the existing static HTML/JS website to a modern full-stack application using **React**, **Express**, **PostgreSQL**, **Framer Motion**, **GSAP**, and **Three.js**.

## 1. Architecture Overview

The application will be split into two main parts:
- **Client (Frontend):** A React Single Page Application (SPA) served by Vite.
- **Server (Backend):** An Express.js REST API connecting to a PostgreSQL database.

### Tech Stack
- **Frontend:**
  - **Framework:** React (Vite)
  - **Styling:** Tailwind CSS (reusing existing styles)
  - **Animations:** 
    - **Framer Motion:** For UI transitions, modals, and layout animations.
    - **GSAP:** For advanced scroll-triggered animations.
    - **Three.js (@react-three/fiber):** For 3D elements (Lantern, particles) to replace CSS 3D transforms.
  - **State Management:** React Context API + Hooks (or Zustand).
  - **Routing:** React Router DOM.
  - **HTTP Client:** Axios / Fetch.

- **Backend:**
  - **Runtime:** Node.js
  - **Framework:** Express.js
  - **Database:** PostgreSQL
  - **ORM:** Prisma (recommended for type safety and ease of use) or raw SQL.
  - **Authentication:** (Optional phase) JWT for Admin login.

## 2. Database Schema (PostgreSQL)

We will migrate the data currently stored in `localStorage` and hardcoded HTML to a relational database.

### Tables
1.  **products**
    - `id` (Serial/UUID)
    - `name` (String)
    - `description` (Text)
    - `price` (Decimal)
    - `category` (String)
    - `stock` (Integer)
    - `emoji` (String) - to keep the current visual style
    - `est_year` (Integer)
    - `created_at` (Timestamp)

2.  **orders**
    - `id` (Serial/UUID)
    - `customer_name` (String)
    - `customer_email` (String)
    - `customer_phone` (String)
    - `customer_address` (Text)
    - `status` (Enum: pending, preparing, delivered, cancelled)
    - `total_amount` (Decimal)
    - `notes` (Text)
    - `created_at` (Timestamp)

3.  **order_items**
    - `id` (Serial/UUID)
    - `order_id` (FK -> orders.id)
    - `product_id` (FK -> products.id)
    - `quantity` (Integer)
    - `price_at_purchase` (Decimal)

## 3. Migration Steps

### Phase 1: Project Initialization
1.  Set up a monorepo structure or separate `client` and `server` directories.
2.  Initialize the React project with Vite.
3.  Initialize the Express project.
4.  Set up the PostgreSQL database connection.

### Phase 2: Backend Development
1.  **Define Models:** Create database models/schema for Products and Orders.
2.  **Seed Data:** Write a script to insert the hardcoded products from `index.html` into the database.
3.  **API Endpoints:**
    - `GET /api/products`: Fetch all products.
    - `POST /api/orders`: Create a new order (Checkout).
    - `GET /api/orders`: Fetch all orders (for Admin).
    - `PATCH /api/orders/:id`: Update order status (for Admin).

### Phase 3: Frontend Development (Client)
1.  **Component Architecture:** Break down `index.html` into React components:
    - `Navbar`, `Hero`, `ExhibitCard`, `CartSidebar`, `Footer`, etc.
2.  **Theme System:** Port the CSS variable-based theme switcher to a React Context provider.
3.  **3D Implementation:** Replace the CSS 3D Lantern with a React Three Fiber component.
4.  **Data Integration:** Fetch products from the backend instead of hardcoding.
5.  **State Management:** Implement Cart context to handle add/remove/update logic.

### Phase 4: Admin Panel Migration
1.  Create a protected `/admin` route.
2.  Port `admin.html` layout to React components.
3.  Connect the Admin Dashboard to the `GET /api/orders` and analytics endpoints.

### Phase 5: Animation Polish
1.  Use **Framer Motion** for the Cart Sidebar slide-in, Modals, and page transitions.
2.  Use **GSAP ScrollTrigger** for the "Reveal" on scroll effects.

## 4. Specific Enhancements

-   **3D Lantern:** The current CSS lantern is impressive but can be made more performant and realistic with Three.js. We will create a 3D model or use a procedural mesh that glows and rotates.
-   **Page Transitions:** Smooth transitions between the Landing Page and Admin Panel.

## 5. Next Steps for You

1.  Confirm this plan.
2.  I will generate the project structure.
3.  I will start with the Backend setup and Database seeding.
4.  Then proceed to the Frontend migration.
