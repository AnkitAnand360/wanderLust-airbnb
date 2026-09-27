# 🌍 Wanderlust - Travel & Accommodation Platform

[![Node.js](https://img.shields.io/badge/Node.js-24.x-68A063?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Mapbox](https://img.shields.io/badge/Mapbox-SDK-000000?style=for-the-badge&logo=mapbox&logoColor=white)](https://www.mapbox.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)](https://getbootstrap.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

> A full-featured, production-ready vacation rental platform inspired by **Airbnb**, built with the **MVC (Model-View-Controller)** pattern using **Node.js, Express, MongoDB Atlas, and EJS**. 

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Architecture](#-project-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Initialization](#database-initialization)
  - [Running the Application](#running-the-application)
- [Route Overview](#-route-overview)
- [Security & Validation](#-security--validation)
- [Future Enhancements](#-future-enhancements)
- [License](#-license)

---

## 🌟 Overview

**Wanderlust** allows users to discover, list, and review unique accommodations and travel destinations worldwide. The platform features forward geocoding with interactive maps, cloud image hosting with automatic optimizations, secure user authentication with session persistence, category-based browsing, and instant tax calculation toggles.

---

## ✨ Key Features

### 🏡 Listings Management (CRUD)
- **Browse & Filter**: Explore listings with real-time category filtering (*Trending, Rooms, Iconic Cities, Mountains, Castles, Amazing pools, Camping, Farms, Arctic, Domes, Boats*).
- **Create & Edit**: Create property listings with image upload, title, description, location, country, price, and category.
- **Dynamic Pricing**: View night rates formatted in local currency (`₹`) with a toggle switch to display total amounts including taxes (+18% GST).
- **Cascading Deletions**: Deleting a listing automatically removes all associated reviews via Mongoose middleware.

### 🗺️ Geocoding & Interactive Maps
- **Forward Geocoding**: Automatically converts user-entered text locations into geographic coordinates via **Mapbox Geocoding API**.
- **Interactive Mapbox GL Maps**: Displays pin markers and location popups on listing show pages.

### 📷 Cloud Media Management
- **Cloudinary Integration**: Uploaded listing images are directly streamed to Cloudinary using `multer` and `multer-storage-cloudinary`.
- **Image Transformations**: Automatically optimizes and serves appropriately sized image thumbnails on edit forms and cards.

### 💬 Reviews & Ratings
- **Starability Rating**: 5-star rating system with customizable review comments.
- **Review Author Attribution**: Each review is linked to its creator, allowing only the original author to delete it.

### ❤️ Wishlist & Favorites System
- **Top-Right Floating Heart**: Instantly save or unsave any listing by clicking the heart button positioned on the top-right corner of listing images.
- **Micro-Animations**: Interactive heart-pulse animation with immediate visual feedback (transitions seamlessly between outline and solid red heart).
- **Navbar Live Counter**: Dedicated "Favorites" link in the navbar with a dynamic counter badge that updates in real time without page reloads.
- **Curated Wishlist Page (`/favorites`)**: A personalized dashboard displaying all favorited listings in a clean grid, with smooth animated item removal and an engaging empty-state view.
- **Asynchronous AJAX Updates**: Seamless user experience powered by asynchronous fetch requests, ensuring browsing uninterrupted by full-page reloads.
- **Guest Protection**: Gracefully redirects unauthenticated users to `/login` when attempting to save favorites.

### 🔐 Authentication & Authorization
- **Passport.js Authentication**: Secure registration and login powered by `passport-local` and `passport-local-mongoose`.
- **Session Persistence**: Sessions managed with `express-session` and stored in **MongoDB Atlas** using `connect-mongo`.
- **Role-Based Access Control**:
  - Unauthenticated users cannot create, edit, or delete listings.
  - Only the listing owner can edit or delete their property.
  - Only the review author can delete their review.
- **Smart Redirects**: Users attempting protected actions are redirected back to their intended page upon successful login.
- **Flash Alerts**: Real-time feedback for successes and errors using `connect-flash`.

---

## 🛠️ Technology Stack

| Category | Technology |
|---|---|
| **Runtime & Framework** | Node.js (v24+), Express.js (v5.x) |
| **Database & ODM** | MongoDB Atlas, Mongoose (v9.x) |
| **Session & Store** | Express-Session, Connect-Mongo |
| **Authentication** | Passport.js, Passport-Local, Passport-Local-Mongoose |
| **Templating Engine** | EJS, EJS-Mate (Layouts & Partials) |
| **Styling & Icons** | Bootstrap 5, FontAwesome 6, Custom CSS |
| **Maps & Geocoding** | Mapbox GL JS, Mapbox Geocoding SDK |
| **Cloud Storage** | Cloudinary, Multer, Multer-Storage-Cloudinary |
| **Data Validation** | Joi, Bootstrap Client-side Validation |

---

## 📐 Project Architecture

```
wanderLust(airbnb)/
├── controllers/          # Request logic & business layer
│   ├── listings.js       # CRUD, geocoding & image handling
│   ├── reviews.js        # Review creation & deletion
│   └── users.js          # Signup, login, and logout logic
├── models/               # Mongoose data schemas
│   ├── listing.js        # Listing schema with GeoJSON Point & post middleware
│   ├── review.js         # Review schema with author reference
│   └── user.js           # User schema with favorites references & Passport-Local-Mongoose
├── routes/               # Express REST routers
│   ├── listing.js        # /listings routes
│   ├── review.js         # /listings/:id/reviews routes
│   └── user.js           # Authentication & /favorites routes
├── views/                # EJS templates & UI components
│   ├── layouts/          # Boilerplate layout with nav & footer
│   ├── includes/         # Reusable partials (navbar, footer, flash alerts)
│   ├── listings/         # index, show, new, edit, and favorites views
│   └── users/            # login and signup views
├── public/               # Static client assets
│   ├── css/              # Custom styling & responsive layouts
│   └── js/               # map.js, script.js & favorite.js (interactive AJAX toggle)
├── utils/                # Helper utilities
│   ├── ExpressError.js   # Custom HTTP error class
│   └── wrapAsync.js      # Async error boundary wrapper
├── init/                 # Seed data scripts
│   ├── data.js           # Sample dataset
│   └── index.js          # DB seeding runner
├── cloudConfig.js        # Cloudinary & Multer configuration
├── middlewares.js        # Auth guards, ownership verification, Joi validators
├── schema.js             # Joi validation schemas
├── app.js                # Express app configuration & server entry point
└── package.json          # Dependencies & metadata
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher; v24 recommended)
- [Git](https://git-scm.com/)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)
- A [Cloudinary](https://cloudinary.com/) account
- A [Mapbox](https://www.mapbox.com/) account

---

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/AnkitAnand360/wanderLust-airbnb.git
   cd wanderLust-airbnb
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

---

### Environment Variables

Create a `.env` file in the root directory and add the following keys:

```env
# Cloudinary Credentials
CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

# Mapbox Token
MAP_TOKEN=your_mapbox_public_token

# MongoDB Atlas Connection
ATLASDB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/wanderLust?retryWrites=true&w=majority

# Session Secret Key
SECRET=your_super_secret_session_key
```

> **Note**: Never commit your `.env` file to version control. Keep your credentials private.

---

### Database Initialization

To populate your database with initial sample listings:

```bash
node init/index.js
```

---

### Running the Application

1. **Start the server with Nodemon (development mode)**:
   ```bash
   npx nodemon app.js
   ```
   *or using standard node:*
   ```bash
   node app.js
   ```

2. **Open in browser**:
   Navigate to [http://localhost:8080](http://localhost:8080).

---

## 📡 Route Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| **GET** | `/listings` | List all listings (supports `?category=...`) | Public |
| **GET** | `/listings/new` | Render form to create new listing | Authenticated |
| **POST** | `/listings` | Create listing with image & geocoding | Authenticated |
| **GET** | `/listings/:id` | Show listing details, reviews, and map | Public |
| **GET** | `/listings/:id/edit`| Render edit form for listing | Owner Only |
| **PUT** | `/listings/:id` | Update listing details and/or image | Owner Only |
| **DELETE**| `/listings/:id` | Delete listing and cascade its reviews | Owner Only |
| **POST** | `/listings/:id/favorite` | Toggle listing favorite/wishlist status | Authenticated |
| **GET** | `/favorites` | View user's saved favorite listings | Authenticated |
| **POST** | `/listings/:id/reviews` | Post a review with star rating | Authenticated |
| **DELETE**| `/listings/:id/reviews/:reviewId` | Delete a review | Review Author Only |
| **GET** | `/signup` | Render signup form | Public |
| **POST** | `/signup` | Register new user account | Public |
| **GET** | `/login` | Render login form | Public |
| **POST** | `/login` | Authenticate user | Public |
| **GET** | `/logout` | Terminate session and logout | Authenticated |

---

## 🔒 Security & Validation

- **Client-Side Validation**: HTML5 and Bootstrap form validation scripts (`public/js/script.js`) prevent submission of empty or malformed fields.
- **Server-Side Validation**: Robust payload validation using **Joi** schemas prevents invalid, malicious, or incomplete requests.
- **Authentication Guards**: `isLoggedIn` middleware protects all mutative routes.
- **Authorization Verification**: `isOwner` and `isReviewAuthor` middlewares ensure users can only modify resources they own.
- **Session Security**: Session cookies configured with `httpOnly: true`, customizable expiration, and secure store via `connect-mongo`.

---

## 🔮 Future Enhancements

- [ ] Date picker & reservation booking calendar
- [ ] Payment gateway integration (Stripe / Razorpay)
- [ ] User profile dashboard with reservation history
- [ ] Search by price range and multi-filter criteria
- [ ] Real-time direct messaging between host and guest

---

## 📄 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).
