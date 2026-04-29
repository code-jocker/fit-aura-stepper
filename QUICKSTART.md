# Quick Start Guide

## 🚀 Getting Started

### Backend Setup

1. **Install Dependencies**
```bash
cd backend
npm install
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your values:
# - MONGODB_URI (use local MongoDB or MongoDB Atlas)
# - JWT_SECRET (generate a random string)
# - Payment API keys (optional for now)
```

3. **Start Backend Server**
```bash
npm run dev
# Server runs on http://localhost:5000
```

### Frontend Setup

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Configure API URL (optional)**
```bash
# .env file in frontend directory
REACT_APP_API_URL=http://localhost:5000/api
```

3. **Start Frontend App**
```bash
npm start
# App runs on http://localhost:3000
```

## 📱 Features Overview

### ✨ Frontend
- **Home Page**: Hero banner, statistics, new arrivals, hot deals, testimonials
- **Product Catalog**: Browse all products with filtering by category
- **Product Detail**: Full product information with images and reviews
- **Shopping Cart**: Manage items with quantities
- **Checkout**: Shipping info and payment method selection
- **Support Chat**: 24/7 customer support widget
- **Mobile Responsive**: Works seamlessly on all devices

### 🔧 Backend
- **API Routes**:
  - `/api/products` - Product management
  - `/api/auth` - User authentication
  - `/api/user` - User profile and cart
  - `/api/orders` - Order management
  - `/api/payments` - Payment processing
  - `/api/subscribe` - Newsletter
  - `/api/testimonials` - Customer reviews

- **Database Models**:
  - Products (with images, sizes, colors, pricing)
  - Users (authentication, cart, addresses)
  - Orders (order history, status tracking)
  - Subscriptions (newsletter subscribers)
  - Testimonials (customer reviews)

## 💳 Payment Integration

### MTN MoMo
- Endpoint: `POST /api/payments/momo`
- Requires: phone number, amount, order ID

### Airtel
- Endpoint: `POST /api/payments/airtel`
- Requires: phone number, amount, order ID

### Free Delivery
- Automatically applied for Kigali addresses
- Other locations: 5,000 RWF

## 🔐 Authentication

- **Register**: `POST /api/auth/register`
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

- **Login**: `POST /api/auth/login`
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Token stored in localStorage and sent in Authorization header.

## 📊 Database Connection

### MongoDB Local
```
mongodb://localhost:27017/mbabazi-closet
```

### MongoDB Atlas (Cloud)
```
mongodb+srv://username:password@cluster.mongodb.net/mbabazi-closet
```

## 🎨 Customization

### Colors
Edit `frontend/tailwind.config.js`:
- Primary: Black (#000000)
- Secondary: Gold (#D4AF37)
- Accent: Amber (#f59e0b)

### Content
- Product images: Add URLs to database
- Testimonials: Add via admin panel
- Categories: Define in products route

### Branding
- Logo: Edit Header component
- Fonts: Montserrat (via Google Fonts)
- Theme: Tailwind CSS classes

## 📦 Data Seeding

Sample products to add to MongoDB:
```json
{
  "name": "Classic Street Walker",
  "brand": "MBABAZI",
  "category": "shoes",
  "price": 75000,
  "salePrice": null,
  "description": "Premium street-style sneaker perfect for daily wear",
  "images": ["https://images.unsplash.com/photo-1542291026-7eec264c27ff"],
  "sizes": ["38", "39", "40", "41", "42", "43", "44", "45"],
  "colors": ["Black", "White", "Red"],
  "rating": 4.5,
  "reviewsCount": 120,
  "stock": 50,
  "isNew": true,
  "isSale": false
}
```

## 🚨 Troubleshooting

### Backend Issues
- Check MongoDB connection
- Verify JWT_SECRET is set
- Check port 5000 isn't in use

### Frontend Issues
- Clear browser cache
- Delete node_modules and reinstall
- Check API_URL in .env

### Payment Issues
- Test with sandbox credentials first
- Verify phone number format (e.g., +250...)
- Check API key permissions

## 📞 Support

- Documentation: See README.md
- Issues: Check DEPLOYMENT.md for production setup
- Help: support@mbabazicloset.rw

## ✅ Next Steps

1. Set up MongoDB (local or Atlas)
2. Install backend dependencies
3. Start backend server
4. Install frontend dependencies
5. Start frontend app
6. Add sample products to database
7. Test features locally
8. Deploy to production (Heroku + Vercel)
