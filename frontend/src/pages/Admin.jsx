import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
  AlertCircle,
  MessageSquare,
  PieChart,
  CreditCard,
  Star,
  Ticket,
  BarChart3,
  Shield,
  Globe,
  Palette,
  Mail,
  FileText,
  Smartphone,
  Send,
  Sparkles,
  Bot
} from 'lucide-react';

const API_URL = process.env.NODE_ENV === 'production' ? '/api' : (process.env.REACT_APP_API_URL || 'http://localhost:5000/api');

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Added categories state
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [staff, setStaff] = useState([]); // Added staff state
  const [deliveryStaff, setDeliveryStaff] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeChatOrder, setActiveChatOrder] = useState(null);
  const [newAdminMessage, setNewAdminMessage] = useState('');
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (activeChatOrder) {
      scrollToBottom();
    }
  }, [messages, activeChatOrder]);

  const fetchAdminMessages = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/messages/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    }
  };

  const handleSendAdminMessage = async () => {
    if (!newAdminMessage.trim() || !activeChatOrder) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/messages`, {
        orderId: activeChatOrder._id,
        content: newAdminMessage,
        type: 'chat',
        receiverId: activeChatOrder.deliveryPerson?._id || activeChatOrder.deliveryPerson
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNewAdminMessage('');
      fetchAdminMessages(activeChatOrder._id);
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    }
  };

  const handleSendMotivation = async (staffId) => {
    const motivations = [
      "Keep up the great work! You're making customers happy! 🚀",
      "Excellent delivery speed today! Keep it up! ✨",
      "You're a vital part of our team. Drive safe! 🏁",
      "Great job handling those deliveries. You're crushing it! 💪",
      "Thank you for your hard work and dedication! 🌟"
    ];
    const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
    const content = window.prompt("Send a motivational message:", randomMotivation);
    
    if (!content) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/messages/motivate`, {
        receiverId: staffId,
        content
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Motivational message sent! 🚀');
    } catch (err) {
      console.error('Error sending motivation:', err);
      alert('Failed to send motivation');
    }
  };
  const [adminStats, setAdminStats] = useState(null); // Added for dashboard charts
  const [selectedOrders, setSelectedOrders] = useState([]); // Added for bulk actions
  const [isDragging, setIsDragging] = useState(false); // Added for drag & drop
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Chatbot State
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello Admin! I am your MBABAZI AI assistant. How can I help you manage your store today?' }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const [formData, setFormData] = useState({
    name: '', 
    brand: '', 
    category: 'shoes', 
    subcategory: '',
    audience: 'unisex',
    price: '', 
    salePrice: '', 
    description: '', 
    shortDescription: '',
    sku: '',
    tags: '',
    images: [],
    sizes: '', 
    colors: '', 
    stock: '', 
    lowStockThreshold: 5,
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    isFeatured: false,
    isNew: true, 
    isPublished: true,
    metaTitle: '',
    metaDescription: '',
    slug: '',
    status: 'published',
    variants: []
  });

  const [staffFormData, setStaffFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff',
    phone: '',
    location: ''
  });
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [promotions, setPromotions] = useState([]);
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [promoFormData, setPromoFormData] = useState({
    title: '',
    description: '',
    code: '',
    type: 'percentage',
    value: '',
    startDate: '',
    endDate: '',
    isActive: true,
    applicableTo: 'all',
    products: []
  });

  const [activeFormTab, setActiveFormTab] = useState('basic'); // 'basic', 'pricing', 'inventory', 'variants', 'shipping', 'seo'

  const handlePromoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      if (editingId) {
        await axios.put(`${API_URL}/promotions/${editingId}`, promoFormData, config);
      } else {
        await axios.post(`${API_URL}/promotions`, promoFormData, config);
      }
      
      setShowPromoForm(false);
      setEditingId(null);
      setPromoFormData({
        title: '',
        description: '',
        code: '',
        type: 'percentage',
        value: '',
        startDate: '',
        endDate: '',
        isActive: true,
        applicableTo: 'all',
        products: []
      });
      fetchPromotions();
      alert('Promotion saved successfully!');
    } catch (err) {
      console.error('Promo submit error:', err);
      alert(err.response?.data?.message || 'Failed to save promotion');
    } finally {
      setLoading(false);
    }
  };

  const fetchPromotions = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${API_URL}/promotions`, config);
      setPromotions(res.data || []);
    } catch (err) {
      console.error('Fetch promotions error:', err);
    }
  };

  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.post(`${API_URL}/user/staff`, staffFormData, config);
      
      setShowStaffForm(false);
      setStaffFormData({
        name: '',
        email: '',
        password: '',
        role: 'staff',
        phone: '',
        location: ''
      });
      fetchData();
      alert('Staff member created successfully!');
    } catch (err) {
      console.error('Staff submit error:', err);
      if (err.response?.data?.errors) {
        alert(`Validation Error: ${err.response.data.errors.join(', ')}`);
      } else {
        alert(err.response?.data?.message || 'Failed to create staff member');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    const newMessage = { role: 'user', content: userMessage };
    setChatMessages(prev => [...prev, newMessage]);
    setUserMessage('');
    setIsTyping(true);

    try {
      // Create context about the store for the AI
      const storeContext = {
        adminName: 'Mbabazi Admin',
        storeName: 'Mbabazi Closet',
        stats: {
          totalProducts: products.length,
          totalOrders: orders.length,
          totalCustomers: 1284,
          revenue: '1,240,000 RWF',
          lowStock: products.filter(p => p.stock < 10).length
        },
        activeTab: activeTab,
        recentOrders: orders.slice(0, 3).map(o => ({ id: o._id.slice(-8), customer: o.customerName, total: o.total, status: o.status }))
      };

      const response = await axios.post(`${API_URL}/chatbot`, {
        messages: [...chatMessages, newMessage],
        context: storeContext
      });

      setChatMessages(prev => [...prev, { role: 'assistant', content: response.data.content }]);
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'I apologize, but I am having trouble connecting to the store database right now. How else can I assist you with the dashboard?' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    await processFiles(files);
  };

  const processFiles = async (files) => {
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`File ${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formDataUpload = new FormData();
      validFiles.forEach(file => {
        formDataUpload.append('images', file);
      });

      const response = await axios.post(`${API_URL}/products/upload`, formDataUpload, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...response.data.urls]
      }));
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload images');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = async (urlToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(url => url !== urlToRemove)
    }));

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/products/delete-image`, { url: urlToRemove }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Delete image error:', err);
      // We don't alert here to not disturb the user experience, 
      // as the image is already removed from the form state
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name || '',
      brand: product.brand || '',
      category: product.category || 'shoes',
      subcategory: product.subcategory || '',
      audience: product.audience || 'unisex',
      price: product.price || '',
      salePrice: product.salePrice || '',
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      sku: product.sku || '',
      tags: product.tags ? product.tags.join(', ') : '',
      images: product.images || [],
      sizes: product.sizes ? product.sizes.join(', ') : '',
      colors: product.colors ? product.colors.join(', ') : '',
      stock: product.stock || '',
      lowStockThreshold: product.lowStockThreshold || 5,
      weight: product.weight || '',
      dimensions: product.dimensions || { length: '', width: '', height: '' },
      isFeatured: product.isFeatured || false,
      isNew: product.isNew !== undefined ? product.isNew : true,
      isPublished: product.isPublished !== undefined ? product.isPublished : true,
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || '',
      slug: product.slug || '',
      status: product.status || 'published',
      variants: product.variants || []
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
      
      // Check if we are saving a category or a product
      if (activeTab === 'categories') {
        const catData = {
          name: formData.name,
          description: formData.description,
          image: formData.image,
          subcategories: formData.subcategories
        };

        if (editingId) {
          await axios.put(`${API_URL}/categories/${editingId}`, catData, config);
        } else {
          await axios.post(`${API_URL}/categories`, catData, config);
        }
      } else {
        const data = {
          ...formData,
          price: Number(formData.price),
          salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
          stock: Number(formData.stock),
          lowStockThreshold: Number(formData.lowStockThreshold),
          weight: formData.weight ? Number(formData.weight) : undefined,
          dimensions: {
            length: formData.dimensions.length ? Number(formData.dimensions.length) : undefined,
            width: formData.dimensions.width ? Number(formData.dimensions.width) : undefined,
            height: formData.dimensions.height ? Number(formData.dimensions.height) : undefined
          },
          sizes: typeof formData.sizes === 'string' ? formData.sizes.split(',').map(s => s.trim()).filter(s => s) : formData.sizes,
          colors: typeof formData.colors === 'string' ? formData.colors.split(',').map(c => c.trim()).filter(c => c) : formData.colors,
          tags: typeof formData.tags === 'string' ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : formData.tags
        };

        if (editingId) {
          await axios.put(`${API_URL}/products/${editingId}`, data, config);
        } else {
          await axios.post(`${API_URL}/products`, data, config);
        }
      }
      
      setShowProductForm(false);
      setEditingId(null);
      setFormData({
        name: '', 
        brand: '', 
        category: 'shoes', 
        subcategory: '',
        audience: 'unisex',
        price: '', 
        salePrice: '', 
        description: '', 
        shortDescription: '',
        sku: '',
        tags: '',
        images: [],
        sizes: '', 
        colors: '', 
        stock: '', 
        lowStockThreshold: 5,
        weight: '',
        dimensions: { length: '', width: '', height: '' },
        isFeatured: false,
        isNew: true, 
        isPublished: true,
        metaTitle: '',
        metaDescription: '',
        slug: '',
        status: 'published',
        variants: []
      });
      fetchData();
      alert(editingId ? 'Updated successfully!' : 'Created successfully!');
    } catch (err) {
      console.error('Submit error:', err);
      if (err.response?.data?.errors) {
        alert(`Validation Error: ${err.response.data.errors.join(', ')}`);
      } else {
        alert(err.response?.data?.message || 'Failed to save');
      }
    } finally {
      setLoading(false);
    }
  };

  // Stats for Dashboard
  const stats = [
    { 
      label: 'Total Revenue', 
      value: `${(adminStats?.totalRevenue || 0).toLocaleString()} RWF`, 
      icon: DollarSign, 
      trend: '+12.5%', 
      color: 'bg-black', 
      sparkline: [40, 35, 50, 45, 60, 55, 70] 
    },
    { 
      label: 'Total Orders', 
      value: orders.length, 
      icon: ShoppingBag, 
      trend: '+8.2%', 
      color: 'bg-amber-500', 
      sparkline: [20, 25, 22, 30, 28, 35, 32] 
    },
    { 
      label: 'Delivered', 
      value: orders.filter(o => o.status === 'delivered').length, 
      icon: CheckCircle2, 
      trend: '+15%', 
      color: 'bg-zinc-800', 
      sparkline: [10, 15, 12, 18, 16, 22, 20] 
    },
    { 
      label: 'Total Products', 
      value: products.length, 
      icon: Package, 
      trend: '+2.1%', 
      color: 'bg-zinc-900', 
      sparkline: [5, 8, 7, 10, 9, 12, 11] 
    },
    { 
      label: 'Pending Orders', 
      value: orders.filter(o => o.status === 'pending').length, 
      icon: Clock, 
      trend: '-3.1%', 
      color: 'bg-amber-600', 
      sparkline: [15, 12, 14, 10, 12, 8, 10] 
    },
    { 
      label: 'Low Stock Items', 
      value: products.filter(p => p.stock < 10).length, 
      icon: AlertCircle, 
      trend: '+12%', 
      color: 'bg-red-500', 
      sparkline: [8, 10, 12, 15, 14, 18, 16] 
    },
  ];

  // Products Table Filter Logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeSubTab === 'inventory') return matchesSearch && p.stock < 10;
    return matchesSearch;
  });

  // Customers Table Data Calculation
  const customersWithStats = customers.map(customer => {
    const customerOrders = orders.filter(o => o.userId === customer._id || o.email === customer.email);
    const totalSpent = customerOrders.reduce((acc, curr) => acc + (curr.total || 0), 0);
    return {
      ...customer,
      ordersCount: customerOrders.length,
      totalSpent
    };
  });

  const filteredCustomers = customersWithStats.filter(c => {
    const matchesSearch = c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Orders Table Filter Logic
  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         o._id.includes(searchTerm);
    
    if (activeSubTab === 'pending') return matchesSearch && o.status === 'pending';
    if (activeSubTab === 'shipped') return matchesSearch && o.status === 'shipped';
    if (activeSubTab === 'completed') return matchesSearch && o.status === 'delivered';
    if (activeSubTab === 'cancelled') return matchesSearch && o.status === 'cancelled';
    return matchesSearch;
  });

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [prodRes, orderRes, staffRes, customerRes, allStaffRes, catRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/products?limit=all&adminView=true`),
        axios.get(`${API_URL}/orders`, config),
        axios.get(`${API_URL}/user?role=delivery`, config),
        axios.get(`${API_URL}/user?role=customer`, config),
        axios.get(`${API_URL}/user?role=admin`, config), // Fetch admin/staff
        axios.get(`${API_URL}/categories`, config), // Fetch categories
        axios.get(`${API_URL}/orders/stats/summary`, config) // Fetch dashboard stats
      ]);

      setProducts(prodRes.data || []);
      setOrders(orderRes.data || []);
      setDeliveryStaff(staffRes.data || []);
      setCustomers(customerRes.data || []);
      setStaff(allStaffRes.data || []);
      setCategories(catRes.data || []);
      setAdminStats(statsRes.data || null);
      fetchPromotions();
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!token || !user || user.role !== 'admin') {
        window.location.href = '/login';
        return;
      }
      fetchData();
    };
    checkAdmin();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/orders/${orderId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error('Update order error:', err);
      alert('Failed to update order status');
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/orders/${orderId}`, { paymentStatus: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error('Update payment error:', err);
      alert('Failed to update payment status');
    }
  };

  const handleAssignDelivery = async (orderId, deliveryPersonId) => {
    try {
      const token = localStorage.getItem('token');
      const order = orders.find(o => o._id === orderId);
      
      await axios.put(`${API_URL}/orders/${orderId}`, { 
        deliveryPerson: deliveryPersonId,
        assignedAt: new Date(),
        // Ensure status updates to shipped when assigned if it was pending
        status: order.status === 'pending' ? 'shipped' : order.status
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      alert('Order assigned and status updated to shipped');
    } catch (err) {
      console.error('Assign delivery error:', err);
      alert('Failed to assign delivery staff');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error('Delete order error:', err);
      alert('Failed to delete order');
    }
  };

  const handleBulkUpdateStatus = async (newStatus) => {
    if (selectedOrders.length === 0) return;
    if (!window.confirm(`Update ${selectedOrders.length} orders to ${newStatus}?`)) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await Promise.all(selectedOrders.map(id => 
        axios.put(`${API_URL}/orders/${id}`, { status: newStatus }, config)
      ));
      
      setSelectedOrders([]);
      fetchData();
      alert('Orders updated successfully');
    } catch (err) {
      console.error('Bulk update error:', err);
      alert('Failed to update some orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/user/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      console.error('Delete customer error:', err);
      alert('Failed to delete customer');
    }
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
    // In a real app, you would save this to the backend
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // --- UI Components ---

  const SidebarItem = ({ id, label, icon: Icon, subItems = [] }) => {
    const isActive = activeTab === id;
    const hasSubItems = subItems.length > 0;

    return (
      <div className="w-full">
        <button
          onClick={() => {
            setActiveTab(id);
            if (hasSubItems) setActiveSubTab(subItems[0].id);
          }}
          className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 ${
            isActive 
              ? 'bg-amber-500 text-black font-black' 
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
          }`}
        >
          <Icon size={20} />
          {isSidebarOpen && <span className="uppercase tracking-widest text-xs font-bold">{label}</span>}
          {isActive && isSidebarOpen && !hasSubItems && <ChevronRight size={16} className="ml-auto" />}
        </button>
        
        {isActive && hasSubItems && isSidebarOpen && (
          <div className="bg-zinc-900/50 py-2">
            {subItems.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveSubTab(sub.id)}
                className={`w-full flex items-center gap-3 pl-14 pr-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeSubTab === sub.id ? 'text-amber-500' : 'text-gray-500 hover:text-white'
                }`}
              >
                <div className={`w-1 h-1 rounded-full ${activeSubTab === sub.id ? 'bg-amber-500' : 'bg-transparent'}`}></div>
                {sub.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-black'}`}>
      {/* Sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-black transition-all duration-500 z-50 ${
          isSidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-black text-black">M</div>
          {isSidebarOpen && <span className="text-white font-black tracking-tighter uppercase">Mbabazi Closet</span>}
        </div>

        <nav className="mt-10 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
          <SidebarItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
          <SidebarItem 
            id="products" 
            label="Products" 
            icon={Package} 
            subItems={[
              { id: 'all', label: 'All Products' },
              { id: 'add', label: 'Add Product' },
              { id: 'inventory', label: 'Inventory' }
            ]}
          />
          <SidebarItem 
            id="categories" 
            label="Categories" 
            icon={MoreVertical} 
          />
          <SidebarItem 
            id="orders" 
            label="Orders" 
            icon={ShoppingBag} 
            subItems={[
              { id: 'all', label: 'All Orders' },
              { id: 'pending', label: 'Pending' },
              { id: 'completed', label: 'Completed' },
              { id: 'tracking', label: 'Tracking' },
              { id: 'cancelled', label: 'Cancelled' }
            ]}
          />
          <SidebarItem id="customers" label="Customers" icon={Users} />
          <SidebarItem id="payments" label="Payments" icon={CreditCard} />
          <SidebarItem id="reviews" label="Reviews" icon={Star} />
          <SidebarItem id="promotions" label="Promotions" icon={Ticket} />
          <SidebarItem id="reports" label="Reports" icon={BarChart3} />
          <SidebarItem id="staff" label="Staff" icon={Shield} />
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
        className={`flex-1 transition-all duration-500 ${
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
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-black uppercase tracking-tighter">Dashboard Overview</h1>
                    {orders.some(o => new Date(o.createdAt).toDateString() === new Date().toDateString()) && (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-[8px] font-black uppercase tracking-widest animate-pulse">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                        Live Activity
                      </span>
                    )}
                  </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:border-amber-500 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg`}>
                        <stat.icon size={18} />
                      </div>
                      <span className={`text-[10px] font-black ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.trend}
                      </span>
                    </div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                    <h3 className="text-xl font-black tracking-tight mb-4">{stat.value}</h3>
                    
                    {/* Simplified Sparkline */}
                    <div className="flex items-end gap-1 h-8">
                      {stat.sparkline.map((val, idx) => (
                        <div 
                          key={idx} 
                          className={`flex-1 rounded-full ${stat.color.replace('bg-', 'bg-opacity-20 bg-')}`}
                          style={{ height: `${val}%` }}
                        ></div>
                      ))}
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
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
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

          {activeTab === 'categories' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter">Categories</h1>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Organize your products</p>
                </div>
                <button 
                  onClick={() => {
                    // Reset category form
                    setEditingId(null);
                    setFormData({
                      name: '',
                      description: '',
                      image: '',
                      subcategories: []
                    });
                    // For simplicity, we reuse showProductForm but for category
                    setShowProductForm(true); 
                  }}
                  className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl"
                >
                  + Create New Category
                </button>
              </div>
              
              <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                {activeSubTab === 'tracking' ? (
                  <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h2 className="text-xl font-black uppercase tracking-tight">Delivery Tracking Map</h2>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Real-time order locations & delivery status</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-[10px] font-black uppercase tracking-widest">Delivered</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <span className="text-[10px] font-black uppercase tracking-widest">Pending</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-[600px] rounded-[2rem] overflow-hidden border border-gray-100 shadow-inner">
                      <DeliveryMap 
                        orders={orders} 
                        onMarkerClick={(order) => {
                          setSearchTerm(order._id);
                          setActiveSubTab('all');
                        }} 
                      />
                    </div>
                  </div>
                ) : (
                  <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Category Name</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Subcategories</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {categories.map((cat) => (
                      <tr key={cat._id} className="hover:bg-gray-50 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                              {cat.image ? (
                                <img src={cat.image} alt="" className="w-full h-full object-cover rounded-2xl" />
                              ) : (
                                <MoreVertical className="text-gray-300" size={20} />
                              )}
                            </div>
                            <div>
                              <p className="font-black uppercase text-xs tracking-tight">{cat.name}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate max-w-xs">{cat.description || 'No description'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-wrap gap-2">
                            {cat.subcategories && cat.subcategories.length > 0 ? (
                              cat.subcategories.map((sub, idx) => (
                                <span key={idx} className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-zinc-100 rounded-full">
                                  {sub.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-[8px] text-gray-400 font-bold uppercase">None</span>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              className="p-2 hover:bg-amber-100 text-amber-600 rounded-lg transition-all"
                              onClick={() => {
                                setEditingId(cat._id);
                                setFormData({
                                  name: cat.name,
                                  description: cat.description || '',
                                  image: cat.image || '',
                                  subcategories: cat.subcategories || []
                                });
                                setShowProductForm(true);
                              }}
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                              onClick={async () => {
                                if (!window.confirm('Delete this category?')) return;
                                try {
                                  const token = localStorage.getItem('token');
                                  await axios.delete(`${API_URL}/categories/${cat._id}`, {
                                    headers: { Authorization: `Bearer ${token}` }
                                  });
                                  fetchData();
                                } catch (err) {
                                  alert('Failed to delete category');
                                }
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  </table>
                )}
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
                    {filteredProducts.map((product) => (
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
                            <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-xs font-bold">{product.stock} Units</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
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
                  <h3 className="text-3xl font-black tracking-tight">{customers.length}</h3>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100">
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">Active This Month</p>
                  <h3 className="text-3xl font-black tracking-tight">{Math.floor(customers.length * 0.35)}</h3>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100">
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-2">New Registrations</p>
                  <h3 className="text-3xl font-black tracking-tight">+{Math.floor(customers.length * 0.05)}</h3>
                </div>
              </div>

              {activeSubTab === 'tracking' ? (
                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden p-8 animate-in zoom-in-95 duration-500">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-xl font-black uppercase tracking-tight">Delivery Tracking Map</h2>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Real-time order locations & delivery status</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Delivered</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Pending</span>
                      </div>
                    </div>
                  </div>
                  <DeliveryMap 
                    orders={orders} 
                    onMarkerClick={(order) => {
                      setSearchTerm(order._id);
                      setActiveSubTab('all');
                    }} 
                  />
                </div>
              ) : (
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
                    {filteredCustomers.length > 0 ? filteredCustomers.map((customer) => (
                      <tr key={customer._id} className="hover:bg-gray-50 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white font-black text-xs">
                              {customer.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'C'}
                            </div>
                            <div>
                              <p className="font-black uppercase text-xs tracking-tight">{customer.name || 'Anonymous'}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{customer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-xs font-bold">{customer.ordersCount} Orders</td>
                        <td className="px-8 py-6 font-black text-xs">{customer.totalSpent.toLocaleString()} RWF</td>
                        <td className="px-8 py-6 text-[10px] font-bold uppercase text-gray-400">
                          {new Date(customer.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-[8px] font-black uppercase tracking-widest px-2 py-1 bg-green-100 text-green-700 rounded-full">Active</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button 
                            onClick={() => handleDeleteCustomer(customer._id)}
                            className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            title="Delete Customer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" className="px-8 py-20 text-center">
                          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No customers found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
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
                  {selectedOrders.length > 0 && (
                    <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 animate-in fade-in zoom-in duration-300">
                      <span className="text-[10px] font-black uppercase tracking-widest text-amber-700">{selectedOrders.length} Selected</span>
                      <select 
                        onChange={(e) => handleBulkUpdateStatus(e.target.value)}
                        className="bg-white border border-amber-200 text-[10px] font-black uppercase px-2 py-1 rounded-lg focus:outline-none"
                        value=""
                      >
                        <option value="" disabled>Bulk Actions</option>
                        <option value="pending">Mark Pending</option>
                        <option value="shipped">Mark Shipped</option>
                        <option value="delivered">Mark Delivered</option>
                        <option value="cancelled">Mark Cancelled</option>
                      </select>
                    </div>
                  )}
                  <button className="bg-white border border-gray-100 px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all">Export CSV</button>
                </div>
              </div>

              <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-6">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                          checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedOrders(filteredOrders.map(o => o._id));
                            } else {
                              setSelectedOrders([]);
                            }
                          }}
                        />
                      </th>
                      <th className="px-4 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer & Address</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Delivery Staff</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Total</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Payment</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className={`hover:bg-gray-50 transition-all group ${selectedOrders.includes(order._id) ? 'bg-amber-50/30' : ''}`}>
                        <td className="px-8 py-6">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                            checked={selectedOrders.includes(order._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedOrders([...selectedOrders, order._id]);
                              } else {
                                setSelectedOrders(selectedOrders.filter(id => id !== order._id));
                              }
                            }}
                          />
                        </td>
                        <td className="px-4 py-6 font-mono text-[10px] font-black text-amber-500">#{order._id.slice(-8).toUpperCase()}</td>
                        <td className="px-8 py-6">
                          <p className="font-black uppercase text-xs tracking-tight">{order.customerName || 'Guest'}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{order.phone || 'No Phone'}</p>
                          <div className="mt-1 flex items-start gap-1">
                            <Truck size={10} className="text-gray-400 mt-0.5 shrink-0" />
                            <p className="text-[10px] text-gray-500 font-medium leading-tight max-w-[150px]">{order.deliveryAddress || 'No Address'}</p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col gap-2">
                            <select 
                              value={order.deliveryPerson || ''} 
                              onChange={(e) => handleAssignDelivery(order._id, e.target.value)}
                              className="text-[10px] font-black uppercase tracking-widest bg-gray-50 border border-gray-100 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-black w-full"
                            >
                              <option value="">Unassigned</option>
                              {deliveryStaff.map(staff => (
                                <option key={staff._id} value={staff._id}>{staff.name}</option>
                              ))}
                            </select>
                            {order.deliveryPerson && (
                              <button 
                                onClick={() => setActiveSubTab('tracking')}
                                className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-amber-500 hover:text-black transition-colors"
                              >
                                <Globe size={10} />
                                Track on Map
                              </button>
                            )}
                          </div>
                          {order.assignedAt && (
                            <p className="text-[8px] text-gray-400 font-bold uppercase mt-1">
                              Assigned: {new Date(order.assignedAt).toLocaleDateString()}
                            </p>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
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
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {order.status !== 'delivered' && (
                              <button 
                                onClick={() => handleUpdateOrderStatus(order._id, 'delivered')}
                                className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-all"
                                title="Mark as Delivered"
                              >
                                <CheckCircle2 size={16} />
                              </button>
                            )}
                            {order.paymentStatus !== 'completed' && (
                              <button 
                                onClick={() => handleUpdatePaymentStatus(order._id, 'completed')}
                                className="p-2 hover:bg-blue-100 text-blue-600 rounded-lg transition-all"
                                title="Mark Payment as Success"
                              >
                                <DollarSign size={16} />
                              </button>
                            )}
                            <button 
                              onClick={() => handleDeleteOrder(order._id)}
                              className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-all"
                              title="Delete Order"
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

          {activeTab === 'payments' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter">Payments</h1>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Revenue & Transaction History</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { 
                    label: 'Total Revenue', 
                    value: `${orders.reduce((acc, curr) => acc + (curr.total || 0), 0).toLocaleString()} RWF`, 
                    icon: DollarSign, 
                    color: 'bg-black' 
                  },
                  { 
                    label: 'Successful', 
                    value: orders.filter(o => o.paymentStatus === 'completed').length, 
                    icon: CheckCircle2, 
                    color: 'bg-green-500' 
                  },
                  { 
                    label: 'Pending', 
                    value: orders.filter(o => o.paymentStatus !== 'completed').length, 
                    icon: Clock, 
                    color: 'bg-amber-500' 
                  },
                  { 
                    label: 'Avg. Order', 
                    value: orders.length > 0 ? `${Math.floor(orders.reduce((acc, curr) => acc + (curr.total || 0), 0) / orders.length).toLocaleString()} RWF` : '0 RWF', 
                    icon: TrendingUp, 
                    color: 'bg-blue-500' 
                  }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                    <div className={`${stat.color} w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                      <stat.icon size={20} />
                    </div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-black">{stat.value}</h3>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Transaction ID</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Method</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Amount</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.length > 0 ? orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-all group">
                        <td className="px-8 py-6 font-mono text-[10px] font-black text-amber-500 uppercase">
                          #{order._id.slice(-10).toUpperCase()}
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-xs font-black uppercase tracking-tight">{order.customerName || 'Guest'}</p>
                        </td>
                        <td className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-500">
                          {order.paymentMethod || 'MOMO'}
                        </td>
                        <td className="px-8 py-6 font-black text-xs">{(order.total || 0).toLocaleString()} RWF</td>
                        <td className="px-8 py-6">
                          <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
                            order.paymentStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {order.paymentStatus === 'completed' ? 'Success' : 'Pending'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right text-[10px] font-bold text-gray-400 uppercase">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="6" className="px-8 py-20 text-center">
                          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No transactions recorded</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter">Reviews</h1>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Customer Feedback & Ratings</p>
                </div>
              </div>

              <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Product</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Customer</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Rating</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Comment</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.some(p => p.reviews?.length > 0) ? products.flatMap(p => 
                      (p.reviews || []).map((rev, i) => (
                        <tr key={`${p._id}-${i}`} className="hover:bg-gray-50 transition-all group">
                          <td className="px-8 py-6">
                            <p className="text-xs font-black uppercase tracking-tight">{p.name}</p>
                          </td>
                          <td className="px-8 py-6 text-xs font-bold">{rev.user?.name || 'Customer'}</td>
                          <td className="px-8 py-6">
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star 
                                  key={star} 
                                  size={12} 
                                  className={star <= rev.rating ? "fill-amber-500 text-amber-500" : "text-gray-200"} 
                                />
                              ))}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-[10px] text-gray-500 max-w-xs line-clamp-2">{rev.comment}</td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button className="bg-black text-white px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-amber-500 transition-all">Approve</button>
                              <button className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-red-100 transition-all">Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-8 py-20 text-center">
                          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No customer reviews yet</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'promotions' && (
            <div className="space-y-8 animate-in zoom-in duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter">Promotions</h1>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Coupons & Discounts</p>
                </div>
                <button 
                  onClick={() => {
                    setEditingId(null);
                    setPromoFormData({
                      title: '',
                      description: '',
                      code: '',
                      type: 'percentage',
                      value: '',
                      startDate: '',
                      endDate: '',
                      isActive: true,
                      applicableTo: 'all',
                      products: []
                    });
                    setShowPromoForm(true);
                  }}
                  className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl"
                >
                  + Create Coupon
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {promotions.length > 0 ? (
                  promotions.map((promo) => (
                    <div key={promo._id} className="bg-white p-10 rounded-[3rem] border border-gray-100 relative overflow-hidden group shadow-sm hover:shadow-md transition-all">
                      <div className={`absolute top-0 right-0 w-32 h-32 ${promo.isActive ? 'bg-amber-500/10' : 'bg-gray-500/10'} rounded-full -mr-16 -mt-16 transition-all group-hover:scale-150`}></div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                          <div className={`${promo.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'} px-4 py-1 rounded-full text-[10px] font-black tracking-widest uppercase`}>
                            {promo.isActive ? 'Active' : 'Inactive'}
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setEditingId(promo._id);
                                setPromoFormData({
                                  title: promo.title,
                                  description: promo.description,
                                  code: promo.code,
                                  type: promo.type,
                                  value: promo.value,
                                  startDate: promo.startDate.split('T')[0],
                                  endDate: promo.endDate.split('T')[0],
                                  isActive: promo.isActive,
                                  applicableTo: promo.applicableTo,
                                  products: promo.products
                                });
                                setShowPromoForm(true);
                              }}
                              className="text-gray-400 hover:text-black transition-colors"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={async () => {
                                if (window.confirm('Delete this promotion?')) {
                                  try {
                                    const token = localStorage.getItem('token');
                                    await axios.delete(`${API_URL}/promotions/${promo._id}`, {
                                      headers: { Authorization: `Bearer ${token}` }
                                    });
                                    fetchPromotions();
                                  } catch (err) {
                                    console.error('Delete promo error:', err);
                                  }
                                }
                              }}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        <h3 className="text-xl font-black tracking-tighter mb-2 uppercase">{promo.title}</h3>
                        <p className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-4">
                          Code: <span className="text-black">{promo.code || 'N/A'}</span>
                        </p>
                        <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                          <div>
                            <p className="text-gray-300 text-[8px] font-black uppercase tracking-widest mb-1">Value</p>
                            <p className="text-xs font-black">
                              {promo.type === 'percentage' ? `${promo.value}% OFF` : `${promo.value.toLocaleString()} RWF OFF`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-300 text-[8px] font-black uppercase tracking-widest mb-1">Expires</p>
                            <p className="text-xs font-black text-gray-500">{new Date(promo.endDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 bg-white p-20 rounded-[3rem] border border-gray-100 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No active promotions found</p>
                  </div>
                )}
              </div>

              {/* Promo Creation Modal */}
              {showPromoForm && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                    <div className="p-10">
                      <div className="flex justify-between items-center mb-8">
                        <div>
                          <h2 className="text-3xl font-black uppercase tracking-tighter">{editingId ? 'Edit Promotion' : 'New Promotion'}</h2>
                          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Configure your discount campaign</p>
                        </div>
                        <button onClick={() => setShowPromoForm(false)} className="p-4 hover:bg-gray-100 rounded-2xl transition-all">
                          <X size={24} />
                        </button>
                      </div>

                      <form onSubmit={handlePromoSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Promotion Title</label>
                            <input required type="text" value={promoFormData.title} onChange={(e) => setPromoFormData({...promoFormData, title: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Coupon Code</label>
                            <input type="text" value={promoFormData.code} onChange={(e) => setPromoFormData({...promoFormData, code: e.target.value.toUpperCase()})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Discount Type</label>
                            <select value={promoFormData.type} onChange={(e) => setPromoFormData({...promoFormData, type: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold">
                              <option value="percentage">Percentage (%)</option>
                              <option value="fixed_amount">Fixed Amount (RWF)</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Value</label>
                            <input required type="number" value={promoFormData.value} onChange={(e) => setPromoFormData({...promoFormData, value: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Applicable To</label>
                            <select value={promoFormData.applicableTo} onChange={(e) => setPromoFormData({...promoFormData, applicableTo: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold">
                              <option value="all">All Products</option>
                              <option value="categories">Specific Categories</option>
                              <option value="products">Specific Products</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Start Date</label>
                            <input required type="date" value={promoFormData.startDate} onChange={(e) => setPromoFormData({...promoFormData, startDate: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">End Date</label>
                            <input required type="date" value={promoFormData.endDate} onChange={(e) => setPromoFormData({...promoFormData, endDate: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                          </div>
                          <div className="col-span-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Description</label>
                            <textarea required value={promoFormData.description} onChange={(e) => setPromoFormData({...promoFormData, description: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold h-24" />
                          </div>
                          <div className="flex items-center gap-3">
                            <input type="checkbox" checked={promoFormData.isActive} onChange={(e) => setPromoFormData({...promoFormData, isActive: e.target.checked})} className="w-5 h-5 rounded-lg border-gray-200 text-amber-500 focus:ring-amber-500" />
                            <label className="text-[10px] font-black uppercase tracking-widest">Active Promotion</label>
                          </div>
                        </div>

                        <div className="pt-4">
                          <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-black text-white py-6 rounded-3xl font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl disabled:opacity-50"
                          >
                            {loading ? 'Saving...' : (editingId ? 'Update Promotion' : 'Create Promotion')}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter">Reports</h1>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Analytics & Performance</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-black uppercase tracking-tight mb-8">Revenue Growth (Last 7 Days)</h3>
                  <div className="h-64 bg-gray-50 rounded-[2rem] flex items-end justify-between p-8 gap-2">
                    {adminStats?.dailyRevenue ? (
                      adminStats.dailyRevenue.map((day, i) => {
                        const maxRevenue = Math.max(...adminStats.dailyRevenue.map(d => d.revenue), 1000);
                        const height = (day.revenue / maxRevenue) * 100;
                        const date = new Date(day._id);

                        return (
                          <div key={day._id} className="flex-1 flex flex-col items-center gap-2 group">
                            <div 
                              className="w-full bg-black rounded-t-xl transition-all group-hover:bg-amber-500 cursor-pointer relative" 
                              style={{ height: `${Math.max(height, 5)}%` }}
                            >
                              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] font-black py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {day.revenue.toLocaleString()} RWF
                              </div>
                            </div>
                            <span className="text-[8px] font-black uppercase text-gray-400">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">No revenue data available</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
                  <h3 className="text-xl font-black uppercase tracking-tight mb-8">Revenue by Category</h3>
                  <div className="space-y-6">
                    {adminStats?.salesByCategory?.length > 0 ? (
                      adminStats.salesByCategory.map(cat => {
                        const totalRevenue = adminStats.salesByCategory.reduce((acc, curr) => acc + curr.revenue, 0);
                        const percentage = totalRevenue > 0 ? (cat.revenue / totalRevenue) * 100 : 0;
                        return (
                          <div key={cat._id} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black uppercase tracking-widest">{cat._id}</span>
                              <div className="text-right">
                                <span className="text-[10px] font-black block">{cat.revenue.toLocaleString()} RWF</span>
                                <span className="text-[8px] text-gray-400 font-bold">{Math.round(percentage)}% of total</span>
                              </div>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-black rounded-full transition-all duration-1000" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="pt-6 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">No sales data found</p>
                      </div>
                    )}
                    <div className="pt-6 text-center border-t border-gray-50 mt-6">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Products Managed</p>
                      <p className="text-4xl font-black">{products.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-end">
                <div>
                  <h1 className="text-4xl font-black uppercase tracking-tighter">Staff</h1>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Team Management & Roles</p>
                </div>
                <button 
                  onClick={() => {
                    setStaffFormData({
                      name: '',
                      email: '',
                      password: '',
                      role: 'staff',
                      phone: '',
                      location: ''
                    });
                    setShowStaffForm(true);
                  }}
                  className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl"
                >
                  + Add Member
                </button>
              </div>

              <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Member</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Role</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {staff.length > 0 ? staff.map((member) => (
                      <tr key={member._id} className="hover:bg-gray-50 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-black text-xs">
                              {member.name?.charAt(0) || 'S'}
                            </div>
                            <div>
                              <p className="font-black uppercase text-xs tracking-tight">{member.name || 'Staff Member'}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-gray-100 rounded-full">{member.role || 'Admin'}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                            <span className="text-xs font-bold">Active</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            {member.role === 'delivery' && (
                              <button 
                                onClick={() => handleSendMotivation(member._id)}
                                className="p-2 hover:bg-green-100 text-green-600 rounded-lg transition-all"
                                title="Send Motivation"
                              >
                                <Heart size={16} />
                              </button>
                            )}
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-all"><Edit2 size={16} /></button>
                            <button 
                              onClick={async () => {
                                if (!window.confirm(`Are you sure you want to delete ${member.name}?`)) return;
                                try {
                                  const token = localStorage.getItem('token');
                                  await axios.delete(`${API_URL}/user/${member._id}`, {
                                    headers: { Authorization: `Bearer ${token}` }
                                  });
                                  fetchData();
                                  alert('Staff member deleted successfully');
                                } catch (err) {
                                  alert(err.response?.data?.message || 'Failed to delete staff member');
                                }
                              }}
                              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-all"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="px-8 py-20 text-center">
                          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No staff members found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter">Settings</h1>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">Configure your platform</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
                  <h3 className="text-xl font-black uppercase tracking-tight mb-8">Store Information</h3>
                  <form onSubmit={handleUpdateSettings} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Store Name</label>
                      <input type="text" defaultValue="MBABAZI CLOSET" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Contact Email</label>
                      <input type="email" defaultValue="contact@mbabazicloset.com" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                    </div>
                    <button type="submit" className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl">Save Changes</button>
                  </form>
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

          {showStaffForm && (
            <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
                <div className="p-10">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h2 className="text-3xl font-black uppercase tracking-tighter">Add Staff Member</h2>
                      <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Register a new team member</p>
                    </div>
                    <button onClick={() => setShowStaffForm(false)} className="p-4 hover:bg-gray-100 rounded-2xl transition-all">
                      <X size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleStaffSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Full Name</label>
                        <input 
                          required 
                          type="text" 
                          value={staffFormData.name} 
                          onChange={(e) => setStaffFormData({...staffFormData, name: e.target.value})} 
                          className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Email Address</label>
                        <input 
                          required 
                          type="email" 
                          value={staffFormData.email} 
                          onChange={(e) => setStaffFormData({...staffFormData, email: e.target.value})} 
                          className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Password</label>
                        <input 
                          required 
                          type="password" 
                          value={staffFormData.password} 
                          onChange={(e) => setStaffFormData({...staffFormData, password: e.target.value})} 
                          className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" 
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Role</label>
                        <select 
                          value={staffFormData.role} 
                          onChange={(e) => setStaffFormData({...staffFormData, role: e.target.value})} 
                          className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold"
                        >
                          <option value="admin">Admin</option>
                          <option value="staff">Staff</option>
                          <option value="delivery">Delivery</option>
                          <option value="support">Support</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Phone Number</label>
                        <input 
                          type="text" 
                          value={staffFormData.phone} 
                          onChange={(e) => setStaffFormData({...staffFormData, phone: e.target.value})} 
                          className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" 
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Location</label>
                        <input 
                          type="text" 
                          value={staffFormData.location} 
                          onChange={(e) => setStaffFormData({...staffFormData, location: e.target.value})} 
                          className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" 
                        />
                      </div>
                    </div>

                    <div className="pt-6 flex gap-4">
                      <button 
                        type="button" 
                        onClick={() => setShowStaffForm(false)}
                        className="flex-1 bg-gray-100 text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={loading} 
                        className="flex-[2] bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-2xl disabled:opacity-50"
                      >
                        {loading ? 'Adding...' : 'Add Member'}
                      </button>
                    </div>
                  </form>
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

                  {/* Form Tabs */}
                  <div className="flex gap-2 mb-8 overflow-x-auto pb-2 custom-scrollbar">
                    {[
                      { id: 'basic', label: 'Basic Info' },
                      { id: 'pricing', label: 'Pricing' },
                      { id: 'inventory', label: 'Inventory' },
                      { id: 'variants', label: 'Variants' },
                      { id: 'shipping', label: 'Shipping' },
                      { id: 'seo', label: 'SEO Settings' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveFormTab(tab.id)}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                          activeFormTab === tab.id 
                            ? 'bg-black text-white shadow-lg' 
                            : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {activeFormTab === 'basic' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                        <div className="space-y-6">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Product Name</label>
                            <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Brand</label>
                            <input required type="text" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Category</label>
                              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold">
                                <option value="shoes">Shoes</option>
                                <option value="clothes">Clothes</option>
                                <option value="accessories">Accessories</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Subcategory</label>
                              <input type="text" value={formData.subcategory} onChange={(e) => setFormData({...formData, subcategory: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Audience</label>
                            <select value={formData.audience} onChange={(e) => setFormData({...formData, audience: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold">
                              <option value="unisex">Unisex</option>
                              <option value="men">Men</option>
                              <option value="women">Women</option>
                              <option value="kids">Kids</option>
                            </select>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Regular Price (RWF)</label>
                              <input required type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                            </div>
                            <div>
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Sale Price (RWF)</label>
                              <input type="number" value={formData.salePrice} onChange={(e) => setFormData({...formData, salePrice: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Short Description</label>
                            <input type="text" value={formData.shortDescription} onChange={(e) => setFormData({...formData, shortDescription: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Full Description</label>
                            <div className="bg-gray-50 rounded-2xl overflow-hidden">
                              <ReactQuill 
                                theme="snow"
                                value={formData.description} 
                                onChange={(content) => setFormData({...formData, description: content})}
                                className="admin-quill-editor"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Tags (comma separated)</label>
                            <input type="text" placeholder="luxury, summer, collection..." value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
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
                        </div>

                        <div className="md:col-span-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 block">Product Images</label>
                          <div className="mb-6">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Add Image URL</label>
                            <div className="flex gap-2">
                              <input 
                                type="text" 
                                id="imageUrlInput"
                                placeholder="https://example.com/image.jpg" 
                                className="flex-1 bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" 
                              />
                              <button 
                                type="button"
                                onClick={() => {
                                  const input = document.getElementById('imageUrlInput');
                                  if (input.value) {
                                    setFormData(prev => ({...prev, images: [...prev.images, input.value]}));
                                    input.value = '';
                                  }
                                }}
                                className="bg-black text-white px-6 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-lg text-[10px]"
                              >
                                Add URL
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {formData.images.map((img, i) => (
                              <div key={i} className="aspect-square bg-gray-100 rounded-3xl overflow-hidden relative group shadow-sm">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeImage(img)} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                  <Trash2 size={24} />
                                </button>
                              </div>
                            ))}
                            <label className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-all text-gray-400 hover:text-amber-500">
                              <Plus size={32} />
                              <span className="text-[10px] font-black uppercase mt-2">Upload</span>
                              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                            </label>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeFormTab === 'pricing' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                        <div className="space-y-6">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Regular Price (RWF)</label>
                            <input required type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Sale Price (RWF)</label>
                            <input type="number" value={formData.salePrice} onChange={(e) => setFormData({...formData, salePrice: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                          </div>
                        </div>
                        <div className="space-y-6 bg-amber-50 p-8 rounded-[2rem] flex flex-col justify-center border border-amber-100">
                          <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2">Discount Preview</p>
                          {formData.price && formData.salePrice ? (
                            <div>
                              <p className="text-4xl font-black text-black">
                                {Math.round(((formData.price - formData.salePrice) / formData.price) * 100)}% OFF
                              </p>
                              <p className="text-[10px] font-bold text-amber-500 uppercase mt-1 tracking-widest">
                                Save {(formData.price - formData.salePrice).toLocaleString()} RWF per item
                              </p>
                            </div>
                          ) : (
                            <p className="text-gray-400 font-bold text-xs uppercase italic tracking-widest">Enter prices to see discount percentage</p>
                          )}
                        </div>
                      </div>
                    )}

                    {activeFormTab === 'inventory' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                        <div className="space-y-6">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">SKU (Stock Keeping Unit)</label>
                            <input type="text" placeholder="AURA-SH-001" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Total Stock</label>
                              <input required type="number" value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                            </div>
                            <div>
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Low Stock Alert</label>
                              <input type="number" value={formData.lowStockThreshold} onChange={(e) => setFormData({...formData, lowStockThreshold: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Sizes (comma separated)</label>
                            <input type="text" placeholder="38, 39, 40..." value={formData.sizes} onChange={(e) => setFormData({...formData, sizes: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Colors (comma separated)</label>
                            <input type="text" placeholder="Black, White, Brown..." value={formData.colors} onChange={(e) => setFormData({...formData, colors: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                          </div>
                        </div>
                      </div>
                    )}

                    {activeFormTab === 'variants' && (
                      <div className="animate-in fade-in duration-300">
                         <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 text-center space-y-4">
                           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                             <Palette className="text-amber-500" size={32} />
                           </div>
                           <h3 className="text-sm font-black uppercase tracking-widest">Advanced Variants Management</h3>
                           <p className="text-gray-400 text-[10px] font-bold uppercase max-w-xs mx-auto">Create specific stock and price for each size/color combination</p>
                           <button type="button" className="bg-black text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 transition-all">
                             Generate Variants from Sizes/Colors
                           </button>
                         </div>
                         {/* Variants Table would go here */}
                      </div>
                    )}

                    {activeFormTab === 'shipping' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                        <div className="space-y-6">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Weight (kg)</label>
                            <input type="number" step="0.01" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                          </div>
                        </div>
                        <div className="space-y-6">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Dimensions (L x W x H cm)</label>
                          <div className="grid grid-cols-3 gap-4">
                            <input type="number" placeholder="L" value={formData.dimensions.length} onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, length: e.target.value}})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                            <input type="number" placeholder="W" value={formData.dimensions.width} onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, width: e.target.value}})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                            <input type="number" placeholder="H" value={formData.dimensions.height} onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, height: e.target.value}})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-4 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                          </div>
                        </div>
                      </div>
                    )}

                    {activeFormTab === 'seo' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
                        <div className="space-y-6">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Meta Title</label>
                            <input type="text" placeholder="SEO optimized title..." value={formData.metaTitle} onChange={(e) => setFormData({...formData, metaTitle: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">URL Slug</label>
                            <input type="text" placeholder="product-url-slug" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold" />
                          </div>
                        </div>
                        <div className="space-y-6">
                          <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Meta Description</label>
                            <textarea value={formData.metaDescription} onChange={(e) => setFormData({...formData, metaDescription: e.target.value})} rows="4" className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-sm focus:ring-2 ring-amber-500 transition-all outline-none font-bold resize-none" placeholder="Search engine description..."></textarea>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pt-10 flex gap-4">
                      <button 
                        type="button" 
                        onClick={() => setShowProductForm(false)}
                        className="flex-1 bg-gray-100 text-black py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={loading} 
                        className="flex-[2] bg-black text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-2xl disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : (editingId ? 'Update Product' : 'Create Product')}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Chatbot Floating Button & Panel */}
        <div className="fixed bottom-10 right-10 z-[100]">
          {showChat ? (
            <div className="bg-white w-[400px] h-[600px] rounded-[3rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
              {/* Chat Header */}
              <div className="bg-black p-8 text-white flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center">
                    <Bot size={24} className="text-black" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest">Aura Assistant</h3>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-tighter">AI Store Manager</p>
                  </div>
                </div>
                <button onClick={() => setShowChat(false)} className="hover:text-amber-500 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-5 rounded-[2rem] text-xs font-bold ${
                      msg.role === 'user' 
                        ? 'bg-amber-500 text-black rounded-tr-none' 
                        : 'bg-gray-50 text-black rounded-tl-none border border-gray-100'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-50 p-5 rounded-[2rem] rounded-tl-none border border-gray-100 flex gap-1">
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-8 border-t border-gray-50">
                <div className="relative">
                  <input 
                    type="text" 
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Ask anything about your store..."
                    className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-6 pr-14 text-xs font-bold focus:ring-2 ring-amber-500 outline-none transition-all"
                  />
                  <button type="submit" className="absolute right-2 top-2 w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center hover:bg-amber-500 transition-all">
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button 
              onClick={() => setShowChat(true)}
              className="w-20 h-20 bg-black text-white rounded-[2rem] flex items-center justify-center shadow-2xl hover:bg-amber-500 hover:scale-110 transition-all group"
            >
              <Bot size={32} className="group-hover:text-black transition-colors" />
              <div className="absolute -top-2 -right-2 bg-amber-500 text-black w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-black">1</div>
            </button>
          )}
        </div>
      </main>
      {/* Custom Styles for Quill */}
      <style>{`
        .admin-quill-editor .ql-toolbar {
          border: none !important;
          background: #f9fafb !important;
          padding: 12px 20px !important;
        }
        .admin-quill-editor .ql-container {
          border: none !important;
          min-height: 200px !important;
          font-family: inherit !important;
          font-size: 0.875rem !important;
        }
        .admin-quill-editor .ql-editor {
          padding: 20px !important;
          font-weight: 700 !important;
        }
        .admin-quill-editor .ql-editor.ql-blank::before {
          color: #9ca3af !important;
          font-style: normal !important;
          left: 20px !important;
        }
      `}</style>
    </div>
  );
}
