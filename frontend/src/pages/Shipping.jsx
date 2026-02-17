import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Shipping() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Shipping Information | MBABAZI CLOSET</title>
        <meta name="description" content="Shipping information and delivery areas for MBABAZI CLOSET. Free delivery in Kigali and affordable rates across Rwanda." />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">Shipping Information</h1>
        <p className="text-gray-600 mb-12">Learn about our shipping options and delivery areas</p>

        <div className="space-y-8">
          {/* Free Delivery */}
          <div className="bg-white rounded-lg shadow p-8 border-l-4 border-green-500">
            <h2 className="text-2xl font-bold mb-4">🚚 Free Delivery in Kigali</h2>
            <p className="text-gray-700 mb-4">
              We offer free delivery to all addresses within Kigali city for orders over RWF 10,000.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Standard: 2-3 business days</li>
              <li>✓ Express: 1 business day (additional RWF 2,000)</li>
              <li>✓ Orders placed before 2 PM arrive next day</li>
            </ul>
          </div>

          {/* Regional Delivery */}
          <div className="bg-white rounded-lg shadow p-8 border-l-4 border-blue-500">
            <h2 className="text-2xl font-bold mb-4">📍 Regional Delivery</h2>
            <p className="text-gray-700 mb-4">
              We ship to towns outside Kigali with the following rates:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-bold mb-2">Huye, Butare</h3>
                <p className="text-gray-600">RWF 3,500 • 2-3 days</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-bold mb-2">Gitarama, Muhanga</h3>
                <p className="text-gray-600">RWF 2,500 • 2-3 days</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-bold mb-2">Gisenyi, Rubavu</h3>
                <p className="text-gray-600">RWF 4,000 • 3-4 days</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <h3 className="font-bold mb-2">Ruhengeri, Musanze</h3>
                <p className="text-gray-600">RWF 4,500 • 3-4 days</p>
              </div>
            </div>
          </div>

          {/* Tracking */}
          <div className="bg-white rounded-lg shadow p-8 border-l-4 border-indigo-500">
            <h2 className="text-2xl font-bold mb-4">📦 Order Tracking</h2>
            <p className="text-gray-700 mb-4">
              You'll receive a tracking number via email once your order ships. You can use this to track your package in real-time.
            </p>
            <p className="text-gray-600">
              Typical shipping times start from the date of purchase, not the order confirmation.
            </p>
          </div>

          {/* Safety */}
          <div className="bg-white rounded-lg shadow p-8 border-l-4 border-orange-500">
            <h2 className="text-2xl font-bold mb-4">🛡️ Safe Packaging</h2>
            <p className="text-gray-700 mb-4">
              All items are carefully packaged to ensure they arrive in perfect condition:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Bubble wrap and protective padding included</li>
              <li>✓ Discreet packaging with no visible branding</li>
              <li>✓ Insurance included on all deliveries</li>
              <li>✓ Signature required for high-value orders</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-indigo-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
            <p className="text-gray-700 mb-4">
              Our support team is ready to help with any shipping concerns.
            </p>
            <div className="space-y-2">
              <p className="text-gray-700">📞 <strong>+250 (0) 798 000 000</strong></p>
              <p className="text-gray-700">📧 <strong>shipping@mbabazicloset.rw</strong></p>
              <p className="text-gray-700">⏰ Monday - Friday, 9 AM - 6 PM EAT</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
