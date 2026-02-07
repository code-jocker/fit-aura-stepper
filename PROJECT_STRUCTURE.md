# Project Structure

```
mbabazi-closet/
│
├── 📁 backend/
│   ├── 📁 config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── email.js                 # Email service
│   │
│   ├── 📁 middleware/
│   │   ├── auth.js                  # JWT authentication
│   │   └── validation.js            # Input validation
│   │
│   ├── 📁 models/
│   │   ├── Product.js               # Product schema
│   │   ├── User.js                  # User schema with password hashing
│   │   ├── Order.js                 # Order schema
│   │   ├── Subscription.js          # Newsletter subscription schema
│   │   └── Testimonial.js           # Customer testimonial schema
│   │
│   ├── 📁 routes/
│   │   ├── auth.js                  # Authentication endpoints
│   │   ├── products.js              # Product management endpoints
│   │   ├── user.js                  # User profile & cart endpoints
│   │   ├── orders.js                # Order management endpoints
│   │   ├── payments.js              # Payment processing endpoints
│   │   ├── subscribe.js             # Newsletter endpoints
│   │   └── testimonials.js          # Testimonial endpoints
│   │
│   ├── .env.example                 # Environment variables template
│   ├── server.js                    # Main server file with Express & Socket.io
│   └── package.json                 # Backend dependencies
│
├── 📁 frontend/
│   ├── 📁 public/
│   │   └── index.html               # Main HTML file
│   │
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── Header.jsx           # Navigation & search
│   │   │   ├── Footer.jsx           # Footer with links & info
│   │   │   ├── ProductCard.jsx      # Product card component
│   │   │   ├── QuickAddModal.jsx    # Quick add to cart modal
│   │   │   └── SupportChat.jsx      # 24/7 support chat widget
│   │   │
│   │   ├── 📁 pages/
│   │   │   ├── Home.jsx             # Homepage with hero & featured products
│   │   │   ├── Products.jsx         # Product catalog with filtering
│   │   │   ├── ProductDetail.jsx    # Individual product page
│   │   │   ├── Cart.jsx             # Shopping cart
│   │   │   ├── Checkout.jsx         # Checkout & payment
│   │   │   └── OrderConfirmation.jsx # Order confirmation
│   │   │
│   │   ├── 📁 assets/               # Images & static files
│   │   ├── api.js                   # API client & service calls
│   │   ├── store.js                 # Zustand state management
│   │   ├── index.css                # Global styles & Tailwind
│   │   ├── App.jsx                  # Main app component
│   │   └── index.js                 # React entry point
│   │
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   ├── tsconfig.json                # TypeScript configuration
│   └── package.json                 # Frontend dependencies
│
├── 📄 README.md                     # Project documentation
├── 📄 QUICKSTART.md                 # Quick start guide
├── 📄 DEPLOYMENT.md                 # Deployment instructions
└── 📄 PROJECT_STRUCTURE.md          # This file

## Key Features by Component

### Backend Components
- **Authentication**: JWT-based secure login/register
- **Cart Management**: Add, remove, update items
- **Order Processing**: Create orders, track status
- **Payment Integration**: MTN MoMo & Airtel support
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io for live updates
- **Email**: Nodemailer for notifications

### Frontend Components
- **State Management**: Zustand for cart & user state
- **API Integration**: Axios with interceptors for JWT
- **Routing**: React Router v6
- **Styling**: Tailwind CSS with custom theme
- **Responsive Design**: Mobile-first approach
- **Component Library**: Reusable cards, modals, buttons

## Database Collections

### Products
- Product details (name, brand, price, images)
- Stock management
- Ratings and reviews
- New/Sale badges
- Size and color variants

### Users
- Authentication (email, hashed password)
- Profile info (name, location, phone)
- Cart items with quantities
- Saved addresses

### Orders
- Order items with quantities
- Pricing (subtotal, delivery fee, total)
- Status tracking
- Payment method & status
- Delivery address

### Subscriptions
- Newsletter email list
- Subscription status

### Testimonials
- Customer reviews
- Ratings (1-5 stars)
- Location info
- Profile images

## API Endpoints Summary

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `GET /api/products/categories` - Get categories

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user

### User
- `GET /api/user/profile` - Get user profile
- `GET /api/user/cart` - Get shopping cart
- `POST /api/user/cart` - Add item to cart
- `DELETE /api/user/cart/:itemId` - Remove item

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:orderId` - Get order details

### Payments
- `POST /api/payments/momo` - MTN MoMo payment
- `POST /api/payments/airtel` - Airtel payment
- `POST /api/payments/webhook` - Payment callback

### Other
- `POST /api/subscribe` - Newsletter subscription
- `GET /api/testimonials` - Get testimonials

## Technology Stack

### Frontend
- React 18.2.0
- React Router DOM 6.8.0
- Tailwind CSS 3.2.7
- Zustand 4.3.2
- Axios 1.3.4
- Socket.io-client 4.5.4

### Backend
- Node.js
- Express.js 4.18.2
- MongoDB + Mongoose 7.0.0
- JWT for authentication
- Bcryptjs for password hashing
- Socket.io for real-time updates
- Nodemailer for emails

### Development
- Nodemon for backend
- React Scripts for frontend build

## Performance Optimizations
- Lazy loading of products
- Image optimization
- Caching of cart in localStorage
- JWT token refresh
- API request debouncing
- Component code splitting

## Security Features
- Password hashing with bcryptjs
- JWT-based authentication
- CORS protection
- Rate limiting on API endpoints
- Input validation
- Environment variables for secrets
- HTTPS support (production)

## Deployment Targets
- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: Heroku, Railway, or AWS EC2
- **Database**: MongoDB Atlas (cloud) or self-hosted
- **CDN**: Images hosted on Unsplash or AWS S3
