import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { productService } from '../api';
import ProductCard from '../components/ProductCard';
import QuickAddModal from '../components/QuickAddModal';
import { useStore } from '../store';

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
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', userName: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const { user } = useStore();

  // Error state to prevent white screen
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if id is valid
        if (!id) {
          setError('Product ID is missing');
          setLoading(false);
          return;
        }
        
        const response = await productService.getById(id);
        const productData = response?.data || null;
        
        if (!productData) {
          setError('Product not found');
          setProduct(null);
        } else {
          setProduct(productData);
          setSelectedImage(0);

          if (productData?.category) {
            try {
              const relatedRes = await axios.get(`${API_URL}/products?category=${productData.category}&limit=4`);
              if (relatedRes.data) {
                setRelatedProducts(relatedRes.data.filter(p => p._id !== id));
              }
            } catch (relatedError) {
              console.warn('Failed to fetch related products:', relatedError);
            }
          }

          // Fetch reviews (non-critical, don't fail if this errors)
          try {
            const reviewsRes = await axios.get(`${API_URL}/reviews/product/${id}`);
            if (reviewsRes.data) {
              setReviews(reviewsRes.data);
            }
          } catch (reviewsError) {
            console.warn('Failed to fetch reviews:', reviewsError);
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError(err.message || 'Failed to load product');
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndRelated();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.comment) return;

    try {
      setSubmittingReview(true);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/reviews`,
        {
          productId: id,
          rating: newReview.rating,
          comment: newReview.comment,
          userName: user?.name || newReview.userName
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );

      setReviews([response.data, ...reviews]);
      setNewReview({ rating: 5, comment: '', userName: '' });
      alert('Review submitted successfully! ✨');
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-white">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-3xl font-black uppercase mb-4">Something went wrong</h2>
      <p className="text-gray-500 mb-6 font-medium">{error}</p>
      <div className="flex gap-4">
        <button 
          onClick={() => window.location.reload()}
          className="bg-amber-500 text-black px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all"
        >
          Retry
        </button>
        <Link to="/products" className="bg-black text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs">Back to Shop</Link>
      </div>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-white">
      <div className="text-6xl mb-4">🛒</div>
      <h2 className="text-3xl font-black uppercase mb-4">Product Not Found</h2>
      <p className="text-gray-500 mb-8 font-medium">This product may have been removed or is unavailable.</p>
      <Link to="/products" className="bg-black text-white px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs">Browse Products</Link>
    </div>
  );

  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{`${product.name} | MBABAZI CLOSET Rwanda`}</title>
        <meta name="description" content={product.description?.substring(0, 160)} />
        <link rel="canonical" href={`https://mbabazi-closet.onrender.com/product/${id}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://mbabazi-closet.onrender.com/product/${id}`} />
        <meta property="og:title" content={`${product.name} | MBABAZI CLOSET Rwanda`} />
        <meta property="og:description" content={product.description?.substring(0, 160)} />
        <meta property="og:image" content={product.images?.[0] || 'https://mbabazi-closet.onrender.com/MBABAZI.JPG'} />
        <meta property="product:price:amount" content={product.salePrice || product.price} />
        <meta property="product:price:currency" content="RWF" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={`https://mbabazi-closet.onrender.com/product/${id}`} />
        <meta property="twitter:title" content={`${product.name} | MBABAZI CLOSET Rwanda`} />
        <meta property="twitter:description" content={product.description?.substring(0, 160)} />
        <meta property="twitter:image" content={product.images?.[0] || 'https://mbabazi-closet.onrender.com/MBABAZI.JPG'} />
      </Helmet>
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
              <div className="flex-grow aspect-[4/5] bg-gray-100 rounded-[2rem] overflow-hidden group cursor-zoom-in shadow-2xl border border-gray-200">
                <img
                  src={(product.images && product.images[selectedImage]) || 'https://placehold.co/800x1000/f5f5f5/999999?text=No+Image'}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/800x1000/f5f5f5/999999?text=Image+Error';
                  }}
                />
              </div>

              {/* Thumbnails Sidebar */}
              <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto md:max-h-[600px] pb-4 md:pb-0 scrollbar-hide">
                {product.images?.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-24 md:w-24 md:h-28 rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-300 bg-gray-100 border ${
                      selectedImage === idx 
                        ? 'ring-4 ring-amber-500 ring-offset-4 scale-95 border-transparent shadow-lg' 
                        : 'opacity-40 hover:opacity-100 hover:scale-105 border-gray-200'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt="" 
                      className="w-full h-full object-contain" 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/200x250/f5f5f5/999999?text=No+Img';
                      }}
                    />
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
                {['description', 'details', 'reviews', 'shipping'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-xs font-black uppercase tracking-widest pb-2 border-b-2 transition-all whitespace-nowrap ${
                      activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray-400'
                    }`}
                  >
                    {tab === 'reviews' ? `Reviews (${reviews.length})` : tab}
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
                {activeTab === 'reviews' && (
                  <div className="space-y-8">
                    {/* Review Form */}
                    <form onSubmit={handleReviewSubmit} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-8">
                      <h4 className="text-black font-black uppercase text-xs tracking-widest mb-4">Leave a Review</h4>
                      <div className="space-y-4">
                        {!user && (
                          <input
                            type="text"
                            placeholder="Your Name"
                            required
                            value={newReview.userName}
                            onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-amber-500 outline-none transition-all text-xs font-bold"
                          />
                        )}
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black uppercase tracking-widest">Rating:</span>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                className={`text-xl transition-transform active:scale-125 ${star <= newReview.rating ? 'text-amber-500' : 'text-gray-300'}`}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <textarea
                          placeholder="Share your experience with this product..."
                          required
                          value={newReview.comment}
                          onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-amber-500 outline-none transition-all text-xs font-bold min-h-[100px] resize-none"
                        />
                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-500 transition-all disabled:opacity-50"
                        >
                          {submittingReview ? 'Submitting...' : 'Post Review'}
                        </button>
                      </div>
                    </form>

                    {/* Reviews List */}
                    <div className="space-y-6">
                      {reviews.length === 0 ? (
                        <p className="text-center py-8 text-gray-400 font-bold uppercase text-[10px] tracking-widest">No reviews yet. Be the first!</p>
                      ) : (
                        reviews.map((review, idx) => (
                          <div key={idx} className="border-b border-gray-100 pb-6 last:border-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className="font-black text-black uppercase text-[10px] tracking-widest">{review.userName}</span>
                                {review.isVerified && (
                                  <span className="bg-green-100 text-green-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Verified Purchase</span>
                                )}
                              </div>
                              <span className="text-[10px] text-gray-400 font-bold">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="text-amber-500 text-xs mb-2">
                              {'★'.repeat(review.rating)}
                              <span className="text-gray-200">{'★'.repeat(5 - review.rating)}</span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
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
