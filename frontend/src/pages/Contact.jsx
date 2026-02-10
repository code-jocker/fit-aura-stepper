import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' ? '/api' : (process.env.REACT_APP_API_URL || 'http://localhost:5000/api');

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      await axios.post(`${API_URL}/contact`, formData);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Contact Us | MBABAZI CLOSET Rwanda</title>
        <meta name="description" content="Get in touch with MBABAZI CLOSET. We're here to help with your orders, sizing questions, or any feedback you have about our premium sneakers and fashion." />
        <link rel="canonical" href="https://mbabazi-closet.onrender.com/contact" />
      </Helmet>
      {/* Hero Section */}
      <section className="bg-black text-white py-16 mb-16">
        <div className="container text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you!
          </p>
        </div>
      </section>

      <div className="container mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>

            {submitted && (
              <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-6">
                ✓ Thank you! Your message has been sent successfully. We'll get back to you soon!
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block font-bold mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className="w-full border rounded px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block font-bold mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full border rounded px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block font-bold mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+250 7XX XXX XXX"
                  className="w-full border rounded px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block font-bold mb-2">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What's this about?"
                  className="w-full border rounded px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block font-bold mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us more..."
                  rows="5"
                  className="w-full border rounded px-4 py-3 outline-none focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 font-bold disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="text-3xl font-bold mb-8">Contact Information</h2>

            <div className="space-y-8">
              {/* Location */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">📍 Location</h3>
                <p className="text-gray-700 mb-2">MBABAZI CLOSET HQ</p>
                <p className="text-gray-700">Kigali, Rwanda 🇷🇼</p>
              </div>

              {/* Phone */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">📞 Phone</h3>
                <p className="text-gray-700">+250 7XX XXX XXX</p>
                <p className="text-sm text-gray-600 mt-2">Available Monday - Friday, 9am - 5pm EAT</p>
              </div>

              {/* Email */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">✉️ Email</h3>
                <p className="text-gray-700">hello@mbabazicloset.rw</p>
                <p className="text-gray-700">support@mbabazicloset.rw</p>
                <p className="text-sm text-gray-600 mt-2">Typically respond within 24 hours</p>
              </div>

              {/* Hours */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-3">🕐 Business Hours</h3>
                <div className="text-gray-700 space-y-1">
                  <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                  <p>Saturday: 10:00 AM - 3:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>

              {/* Live Chat */}
              <div className="bg-amber-50 p-6 rounded-lg border-2 border-amber-500">
                <h3 className="text-xl font-bold mb-3">💬 24/7 Live Chat</h3>
                <p className="text-gray-700 mb-4">
                  Need instant help? Open the chat widget in the bottom right corner for immediate support!
                </p>
                <button className="btn-primary w-full">Open Live Chat</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-16 mb-16">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              {
                q: "How long does delivery take?",
                a: "Kigali: 1-2 business days. Outside Kigali: 3-5 business days. Free delivery in Kigali!"
              },
              {
                q: "What payment methods do you accept?",
                a: "MTN MoMo, Airtel Money, credit/debit cards, and bank transfers."
              },
              {
                q: "Can I return products?",
                a: "Yes! 30-day money-back guarantee on all purchases. Check our return policy for details."
              },
              {
                q: "Are your products authentic?",
                a: "100% authentic. All products sourced from authorized dealers only."
              },
              {
                q: "Do you offer student discounts?",
                a: "Yes! Show valid student ID for 10% off. Valid for purchases in-store and online."
              },
              {
                q: "How can I track my order?",
                a: "You'll receive tracking updates via email and SMS after your order ships."
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg">
                <h3 className="font-bold mb-3 text-lg">{item.q}</h3>
                <p className="text-gray-700">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map / Social */}
      <section className="container mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Follow Us</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          {[
            { icon: '📘', name: 'Facebook', url: '#' },
            { icon: '📷', name: 'Instagram', url: '#' },
            { icon: '𝕏', name: 'Twitter', url: '#' },
            { icon: '▶️', name: 'YouTube', url: '#' },
            { icon: '💼', name: 'LinkedIn', url: '#' }
          ].map((social, idx) => (
            <a
              key={idx}
              href={social.url}
              className="w-16 h-16 bg-gray-100 hover:bg-black hover:text-white rounded-full flex items-center justify-center text-2xl transition"
              title={social.name}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
