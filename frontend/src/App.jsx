import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import SupportChat from './components/SupportChat';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Categories from './pages/Categories';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import DeliveryDashboard from './pages/DeliveryDashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Contact from './pages/Contact';
import TrackOrder from './pages/TrackOrder';
import Returns from './pages/Returns';
import Shipping from './pages/Shipping';
import SizeGuide from './pages/SizeGuide';
import StoreLocations from './pages/StoreLocations';
import Careers from './pages/Careers';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import './index.css';

function App() {
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "your-google-client-id-here.apps.googleusercontent.com";

  useEffect(() => {
    // Load Tailwind CSS dynamically
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <Helmet>
        <title>MBABAZI CLOSET | Premium Fashion & Authentic Sneakers Rwanda 🇷🇼</title>
        <meta name="description" content="MBABAZI CLOSET is Rwanda's premier destination for 100% authentic sneakers and premium fashion. Shop Nike, Jordan, Adidas, and luxury athleisure in Kigali." />
        <link rel="canonical" href="https://mbabazi-closet.onrender.com/" />
      </Helmet>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/products" element={<Products />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/about" element={<About />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/size-guide" element={<SizeGuide />} />
              <Route path="/store-locations" element={<StoreLocations />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />

              {/* Protected User Routes */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />

              {/* Delivery Only Routes */}
              <Route 
                path="/delivery" 
                element={
                  <ProtectedRoute requiredRole="delivery">
                    <DeliveryDashboard />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Only Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Admin />
                  </ProtectedRoute>
                } 
              />

              {/* 404 Route */}
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          <Footer />
          <SupportChat />
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
