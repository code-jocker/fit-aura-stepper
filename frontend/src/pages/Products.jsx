import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import QuickAddModal from '../components/QuickAddModal';

// Get the base API URL - check multiple sources for flexibility
const getApiUrl = () => {
  // In production, use relative /api path (served by reverse proxy)
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  // In development, check for custom API URL first, then fallback to localhost
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // Default to localhost
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState(['shoes', 'clothes', 'accessories']);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [isSaleOnly, setIsSaleOnly] = useState(searchParams.get('sale') === 'true');
  const [isComingSoon, setIsComingSoon] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const category = searchParams.get('category');
    const audience = searchParams.get('audience');
    const search = searchParams.get('search');
    const sale = searchParams.get('sale') === 'true';

    setSelectedCategory(category || '');
    setSelectedAudience(audience || '');
    setSearchQuery(search || '');
    setIsSaleOnly(sale);
  }, [searchParams]);

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/categories`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setCategories(res.data.map(cat => cat.name));
      }
      // If no categories from API, keep the default categories
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Keep default categories on error
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch products
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('userType');
      const isAdmin = token && userType === 'admin';
      
      let url = `${API_URL}/products`;
      const params = new URLSearchParams();
      params.append('limit', 'all');
      
      if (isAdmin) {
        params.append('adminView', 'true');
      }
      if (isComingSoon) {
        params.append('comingSoon', 'true');
      }
      
      const queryString = params.toString();
      const res = await axios.get(`${url}${queryString ? `?${queryString}` : ''}`);
      
      if (res.data && Array.isArray(res.data)) {
        setProducts(res.data);
      } else {
        // Handle unexpected response format
        console.warn('Unexpected API response:', res.data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [isComingSoon]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (products.length > 0) {
      applyFilters();
    }
  }, [products, selectedCategory, selectedAudience, searchQuery, priceRange, sortBy, selectedSizes, selectedColors, isSaleOnly, isComingSoon]); // eslint-disable-line react-hooks/exhaustive-deps

  const applyFilters = () => {
    let filtered = [...products];

    // Admin vs Public View logic is handled by the API, but we can double check here
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const isAdmin = token && userType === 'admin';
    
    if (!isAdmin) {
      // For public users, we might still want to show products that are coming soon but tagged as such
      // Actually, the API might already filter them out. Let's assume the API returns them if we want to show them.
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        (p.brand && p.brand.toLowerCase().includes(query))
      );
    }

    // Audience filter (if selected, include unisex products too)
    if (selectedAudience) {
      filtered = filtered.filter(p => 
        p.audience === selectedAudience || p.audience === 'unisex'
      );
    }

    // Sale filter
    if (isSaleOnly) {
      filtered = filtered.filter(p => p.salePrice && p.salePrice < p.price);
    }

    // Coming Soon filter
    if (isComingSoon) {
      filtered = filtered.filter(p => !p.isPublished);
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Price filter
    filtered = filtered.filter(p => {
      const price = p.salePrice || p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => 
        selectedSizes.some(size => p.sizes?.includes(size))
      );
    }

    // Color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter(p => 
        selectedColors.some(color => p.colors?.some(c => c.toLowerCase() === color.toLowerCase()))
      );
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case 'price-low':
          return (a.salePrice || a.price) - (b.salePrice || b.price);
        case 'price-high':
          return (b.salePrice || b.price) - (a.salePrice || a.price);
        case 'discount':
          const discountA = a.salePrice ? Math.round(((a.price - a.salePrice) / a.price) * 100) : 0;
          const discountB = b.salePrice ? Math.round(((b.price - b.salePrice) / b.price) * 100) : 0;
          return discountB - discountA;
        case 'popular':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleQuickAdd = (product) => {
    setSelectedProduct(product);
    setShowQuickAdd(true);
  };

  const getPageTitle = () => {
    if (selectedCategory) {
      const audience = selectedAudience ? `${selectedAudience}'s ` : '';
      return `Shop ${audience}${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} | MBABAZI CLOSET Rwanda`;
    }
    if (searchQuery) {
      return `Search Results for "${searchQuery}" | MBABAZI CLOSET Rwanda`;
    }
    return 'Shop Authentic Sneakers & Fashion | MBABAZI CLOSET Rwanda';
  };

  const getPageDescription = () => {
    if (selectedCategory) {
      return `Browse our collection of ${selectedAudience || ''} ${selectedCategory} at MBABAZI CLOSET. 100% authentic and premium quality available in Rwanda.`;
    }
    return 'Browse our collection of 100% authentic sneakers, streetwear, and premium fashion in Rwanda. Nike, Jordan, Adidas and more.';
  };

  const getCanonicalUrl = () => {
    const baseUrl = 'https://mbabazi-closet.onrender.com/products';
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedAudience) params.append('audience', selectedAudience);
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{getPageTitle()}</title>
        <meta name="description" content={getPageDescription()} />
        <link rel="canonical" href={getCanonicalUrl()} />
        <meta property="og:title" content={getPageTitle()} />
        <meta property="og:description" content={getPageDescription()} />
        <meta property="og:url" content={getCanonicalUrl()} />
      </Helmet>
      {/* Category Header & Breadcrumbs */}
      <section className="bg-gray-50 pt-16 pb-8 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-6">
            <Link to="/" className="hover:text-amber-500 transition">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-amber-500 transition">Shop</Link>
            {selectedCategory && (
              <>
                <span>/</span>
                <span className="text-gray-900">{selectedCategory}</span>
              </>
            )}
          </nav>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-3">
                {selectedCategory ? `${selectedAudience || ''} ${selectedCategory}` : searchQuery ? `Search: ${searchQuery}` : 'All Collections'}
              </h1>
              <p className="text-gray-500 max-w-lg font-medium text-sm">
                {isSaleOnly 
                  ? 'Discover limited-time offers on our premium selection.' 
                  : 'Explore our latest drops and timeless classics.'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {filteredProducts.length} Results
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border-2 border-gray-100 px-4 py-2 rounded-full font-bold uppercase text-[10px] tracking-wider focus:border-amber-500 outline-none transition-all cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low-High</option>
                <option value="price-high">Price: High-Low</option>
                <option value="popular">Best Selling</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters Sidebar - Sticky on Desktop */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-8 lg:hidden">
                <button
                  onClick={() => setFilterOpen(true)}
                  className="flex-1 bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm"
                >
                  Show Filters
                </button>
              </div>
              
              <div className="hidden lg:block">
                <FilterSidebar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  selectedAudience={selectedAudience}
                  onAudienceChange={setSelectedAudience}
                  priceRange={priceRange}
                  onPriceChange={setPriceRange}
                  selectedSizes={selectedSizes}
                  onSizesChange={setSelectedSizes}
                  selectedColors={selectedColors}
                  onColorsChange={setSelectedColors}
                  isSaleOnly={isSaleOnly}
                  onSaleChange={setIsSaleOnly}
                  isComingSoon={isComingSoon}
                  onComingSoonChange={setIsComingSoon}
                  isOpen={true}
                  onClose={() => {}}
                />
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-grow">

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-[4/5] bg-gray-100 rounded-3xl animate-pulse" />
                    <div className="h-4 w-2/3 bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-1/3 bg-gray-100 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-32 border-2 border-dashed border-gray-100 rounded-3xl">
                <span className="text-6xl mb-6 block">⚠️</span>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Failed to load products</h3>
                <p className="text-gray-500 mb-8 font-medium">{error}</p>
                <button
                  onClick={() => fetchData()}
                  className="bg-black text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-amber-500 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onQuickAdd={handleQuickAdd}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-32 border-2 border-dashed border-gray-100 rounded-3xl">
                <span className="text-6xl mb-6 block">🛸</span>
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2">No items found</h3>
                <p className="text-gray-500 mb-8 font-medium">Try adjusting your filters or search terms.</p>
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedAudience('');
                    setPriceRange([0, 100000]);
                    setSelectedSizes([]);
                    setSelectedColors([]);
                    setIsSaleOnly(false);
                    setSearchQuery('');
                  }}
                  className="bg-black text-white px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-amber-500 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            )}

            {/* Pagination Placeholder */}
            {filteredProducts.length > 0 && (
              <div className="mt-20 flex justify-center border-t pt-12">
                <button className="px-12 py-4 bg-gray-50 hover:bg-gray-100 text-black rounded-full font-black uppercase tracking-widest text-xs transition-all">
                  Load More Styles
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {filterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setFilterOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-xs bg-white p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black uppercase tracking-tight">Filters</h2>
              <button onClick={() => setFilterOpen(false)} className="text-2xl">✕</button>
            </div>
            <FilterSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedAudience={selectedAudience}
              onAudienceChange={setSelectedAudience}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              selectedSizes={selectedSizes}
              onSizesChange={setSelectedSizes}
              selectedColors={selectedColors}
              onColorsChange={setSelectedColors}
              isSaleOnly={isSaleOnly}
              onSaleChange={setIsSaleOnly}
              isComingSoon={isComingSoon}
              onComingSoonChange={setIsComingSoon}
              isOpen={true}
              onClose={() => setFilterOpen(false)}
            />
          </div>
        </div>
      )}

      {showQuickAdd && selectedProduct && (
        <QuickAddModal
          product={selectedProduct}
          onClose={() => setShowQuickAdd(false)}
        />
      )}
    </div>
  );
}
