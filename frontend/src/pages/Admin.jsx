import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeliveryMap from '../components/DeliveryMap';

const API_URL = process.env.NODE_ENV === 'production' ? '/api' : (process.env.REACT_APP_API_URL || 'http://localhost:5000/api');

export default function Admin() {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders', 'deliveries'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveryStaff, setDeliveryStaff] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('shoes');
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showWorkerForm, setShowWorkerForm] = useState(false);
  const [workerFormData, setWorkerFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: ''
  });

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    category: 'shoes',
    audience: 'unisex',
    price: '',
    salePrice: '',
    description: '',
    images: [],
    sizes: '',
    colors: '',
    stock: '',
    isFeatured: false,
    isNew: true,
    isPublished: true
  });

  // Image Compression Helper
  const compressImage = (base64Str, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
    });
  };

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const url = searchTerm 
        ? `${API_URL}/products?search=${encodeURIComponent(searchTerm)}&limit=all&adminView=true`
        : `${API_URL}/products?category=${selectedCategory}&limit=all&adminView=true`;
      const res = await axios.get(url);
      if (res.data) {
        setProducts(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Keep existing products if fetch fails
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/orders/${orderId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Order status updated');
      fetchOrders();
    } catch (error) {
      alert('Failed to update order status');
    }
  };

  // Fetch delivery staff
  const fetchDeliveryStaff = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/user?role=delivery`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeliveryStaff(res.data);
    } catch (error) {
      console.error('Failed to fetch delivery staff:', error);
    }
  };

  const handleWorkerSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/user/workers`, workerFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Worker added successfully');
      setWorkerFormData({ name: '', email: '', password: '', phone: '', location: '' });
      setShowWorkerForm(false);
      fetchDeliveryStaff();
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteWorker = async (workerId) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/user/workers/${workerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Worker deleted successfully');
        fetchDeliveryStaff();
      } catch (error) {
        alert(`Error: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const assignDelivery = async (orderId, deliveryPersonId, adminNote = '') => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/orders/${orderId}`, { 
        deliveryPerson: deliveryPersonId,
        status: 'shipped',
        assignedAt: new Date(),
        adminNote: adminNote || 'Please deliver this order ASAP. Be polite to the customer!'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Delivery assigned successfully');
      fetchOrders();
    } catch (error) {
      alert('Failed to assign delivery');
    }
  };

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'deliveries') {
      fetchOrders();
      fetchDeliveryStaff();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, activeTab, searchTerm]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Max size is 5MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result;
        const compressedResult = await compressImage(result);
        setFormData(prev => {
          const currentImages = Array.isArray(prev.images) ? [...prev.images] : [];
          if (!currentImages.includes(compressedResult)) {
            currentImages.push(compressedResult);
          }
          return {
            ...prev,
            images: currentImages
          };
        });
      };
      reader.onerror = () => {
        alert(`Failed to read file ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Improved validation for images
    const imageList = Array.isArray(formData.images) ? formData.images : [];

    if (!formData.name || !formData.brand || !formData.price || !formData.description || imageList.length === 0) {
      alert('Please fill in all required fields including at least one image');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        stock: parseInt(formData.stock) || 0,
        images: imageList,
        sizes: typeof formData.sizes === 'string' ? formData.sizes.split(',').map(s => s.trim()).filter(s => s) : (Array.isArray(formData.sizes) ? formData.sizes : []),
        colors: typeof formData.colors === 'string' ? formData.colors.split(',').map(c => c.trim()).filter(c => c) : (Array.isArray(formData.colors) ? formData.colors : []),
        isFeatured: !!formData.isFeatured,
        isNew: !!formData.isNew,
        isPublished: formData.isPublished !== undefined ? !!formData.isPublished : true
      };

      if (editingId) {
        // Update existing product
        await axios.put(`${API_URL}/products/${editingId}`, payload, config);
        alert('Product updated successfully');
      } else {
        // Create new product
        await axios.post(`${API_URL}/products`, payload, config);
        alert('Product created successfully');
      }

      // Reset form
      setFormData({
        name: '',
        brand: '',
        category: 'shoes',
        audience: 'unisex',
        price: '',
        salePrice: '',
        description: '',
        images: [],
        sizes: '',
        colors: '',
        stock: '',
        isFeatured: false,
        isNew: true,
        isPublished: true
      });
      setEditingId(null);
      setShowForm(false);
      
      // Refresh products
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      audience: product.audience || 'unisex',
      price: product.price,
      salePrice: product.salePrice || '',
      description: product.description,
      images: Array.isArray(product.images) ? product.images : [],
      sizes: product.sizes.join(', '),
      colors: product.colors.join(', '),
      stock: product.stock,
      isFeatured: product.isFeatured || false,
      isNew: product.isNew || false,
      isPublished: product.isPublished !== undefined ? product.isPublished : true
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert(`Error: ${error.response?.data?.message || error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      brand: '',
      category: 'shoes',
      audience: 'unisex',
      price: '',
      salePrice: '',
      description: '',
      images: [],
      sizes: '',
      colors: '',
      stock: '',
      isFeatured: false,
      isNew: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-lg font-bold transition ${
              activeTab === 'products' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Manage Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-lg font-bold transition ${
              activeTab === 'orders' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Manage Orders
          </button>
          <button
            onClick={() => setActiveTab('deliveries')}
            className={`px-6 py-3 rounded-lg font-bold transition ${
              activeTab === 'deliveries' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Tracking & Deliveries
          </button>
        </div>

        {activeTab === 'deliveries' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center bg-white rounded-[2rem] shadow-2xl p-8">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Worker Management</h2>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Add or remove delivery personnel</p>
              </div>
              <button 
                onClick={() => setShowWorkerForm(!showWorkerForm)}
                className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-lg hover:shadow-amber-200"
              >
                {showWorkerForm ? 'Close Form' : '+ Add New Worker'}
              </button>
            </div>

            {showWorkerForm && (
              <div className="bg-white rounded-[2rem] shadow-2xl p-8 animate-in fade-in slide-in-from-top-4 duration-300">
                <form onSubmit={handleWorkerSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 ring-amber-500 transition-all"
                      value={workerFormData.name}
                      onChange={(e) => setWorkerFormData({...workerFormData, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email Address</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 ring-amber-500 transition-all"
                      value={workerFormData.email}
                      onChange={(e) => setWorkerFormData({...workerFormData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 ring-amber-500 transition-all"
                      value={workerFormData.password}
                      onChange={(e) => setWorkerFormData({...workerFormData, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Phone Number</label>
                    <input
                      type="text"
                      placeholder="+250..."
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 ring-amber-500 transition-all"
                      value={workerFormData.phone}
                      onChange={(e) => setWorkerFormData({...workerFormData, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Location/Base</label>
                    <input
                      type="text"
                      placeholder="Kigali, Rwanda"
                      className="w-full bg-gray-50 border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 ring-amber-500 transition-all"
                      value={workerFormData.location}
                      onChange={(e) => setWorkerFormData({...workerFormData, location: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-amber-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg hover:shadow-gray-200 disabled:opacity-50"
                    >
                      {loading ? 'Creating...' : 'Register Worker'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-[2rem] shadow-2xl p-8">
              <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">All Delivery Workers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {deliveryStaff.length === 0 ? (
                  <p className="col-span-full text-center py-12 text-gray-400 font-bold uppercase tracking-widest text-xs">No workers registered yet</p>
                ) : (
                  deliveryStaff.map(worker => (
                    <div key={worker._id} className="bg-gray-50 rounded-3xl p-6 border-2 border-transparent hover:border-amber-500 transition-all group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-xl">
                          👤
                        </div>
                        <button 
                          onClick={() => deleteWorker(worker._id)}
                          className="opacity-0 group-hover:opacity-100 p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                          title="Delete Worker"
                        >
                          🗑️
                        </button>
                      </div>
                      <h3 className="font-black uppercase text-sm mb-1">{worker.name}</h3>
                      <p className="text-xs text-gray-500 font-bold mb-3">{worker.email}</p>
                      <div className="space-y-2 border-t border-gray-100 pt-3">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                          <span>📍</span> {worker.location || 'No location'}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
                          <span>📞</span> {worker.phone || 'No phone'}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-2xl p-8">
              <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">Live Delivery Map</h2>
              <DeliveryMap 
                orders={orders} 
                workers={deliveryStaff}
                onMarkerClick={(item) => {
                  if (item.type === 'order') {
                    const element = document.getElementById(`order-${item.data._id}`);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }
                }} 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-[2rem] shadow-2xl p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black uppercase tracking-tight">Pending Assignments</h2>
                  <button
                    onClick={() => {
                      const pendingOrders = orders.filter(o => o.status === 'confirmed' || o.status === 'pending');
                      const availableStaff = deliveryStaff.filter(s => s.isAvailable);
                      if (pendingOrders.length === 0) return alert('No pending orders to assign');
                      if (availableStaff.length === 0) return alert('No available delivery staff');
                      
                      if (window.confirm(`Auto-assign ${Math.min(pendingOrders.length, availableStaff.length)} orders to available staff?`)) {
                        pendingOrders.forEach((order, index) => {
                          const staff = availableStaff[index % availableStaff.length];
                          assignDelivery(order._id, staff._id);
                        });
                      }
                    }}
                    className="text-[10px] bg-amber-500 text-black px-4 py-2 rounded-xl font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-lg"
                  >
                    ⚡ Auto-Assign All
                  </button>
                </div>
                <div className="space-y-4">
                  {orders.filter(o => o.status === 'confirmed' || o.status === 'pending').length === 0 ? (
                    <p className="text-gray-500 font-bold text-center py-8 uppercase tracking-widest text-xs">No pending assignments</p>
                  ) : (
                    orders.filter(o => o.status === 'confirmed' || o.status === 'pending').map(order => (
                      <div key={order._id} id={`order-${order._id}`} className="border-2 border-gray-50 rounded-2xl p-4 hover:border-amber-500 transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-black uppercase text-sm">{order.customerName}</h3>
                            <p className="text-xs text-gray-500">{order.deliveryAddress}</p>
                            {order.location && (
                              <p className="text-[10px] text-amber-600 font-bold uppercase tracking-widest mt-1">
                                📍 Precise Location captured
                              </p>
                            )}
                          </div>
                          <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                            {order.status}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <textarea
                            placeholder="Add a message for delivery (optional)..."
                            className="w-full bg-gray-50 border-none rounded-xl px-4 py-2 text-[10px] font-bold outline-none focus:ring-2 ring-amber-500"
                            onChange={(e) => order.tempAdminNote = e.target.value}
                            rows="2"
                          />
                          <div className="flex gap-2">
                            <select 
                              className="flex-grow bg-gray-50 border-none rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-2 ring-amber-500"
                              onChange={(e) => order.tempDeliveryPerson = e.target.value}
                            >
                              <option value="">Select Delivery Person</option>
                              {deliveryStaff.map(staff => (
                                <option key={staff._id} value={staff._id}>{staff.name}</option>
                              ))}
                            </select>
                            <button 
                              onClick={() => {
                                if (order.tempDeliveryPerson) {
                                  assignDelivery(order._id, order.tempDeliveryPerson, order.tempAdminNote);
                                } else {
                                  alert('Please select a delivery person');
                                }
                              }}
                              className="bg-black text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-500 transition-all"
                            >
                              Assign
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white rounded-[2rem] shadow-2xl p-8">
                <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">Active Deliveries</h2>
                <div className="space-y-4">
                  {orders.filter(o => o.status === 'shipped').length === 0 ? (
                    <p className="text-gray-500 font-bold text-center py-8 uppercase tracking-widest text-xs">No active deliveries</p>
                  ) : (
                    orders.filter(o => o.status === 'shipped').map(order => (
                      <div key={order._id} className="border-2 border-gray-50 rounded-2xl p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-black uppercase text-sm">{order.customerName}</h3>
                          <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                            In Transit
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 mb-4">
                          Assigned to: <span className="text-black font-bold uppercase">{deliveryStaff.find(s => s._id === order.deliveryPerson)?.name || 'Unknown'}</span>
                        </p>
                        <button 
                          onClick={() => updateOrderStatus(order._id, 'delivered')}
                          className="w-full bg-green-500 text-white py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-green-600 transition-all"
                        >
                          Mark as Delivered
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' ? (
          <>
            {/* Search and Filter */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Search Products</h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, brand, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border rounded-lg px-4 py-2 outline-none focus:border-black"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Filter by Category</h2>
                <div className="flex gap-2 flex-wrap">
                  {['shoes', 'clothes', 'accessories'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSearchTerm(''); // Clear search when category changes
                      }}
                      className={`px-4 py-2 rounded-lg capitalize font-semibold transition ${
                        selectedCategory === cat && !searchTerm
                          ? 'bg-black text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

        {/* Add Product Button */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary px-6 py-3"
          >
            {showForm ? 'Cancel' : '+ Add New Product'}
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block font-bold mb-2">Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border rounded px-4 py-2 outline-none focus:border-black"
                    placeholder="e.g., Nike Air Jordan"
                  />
                </div>

                {/* Brand */}
                <div>
                  <label className="block font-bold mb-2">Brand *</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="w-full border rounded px-4 py-2 outline-none focus:border-black"
                    placeholder="e.g., Nike"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block font-bold mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border rounded px-4 py-2 outline-none focus:border-black"
                  >
                    <option value="shoes">Shoes</option>
                    <option value="clothes">Clothes</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                {/* Audience */}
                <div>
                  <label className="block font-bold mb-2">For Who *</label>
                  <select
                    name="audience"
                    value={formData.audience}
                    onChange={handleInputChange}
                    className="w-full border rounded px-4 py-2 outline-none focus:border-black"
                  >
                    <option value="unisex">Unisex</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block font-bold mb-2">Price (RWF) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full border rounded px-4 py-2 outline-none focus:border-black"
                    placeholder="0"
                    min="0"
                  />
                </div>

                {/* Sale Price */}
                <div>
                  <label className="block font-bold mb-2">Sale Price (RWF)</label>
                  <input
                    type="number"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleInputChange}
                    className="w-full border rounded px-4 py-2 outline-none focus:border-black"
                    placeholder="Leave empty if not on sale"
                    min="0"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block font-bold mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full border rounded px-4 py-2 outline-none focus:border-black"
                    placeholder="0"
                    min="0"
                  />
                </div>

                {/* Status Toggles */}
                <div className="flex gap-8 items-center pt-8">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="font-bold group-hover:text-amber-600 transition">🌟 Feature on Home</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="isNew"
                      checked={formData.isNew}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="font-bold group-hover:text-amber-600 transition">🆕 Mark as New</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <span className="font-bold group-hover:text-amber-600 transition">🌍 Publish Immediately</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded px-4 py-2 outline-none focus:border-black"
                  placeholder="Product description..."
                  rows="4"
                />
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-bold mb-2 text-sm uppercase tracking-tight">Image Management</label>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="newImageUrl"
                        placeholder="Paste image URL here..."
                        className="flex-grow border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 ring-amber-500 transition-all"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const url = e.target.value.trim();
                            if (url) {
                              const imgs = Array.isArray(formData.images) ? [...formData.images] : [];
                              imgs.push(url);
                              setFormData(prev => ({ ...prev, images: imgs }));
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById('newImageUrl');
                          const url = input.value.trim();
                          if (url) {
                            const imgs = Array.isArray(formData.images) ? [...formData.images] : [];
                            imgs.push(url);
                            setFormData(prev => ({ ...prev, images: imgs }));
                            input.value = '';
                          }
                        }}
                        className="bg-black text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-500 transition-all"
                      >
                        Add URL
                      </button>
                    </div>
                    
                    <textarea
                      name="images"
                      value={Array.isArray(formData.images) ? formData.images.join(', ') : ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData(prev => ({ 
                          ...prev, 
                          images: val.split(',').map(s => s.trim()).filter(s => s) 
                        }));
                      }}
                      className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 ring-amber-500 font-mono text-xs bg-gray-50/50"
                      placeholder="Current image list (comma-separated)..."
                      rows="3"
                    />
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">
                      💡 Tip: You can paste multiple URLs separated by commas, or use the "Add URL" button above.
                    </p>
                  </div>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 min-h-[300px]">
                  <label className="cursor-pointer flex flex-col items-center mb-6">
                    <span className="text-4xl mb-2">📤</span>
                    <span className="font-bold text-gray-700">Upload Local Images</span>
                    <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Max 5MB each</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  
                  {formData.images && formData.images.length > 0 && (
                    <div className="w-full">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Live Previews</h3>
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-48 overflow-y-auto p-1">
                        {formData.images.map((img, i) => (
                          <div key={i} className="relative group aspect-square">
                            <img 
                              src={img} 
                              alt="preview" 
                              className="w-full h-full object-cover rounded-xl border-2 border-white shadow-md group-hover:border-amber-500 transition-all" 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/100?text=Error';
                              }}
                            />
                            <button 
                              type="button"
                              onClick={() => {
                                setFormData(prev => {
                                  const imgs = [...prev.images];
                                  imgs.splice(i, 1);
                                  return { ...prev, images: imgs };
                                });
                              }}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sizes */}
              <div>
                <label className="block font-bold mb-2">Available Sizes (comma-separated)</label>
                <input
                  type="text"
                  name="sizes"
                  value={formData.sizes}
                  onChange={handleInputChange}
                  className="w-full border rounded px-4 py-2 outline-none focus:border-black"
                  placeholder="e.g., XS, S, M, L, XL or 36, 37, 38, 39, 40"
                />
              </div>

              {/* Colors */}
              <div>
                <label className="block font-bold mb-2">Available Colors (comma-separated)</label>
                <input
                  type="text"
                  name="colors"
                  value={formData.colors}
                  onChange={handleInputChange}
                  className="w-full border rounded px-4 py-2 outline-none focus:border-black"
                  placeholder="e.g., Red, Blue, Black, White"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-2xl font-bold capitalize">
              {selectedCategory} ({products.length} products)
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : products.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No products in this category. Add one to get started!
            </div>
          ) : (
            <div className="space-y-6 p-6">
              {products.map(product => (
                <div key={product._id} className="border rounded-lg p-6 hover:shadow-lg transition">
                  <div className="flex flex-col gap-6">
                    {/* Product Images Gallery - Now Full Width Above Details */}
                    {product.images && product.images.length > 0 ? (
                      <div className="w-full">
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                          {product.images.map((image, idx) => (
                            <div key={idx} className="relative flex-shrink-0 w-32 h-32 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
                              <img
                                src={image}
                                alt={`${product.name} ${idx + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition duration-500 cursor-pointer"
                                loading="lazy"
                                onClick={() => window.open(image, '_blank')}
                                onError={(e) => {
                                  console.error(`Image failed to load: ${image}`);
                                  e.target.src = 'https://via.placeholder.com/400x400?text=Error';
                                  e.target.className = "w-full h-full object-contain p-2 opacity-50";
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 border border-dashed border-gray-300">
                        No Images Available
                      </div>
                    )}

                    {/* Product Details */}
                    <div className="w-full">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                          <p className="text-gray-600 text-sm capitalize">{product.brand} • {product.category}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">
                            {product.price.toLocaleString()} RWF
                          </div>
                          {!product.isPublished && (
                            <div className="inline-block mt-1 bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                              🔜 Coming Soon
                            </div>
                          )}
                          {product.salePrice && (
                            <div className="text-green-600 font-semibold text-lg">
                              Sale: {product.salePrice.toLocaleString()} RWF
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm mb-4 line-clamp-2">{product.description}</p>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div className="bg-gray-50 p-3 rounded">
                          <label className="text-xs font-semibold text-gray-600 block mb-1">Available Sizes</label>
                          <p className="text-gray-800 font-medium">
                            {product.sizes && product.sizes.length > 0 ? product.sizes.join(', ') : 'N/A'}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <label className="text-xs font-semibold text-gray-600 block mb-1">Colors</label>
                          <p className="text-gray-800 font-medium">
                            {product.colors && product.colors.length > 0 ? product.colors.join(', ') : 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                          product.stock > 10
                            ? 'bg-green-100 text-green-800'
                            : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </span>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold text-sm"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold text-sm"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold">Orders ({orders.length})</h2>
              <button onClick={fetchOrders} className="text-blue-500 hover:underline">Refresh</button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-600 uppercase text-sm">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map(order => (
                    <React.Fragment key={order._id}>
                      <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => order.showDetails = !order.showDetails}>
                        <td className="p-4 font-mono text-sm">{order._id.slice(-8)}</td>
                        <td className="p-4">
                          <div className="font-semibold">{order.customerName || 'Guest'}</div>
                          <div className="text-xs text-gray-500">{order.phone}</div>
                        </td>
                        <td className="p-4 font-bold">{order.total.toLocaleString()} RWF</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="capitalize text-sm">{order.paymentMethod}</span>
                          {order.paymentStatus === 'completed' && <span className="ml-2 text-green-600">✓</span>}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <select 
                              value={order.status}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              className="border rounded px-2 py-1 text-sm outline-none"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setOrders(orders.map(o => o._id === order._id ? {...o, showDetails: !o.showDetails} : o));
                              }}
                              className="text-gray-400 hover:text-black"
                            >
                              {order.showDetails ? '▲' : '▼'}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {order.showDetails && (
                        <tr className="bg-gray-50">
                          <td colSpan="6" className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                              <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Order Items</h3>
                                <div className="space-y-3">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                                      <div className="flex flex-col">
                                        <span className="text-sm font-bold">Product ID: {item.productId.slice(-6)}</span>
                                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                          Size: {item.size} | Color: {item.color}
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-sm font-black">{item.price.toLocaleString()} RWF</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase">Qty: {item.quantity}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Customer Details</h3>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-2">
                                  <p className="text-sm"><strong>Name:</strong> {order.customerName}</p>
                                  <p className="text-sm"><strong>Phone:</strong> {order.phone}</p>
                                  <p className="text-sm"><strong>Email:</strong> {order.email}</p>
                                  <p className="text-sm"><strong>Address:</strong> {order.deliveryAddress}</p>
                                  {order.notes && (
                                    <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-1">Customer Note</p>
                                      <p className="text-xs italic text-amber-800">{order.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Delivery & Admin Notes</h3>
                                  <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Admin Message to Delivery</p>
                                      <p className="text-xs font-bold text-gray-700">{order.adminNote || 'No message sent'}</p>
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-100">
                                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">Message from Delivery</p>
                                      <p className="text-xs font-bold text-blue-800">{order.deliveryNote || 'No feedback yet'}</p>
                                    </div>
                                  </div>
                                </div>
                                {order.status === 'pending' || order.status === 'confirmed' ? (
                                  <div className="bg-amber-100 p-4 rounded-xl border border-amber-200">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-2">Action Required</p>
                                    <p className="text-xs font-bold">Please assign this order to a delivery person in the "Tracking & Deliveries" tab.</p>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="p-8 text-center text-gray-500">No orders found.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
