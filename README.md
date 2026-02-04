# Fit Aura & Steppers - E-Commerce Platform

🇷🇼 Rwanda's premium fashion destination for sneakers, athleisure wear, and accessories.

## Features

✨ **Frontend (React + Tailwind CSS)**
- Responsive mobile-first design
- Product catalog with filtering and search
- Quick add to cart with size/color selection
- Shopping cart management
- Secure checkout process
- Order confirmation
- 24/7 support chat widget
- Newsletter subscription
- Customer testimonials

🔧 **Backend (Node.js/Express)**
- RESTful API with JWT authentication
- MongoDB database
- Product management
- User authentication and profiles
- Cart management
- Order processing
- Payment integration (MTN MoMo & Airtel)
- Real-time updates with WebSockets
- Email notifications

## Installation

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

## Project Structure

```
fit-aura-steppers/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Authentication & validation
│   ├── config/          # Configuration files
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── api.js       # API client
│   │   ├── store.js     # State management
│   │   └── App.jsx      # Main app
│   ├── public/
│   └── package.json
└── README.md
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `GET /api/products/categories` - Get categories

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### User
- `GET /api/user/profile` - Get user profile
- `GET /api/user/cart` - Get cart
- `POST /api/user/cart` - Add to cart
- `DELETE /api/user/cart/:itemId` - Remove from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

### Payments
- `POST /api/payments/momo` - MTN MoMo payment
- `POST /api/payments/airtel` - Airtel payment
- `POST /api/payments/webhook` - Payment webhook

## Payment Integration

The platform supports:
- **MTN MoMo** - Mobile money payment
- **Airtel Money** - Airtel mobile payment

Free delivery available in Kigali, Rwanda.

## Technology Stack

- **Frontend**: React 18, Tailwind CSS, React Router, Zustand, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Socket.io
- **Hosting**: Vercel (Frontend), Heroku/Railway (Backend)

## Support

📧 support@fitaura.rw
📞 +250 (0) 798 000 000
💬 24/7 Live Chat Support

## License

MIT License - 2026 Fit Aura & Steppers
