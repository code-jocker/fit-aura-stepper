import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';

export default function Header() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userName, setUserName] = useState('');
  const { cart } = useStore();
  const [scrolled, setScrolled] = useState(false);
  
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const uType = localStorage.getItem('userType');
    
    if (token && user) {
      setIsLoggedIn(true);
      setUserType(uType);
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || userData.username || 'User');
      } catch (e) {
        setUserName('User');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    setIsLoggedIn(false);
    setUserType(null);
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Top Promotional Bar */}
      <div className="bg-black text-white py-2 text-center overflow-hidden">
        <div className="flex justify-center items-center gap-8 whitespace-nowrap animate-marquee">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">⚡ Free Kigali Delivery on all orders</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:inline">✨ Premium Quality Guaranteed</span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:inline">🇷🇼 Rwanda's #1 Sneaker Shop</span>
        </div>
      </div>

      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-md shadow-lg py-2' 
            : 'bg-white py-4'
        }`}
        style={{
          paddingTop: 'max(16px, env(safe-area-inset-top))'
        }}
      >
        <nav className="container flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="relative overflow-hidden bg-black rounded-xl p-1.5 shadow-xl shadow-amber-500/10 border border-amber-500/20 group-hover:border-amber-500/50 transition-all duration-500">
              <img 
                src="/mbabazi.png" 
                alt="MBABAZI CLOSET" 
                className={`h-12 md:h-16 w-auto object-contain transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2 ${scrolled ? 'scale-90 h-10 md:h-12' : ''}`} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/150x50?text=MBABAZI';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-white/40 to-amber-500/0 -translate-x-full group-hover:animate-shimmer" />
            </div>
            <div className="ml-3 hidden sm:flex flex-col">
              <span className="text-[14px] font-black uppercase tracking-tighter leading-none group-hover:text-amber-500 transition-colors">MBABAZI</span>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 leading-none mt-1">CLOSET</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Men', path: '/products?category=men' },
              { label: 'Women', path: '/products?category=women' },
              { label: 'Shoes', path: '/products?category=shoes' },
              { label: 'New', path: '/products?isNew=true' },
              { label: 'Sale', path: '/products?sale=true', special: true },
            ].map((link) => (
              <Link 
                key={link.label}
                to={link.path} 
                className={`relative text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 hover:text-amber-500 group ${
                  link.special ? 'text-red-600' : 'text-black'
                }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Right Side Tools */}
          <div className="flex items-center gap-6">
            {/* Search Toggle (Desktop) */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
              <input
                type="text"
                placeholder="Search styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none w-40 text-[10px] font-bold uppercase tracking-wider"
              />
              <button type="submit" className="text-sm opacity-50 hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>

            <div className="flex items-center gap-4">
              {/* Wishlist */}
              <button className="hidden sm:block hover:text-amber-500 transition-transform hover:scale-110 active:scale-95">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Cart */}
              <Link to="/cart" className="relative hover:text-amber-500 transition-transform hover:scale-110 active:scale-95">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-black rounded-full w-4 h-4 flex items-center justify-center text-[9px] font-black border border-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              {isLoggedIn ? (
                <div className="flex items-center gap-4 border-l pl-4 border-gray-100">
                  <Link 
                    to={userType === 'admin' ? '/admin' : '/profile'} 
                    className="flex items-center gap-2 group"
                  >
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 font-black text-xs group-hover:bg-amber-500 group-hover:text-white transition-all">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:block text-[10px] font-black uppercase tracking-widest">{userName.split(' ')[0]}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="hidden lg:block text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-red-600 transition-colors"
                  >
                    Exit
                  </button>
                </div>
              ) : (
                <Link to="/login" className="hidden sm:block">
                  <span className="bg-black text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-amber-500 transition-all shadow-xl shadow-black/10 active:scale-95 inline-block">
                    Join Aura
                  </span>
                </Link>
              )}
              
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <div className="space-y-1.5">
                  <span className={`block w-6 h-0.5 bg-black transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`block w-6 h-0.5 bg-black transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block w-4 h-0.5 bg-black transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2 w-6' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu - Enhanced */}
        <div className={`md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-100 transition-all duration-300 overflow-hidden ${mobileMenuOpen ? 'max-h-[80vh] py-8' : 'max-h-0'}`}>
          <div className="container space-y-6">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-full px-4 py-3 focus-within:bg-white focus-within:ring-2 focus-within:ring-amber-500/20">
              <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none w-full text-sm font-medium"
              />
              <button type="submit" className="text-amber-500 font-bold text-sm uppercase">
                Go
              </button>
            </form>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Men', path: '/products?category=men' },
                { label: 'Women', path: '/products?category=women' },
                { label: 'Shoes', path: '/products?category=shoes' },
                { label: 'Clothing', path: '/products?category=clothes' },
                { label: 'New Arrivals', path: '/products?isNew=true' },
                { label: 'Flash Sale', path: '/products?sale=true', special: true },
              ].map((link) => (
                <Link 
                  key={link.label}
                  to={link.path} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-4 rounded-2xl bg-gray-50 text-[11px] font-black uppercase tracking-wider text-center ${link.special ? 'text-red-600' : 'text-black'}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            <div className="border-t border-gray-100 pt-6">
              {isLoggedIn ? (
                <div className="space-y-4">
                  <Link 
                    to={userType === 'admin' ? '/admin' : '/profile'} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-black">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Account</p>
                      <p className="text-sm font-black">{userName}</p>
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full py-4 text-[11px] font-black uppercase tracking-widest text-red-600 bg-red-50 rounded-2xl"
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-5 bg-black text-white text-center rounded-2xl text-[11px] font-black uppercase tracking-[0.2em]"
                >
                  Login to Aura
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
