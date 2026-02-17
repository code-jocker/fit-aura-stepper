import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function Categories() {
  const categories = [
    {
      name: 'Men Shoes',
      slug: 'shoes',
      audience: 'men',
      description: 'Premium sneakers, boots and athletic footwear for men',
      icon: '👟',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
      featured: true,
      count: '120+ Items'
    },
    {
      name: 'Women Clothing',
      slug: 'clothes',
      audience: 'women',
      description: 'Quality athleisure wear and casual apparel for women',
      icon: '👗',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop',
      featured: true,
      count: '85+ Items'
    },
    {
      name: 'Men Clothing',
      slug: 'clothes',
      audience: 'men',
      description: 'Streetwear, hoodies and premium apparel for men',
      icon: '👕',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500&h=500&fit=crop',
      count: '90+ Items'
    },
    {
      name: 'Women Shoes',
      slug: 'shoes',
      audience: 'women',
      description: 'Elegant sneakers and performance footwear for women',
      icon: '👠',
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&h=500&fit=crop',
      count: '75+ Items'
    },
    {
      name: 'Accessories',
      slug: 'accessories',
      description: 'Complete your look with premium essentials',
      icon: '⌚',
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
      count: '50+ Items'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Categories | MBABAZI CLOSET</title>
        <meta name="description" content="Shop by category at MBABAZI CLOSET. Men's and Women's shoes, clothing, and accessories." />
      </Helmet>
      {/* Page Title Section */}
      <section className="bg-gray-50 py-20 border-b">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter uppercase">Shop by Category</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Explore our curated collections of premium footwear and apparel, designed for style and performance.
          </p>
        </div>
      </section>

      {/* Quick Filters */}
      <div className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap justify-center gap-4">
          <Link to="/products?audience=men" className="px-6 py-2 rounded-full border border-gray-200 hover:border-amber-500 hover:text-amber-600 font-bold transition-all uppercase text-sm tracking-widest">Men</Link>
          <Link to="/products?audience=women" className="px-6 py-2 rounded-full border border-gray-200 hover:border-amber-500 hover:text-amber-600 font-bold transition-all uppercase text-sm tracking-widest">Women</Link>
          <Link to="/products?category=shoes" className="px-6 py-2 rounded-full border border-gray-200 hover:border-amber-500 hover:text-amber-600 font-bold transition-all uppercase text-sm tracking-widest">Shoes</Link>
          <Link to="/products?category=clothes" className="px-6 py-2 rounded-full border border-gray-200 hover:border-amber-500 hover:text-amber-600 font-bold transition-all uppercase text-sm tracking-widest">Clothing</Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Featured Categories Section */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black uppercase tracking-tight">Featured Collections</h2>
            <div className="h-1 flex-grow mx-8 bg-gray-100 hidden md:block" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.filter(c => c.featured).map(category => (
              <Link key={`${category.slug}-${category.audience}`} to={`/products?category=${category.slug}${category.audience ? `&audience=${category.audience}` : ''}`}>
                <div className="group relative overflow-hidden rounded-3xl h-[400px] shadow-2xl transition-all duration-500">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute top-6 left-6">
                    <span className="bg-amber-500 text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">Seasonal Pick</span>
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
                    <span className="text-amber-400 font-bold uppercase tracking-[0.2em] mb-2">{category.count}</span>
                    <h3 className="text-4xl font-black mb-4 uppercase">{category.name}</h3>
                    <p className="text-gray-200 mb-8 max-w-md font-medium">{category.description}</p>
                    <div className="flex items-center gap-3 font-black uppercase tracking-widest group/btn">
                      <span className="border-b-2 border-white group-hover/btn:border-amber-500 transition-colors">View Collection</span>
                      <span className="transform group-hover/btn:translate-x-2 transition-transform">→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-black uppercase tracking-tight">All Categories</h2>
            <div className="h-1 flex-grow mx-8 bg-gray-100 hidden md:block" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.filter(c => !c.featured).map(category => (
              <Link key={`${category.slug}-${category.audience}`} to={`/products?category=${category.slug}${category.audience ? `&audience=${category.audience}` : ''}`}>
                <div className="group relative overflow-hidden rounded-2xl h-80 shadow-lg hover:shadow-xl transition-all duration-300">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
                    <div className="text-5xl mb-4 transform group-hover:scale-125 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h2 className="text-2xl font-black mb-1 uppercase tracking-tighter">{category.name}</h2>
                    <span className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-4">{category.count}</span>
                    <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <span className="bg-white text-black px-6 py-2 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-amber-500 hover:text-white transition">
                        View Products
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
