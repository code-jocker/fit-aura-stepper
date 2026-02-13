import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeliveryMap from '../components/DeliveryMap';

const API_URL = process.env.NODE_ENV === 'production' ? '/api' : (process.env.REACT_APP_API_URL || 'http://localhost:5000/api');

export default function TrackOrder() {
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId) {
      setError('Please enter an order ID');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // We use optionalAuth, but for guest tracking we just send the ID
      const response = await axios.get(`${API_URL}/orders/${orderId.trim()}`);
      setOrderStatus(response.data);
    } catch (err) {
      console.error('Tracking error:', err);
      setError(err.response?.data?.message || 'Order not found. Please check your ID and try again.');
      setOrderStatus(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black uppercase tracking-tight mb-4">Track Your Order</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Enter your order ID to see the live delivery status</p>
        </div>

        <div className="max-w-xl mx-auto mb-12">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-black"></div>
            <form onSubmit={handleTrack} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Order ID</label>
                <input
                  type="text"
                  value={orderId}
                  onChange={(e) => {
                    setOrderId(e.target.value);
                    setError('');
                  }}
                  placeholder="Paste your order ID here..."
                  className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-4 outline-none focus:border-black focus:bg-white transition-all font-bold"
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-amber-500 transition-all shadow-xl disabled:opacity-50 transform hover:scale-[1.02] active:scale-95"
              >
                {loading ? 'Locating Order...' : 'Track My Package 🚀'}
              </button>
            </form>
          </div>
        </div>

        {/* Status Display */}
        {orderStatus && (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Info */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-[2rem] shadow-xl p-8 border border-gray-100">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order</p>
                      <h2 className="text-xl font-black uppercase">#{orderStatus._id.slice(-8)}</h2>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      orderStatus.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {orderStatus.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</span>
                      <span className="font-bold text-sm uppercase">{orderStatus.customerName}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Estimated</span>
                      <span className="font-bold text-sm uppercase">1-2 Days</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-50">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total</span>
                      <span className="font-bold text-sm">{orderStatus.total.toLocaleString()} RWF</span>
                    </div>
                    <div className="pt-2">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Delivery Address</p>
                      <p className="text-xs font-bold text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl">
                        {orderStatus.deliveryAddress}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-black text-white rounded-[2rem] shadow-xl p-8">
                  <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="text-amber-500">✨</span> Items in Package
                  </h3>
                  <div className="space-y-3">
                    {orderStatus.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest border-b border-white/10 pb-2">
                        <span>{item.quantity}x Product</span>
                        <span className="text-gray-400">{item.size}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map/Tracking Visualization */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-[2.5rem] shadow-xl p-2 border border-gray-100 h-full min-h-[500px] overflow-hidden">
                  <DeliveryMap 
                    orders={[orderStatus]} 
                    onMarkerClick={() => {}} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
