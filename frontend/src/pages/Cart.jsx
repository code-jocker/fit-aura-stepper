import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useStore } from '../store';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateCartItem, removeFromCart } = useStore();
  const [isFreeDelivery, setIsFreeDelivery] = useState(true);

  const subtotal = cart.reduce((sum, item) => {
    const itemPrice = item.salePrice || item.price;
    return sum + (itemPrice * item.quantity);
  }, 0);
  const deliveryFee = isFreeDelivery ? 0 : 5000;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <Helmet>
          <title>Shopping Cart | MBABAZI CLOSET</title>
          <meta name="description" content="View your shopping cart at MBABAZI CLOSET. Secure checkout for authentic sneakers and premium fashion in Rwanda." />
        </Helmet>
        <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mb-8">
          <span className="text-4xl">🛒</span>
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tight mb-4">Your Cart is Empty</h1>
        <p className="text-gray-500 max-w-xs mb-10 font-medium">Looks like you haven't added any styles yet. Let's find something you'll love!</p>
        <Link
          to="/products"
          className="px-12 py-4 bg-black text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-amber-500 transition-all shadow-xl"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-16">
      <Helmet>
        <title>Shopping Cart | MBABAZI CLOSET</title>
        <meta name="description" content="View your shopping cart at MBABAZI CLOSET. Secure checkout for authentic sneakers and premium fashion in Rwanda." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tight">Shopping <span className="text-amber-500">Cart</span></h1>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 bg-white px-4 py-2 rounded-full border">
            {cart.reduce((sum, item) => sum + item.quantity, 0)} Items Selected
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            {cart.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-black/5 border border-gray-100 flex flex-col md:flex-row gap-8 group transition-all hover:shadow-2xl">
                <div className="w-full md:w-40 h-48 md:h-40 bg-gray-50 rounded-[1.5rem] overflow-hidden flex-shrink-0">
                  <img
                    src={item.images?.[0] || item.image || 'https://via.placeholder.com/300'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-black uppercase tracking-tight">{item.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-gray-100 rounded-full text-gray-500">
                        Size: {item.size || 'N/A'}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-gray-100 rounded-full text-gray-500">
                        Color: {item.color || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black">
                        {(item.salePrice || item.price).toLocaleString()} RWF
                      </span>
                      {item.salePrice && item.salePrice < item.price && (
                        <span className="text-sm text-gray-400 line-through font-bold">
                          {item.price.toLocaleString()} RWF
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 md:mt-0">
                    <div className="flex items-center border-2 border-gray-100 rounded-2xl p-1 bg-gray-50">
                      <button
                        onClick={() => updateCartItem(item.productId, Math.max(1, item.quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center font-bold hover:bg-white rounded-xl transition-all"
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-black">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItem(item.productId, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center font-bold hover:bg-white rounded-xl transition-all"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-lg font-black text-amber-600">
                      {((item.salePrice || item.price) * item.quantity).toLocaleString()} RWF
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Cart Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              {[
                { icon: '🇷🇼', title: 'Local Pride', desc: 'Proudly Rwandan' },
                { icon: '🛡️', title: 'Secure', desc: 'MoMo Verified' },
                { icon: '🚚', title: 'Fast', desc: 'Kigali Express' },
                { icon: '✨', title: 'Quality', desc: 'Handpicked' }
              ].map((badge, i) => (
                <div key={i} className="bg-white/40 backdrop-blur-md p-4 rounded-3xl border border-white/60 flex flex-col items-center text-center">
                  <span className="text-2xl mb-2">{badge.icon}</span>
                  <h4 className="text-[10px] font-black uppercase tracking-widest">{badge.title}</h4>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 bg-black text-white p-10 rounded-[2.5rem] shadow-2xl shadow-black/20 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-[60px] -mr-20 -mt-20"></div>
              
              <h2 className="text-2xl font-black uppercase tracking-tight mb-8 relative z-10">Order Summary</h2>

              <div className="space-y-6 mb-8 border-b border-white/10 pb-8 relative z-10">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">{subtotal.toLocaleString()} RWF</span>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <span>Delivery</span>
                    <span className={isFreeDelivery ? 'text-green-400' : 'text-white'}>
                      {isFreeDelivery ? 'FREE' : `${deliveryFee.toLocaleString()} RWF`}
                    </span>
                  </div>
                  
                  <label className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl cursor-pointer group transition-all hover:bg-white/10 border border-white/10">
                    <input
                      type="checkbox"
                      checked={isFreeDelivery}
                      onChange={(e) => setIsFreeDelivery(e.target.checked)}
                      className="w-5 h-5 accent-amber-500 rounded border-none"
                    />
                    <div className="flex-1">
                      <span className="block text-[10px] font-black uppercase tracking-widest text-amber-500">Kigali Delivery</span>
                      <span className="block text-[9px] text-gray-400 font-bold uppercase">Free for all Kigali residents 🚚</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-between text-2xl font-black uppercase tracking-tight mb-10 relative z-10">
                <span>Total</span>
                <span className="text-amber-500">{total.toLocaleString()} RWF</span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-amber-500 text-black py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-amber-500/20 mb-4 relative z-10"
              >
                Checkout Now
              </button>

              <button
                onClick={() => navigate('/products')}
                className="w-full bg-white/10 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-white/20 transition-all relative z-10 border border-white/10"
              >
                Keep Browsing
              </button>
              
              <div className="mt-8 flex items-center justify-center gap-3 opacity-40 relative z-10">
                <span className="text-[8px] font-black uppercase tracking-[0.3em]">Safe & Secure</span>
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

