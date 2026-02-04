import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { productService } from '../api';
import ProductCard from '../components/ProductCard';
import QuickAddModal from '../components/QuickAddModal';
import { useStore } from '../store';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useStore();

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        setLoading(true);
        const response = await productService.getById(id);
        const productData = response?.data || null;
        setProduct(productData);
        setSelectedImage(0);

        if (productData?.category) {
          const relatedRes = await axios.get(`${API_URL}/products?category=${productData.category}&limit=4`);
          setRelatedProducts(relatedRes.data.filter(p => p._id !== id));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndRelated();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h2 className="text-3xl font-black uppercase mb-4">Product Not Found</h2>
      <Link to="/products" className="bg-black text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs">Back to Shop</Link>
    </div>
  );

  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
        <Link to="/" className="hover:text-amber-500 transition">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-amber-500 transition">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-amber-500 transition">{product.category}</Link>
        <span>/</span>
        <span className="text-gray-900 truncate">{product.name}</span>
      </nav>

      <main className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left: Product Gallery */}
          <div className="lg:col-span-7">
            <div className="flex flex-col md:flex-row-reverse gap-6">
              {/* Main Image Container */}
              <div className="flex-grow aspect-[4/5] bg-gray-50 rounded-[2rem] overflow-hidden group cursor-zoom-in">
                <img
                  src={product.images?.[selectedImage] || 'https://via.placeholder.com/800x1000'}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Thumbnails Sidebar */}
              <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible pb-4 md:pb-0">
                {product.images?.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-24 md:w-24 md:h-28 rounded-2xl overflow-hidden flex-shrink-0 transition-all ${
                      selectedImage === idx ? 'ring-2 ring-amber-500 ring-offset-2' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-gray-100 text-gray-900 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
                  {product.brand}
                </span>
                {!product.isPublished ? (
                  <span className="text-purple-600 text-[10px] font-black uppercase tracking-[0.2em]">
                    🔜 Coming Soon {product.publishDate && `(${new Date(product.publishDate).toLocaleDateString()})`}
                  </span>
                ) : product.stock > 0 ? (
                  <span className="text-green-600 text-[10px] font-black uppercase tracking-[0.2em]">In Stock</span>
                ) : (
                  <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.2em]">Sold Out</span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center text-amber-500 font-bold">
                  {'★'.repeat(Math.round(product.rating || 5))}
                  <span className="text-gray-300">{'★'.repeat(5 - Math.round(product.rating || 5))}</span>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {product.reviewsCount || 0} Reviews
                </span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-black">
                  {(product.salePrice || product.price).toLocaleString()} RWF
                </span>
                {product.salePrice && (
                  <>
                    <span className="text-lg text-gray-400 line-through font-bold">
                      {product.price.toLocaleString()} RWF
                    </span>
                    <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                      -{discount}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Selection Area */}
            <div className="space-y-8 mb-10 border-t pt-8">
              {/* Size Selection Placeholder */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Select Size</h3>
                  <button className="text-[10px] font-black uppercase tracking-widest text-amber-600 border-b border-amber-600">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {['US 7', 'US 8', 'US 9', 'US 10', 'US 11'].map(size => (
                    <button key={size} className="w-14 h-14 border-2 border-gray-100 rounded-2xl flex items-center justify-center text-xs font-black hover:border-black hover:bg-black hover:text-white transition-all">
                      {size.split(' ')[1]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Quantity</h3>
                <div className="flex items-center border-2 border-gray-100 rounded-2xl p-1 bg-gray-50/50">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center font-black hover:bg-white hover:shadow-sm rounded-xl transition-all"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-black text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center font-black hover:bg-white hover:shadow-sm rounded-xl transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={() => setShowQuickAdd(true)}
                disabled={product.stock === 0 || !product.isPublished}
                className="flex-grow bg-amber-500 text-black h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all shadow-xl shadow-amber-500/20 active:scale-95 disabled:opacity-50 disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none"
              >
                {!product.isPublished ? '🔜 Coming Soon' : product.stock > 0 ? '⚡ Add to Collection' : 'Sold Out'}
              </button>
              <button className="w-14 h-14 border-2 border-gray-100 rounded-2xl flex items-center justify-center hover:border-red-500 group transition-all">
                <span className="text-xl group-hover:scale-125 transition-transform">♡</span>
              </button>
            </div>

            {/* Rwanda Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mb-12">
              <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 flex items-center gap-3">
                <span className="text-xl">🇷🇼</span>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Authentic</h4>
                  <p className="text-[9px] text-gray-500 font-bold">100% Genuine</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 flex items-center gap-3">
                <span className="text-xl">🚚</span>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Fast Delivery</h4>
                  <p className="text-[9px] text-gray-500 font-bold">Nationwide</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 flex items-center gap-3">
                <span className="text-xl">💳</span>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest">MoMo Pay</h4>
                  <p className="text-[9px] text-gray-500 font-bold">Secure Checkout</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100 flex items-center gap-3">
                <span className="text-xl">✨</span>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest">Premium</h4>
                  <p className="text-[9px] text-gray-500 font-bold">Quality Guaranteed</p>
                </div>
              </div>
            </div>

            {/* Details Tabs */}
            <div className="border-t">
              <div className="flex gap-8 mb-6 overflow-x-auto pt-8">
                {['description', 'details', 'shipping'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-xs font-black uppercase tracking-widest pb-2 border-b-2 transition-all whitespace-nowrap ${
                      activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray-400'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="text-gray-500 text-sm font-medium leading-relaxed">
                {activeTab === 'description' && (
                  <p>{product.description}</p>
                )}
                {activeTab === 'details' && (
                  <ul className="list-disc list-inside space-y-2">
                    <li>Premium construction for lasting durability</li>
                    <li>Designed for maximum comfort and style</li>
                    <li>Authentic {product.brand} craftsmanship</li>
                    <li>Imported high-quality materials</li>
                  </ul>
                )}
                {activeTab === 'shipping' && (
                  <p>Fast delivery across Rwanda. Free shipping on orders over 50,000 RWF. 14-day easy returns policy.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-32 pt-16 border-t">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-black uppercase tracking-tight">You May Also Like</h2>
              <Link to={`/products?category=${product.category}`} className="text-xs font-black uppercase tracking-widest border-b-2 border-black">View All</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p._id} product={p} onQuickAdd={() => navigate(`/product/${p._id}`)} />
              ))}
            </div>
          </section>
        )}
      </main>

      <QuickAddModal
        product={product}
        isOpen={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
      />
    </div>
  );
}
