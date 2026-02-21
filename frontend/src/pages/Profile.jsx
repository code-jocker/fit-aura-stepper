import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import SupportChat from '../components/SupportChat';

const API_URL = process.env.NODE_ENV === 'production' ? '/api' : (process.env.REACT_APP_API_URL || 'http://localhost:5000/api');

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchUserData();
  }, [navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // Fetch user profile
      const userRes = await axios.get(`${API_URL}/user/profile`, { headers });
      setUser(userRes.data);

      // Fetch user orders
      const ordersRes = await axios.get(`${API_URL}/orders`, { headers }).catch(() => ({ data: [] }));
      setOrders(ordersRes.data || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowLogout(false);
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container text-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container text-center">
          <p className="text-gray-600 mb-4">Please log in to view your profile</p>
          <Link to="/login" className="btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Helmet>
        <title>My Profile | MBABAZI CLOSET</title>
        <meta name="description" content="Manage your MBABAZI CLOSET account, view orders, and update your profile." />
      </Helmet>
      <div className="container max-w-2xl">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">👤 My Profile</h1>
              <p className="text-gray-600">Manage your account and view orders</p>
            </div>
            <button
              onClick={() => setShowLogout(!showLogout)}
              className="text-red-600 hover:text-red-800 font-bold"
            >
              Logout
            </button>
          </div>

          {showLogout && (
            <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
              <p className="text-red-800 mb-3">Are you sure you want to log out?</p>
              <div className="flex gap-2">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Yes, Logout
                </button>
                <button
                  onClick={() => setShowLogout(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* User Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
            <div>
              <label className="text-gray-600 text-sm">Full Name</label>
              <p className="text-xl font-semibold">{user.name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-gray-600 text-sm">Email</label>
              <p className="text-xl font-semibold">{user.email}</p>
            </div>
            <div>
              <label className="text-gray-600 text-sm">Phone</label>
              <p className="text-xl font-semibold">{user.phone || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-gray-600 text-sm">Member Since</label>
              <p className="text-xl font-semibold">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          {/* Addresses */}
          {user.addresses && user.addresses.length > 0 && (
            <div className="border-t pt-6 mt-6">
              <h3 className="text-xl font-bold mb-4">📍 Saved Addresses</h3>
              <div className="space-y-3">
                {user.addresses.map((addr, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded">
                    <p className="font-semibold">{addr.name}</p>
                    <p className="text-gray-600">{addr.address}</p>
                    <p className="text-gray-600">{addr.city}, {addr.postalCode}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-6">📦 Order History</h2>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">You haven't placed any orders yet</p>
              <Link to="/products" className="btn-primary">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold">Order #{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded text-sm font-bold ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-3 rounded mb-3">
                    <p className="text-sm text-gray-600 mb-2">
                      {order.items?.length || 0} items
                    </p>
                    {order.items?.slice(0, 2).map((item, idx) => (
                      <p key={idx} className="text-sm text-gray-700">
                        • {item.name} × {item.quantity}
                      </p>
                    ))}
                    {order.items?.length > 2 && (
                      <p className="text-sm text-gray-600">
                        + {order.items.length - 2} more items
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="text-xl font-bold">
                        {order.totalPrice?.toLocaleString()} RWF
                      </p>
                    </div>
                    <Link
                      to={`/order-confirmation/${order._id}`}
                      className="btn-outline text-sm px-4 py-2"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Support Chat Section */}
        <div className="bg-white rounded-lg shadow p-6 mt-8">
          <h2 className="text-2xl font-bold mb-6">💬 Customer Support</h2>
          <SupportChat embedded={true} />
        </div>
      </div>
    </div>
  );
}
