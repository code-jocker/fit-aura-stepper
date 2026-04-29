import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const API_URL = process.env.NODE_ENV === 'production' ? '/api' : (process.env.REACT_APP_API_URL || 'http://localhost:5000/api');

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

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
        alert('Account created successfully! 🇷🇼');
        navigate(response.data.user.role === 'admin' ? '/admin' : '/products');
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

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('userType', 'user');
        alert('Account created successfully! 🇷🇼');
        navigate('/products');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => { // eslint-disable-line no-unused-vars
    // Placeholder for Google OAuth
    alert('Google Login is coming soon! 🚀');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center py-12 px-4">
      <Helmet>
        <title>Sign Up | MBABAZI CLOSET</title>
        <meta name="description" content="Create an account at MBABAZI CLOSET. Join our community for exclusive access to authentic sneakers and premium fashion in Rwanda." />
      </Helmet>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <img src="/MBABAZI.JPG" alt="MBABAZI CLOSET" className="h-16 w-auto object-contain brightness-0 invert mx-auto" />
          </Link>
          <p className="text-gray-400">Join Rwanda's trendiest fashion squad</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[2rem] shadow-2xl p-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-500 to-orange-600"></div>
          
          <h1 className="text-3xl font-black mb-2 text-gray-900 uppercase tracking-tight">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm mb-8 font-medium">Step into style with us.</p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-6 text-xs font-bold uppercase tracking-wider">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 ml-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-3.5 outline-none focus:border-amber-500 focus:bg-white transition-all font-bold text-sm"
              />
            </div>

            {/* Email */}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1 ml-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
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
              {loading ? 'Creating Squad Member...' : 'Sign Up Now'}
            </button>
          </form>

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

          {/* Login Link */}
          <div className="mt-8 text-center pt-6 border-t border-gray-50">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-2">Already have an account?</p>
            <Link to="/login" className="text-amber-600 font-black uppercase tracking-widest text-xs hover:text-black transition-colors">
              Login to Squad
            </Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link to="/" className="text-gray-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
