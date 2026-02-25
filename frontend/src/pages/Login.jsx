import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export default function Login() {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('user'); // 'user', 'admin', or 'delivery'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') setLoginType('admin');
    if (params.get('delivery') === 'true') setLoginType('delivery');
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/google-login`, {
        tokenId: credentialResponse.credential
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('userType', response.data.user.role || 'user');
        alert('Login successful!');
        navigate(response.data.user.role === 'admin' ? '/admin' : response.data.user.role === 'delivery' ? '/delivery' : '/profile');
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError(err.response?.data?.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (loginType === 'user' || loginType === 'delivery') {
      // User or Delivery Login
      if (!formData.email || !formData.password) {
        setError('Email and password are required');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post(`${API_URL}/auth/login`, {
          email: formData.email,
          password: formData.password
        });

        if (response.data.token) {
          const { token, user } = response.data;
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('userType', user.role);
          
          alert(`${user.role.charAt(0).toUpperCase() + user.role.slice(1)} login successful!`);
          
          if (user.role === 'admin') navigate('/admin');
          else if (user.role === 'delivery') navigate('/delivery');
          else navigate('/profile');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Login failed');
      } finally {
        setLoading(false);
      }
    } else {
      // Admin Login
      if (!formData.username || !formData.password) {
        setError('Username and password are required');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.post(`${API_URL}/auth/admin-login`, {
          username: formData.username,
          password: formData.password
        });

        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('userType', 'admin');
          alert('Admin login successful!');
          navigate('/admin');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Admin login failed');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSwitchTab = (type) => {
    setLoginType(type);
    setFormData({ email: '', password: '', username: '' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center py-12 px-4">
      <Helmet>
        <title>Login | MBABAZI CLOSET</title>
        <meta name="description" content="Login to your MBABAZI CLOSET account. Access your profile, orders, and exclusive offers." />
      </Helmet>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <img src="/MBABAZI.JPG" alt="MBABAZI CLOSET" className="h-16 w-auto object-contain brightness-0 invert mx-auto" />
          </Link>
          <p className="text-gray-400">
            {loginType === 'user' ? 'Welcome back!' : loginType === 'admin' ? 'Admin Dashboard' : 'Delivery Access'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[2rem] shadow-2xl p-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-orange-600"></div>

          <h1 className="text-3xl font-black mb-2 text-gray-900 uppercase tracking-tight">
            {loginType === 'user' ? 'Customer Login' : loginType === 'delivery' ? 'Delivery Login' : 'Admin Login'}
          </h1>
          <p className="text-gray-500 text-sm mb-8 font-medium">
            {loginType === 'delivery' ? 'Access your delivery dashboard.' : 'Welcome back to the squad.'}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-xs font-bold uppercase tracking-wider">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {loginType === 'admin' ? (
              <>
                {/* Admin Username */}
                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 ml-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Admin username"
                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-3.5 outline-none focus:border-amber-500 focus:bg-white transition-all font-bold text-sm"
                  />
                </div>
              </>
            ) : (
              <>
                {/* User Email */}
                <div>
                  <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 ml-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-3.5 outline-none focus:border-amber-500 focus:bg-white transition-all font-bold text-sm"
                  />
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 ml-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-3.5 outline-none focus:border-amber-500 focus:bg-white transition-all font-bold text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-amber-500 transition-all shadow-xl disabled:opacity-50 mt-6 transform hover:scale-[1.02] active:scale-95"
            >
              {loading ? 'Verifying...' : `${loginType === 'user' ? 'Login to Squad' : 'Admin Access'}`}
            </button>
          </form>

          {loginType === 'user' && (
            <>
              {/* Social Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
                  <span className="bg-white px-4 text-gray-400">Or continue with</span>
                </div>
              </div>

              {/* Google Button */}
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  useOneTap
                  theme="filled_black"
                  shape="pill"
                  width="100%"
                />
              </div>
            </>
          )}

          {/* Sign Up for Users */}
          {loginType === 'user' && (
            <div className="mt-8 text-center pt-6 border-t border-gray-50">
              <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Don't have an account?</p>
              <Link to="/signup" className="text-amber-600 font-black uppercase tracking-widest text-xs hover:text-black transition-colors">
                Join the Squad
              </Link>
            </div>
          )}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-400 hover:text-white">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
