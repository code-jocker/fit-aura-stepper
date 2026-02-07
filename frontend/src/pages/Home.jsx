import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, testimonialService, subscriptionService } from '../api';
import ProductCard from '../components/ProductCard';
import QuickAddModal from '../components/QuickAddModal';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeLoading, setSubscribeLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [arrivalsRes, testimonialsRes, featuredRes, comingSoonRes] = await Promise.all([
        productService.getAll({ isNew: true, limit: 6 }).catch(() => ({ data: [] })),
        testimonialService.getAll().catch(() => ({ data: [] })),
        productService.getAll({ featured: true, limit: 3 }).catch(() => ({ data: [] })),
        // Fetch coming soon products for the special section
        productService.getAll({ comingSoon: true, limit: 3 }).catch(() => ({ data: [] }))
      ]);
      setNewArrivals(arrivalsRes?.data || []);
      // Testimonials are fetched but currently not used in the UI state
      setFeaturedProducts(featuredRes?.data || []);
      setComingSoon(comingSoonRes?.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setNewArrivals([]);
      setFeaturedProducts([]);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      setSubscribeLoading(true);
      await subscriptionService.subscribe(subscribeEmail);
      alert('Thank you for subscribing! 📧');
      setSubscribeEmail('');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to subscribe');
    } finally {
      setSubscribeLoading(false);
    }
  };

  const handleQuickAdd = (product) => {
    setSelectedProduct(product);
    setShowQuickAdd(true);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden flex items-center">
        <div
          className="absolute inset-0 transition-transform duration-[20s] hover:scale-110"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1600&h=900&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
          aria-label="MBABAZI CLOSET Hero Image - Premium Sneakers in Rwanda"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="relative container px-4">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 bg-amber-500 text-black text-xs font-black uppercase tracking-[0.2em] rounded-full mb-6 animate-fade-in">
              🇷🇼 Rwanda's Premium Fashion Destination
            </span>
            <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tighter animate-slide-up">
              ELEVATE YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600">STYLE GAME</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-xl font-medium leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
              Discover premium sneakers and athleisure that blend contemporary fashion with authentic Rwandan inspiration.
            </p>
            <div className="flex flex-wrap gap-5 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Link to="/products" className="px-10 py-4 bg-amber-500 text-black rounded-full font-black uppercase tracking-wider hover:bg-white hover:scale-105 transition-all shadow-2xl flex items-center gap-2 group">
                Shop Collection 
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link to="/products?category=shoes" className="px-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full font-black uppercase tracking-wider hover:bg-white/20 transition-all">
                View Sneakers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-black py-10 border-y border-white/10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Happy Customers', value: '10K+' },
              { label: 'Premium Products', value: '500+' },
              { label: 'Customer Rating', value: '4.9/5' },
              { label: 'Fast Delivery', value: 'Kigali Wide' }
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-3xl md:text-4xl font-black text-amber-500 mb-1 group-hover:scale-110 transition-transform">{stat.value}</div>
                <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-6 border-b border-gray-100">
        <div className="container">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🚚</span>
              <div>
                <p className="font-black text-sm uppercase">Free Delivery</p>
                <p className="text-[10px] text-gray-500 font-bold">In Kigali City</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛡️</span>
              <div>
                <p className="font-black text-sm uppercase">Authentic Products</p>
                <p className="text-[10px] text-gray-500 font-bold">100% Guaranteed</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <p className="font-black text-sm uppercase">Easy Payments</p>
                <p className="text-[10px] text-gray-500 font-bold">MTN MoMo & Airtel</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎧</span>
              <div>
                <p className="font-black text-sm uppercase">24/7 Support</p>
                <p className="text-[10px] text-gray-500 font-bold">Local Assistance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container py-16">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight leading-none">Shop By <br /> <span className="text-amber-600">Category</span></h2>
            <div className="h-1.5 w-16 bg-black mt-4"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Men\'s Shoes', query: 'shoes', img: '1549298916361-001195ee9184', count: '120+ Items' },
            { name: 'Women\'s Style', query: 'women', img: '1483985988335-5f5763520549', count: '85+ Items' },
            { name: 'Athleisure', query: 'clothes', img: '1515886657613-9f3515b0c78f', count: '200+ Items' },
            { name: 'Accessories', query: 'accessories', img: '1523275335684-37898b6baf30', count: '50+ Items' },
            { name: 'New Arrivals', query: 'isNew', img: '1556906781-9a412961c28c', count: 'Just In' },
            { name: 'Sale Items', query: 'sale', img: '1511556532299-8f662fc26c06', count: 'Up to 50% Off' }
          ].map((cat, i) => (
            <Link
              key={i}
              to={cat.query === 'isNew' ? '/products?isNew=true' : cat.query === 'sale' ? '/products?sale=true' : `/products?category=${cat.query}`}
              className="relative h-64 rounded-2xl overflow-hidden group shadow-md"
            >
              <div
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-110"
                style={{
                  backgroundImage: `url(https://images.unsplash.com/photo-${cat.img}?w=600&h=800&fit=crop)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                <p className="text-amber-400 text-[10px] font-bold uppercase tracking-widest mb-1">{cat.count}</p>
                <h3 className="text-xl font-black uppercase tracking-tight mb-2">{cat.name}</h3>
                <span className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all text-sm">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers / Trending Products */}
      <section className="bg-gray-50 py-16">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-amber-600 font-bold uppercase tracking-widest mb-1 block text-xs">Top Picks</span>
              <h2 className="text-3xl font-black uppercase tracking-tight">Best Sellers</h2>
            </div>
            <Link to="/products" className="text-black font-bold border-b-2 border-black hover:text-amber-600 hover:border-amber-600 transition-colors pb-1 text-sm">Shop All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.length > 0 ? featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} onQuickAdd={handleQuickAdd} />
            )) : (
              <div className="col-span-full py-16 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">
                Loading trending styles...
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mid-Page Promotional Banner */}
      <section className="container py-16">
        <div className="relative h-[400px] rounded-[2rem] overflow-hidden group">
          <div
            className="absolute inset-0 transition-transform duration-[5s] group-hover:scale-105"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=1600)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-10 md:px-16 text-white">
            <span className="text-amber-500 font-bold uppercase tracking-[0.2em] mb-4 text-sm">Seasonal Refresh</span>
            <h2 className="text-4xl md:text-6xl font-black mb-6 max-w-xl leading-none tracking-tight uppercase">
              Summer <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Essentials</span>
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-md font-medium text-gray-300">
              Up to 50% off on selected footwear and apparel. Limited time only.
            </p>
            <div>
              <Link to="/products?sale=true" className="inline-block px-10 py-4 bg-amber-500 text-black rounded-full font-bold uppercase tracking-wider hover:bg-white transition-all transform hover:scale-105 shadow-xl">
                Claim Offer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="container py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-xl">
            <h2 className="text-4xl font-black uppercase tracking-tight mb-4">Fresh Arrivals</h2>
            <p className="text-gray-500 text-lg font-medium leading-relaxed">
              The latest drops from global brands, now available in Rwanda.
            </p>
          </div>
          <Link to="/products?isNew=true" className="px-8 py-3.5 bg-black text-white rounded-full font-bold uppercase tracking-wider hover:bg-amber-500 transition-all text-xs shadow-lg">
            Explore New Drop
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newArrivals.map(product => (
            <ProductCard key={product._id} product={product} onQuickAdd={handleQuickAdd} />
          ))}
        </div>
      </section>

      {/* Coming Soon Section */}
      {comingSoon.length > 0 && (
        <section className="bg-amber-500 py-24">
          <div className="container">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
              <div className="max-w-2xl text-black">
                <span className="text-black/60 font-black uppercase tracking-[0.3em] mb-4 block text-xs">Upcoming Drops</span>
                <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none">Dropping <br /> Very Soon</h2>
                <p className="text-xl font-medium text-black/80">Get ready for the most anticipated releases of the season. Early access for members only.</p>
              </div>
              <Link to="/products?comingSoon=true" className="px-10 py-5 bg-black text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-white hover:text-black transition-all shadow-2xl">
                Explore All Drops
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {comingSoon.map(product => (
                <div key={product._id} className="relative group overflow-hidden rounded-[2.5rem] bg-white p-4 shadow-2xl">
                  <div className="aspect-[4/5] overflow-hidden rounded-[2rem]">
                    <img 
                      src={product.images?.[0] || 'https://via.placeholder.com/800x1000?text=Product+Image'} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/800x1000?text=Image+Not+Available';
                      }}
                    />
                  </div>
                  <div className="mt-6 px-4 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full mb-3 inline-block">🔜 {product.publishDate ? new Date(product.publishDate).toLocaleDateString() : 'Coming Soon'}</span>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-black mb-2">{product.name}</h3>
                    <p className="text-gray-500 font-medium text-sm line-clamp-2">{product.description}</p>
                  </div>
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center p-8 backdrop-blur-sm">
                    <div className="text-center">
                      <p className="text-white font-black uppercase tracking-widest text-xs mb-4">Notify Me on Drop</p>
                      <button className="px-8 py-3 bg-amber-500 text-black rounded-full font-black uppercase tracking-wider text-[10px] hover:bg-white transition-all">Set Reminder</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Customer Testimonials */}
      <section className="bg-black py-24 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] -ml-48 -mb-48"></div>
        
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <span className="text-amber-500 font-black uppercase tracking-[0.3em] mb-4 block text-xs">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">What Our Community Says</h2>
            <p className="text-gray-400 font-medium">Join thousands of happy customers across Rwanda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Diane Uwimana",
                location: "Kigali City",
                quote: "Murakoze cyane! The sneakers are amazing quality and the MoMo payment was so easy. Delivery to Kimironko was super fast!",
                rating: 5
              },
              {
                name: "Jean-Pierre Habimana",
                location: "Musanze",
                quote: "Best athleisure store in Rwanda! Great selection and the prices are fair. My track jacket arrived in perfect condition.",
                rating: 5
              },
              {
                name: "Claudine Mugisha",
                location: "Rubavu",
                quote: "I love that they deliver to Western Province! The compression leggings are exactly as described. Will order again!",
                rating: 5
              }
            ].map((t, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-all duration-500 group">
                <div className="flex text-amber-500 mb-6 text-lg">
                  {'★'.repeat(t.rating)}
                </div>
                <p className="text-gray-200 text-lg italic mb-10 leading-relaxed font-medium group-hover:text-white transition-colors">"{t.quote}"</p>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center font-black text-2xl text-white shadow-2xl transform group-hover:rotate-6 transition-transform">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-white text-xl">{t.name}</h4>
                    <p className="text-amber-500 font-black text-xs uppercase tracking-widest">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand / Partners Logos */}
      <section className="py-12 border-b border-gray-100 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
        <div className="container">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {['NIKE', 'ADIDAS', 'PUMA', 'JORDAN', 'VANS', 'CONVERSE'].map(brand => (
              <span key={brand} className="text-2xl md:text-3xl font-black text-gray-400 tracking-tighter hover:text-black transition-colors cursor-default">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Rwanda Trust Badges */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black uppercase tracking-tight mb-4">Why Choose MBABAZI CLOSET</h2>
            <p className="text-gray-500 font-medium">Providing the best shopping experience across Rwanda</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="text-center space-y-4 group">
              <div className="w-20 h-20 bg-amber-50 rounded-[2rem] flex items-center justify-center mx-auto group-hover:bg-amber-500 transition-colors duration-500">
                <span className="text-3xl group-hover:scale-125 transition-transform duration-500">🇷🇼</span>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">Proudly Rwandan</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Local expertise with global standards. We understand the Rwandan style and needs.
              </p>
            </div>
            <div className="text-center space-y-4 group">
              <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto group-hover:bg-blue-500 transition-colors duration-500">
                <span className="text-3xl group-hover:scale-125 transition-transform duration-500">🛵</span>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">Express Delivery</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Same-day delivery in Kigali. 24-48 hours delivery to all other provinces.
              </p>
            </div>
            <div className="text-center space-y-4 group">
              <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto group-hover:bg-green-500 transition-colors duration-500">
                <span className="text-3xl group-hover:scale-125 transition-transform duration-500">💳</span>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">Secure MoMo</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Pay safely using MTN Mobile Money or Airtel Money. Secure and instant.
              </p>
            </div>
            <div className="text-center space-y-4 group">
              <div className="w-20 h-20 bg-purple-50 rounded-[2rem] flex items-center justify-center mx-auto group-hover:bg-purple-500 transition-colors duration-500">
                <span className="text-3xl group-hover:scale-125 transition-transform duration-500">✨</span>
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">100% Authentic</h3>
              <p className="text-gray-500 text-sm font-medium leading-relaxed">
                Every product is verified for quality and authenticity. No compromises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Regions Section */}
      <section className="bg-gray-50 py-24 overflow-hidden">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-8">
              <span className="text-amber-600 font-black uppercase tracking-[0.3em] text-xs">Nationwide Coverage</span>
              <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                Delivering to Every <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Corner of Rwanda</span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center flex-shrink-0 font-bold">1</div>
                  <div>
                    <h4 className="font-black uppercase tracking-tight text-lg">Kigali City</h4>
                    <p className="text-gray-500 font-medium">Free delivery within 2-4 hours. All districts covered (Nyarugenge, Gasabo, Kicukiro).</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center flex-shrink-0 font-bold">2</div>
                  <div>
                    <h4 className="font-black uppercase tracking-tight text-lg">Provincial Hubs</h4>
                    <p className="text-gray-500 font-medium">Next-day delivery to Musanze, Rubavu, Huye, and Rwamagana for only 5,000 RWF.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center flex-shrink-0 font-bold">3</div>
                  <div>
                    <h4 className="font-black uppercase tracking-tight text-lg">Remote Areas</h4>
                    <p className="text-gray-500 font-medium">48-hour delivery to any other location via our partner courier services.</p>
                  </div>
                </div>
              </div>
              <Link to="/products" className="inline-block px-10 py-4 bg-black text-white rounded-full font-black uppercase tracking-widest text-xs hover:bg-amber-500 transition-all shadow-xl">
                Start Shopping Now
              </Link>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="aspect-square bg-amber-500/10 rounded-[3rem] overflow-hidden rotate-3 absolute inset-0 -z-10"></div>
              <div className="aspect-square bg-white rounded-[3rem] shadow-2xl overflow-hidden p-8 border border-gray-100">
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800" 
                  alt="Rwanda Delivery" 
                  className="w-full h-full object-cover rounded-[2rem]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Trust Badges - Secondary */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              {
                title: "Local MoMo Support",
                desc: "Secure payments via MTN & Airtel Money",
                icon: "💳"
              },
              {
                title: "Kigali Fast Track",
                desc: "Same-day delivery within Kigali City",
                icon: "⚡"
              },
              {
                title: "Countrywide Reach",
                desc: "Safe delivery to all provinces in Rwanda",
                icon: "🇷🇼"
              },
              {
                title: "Premium Quality",
                desc: "100% authentic curated streetwear",
                icon: "⭐"
              }
            ].map((item, i) => (
              <div key={i} className="group p-8 rounded-3xl bg-gray-50 hover:bg-black transition-all duration-500">
                <div className="text-4xl mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all">{item.icon}</div>
                <h3 className="text-lg font-black uppercase tracking-tight mb-2 group-hover:text-amber-500 transition-colors">{item.title}</h3>
                <p className="text-gray-500 text-sm font-medium group-hover:text-gray-400 transition-colors leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="container py-16">
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-[2rem] p-10 md:p-16 relative overflow-hidden text-center text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -mr-32 -mt-32"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="text-amber-500 font-bold uppercase tracking-[0.2em] mb-4 block animate-pulse text-xs">Exclusive Perks</span>
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight uppercase leading-tight">Unlock <br /> 10% Off</h2>
            <p className="text-lg md:text-xl text-gray-400 mb-10 font-medium leading-relaxed">
              Join the squad for early access to limited drops.
            </p>
            <form className="flex flex-col md:flex-row gap-3 bg-white/5 p-1.5 rounded-full backdrop-blur-sm border border-white/10" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter email"
                required
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                className="flex-1 bg-transparent px-6 py-3.5 rounded-full text-white outline-none font-bold text-base placeholder:text-gray-500"
              />
              <button 
                type="submit" 
                disabled={subscribeLoading}
                className="px-8 py-3.5 bg-amber-500 text-black rounded-full font-bold uppercase tracking-wider hover:bg-white transition-all transform hover:scale-105 disabled:opacity-50 shadow-xl text-sm"
              >
                {subscribeLoading ? '...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Admin Quick Access (Optional but kept for functionality) */}
      <section className="container mb-24 opacity-50 hover:opacity-100 transition-opacity">
        <div className="bg-gray-50 p-12 rounded-[3rem] border-2 border-dashed border-gray-200 group hover:border-black transition-all">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-black mb-2 uppercase tracking-tighter">Store Management</h3>
              <p className="text-gray-500 font-medium">Quick access to product inventory and orders.</p>
            </div>
            <Link to="/admin" className="px-10 py-4 bg-black text-white rounded-full font-black uppercase tracking-widest hover:bg-amber-600 transition-all transform group-hover:scale-105 shadow-xl">
              Dashboard →
            </Link>
          </div>
        </div>
      </section>

      <QuickAddModal
        product={selectedProduct}
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
      />
    </div>
  );
}
