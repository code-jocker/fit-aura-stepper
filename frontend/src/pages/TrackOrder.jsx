import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TrackOrder() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId) {
      alert('Please enter an order ID');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setOrderStatus({
        id: orderId,
        status: 'In Transit',
        location: 'Kigali Distribution Center',
        estimatedDelivery: '2 days',
        items: 2
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-4">Track Your Order</h1>
        <p className="text-gray-600 mb-12">Enter your order ID to see the delivery status</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Track Form */}
          <div className="bg-white rounded-lg shadow p-8">
            <form onSubmit={handleTrack} className="space-y-4">
              <div>
                <label className="block font-bold mb-2">Order ID</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g., ORD-2025-001"
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded font-bold hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Tracking...' : 'Track Order'}
              </button>
            </form>
          </div>

          {/* Status Display */}
          {orderStatus && (
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold mb-6">Order #{orderStatus.id}</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Status</span>
                  <span className="font-bold text-green-600">{orderStatus.status}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Current Location</span>
                  <span className="font-bold">{orderStatus.location}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-gray-600">Estimated Delivery</span>
                  <span className="font-bold">{orderStatus.estimatedDelivery}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Items</span>
                  <span className="font-bold">{orderStatus.items} item(s)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
