import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DeliveryMap from '../components/DeliveryMap';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  Moon, 
  Sun,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Truck,
  Plus,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';

const API_URL = process.env.NODE_ENV === 'production' ? '/api' : (process.env.REACT_APP_API_URL || 'http://localhost:5000/api');

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [deliveryStaff, setDeliveryStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: '', brand: '', category: 'shoes', audience: 'unisex',
    price: '', salePrice: '', description: '', images: [],
    sizes: '', colors: '', stock: '', isFeatured: false,
    isNew: true, isPublished: true
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      brand: product.brand,
      category: product.category,
      audience: product.audience || 'unisex',
      price: product.price,
      salePrice: product.salePrice || '',
      description: product.description,
      images: product.images || [],
      sizes: product.sizes ? product.sizes.join(', ') : '',
      colors: product.colors ? product.colors.join(', ') : '',
      stock: product.stock,
      isFeatured: product.isFeatured || false,
      isNew: product.isNew !== undefined ? product.isNew : true,
      isPublished: product.isPublished !== undefined ? product.isPublished : true
    });
    setShowProductForm(true);
  };

  const handleDelete = async (id) => {
     if (!window.confirm('Are you sure you want to delete this product?')) return;
     try {
       const token = localStorage.getItem('token');
       await axios.delete(`${API_URL}/products/${id}`, {
         headers: { Authorization: `Bearer ${token}` }
       });
       fetchData();
     } catch (err) {
       console.error('Delete error:', err);
       alert('Failed to delete product');
     }
   };

   const handleSubmit = async (e) => {
     e.preventDefault();
     setLoading(true);
     try {
       const token = localStorage.getItem('token');
       const config = { headers: { Authorization: `Bearer ${token}` } };
       
       const data = {
         ...formData,
         price: Number(formData.price),
         salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
         stock: Number(formData.stock),
         sizes: typeof formData.sizes === 'string' ? formData.sizes.split(',').map(s => s.trim()).filter(s => s) : formData.sizes,
         colors: typeof formData.colors === 'string' ? formData.colors.split(',').map(c => c.trim()).filter(c => c) : formData.colors
       };

       if (editingId) {
         await axios.put(`${API_URL}/products/${editingId}`, data, config);
       } else {
         await axios.post(`${API_URL}/products`, data, config);
       }
       
       setShowProductForm(false);
       setEditingId(null);
       setFormData({
         name: '', brand: '', category: 'shoes', audience: 'unisex',
         price: '', salePrice: '', description: '', images: [],
         sizes: '', colors: '', stock: '', isFeatured: false,
         isNew: true, isPublished: true
       });
       fetchData();
     } catch (err) {
       console.error('Submit error:', err);
       alert(err.response?.data?.message || 'Failed to save product');
     } finally {
       setLoading(false);
     }
   };

  // Stats for Dashboard
  const stats = [
    { label: 'Total Revenue', value: '1,240,000 RWF', icon: DollarSign, trend: '+12.5%', color: 'bg-green-500' },
    { label: 'Total Orders', value: orders.length, icon: ShoppingBag, trend: '+8.2%', color: 'bg-blue-500' },
    { label: 'Total Customers', value: '450', icon: Users, trend: '+5.4%', color: 'bg-purple-500' },
    { label: 'Active Products', value: products.length, icon: Package, trend: '+2.1%', color: 'bg-amber-500' },
  ];

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer \${token}` } };
      
      const [prodRes, orderRes, staffRes] = await Promise.all([
        axios.get(`\${API_URL}/products?limit=all&adminView=true`),
        axios.get(`\${API_URL}/orders`, config),
        axios.get(`\${API_URL}/user?role=delivery`, config)
      ]);

      setProducts(prodRes.data || []);
      setOrders(orderRes.data || []);
      setDeliveryStaff(staffRes.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // --- UI Components ---

  const SidebarItem = ({ id, label, icon: Icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 \${
        activeTab === id 
          ? 'bg-amber-500 text-black font-black' 
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon size={20} />
      {isSidebarOpen && <span className="uppercase tracking-widest text-xs font-bold">{label}</span>}
      {activeTab === id && isSidebarOpen && <ChevronRight size={16} className="ml-auto" />}
    </button>
  );

  return (
    <div className={`min-h-screen flex \${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-black'}`}>
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-black transition-all duration-500 z-50 \${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-black text-black">M</div>
          {isSidebarOpen && <span className="text-white font-black tracking-tighter uppercase">Mbabazi Closet</span>}
        </div>

        <nav className="mt-10">
          <SidebarItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <SidebarItem id="products" label="Products" icon={Package} />
          <SidebarItem id="orders" label="Orders" icon={ShoppingBag} />
          <SidebarItem id="customers" label="Customers" icon={Users} />
          <SidebarItem id="deliveries" label="Deliveries" icon={Truck} />
          <SidebarItem id="settings" label="Settings" icon={Settings} />
        </nav>

        <button 
          onClick={handleLogout}
          className="absolute bottom-0 w-full flex items-center gap-4 px-6 py-8 text-gray-500 hover:text-red-500 transition-colors border-t border-white/10"
        >
          <LogOut size={20} />
          {isSidebarOpen && <span className="uppercase tracking-widest text-xs font-bold">Logout</span>}
        </button>
      </aside>

      {/* Main Content Area */}
      <main 
        className={`flex-1 transition-all duration-500 \${
          isSidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 py-4 flex items-center justify-between">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="flex-1 max-w-xl mx-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search orders, products, customers..."
              className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-3 hover:bg-gray-100 rounded-2xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 hover:bg-gray-100 rounded-2xl transition-all"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="h-10 w-px bg-gray-100 mx-2"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black uppercase tracking-widest">Admin</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Mbabazi Closet</p>
              </div>
              <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center text-white font-black">A</div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter">Dashboard Overview</h1>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Welcome back, Administrator</p>
                </div>
                <div className="flex gap-4">
                  <button className="flex items-center gap-2 bg-white border border-gray-100 px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-sm hover:shadow-md transition-all">
                    <Filter size={16} /> Filter
                  </button>
                  <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-amber-500 transition-all">
                    <Plus size={16} /> Add Product
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:border-amber-500 transition-all">
                    <div className={`\${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                      <stat.icon size={24} />
                    </div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-2xl font-black tracking-tight">{stat.value}</h3>
                      <span className="text-green-500 text-xs font-black">{stat.trend}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Orders & Charts Section (Simplified for now) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-black uppercase tracking-tight">Recent Orders</h2>
                    <button className="text-amber-500 text-xs font-black uppercase tracking-widest hover:underline">View All</button>
                  </div>
                  <div className="space-y-6">
                    {orders.slice(0, 5).map((order, i) => (
                      <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-3xl transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center font-black text-xs uppercase">
                            {order.customerName?.charAt(0) || 'G'}
                          </div>
                          <div>
                            <p className="font-black uppercase text-xs tracking-tight">{order.customerName || 'Guest'}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order._id.slice(-8)} • {new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-xs">{order.total.toLocaleString()} RWF</p>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full \${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-black text-white rounded-[3rem] p-10 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/20 rounded-full blur-[100px]"></div>
                  <h2 className="text-xl font-black uppercase tracking-tight mb-8">Quick Actions</h2>
                  <div className="space-y-4 relative z-10">
                    <button className="w-full flex items-center justify-between p-6 bg-white/10 hover:bg-white/20 rounded-[2rem] transition-all group border border-white/5">
                      <div className="flex items-center gap-4">
                        <Package size={20} className="text-amber-500" />
                        <span className="text-xs font-black uppercase tracking-widest">Inventory Alert</span>
                      </div>
                      <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">12</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-6 bg-white/10 hover:bg-white/20 rounded-[2rem] transition-all group border border-white/5">
                      <div className="flex items-center gap-4">
                        <Bell size={20} className="text-amber-500" />
                        <span className="text-xs font-black uppercase tracking-widest">New Reviews</span>
                      </div>
                      <span className="bg-amber-500 text-black text-[10px] px-2 py-0.5 rounded-full font-black">5</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-6 bg-amber-500 text-black rounded-[2rem] hover:scale-105 transition-all mt-10">
                      <span className="text-xs font-black uppercase tracking-widest">Download Report</span>
                      <TrendingUp size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter">Products</h1>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Manage your inventory</p>
                </div>
                <button 
                  onClick={() => setShowProductForm(true)}
                  className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl"
                >
                  + Create New Product
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Category</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Price</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Stock</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gray-100 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center">
                              {product.images?.[0] ? (
                                <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <Package className="text-gray-300" size={24} />
                              )}
                            </div>
                            <div>
                              <p className="font-black uppercase text-xs tracking-tight">{product.name}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{product.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-gray-100 rounded-full">{product.category}</span>
                        </td>
                        <td className="px-8 py-6 font-black text-xs">{product.price.toLocaleString()} RWF</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full \${product.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-xs font-bold">{product.stock} Units</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full \${
                            product.isPublished ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'
                          }`}>
                            {product.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => handleEdit(product)}
                              className="p-2 hover:bg-amber-100 text-amber-600 rounded-lg transition-all"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDelete(product._id)}
                              className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter">Customers</h1>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Manage your community</p>
                </div>
                <div className="flex gap-4">
                  <button className="bg-white border border-gray-100 px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all">Export Data</button>
                  <button className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl">+ Add Customer</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100">
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Customers</p>
                  <h3 className="text-3xl font-black tracking-tight">1,284</h3>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100">
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Active This Month</p>
                  <h3 className="text-3xl font-black tracking-tight">452</h3>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100">
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">New Registrations</p>
                  <h3 className="text-3xl font-black tracking-tight">+86</h3>
                </div>
              </div>

              <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Orders</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Total Spent</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Joined</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i} className="hover:bg-gray-50 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white font-black text-xs">JD</div>
                            <div>
                              <p className="font-black uppercase text-xs tracking-tight">Jane Doe {i}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">jane.doe@example.com</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-xs font-bold">{i + 2} Orders</td>
                        <td className="px-8 py-6 font-black text-xs">{(i * 150000).toLocaleString()} RWF</td>
                        <td className="px-8 py-6 text-[10px] font-bold uppercase text-gray-400">Oct 12, 2025</td>
                        <td className="px-8 py-6">
                          <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-green-100 text-green-700 rounded-full">Active</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-all"><MoreVertical size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
               <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter">Orders</h1>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Manage customer transactions</p>
                </div>
                <div className="flex gap-4">
                  <button className="bg-white border border-gray-100 px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all">Export CSV</button>
                </div>
              </div>

              <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Total</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Payment</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-all group">
                        <td className="px-8 py-6 font-mono text-[10px] font-black text-amber-500">#{order._id.slice(-8).toUpperCase()}</td>
                        <td className="px-8 py-6">
                          <p className="font-black uppercase text-xs tracking-tight">{order.customerName || 'Guest'}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.phone || 'No Phone'}</p>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full \${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 font-black text-xs">{order.total.toLocaleString()} RWF</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase">{order.paymentMethod}</span>
                            {order.paymentStatus === 'completed' ? 
                              <CheckCircle2 size={14} className="text-green-500" /> : 
                              <Clock size={14} className="text-amber-500" />
                            }
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="p-2 hover:bg-gray-100 rounded-xl transition-all"><MoreVertical size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'deliveries' && (
            <div className="space-y-8 animate-in zoom-in duration-500">
               <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter">Deliveries</h1>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Logistics & Tracking</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[3rem] p-4 shadow-sm border border-gray-100 h-[600px] overflow-hidden">
                  <DeliveryMap orders={orders} />
                </div>
                <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100 overflow-y-auto max-h-[600px]">
                  <h2 className="text-xl font-black uppercase tracking-tight mb-8">Active Staff</h2>
                  <div className="space-y-6">
                    {deliveryStaff.map((staff) => (
                      <div key={staff._id} className="p-6 bg-gray-50 rounded-3xl border-2 border-transparent hover:border-amber-500 transition-all">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white font-black">{staff.name.charAt(0)}</div>
                          <div>
                            <p className="font-black uppercase text-xs tracking-tight">{staff.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Available</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="flex-1 bg-black text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 transition-all">Assign Order</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {showProductForm && (
            <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-10">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h2 className="text-3xl font-black uppercase tracking-tighter">{editingId ? 'Edit Product' : 'New Product'}</h2>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Add your luxury item to the collection</p>
                    </div>
                    <button onClick={() => setShowProductForm(false)} className="p-4 hover:bg-gray-100 rounded-2xl transition-all">
                      <X size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Product Name</label>
                        <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Brand</label>
                          <input required type="text" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Category</label>
                          <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold">
                            <option value="shoes">Shoes</option>
                            <option value="clothes">Clothes</option>
                            <option value="accessories">Accessories</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Price (RWF)</label>
                          <input required type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Stock</label>
                          <input required type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Description</label>
                        <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="4" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold resize-none"></textarea>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Images</label>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {formData.images.map((img, i) => (
                            <div key={i} className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative group">
                              <img src={img} alt="" className="w-full h-full object-cover" />
                              <button type="button" onClick={() => setFormData({...formData, images: formData.images.filter((_, idx) => idx !== i)})} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                <Trash2 size={20} />
                              </button>
                            </div>
                          ))}
                          <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-all text-gray-400 hover:text-amber-500">
                            <Plus size={24} />
                            <span className="text-[8px] font-black uppercase mt-2">Upload</span>
                            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                          </label>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Sizes (comma separated)</label>
                          <input type="text" placeholder="38, 39, 40..." value={formData.sizes} onChange={(e) => setFormData({...formData, sizes: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Colors (comma separated)</label>
                          <input type="text" placeholder="Black, White..." value={formData.colors} onChange={(e) => setFormData({...formData, colors: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                        </div>
                      </div>
                      <div className="flex items-center gap-6 pt-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} className="w-5 h-5 rounded-lg border-gray-200 text-amber-500 focus:ring-amber-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Featured</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({...formData, isPublished: e.target.checked})} className="w-5 h-5 rounded-lg border-gray-200 text-amber-500 focus:ring-amber-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Published</span>
                        </label>
                      </div>
                      <div className="pt-6">
                        <button type="submit" disabled={loading} className="w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-2xl disabled:opacity-50">
                          {loading ? 'Processing...' : (editingId ? 'Update Product' : 'Create Product')}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
            <div className="space-y-8 animate-in fade-in duration-500">
              <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter">Settings</h1>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Configure your platform</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-black uppercase tracking-tight mb-8">Store Information</h3>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Store Name</label>
                      <input type="text" defaultValue="MBABAZI CLOSET" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Contact Email</label>
                      <input type="email" defaultValue="contact@mbabazicloset.com" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                    </div>
                    <button className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl">Save Changes</button>
                  </div>
                </div>

                <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-black uppercase tracking-tight mb-8">System Status</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 bg-green-50 rounded-3xl border border-green-100">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-black uppercase tracking-widest text-green-700">API Server Operational</span>
                      </div>
                      <span className="text-[10px] font-bold text-green-600">99.9% Uptime</span>
                    </div>
                    <div className="flex items-center justify-between p-6 bg-blue-50 rounded-3xl border border-blue-100">
                      <div className="flex items-center gap-4">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-xs font-black uppercase tracking-widest text-blue-700">Database Connected</span>
                      </div>
                      <span className="text-[10px] font-bold text-blue-600">Atlas Cluster 0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
