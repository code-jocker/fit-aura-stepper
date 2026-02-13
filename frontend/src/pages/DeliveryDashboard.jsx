import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DeliveryMap from '../components/DeliveryMap';
import { Send, MessageCircle, Heart, MapPin, Phone, CheckCircle2, Navigation, Bell } from 'lucide-react';

const API_URL = process.env.NODE_ENV === 'production' ? '/api' : (process.env.REACT_APP_API_URL || 'http://localhost:5000/api');

export default function DeliveryDashboard() {
  const [worker, setWorker] = useState(null);
  const [assignedOrders, setAssignedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [startLocation, setStartLocation] = useState(null);
  const [gettingStartLocation, setGettingStartLocation] = useState(false);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState({});
  const [motivations, setMotivations] = useState([]);
  const [showChat, setShowChat] = useState({});
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showChat]);

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
    fetchMotivations();
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
      
      // Fetch messages for each order
      response.data.forEach(order => {
        fetchOrderMessages(order._id);
      });
    } catch (err) {
      setError('Failed to fetch assigned orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderMessages = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/messages/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(prev => ({ ...prev, [orderId]: response.data }));
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const fetchMotivations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const motivationMsgs = response.data.filter(m => m.type === 'motivation');
      setMotivations(motivationMsgs);
    } catch (err) {
      console.error('Error fetching motivations:', err);
    }
  };

  const sendMessage = async (orderId) => {
    if (!newMessage[orderId]?.trim()) return;

    try {
      const token = localStorage.getItem('token');
      // Admin ID is usually known or can be found from the order/profile
      // For now, we'll assume sending to the "admin" role
      await axios.post(`${API_URL}/messages`, {
        orderId,
        content: newMessage[orderId],
        type: 'chat',
        receiverId: 'admin' // Backend needs to handle 'admin' as a special receiver or we need the actual admin ID
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNewMessage(prev => ({ ...prev, [orderId]: '' }));
      fetchOrderMessages(orderId);
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    }
  };

  const markAsDelivered = async (orderId, note = '') => {
    if (!window.confirm('Are you sure you want to mark this order as DELIVERED? This will notify the admin and send a thank you message to the customer.')) {
      return;
    }

    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/orders/${orderId}/delivered`,
        { deliveryNote: note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Order marked as delivered! Admin and customer have been notified. ✨');
      fetchAssignedOrders(); // Refresh the list
    } catch (err) {
      console.error('Error marking as delivered:', err);
      alert(err.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const updateDeliveryNote = async (orderId, note) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/orders/${orderId}/note`,
        { deliveryNote: note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Note saved! Admin can see this now.');
      fetchAssignedOrders();
    } catch (err) {
      alert('Failed to save note');
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

  if (loading) return <div className="container py-20 text-center font-black uppercase animate-pulse">Loading Dashboard...</div>;

  return (
    <div className="container py-12 bg-[#fafafa] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
        <div>
          <h1 className="text-5xl font-black uppercase mb-2 tracking-tighter">Delivery <span className="text-amber-500">Center</span></h1>
          <p className="text-gray-500 font-bold flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-ping"></span>
            Welcome back, {worker?.name} • Rwanda Logistics
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-black/5 border border-gray-100 flex items-center gap-8">
          <div className="flex flex-col">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Status</p>
            <div className={`flex items-center gap-2 font-black text-sm ${worker?.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
              <span className={`w-3 h-3 rounded-full ${worker?.isAvailable ? 'bg-green-600 animate-pulse' : 'bg-red-600'}`}></span>
              {worker?.isAvailable ? 'AVAILABLE' : 'OFFLINE'}
            </div>
          </div>
          <button
            onClick={toggleAvailability}
            disabled={updating}
            className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all transform active:scale-95 ${
              worker?.isAvailable 
                ? 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white' 
                : 'bg-green-600 text-white hover:bg-black shadow-lg shadow-green-200'
            }`}
          >
            {worker?.isAvailable ? 'Go Offline' : 'Go Online Now'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Stats & Profile & Motivations (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          {/* Motivation Box */}
          {motivations.length > 0 && (
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-amber-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-20">
                <Heart size={80} fill="currentColor" />
              </div>
              <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2">
                <Bell size={20} /> Motivation
              </h3>
              <div className="space-y-4 relative z-10">
                {motivations.slice(0, 3).map((m, idx) => (
                  <div key={idx} className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                    <p className="text-sm font-bold italic leading-relaxed">"{m.content}"</p>
                    <p className="text-[10px] font-black uppercase mt-2 opacity-70">— From Admin</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-black text-white p-8 rounded-[2.5rem] shadow-2xl">
            <h3 className="text-xl font-black uppercase mb-8 text-amber-500 flex items-center gap-2">
              <MapPin size={20} /> My Station
            </h3>
            <div className="space-y-6">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Current Base</p>
                <p className="font-bold text-lg">{worker?.location || 'Not set'}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Email</p>
                <p className="font-bold">{worker?.email}</p>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Phone</p>
                <p className="font-bold">{worker?.phone || 'Not set'}</p>
              </div>
            </div>

            <form onSubmit={updateLocation} className="mt-10 pt-8 border-t border-white/10">
              <label className="block text-gray-400 text-[10px] font-black uppercase tracking-widest mb-3">Update Current Location</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Nyarugenge, Kigali"
                  defaultValue={worker?.location}
                  className="flex-grow bg-white/10 border-none rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                />
                <button type="submit" disabled={updating} className="bg-amber-500 text-black px-6 rounded-2xl text-[10px] font-black uppercase hover:bg-white transition-all">
                  Update
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
            <h3 className="text-xl font-black uppercase mb-8 tracking-tight">Performance</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <p className="text-4xl font-black mb-1">{assignedOrders.length}</p>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Active Tasks</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                <p className="text-4xl font-black mb-1">0</p>
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Assigned Orders & Map (8 cols) */}
        <div className="lg:col-span-8 space-y-12">
          {/* Map Section */}
          <div>
            <div className="flex justify-between items-end mb-6">
              <h3 className="text-2xl font-black uppercase tracking-tighter">Live Route <span className="text-amber-500">Map</span></h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-gray-100">Real-time tracking active</p>
            </div>
            <div className="bg-white p-3 rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden h-[450px]">
              <DeliveryMap 
                orders={assignedOrders} 
                onMarkerClick={(order) => {
                  const element = document.getElementById(`order-${order._id}`);
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                }} 
              />
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-8">
            <h3 className="text-2xl font-black uppercase tracking-tighter">Current <span className="text-amber-500">Assignments</span></h3>
            
            {assignedOrders.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-[3rem] py-32 text-center shadow-xl shadow-black/5">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin size={40} className="text-gray-300" />
                </div>
                <p className="text-gray-400 font-black uppercase tracking-widest">No active deliveries</p>
                <p className="text-sm text-gray-400 mt-2 font-bold">New orders will appear here as they are assigned.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {assignedOrders.map(order => (
                  <div key={order._id} id={`order-${order._id}`} className="bg-white border border-gray-100 rounded-[3rem] p-8 md:p-12 shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all relative overflow-hidden group">
                    {/* Status Badge */}
                    <div className="absolute top-8 right-8 flex items-center gap-3">
                      <span className="bg-amber-100 text-amber-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="w-2 h-2 bg-amber-600 rounded-full animate-pulse"></span>
                        {order.status}
                      </span>
                      <span className="text-gray-300 font-black text-xs">#{order._id.slice(-8)}</span>
                    </div>

                    <div className="flex flex-col gap-10">
                      {/* Customer Info */}
                      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                        <div className="flex-grow">
                          <h4 className="text-3xl font-black uppercase mb-2 tracking-tighter">{order.customerName}</h4>
                          <div className="flex flex-wrap gap-4">
                            <a href={`tel:${order.phone}`} className="flex items-center gap-2 text-gray-500 font-bold hover:text-amber-600 transition-colors">
                              <Phone size={16} /> {order.phone}
                            </a>
                            <p className="flex items-center gap-2 text-gray-500 font-bold">
                              <MapPin size={16} /> {order.deliveryAddress}
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 min-w-[200px] text-right">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Total to Collect</p>
                          <p className="text-3xl font-black text-black">{order.total.toLocaleString()} RWF</p>
                          <p className={`text-[10px] font-black uppercase tracking-widest mt-3 px-3 py-1.5 rounded-xl inline-block ${order.paymentMethod === 'cash' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                            {order.paymentMethod === 'cash' ? '💵 Cash on Delivery' : '💳 Already Paid'}
                          </p>
                        </div>
                      </div>

                      {/* Navigation Section */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={`p-6 rounded-[2rem] border-2 transition-all ${startLocation ? 'bg-green-50/50 border-green-100' : 'bg-gray-50 border-dashed border-gray-200'}`}>
                          <div className="flex justify-between items-center mb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Current Position</p>
                            {startLocation && <CheckCircle2 size={16} className="text-green-500" />}
                          </div>
                          {startLocation ? (
                            <div className="space-y-1">
                              <p className="font-black text-sm">Station Locked</p>
                              <p className="text-[10px] text-gray-400 font-bold">{startLocation.lat.toFixed(6)}, {startLocation.lng.toFixed(6)}</p>
                            </div>
                          ) : (
                            <button 
                              onClick={captureStartLocation}
                              disabled={gettingStartLocation}
                              className="w-full py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                            >
                              <MapPin size={14} /> {gettingStartLocation ? 'Capturing...' : 'Set Current Location'}
                            </button>
                          )}
                        </div>

                        <div className="p-6 bg-blue-50/50 rounded-[2rem] border-2 border-blue-100">
                          <div className="flex justify-between items-center mb-4">
                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Target Destination</p>
                            <Navigation size={16} className="text-blue-500" />
                          </div>
                          <div className="flex flex-col gap-4">
                            <p className="font-black text-sm leading-tight">{order.deliveryAddress}</p>
                            {order.location && (
                              <a 
                                href={`https://www.google.com/maps/dir/?api=1&destination=${order.location.lat},${order.location.lng}${startLocation ? `&origin=${startLocation.lat},${startLocation.lng}` : ''}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
                              >
                                <Navigation size={14} /> Open Navigation
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Product Details Section */}
                      <div className="bg-gray-50 rounded-[2rem] p-8 border border-gray-100">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">Items to Deliver</h5>
                        <div className="space-y-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100">
                              <div className="w-16 h-16 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <Package size={24} />
                                  </div>
                                )}
                              </div>
                              <div className="flex-grow">
                                <p className="font-black text-sm uppercase tracking-tight">{item.name}</p>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">
                                  Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-black text-sm">{(item.price * item.quantity).toLocaleString()} RWF</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action & Chat Section */}
                      <div className="border-t border-gray-50 pt-10">
                        <div className="flex flex-col md:flex-row gap-12">
                          <div className="md:w-full flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Communication</p>
                              <button 
                                onClick={() => setShowChat(prev => ({ ...prev, [order._id]: !prev[order._id] }))}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                                  showChat[order._id] ? 'bg-black text-white' : 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                                }`}
                              >
                                <MessageCircle size={14} /> {showChat[order._id] ? 'Hide Chat' : 'Chat with Admin'}
                              </button>
                            </div>

                            {showChat[order._id] ? (
                              <div className="bg-gray-50 rounded-[2rem] border border-gray-100 overflow-hidden flex flex-col h-[350px]">
                                <div className="flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                  {messages[order._id]?.length > 0 ? (
                                    messages[order._id].map((msg, idx) => (
                                      <div key={idx} className={`flex flex-col ${msg.senderId._id === worker?._id ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[80%] p-4 rounded-2xl text-xs font-bold ${
                                          msg.senderId._id === worker?._id 
                                            ? 'bg-black text-white rounded-tr-none' 
                                            : 'bg-white border border-gray-200 text-black rounded-tl-none shadow-sm'
                                        }`}>
                                          {msg.content}
                                        </div>
                                        <span className="text-[9px] text-gray-400 mt-1 uppercase font-black tracking-widest">
                                          {msg.senderId.role === 'admin' ? 'ADMIN' : 'YOU'} • {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                                      <MessageCircle size={40} className="mb-2" />
                                      <p className="text-[10px] font-black uppercase tracking-widest">No messages yet</p>
                                    </div>
                                  )}
                                  <div ref={chatEndRef} />
                                </div>
                                <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                                  <input 
                                    type="text"
                                    value={newMessage[order._id] || ''}
                                    onChange={(e) => setNewMessage(prev => ({ ...prev, [order._id]: e.target.value }))}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage(order._id)}
                                    placeholder="Type message to admin..."
                                    className="flex-grow bg-gray-50 border-none rounded-xl px-4 py-3 text-xs font-bold outline-none focus:ring-2 ring-amber-500 transition-all"
                                  />
                                  <button 
                                    onClick={() => sendMessage(order._id)}
                                    className="bg-black text-white p-3 rounded-xl hover:bg-amber-500 transition-all shadow-lg"
                                  >
                                    <Send size={18} />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-amber-50/50 p-6 rounded-[2rem] border border-amber-100 flex-grow">
                                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-3">Admin Instructions</p>
                                <div className="bg-white p-4 rounded-2xl border border-amber-100 shadow-sm italic text-sm font-bold text-gray-700">
                                  "{order.adminNote || 'Drive safe! No specific notes for this delivery.'}"
                                </div>
                                <div className="mt-6">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">Your Progress Note</p>
                                  <textarea
                                    placeholder="Add status update for admin..."
                                    defaultValue={order.deliveryNote}
                                    onBlur={(e) => updateDeliveryNote(order._id, e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:ring-2 ring-amber-500 min-h-[100px] shadow-sm transition-all"
                                  />
                                  <p className="text-[9px] text-gray-400 mt-2 italic font-bold text-center">Auto-saves on blur</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex gap-4 w-full">
                        <button 
                          onClick={() => markAsDelivered(order._id, order.deliveryNote)}
                          disabled={updating || order.status === 'delivered'}
                          className={`flex-grow py-6 rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] transition-all shadow-2xl transform active:scale-95 flex items-center justify-center gap-3 ${
                            order.status === 'delivered'
                              ? 'bg-green-100 text-green-600 cursor-default'
                              : 'bg-black text-white hover:bg-amber-500 shadow-black/20'
                          }`}
                        >
                          {order.status === 'delivered' ? <><CheckCircle2 size={20} /> COMPLETED</> : 'CONFIRM DELIVERY COMPLETE'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
