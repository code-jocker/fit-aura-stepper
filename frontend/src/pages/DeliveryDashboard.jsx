import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' ? '/api' : (process.env.REACT_APP_API_URL || 'http://localhost:5000/api');

export default function DeliveryDashboard() {
  const [worker, setWorker] = useState(null);
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [startLocation, setStartLocation] = useState(null);
  const [gettingStartLocation, setGettingStartLocation] = useState(false);

  const captureStartLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setGettingStartLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setStartLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGettingStartLocation(false);
        alert("Start location captured! 📍 You can now see the route to your destination.");
      },
      (error) => {
        console.error("Error getting location:", error);
        setGettingStartLocation(false);
        alert("Could not get your current location.");
      }
    );
  };

  useEffect(() => {
    fetchWorkerData();
    fetchAssignedOrders();
  }, []);

  const fetchWorkerData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorker(response.data);
    } catch (err) {
      setError('Failed to fetch profile data');
    }
  };

  const fetchAssignedOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/orders/assigned`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignedOrders(response.data);
    } catch (err) {
      setError('Failed to fetch assigned orders');
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async () => {
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/users/availability`,
        { isAvailable: !worker.isAvailable },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWorker(response.data);
    } catch (err) {
      alert('Failed to update availability');
    } finally {
      setUpdating(false);
    }
  };

  const updateLocation = async (e) => {
    e.preventDefault();
    const newLocation = e.target.location.value;
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/users/location`,
        { location: newLocation },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWorker(response.data);
      alert('Location updated successfully');
    } catch (err) {
      alert('Failed to update location');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="container py-20 text-center">Loading Dashboard...</div>;

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-black uppercase mb-2">Delivery Dashboard</h1>
          <p className="text-gray-500 font-bold">Welcome back, {worker?.name}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-1">Current Status</p>
            <div className={`flex items-center gap-2 font-bold ${worker?.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
              <span className={`w-3 h-3 rounded-full ${worker?.isAvailable ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`}></span>
              {worker?.isAvailable ? 'Available for Delivery' : 'Currently Busy/Offline'}
            </div>
          </div>
          <button
            onClick={toggleAvailability}
            disabled={updating}
            className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
              worker?.isAvailable 
                ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' 
                : 'bg-green-50 text-green-600 hover:bg-green-600 hover:text-white'
            }`}
          >
            {worker?.isAvailable ? 'Go Offline' : 'Go Online'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Stats & Profile */}
        <div className="space-y-8">
          <div className="bg-black text-white p-8 rounded-3xl">
            <h3 className="text-xl font-black uppercase mb-6 text-amber-500">My Profile</h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Email</p>
                <p className="font-bold">{worker?.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Phone</p>
                <p className="font-bold">{worker?.phone || 'Not set'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Current Base</p>
                <p className="font-bold">{worker?.location || 'Rwanda'}</p>
              </div>
            </div>

            <form onSubmit={updateLocation} className="mt-8 pt-8 border-t border-white/10">
              <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Update Current Location</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Nyarugenge, Kigali"
                  defaultValue={worker?.location}
                  className="flex-grow bg-white/10 border-none rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button type="submit" disabled={updating} className="bg-amber-500 text-black px-4 py-2 rounded-lg text-xs font-black uppercase">
                  Update
                </button>
              </div>
            </form>
          </div>

          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <h3 className="text-xl font-black uppercase mb-6">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl">
                <p className="text-2xl font-black">{assignedOrders.length}</p>
                <p className="text-xs text-gray-500 font-bold">Active Tasks</p>
              </div>
              <div className="bg-white p-4 rounded-2xl">
                <p className="text-2xl font-black">0</p>
                <p className="text-xs text-gray-500 font-bold">Completed Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Assigned Orders */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-black uppercase mb-8">Assigned Deliveries</h3>
          
          {assignedOrders.length === 0 ? (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl py-20 text-center">
              <p className="text-gray-400 font-bold">No active deliveries assigned to you yet.</p>
              <p className="text-sm text-gray-400 mt-2">Wait for admin to assign new orders.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {assignedOrders.map(order => (
                <div key={order._id} className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  {/* Admin Message Banner */}
                  <div className="bg-amber-500/10 border-b border-amber-500/20 px-8 py-3 -mx-8 -mt-8 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📢</span>
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-800">
                        Message from Admin: <span className="text-black italic normal-case font-bold ml-1">"{order.adminNote || 'No specific instructions. Drive safe!'}"</span>
                      </p>
                    </div>
                    <span className="text-[9px] font-bold text-amber-600 bg-white px-2 py-0.5 rounded-full shadow-sm">NEW ASSIGNMENT</span>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="space-y-4 flex-grow">
                      <div className="flex items-center gap-3">
                        <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                          {order.status}
                        </span>
                        <span className="text-gray-400 font-bold text-sm">#{order._id.slice(-8)}</span>
                      </div>
                      
                      <div>
                        <h4 className="text-xl font-black uppercase">{order.customerName}</h4>
                        <p className="text-gray-500 font-bold">{order.phone}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        {/* Start Point */}
                        <div className={`p-5 rounded-2xl border-2 transition-all ${startLocation ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-dashed border-gray-200'}`}>
                          <div className="flex justify-between items-center mb-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Start Point</p>
                            {startLocation && <span className="text-green-500 text-xs">✓ Set</span>}
                          </div>
                          {startLocation ? (
                            <div className="space-y-2">
                              <p className="font-bold text-sm">Current Device Location</p>
                              <p className="text-[10px] text-gray-400">{startLocation.lat.toFixed(4)}, {startLocation.lng.toFixed(4)}</p>
                            </div>
                          ) : (
                            <button 
                              onClick={captureStartLocation}
                              disabled={gettingStartLocation}
                              className="w-full py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-lg"
                            >
                              {gettingStartLocation ? 'Capturing...' : '📍 Set Start Point'}
                            </button>
                          )}
                        </div>

                        {/* Destination */}
                        <div className="p-5 bg-blue-50 rounded-2xl border-2 border-blue-100">
                          <div className="flex justify-between items-center mb-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Destination</p>
                            <span className="text-blue-500 text-xs">📍 Customer</span>
                          </div>
                          <p className="font-bold text-sm leading-tight mb-2">{order.deliveryAddress}</p>
                          {order.location && (
                            <div className="flex gap-2">
                              <a 
                                href={`https://www.google.com/maps/dir/${startLocation ? `${startLocation.lat},${startLocation.lng}` : 'Current+Location'}/${order.location.lat},${order.location.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-grow bg-blue-600 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-center hover:bg-blue-700 transition-all shadow-md"
                              >
                                {startLocation ? '🚀 Start Navigation' : '🗺️ Open Route'}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end gap-4 min-w-[200px]">
                      <div className="text-right bg-gray-50 p-4 rounded-2xl w-full border border-gray-100">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Total to Collect</p>
                        <p className="text-2xl font-black text-black">{order.total.toLocaleString()} RWF</p>
                        <p className={`text-[10px] font-black uppercase tracking-widest mt-2 px-2 py-1 rounded-lg inline-block ${order.paymentMethod === 'cash' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                          {order.paymentMethod === 'cash' ? '💵 Cash on Delivery' : '💳 Paid Online'}
                        </p>
                      </div>

                      <div className="flex gap-2 w-full">
                        <button 
                          onClick={() => {/* Update logic here */}}
                          className="flex-grow bg-black text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl transform active:scale-95"
                        >
                          Mark Delivered
                        </button>
                        <a href={`tel:${order.phone}`} className="bg-amber-500 text-black p-4 rounded-2xl hover:bg-black hover:text-white transition-all shadow-lg">
                          📞
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-50">
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Order Items</p>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 px-3 py-1 rounded-lg text-xs font-bold">
                          {item.name} x{item.quantity} ({item.size})
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
