import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-black text-white py-16 mb-16">
        <div className="container text-center">
          <div className="mb-8 flex flex-col items-center">
            <img src="/MBABAZI.JPG" alt="MBABAZI CLOSET" className="h-20 w-auto object-contain brightness-0 invert mb-6" />
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
              About Us
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Rwanda's premier destination for premium sneakers, athletic wear, and fashion
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="container mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-700 mb-4 text-lg">
              Founded in 2020, MBABAZI CLOSET emerged from a passion for bringing world-class 
              fashion to Rwanda. We believe that everyone deserves access to premium, authentic athletic 
              wear and sneakers that elevate their style and confidence.
            </p>
            <p className="text-gray-700 mb-4 text-lg">
              What started as a small vision has grown into Rwanda's most trusted fashion e-commerce 
              platform, serving thousands of happy customers across the country with authentic products 
              and exceptional service.
            </p>
            <p className="text-gray-700 text-lg">
              Today, we continue to push boundaries and set trends in the East African fashion scene.
            </p>
          </div>
          <div className="relative h-96 rounded-lg overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=600&fit=crop"
              alt="Our store"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="bg-gray-50 py-16 mb-16">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">Our Mission & Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-2xl font-bold mb-4">🎯 Our Mission</h3>
              <p className="text-gray-700">
                To empower Rwandans to express their authentic style through premium, accessible fashion 
                and inspire confidence in every customer.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-2xl font-bold mb-4">✨ Quality</h3>
              <p className="text-gray-700">
                We source only authentic, premium products from trusted global brands to ensure 
                excellence in every purchase.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow">
              <h3 className="text-2xl font-bold mb-4">🤝 Customer First</h3>
              <p className="text-gray-700">
                Your satisfaction is our priority. We provide 24/7 support, fast delivery, and 
                hassle-free returns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mb-16">
        <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { icon: '🚀', title: 'Fast Delivery', description: 'Free delivery in Kigali, nationwide shipping available' },
            { icon: '🔒', title: 'Secure Payment', description: 'MTN MoMo, Airtel Money, and card payments accepted' },
            { icon: '✅', title: 'Authentic Products', description: '100% guaranteed authentic from authorized dealers' },
            { icon: '💬', title: '24/7 Support', description: 'Live chat support available round the clock' },
            { icon: '📱', title: 'Mobile Friendly', description: 'Shop easily on any device, anytime, anywhere' },
            { icon: '🎁', title: 'Great Deals', description: 'Exclusive sales, discounts, and loyalty rewards' }
          ].map((item, idx) => (
            <div key={idx} className="border rounded-lg p-6">
              <p className="text-4xl mb-3">{item.icon}</p>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-700">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-black text-white py-16 mb-16">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">By The Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold text-amber-500 mb-2">10K+</p>
              <p className="text-gray-300">Happy Customers</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-amber-500 mb-2">500+</p>
              <p className="text-gray-300">Products</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-amber-500 mb-2">50+</p>
              <p className="text-gray-300">Brands</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-amber-500 mb-2">4.9★</p>
              <p className="text-gray-300">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container mb-16">
        <h2 className="text-4xl font-bold text-center mb-12">Our Team</h2>
        <p className="text-center text-gray-700 text-lg max-w-2xl mx-auto mb-12">
          A passionate group of fashion enthusiasts, developers, and customer service experts 
          dedicated to bringing the best shopping experience to Rwanda.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Alice Mukakarangwa', role: 'Founder & CEO', emoji: '👩‍💼' },
            { name: 'David Habimana', role: 'Head of Operations', emoji: '👨‍💼' },
            { name: 'Patience Uwambajimana', role: 'Customer Success Lead', emoji: '👩‍💻' }
          ].map((member, idx) => (
            <div key={idx} className="text-center bg-gray-50 p-8 rounded-lg">
              <p className="text-6xl mb-4">{member.emoji}</p>
              <h3 className="text-xl font-bold mb-1">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-amber-500 text-white py-16 mb-16">
        <div className="container text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Style?</h2>
          <p className="text-xl mb-8">Join thousands of happy customers shopping at MBABAZI CLOSET</p>
          <Link to="/products" className="btn-primary bg-black hover:bg-gray-800 px-8 py-3">
            Shop Now →
          </Link>
        </div>
      </section>

      {/* Contact Info */}
      <section className="container mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl mb-3">📍</p>
            <h3 className="font-bold mb-2">Location</h3>
            <p className="text-gray-700">Kigali, Rwanda</p>
          </div>
          <div>
            <p className="text-3xl mb-3">📞</p>
            <h3 className="font-bold mb-2">Phone</h3>
            <p className="text-gray-700">+250 7XX XXX XXX</p>
          </div>
          <div>
            <p className="text-3xl mb-3">✉️</p>
            <h3 className="font-bold mb-2">Email</h3>
            <p className="text-gray-700">hello@mbabazicloset.rw</p>
          </div>
        </div>
      </section>
    </div>
  );
}
