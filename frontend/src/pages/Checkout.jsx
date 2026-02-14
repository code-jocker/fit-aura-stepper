import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { orderService, paymentService, promotionService } from '../api';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, user, clearCart } = useStore();
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'momo',
    notes: ''
  });
  
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [paymentStep, setPaymentStep] = useState('checkout'); // 'checkout', 'processing', 'success'
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState('');

  const validateRwandaPhone = (phone) => {
    // Basic Rwanda phone validation: starts with 078, 079, 072, 073 and is 10 digits
    // OR starts with 78, 79, 72, 73 and is 9 digits
    const regex = /^(07[8923]\d{7}|7[8923]\d{7})$/;
    return regex.test(phone);
  };

  const formatPhone = (phone) => {
    let cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      cleaned = cleaned.substring(1);
    }
    if (cleaned.startsWith('250')) {
      cleaned = cleaned.substring(3);
    }
    return '250' + cleaned;
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setGettingLocation(false);
        alert("Location captured! 📍 This will help us deliver your order faster.");
      },
      (error) => {
        console.error("Error getting location:", error);
        setGettingLocation(false);
        alert("Could not get your location. Please enter your address manually.");
      }
    );
  };

  const subtotal = cart.reduce((sum, item) => {
    const itemPrice = item.salePrice || item.price;
    return sum + (itemPrice * item.quantity);
  }, 0);
  const deliveryFee = formData.city.toLowerCase().includes('kigali') ? 0 : 5000;
  const total = Math.max(0, subtotal + deliveryFee - discount);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const res = await promotionService.validate(couponCode, cart);
      setAppliedCoupon(res.data.promotion);
      setDiscount(res.data.discount);
      alert(`Coupon applied! You saved ${res.data.discount.toLocaleString()} RWF`);
    } catch (err) {
      setCouponError(err.response?.data?.message || 'Invalid coupon code');
      setAppliedCoupon(null);
      setDiscount(0);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    // Validate phone number
    if (!validateRwandaPhone(formData.phone)) {
      alert('Please enter a valid Rwanda phone number (e.g., 078XXXXXXX)');
      return;
    }

    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setPaymentStep('processing');

    try {
      const formattedPhone = formatPhone(formData.phone);

      // Create order first
      const orderData = {
        customerName: formData.fullName,
        email: formData.email,
        phone: formattedPhone,
        items: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.salePrice || item.price,
          size: item.size || 'N/A',
          color: item.color || 'N/A',
          image: item.images?.[0]
        })),
        deliveryAddress: `${formData.address}, ${formData.city}`,
        city: formData.city,
        location: location,
        paymentMethod: formData.paymentMethod,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        discount: discount,
        couponCode: appliedCoupon?.code,
        total: total,
        notes: formData.notes,
        status: 'pending',
        paymentStatus: 'pending', // Always pending initially for online payments
      };

      console.log('Sending order data:', orderData);
      const orderResponse = await orderService.create(orderData);
      const orderId = orderResponse.data._id;

      if (!orderId) {
        throw new Error('Order creation failed');
      }

      // Handle Online Payment with Flutterwave
      if (formData.paymentMethod === 'momo' || formData.paymentMethod === 'airtel' || formData.paymentMethod === 'card') {
        const paymentData = {
          orderId: orderId,
          amount: total,
          email: formData.email,
          phone: formattedPhone,
          name: formData.fullName
        };

        const paymentResponse = await paymentService.initiateFlutterwave(paymentData);
        
        if (paymentResponse.data.status === 'success' && paymentResponse.data.link) {
          // Clear cart before redirecting
          clearCart();
          // Redirect to Flutterwave checkout
          window.location.href = paymentResponse.data.link;
          return;
        } else {
          throw new Error('Failed to initialize payment gateway');
        }
      }

      // If Cash on Delivery
      setPaymentStep('success');
      await new Promise(resolve => setTimeout(resolve, 1500));
      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('We encountered an issue processing your order. Please check your connection or try again. If the problem persists, contact our support.');
      setPaymentStep('checkout');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <button onClick={() => navigate('/products')} className="btn-primary">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-16 relative">
      {/* Payment Processing Overlay */}
      {paymentStep !== 'checkout' && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-md transition-all duration-500">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full text-center space-y-8 shadow-2xl border border-white/20 transform animate-in fade-in zoom-in duration-500">
            {paymentStep === 'processing' && (
              <>
                <div className="relative">
                  <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
                    <div className="w-16 h-16 border-[5px] border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl">👟</div>
                </div>
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tight mb-2">Processing</h3>
                  <p className="text-gray-500 font-medium">Finalizing your order...</p>
                </div>
              </>
            )}

            {paymentStep === 'success' && (
              <>
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto scale-110">
                  <svg className="w-12 h-12 text-green-500 animate-in zoom-in duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tight mb-2">Confirmed!</h3>
                  <p className="text-gray-500 font-medium italic">"Murakoze cyane! Your style is on the way."</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Checkout Form */}
          <div className="flex-1 space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => navigate('/cart')} className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-black hover:text-white transition-all">
                ←
              </button>
              <h1 className="text-4xl font-black uppercase tracking-tight">Checkout</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Section - NOW FIRST */}
              <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-black/5 border border-gray-100 ring-4 ring-amber-500/10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-black text-white rounded-2xl flex items-center justify-center font-black">1</div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Select Payment Method</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { id: 'momo', label: 'MTN MoMo', icon: '💳', color: 'bg-amber-400' },
                    { id: 'airtel', label: 'Airtel Money', icon: '📱', color: 'bg-red-500' },
                    { id: 'card', label: 'Card / Others', icon: '🌐', color: 'bg-blue-600' },
                    { id: 'cash', label: 'Cash on Delivery', icon: '💵', color: 'bg-green-500' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                      className={`relative p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 group ${
                        formData.paymentMethod === method.id
                          ? 'border-black bg-black text-white shadow-xl scale-[1.02]'
                          : 'border-gray-100 bg-gray-50 hover:border-amber-200'
                      }`}
                    >
                      <span className="text-3xl">{method.icon}</span>
                      <span className="font-black uppercase tracking-widest text-[10px]">{method.label}</span>
                      {formData.paymentMethod === method.id && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-[10px]">✓</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Section - NOW SECOND */}
              <div className={`bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-black/5 border border-gray-100 transition-all duration-500 ${!formData.paymentMethod ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 bg-amber-500 text-black rounded-2xl flex items-center justify-center font-black">2</div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Delivery Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-amber-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold"
                      placeholder="e.g. Jean Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-amber-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  {/* Phone number label changes based on payment method */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                      {formData.paymentMethod === 'cash' ? 'Contact Phone' : `${formData.paymentMethod === 'momo' ? 'MTN' : 'Airtel'} MoMo Number`}
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-amber-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold"
                        placeholder="078 XXX XXXX"
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-amber-600">🇷🇼 +250</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">City / District</label>
                    <select
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border-2 border-transparent focus:border-amber-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold cursor-pointer"
                    >
                      <option value="">Select City</option>
                      <optgroup label="Kigali City (Free Delivery)">
                        <option value="Nyarugenge, Kigali">Nyarugenge</option>
                        <option value="Gasabo, Kigali">Gasabo</option>
                        <option value="Kicukiro, Kigali">Kicukiro</option>
                      </optgroup>
                      <optgroup label="Provinces (5,000 RWF)">
                        <option value="Musanze, Northern">Musanze</option>
                        <option value="Rubavu, Western">Rubavu</option>
                        <option value="Huye, Southern">Huye</option>
                        <option value="Rwamagana, Eastern">Rwamagana</option>
                        <option value="Other">Other Provinces</option>
                      </optgroup>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Street Address / Landmark</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-amber-500 focus:bg-white rounded-2xl px-6 py-4 outline-none transition-all font-bold pr-32"
                        placeholder="e.g. Near Kimironko Market, House #12"
                      />
                      <button
                        type="button"
                        onClick={handleGetLocation}
                        disabled={gettingLocation}
                        className={`absolute right-2 top-2 bottom-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 ${
                          location ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-amber-500'
                        }`}
                      >
                        {gettingLocation ? '...' : location ? '📍 Captured' : '📍 Auto-Locate'}
                      </button>
                    </div>
                    {location && (
                      <p className="text-[9px] text-green-600 font-bold uppercase tracking-widest mt-1 ml-1 animate-pulse">
                        ✓ Precise Location Locked: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-[400px]">
            <div className="sticky top-32 bg-black text-white p-10 rounded-[2.5rem] shadow-2xl shadow-black/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-[60px] -mr-20 -mt-20"></div>
              
              <h2 className="text-2xl font-black uppercase tracking-tight mb-8 relative z-10">Summary</h2>
              
              <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar relative z-10">
                {cart.map((item) => (
                  <div key={`${item.productId}-${item.size}`} className="flex gap-4">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl overflow-hidden flex-shrink-0 border border-white/10">
                      <img src={item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black truncate uppercase tracking-wider">{item.name}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                      <p className="text-amber-500 text-xs font-black mt-1">{(item.salePrice || item.price).toLocaleString()} RWF</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-white/10 relative z-10">
                {/* Coupon Code Input */}
                <div className="space-y-2 mb-6">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="ENTER CODE"
                      disabled={appliedCoupon}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-amber-500 transition-all uppercase placeholder:text-gray-600 disabled:opacity-50"
                    />
                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={() => {
                          setAppliedCoupon(null);
                          setDiscount(0);
                          setCouponCode('');
                        }}
                        className="px-4 py-3 bg-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase hover:bg-red-500/30 transition-all"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={couponLoading || !couponCode}
                        className="px-4 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase hover:bg-amber-500 transition-all disabled:opacity-50"
                      >
                        {couponLoading ? '...' : 'Apply'}
                      </button>
                    )}
                  </div>
                  {couponError && <p className="text-[9px] text-red-400 font-bold uppercase mt-1">{couponError}</p>}
                  {appliedCoupon && <p className="text-[9px] text-green-400 font-bold uppercase mt-1">✓ {appliedCoupon.title} Applied</p>}
                </div>

                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">{subtotal.toLocaleString()} RWF</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-green-400">
                    <span>Discount</span>
                    <span>-{discount.toLocaleString()} RWF</span>
                  </div>
                )}
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span>Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-green-400' : 'text-white'}>
                    {deliveryFee === 0 ? 'FREE' : `${deliveryFee.toLocaleString()} RWF`}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-black uppercase tracking-tight pt-4 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-amber-500">{total.toLocaleString()} RWF</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full mt-10 bg-amber-500 text-black py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-amber-500/20 relative z-10 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Complete Purchase'}
              </button>
              
              <div className="mt-8 flex items-center justify-center gap-3 opacity-40 relative z-10">
                <span className="text-[8px] font-black uppercase tracking-[0.3em]">Secure Checkout</span>
                <span className="w-1 h-1 bg-white rounded-full"></span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em]">Rwanda MoMo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
