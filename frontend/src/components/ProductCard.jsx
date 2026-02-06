import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product, onQuickAdd }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const discount = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const inStock = product.stock > 0;
  const lowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-black/5 hover:shadow-2xl hover:shadow-black/10 transition-all duration-500 overflow-hidden group border border-gray-100 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative bg-white aspect-[4/5] overflow-hidden">
        <Link to={`/product/${product._id}`}>
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/300x400?text=Product'}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x400?text=Image+Not+Found';
            }}
          />
        </Link>
        
        {/* Out of Stock Overlay */}
        {!inStock && product.isPublished && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white/90 text-black font-black px-6 py-2 rounded-full text-xs uppercase tracking-widest shadow-xl">Sold Out</span>
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-5 right-5 bg-white/80 backdrop-blur-md rounded-2xl p-3 shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 z-10"
        >
          <span className="text-xl leading-none">{isWishlisted ? '❤️' : '🤍'}</span>
        </button>
        
        {/* Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2">
          {product.isNew && (
            <span className="inline-block bg-amber-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg uppercase tracking-widest">
              ✨ NEW
            </span>
          )}
          {discount > 0 && (
            <span className="inline-block bg-black text-white px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg uppercase tracking-widest">
              −{discount}%
            </span>
          )}
          {!product.isPublished && (
            <span className="inline-block bg-purple-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black shadow-lg uppercase tracking-widest">
              🔜 SOON
            </span>
          )}
        </div>

        {/* Quick Action Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
          <button
            onClick={() => onQuickAdd && onQuickAdd(product)}
            disabled={!inStock || !product.isPublished}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all transform translate-y-4 group-hover:translate-y-0 shadow-2xl ${
              inStock && product.isPublished
                ? 'bg-white text-black hover:bg-amber-500'
                : 'bg-white/50 text-gray-500 cursor-not-allowed backdrop-blur-md'
            }`}
          >
            {!product.isPublished ? 'Coming Soon' : inStock ? '⚡ Quick Add' : 'Sold Out'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] text-amber-600 font-black uppercase tracking-[0.2em]">{product.brand || 'Premium'}</p>
          {lowStock && product.isPublished && (
            <span className="text-[9px] text-red-500 font-black uppercase tracking-widest animate-pulse">Only {product.stock} Left!</span>
          )}
        </div>
        
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-black uppercase tracking-tight mb-3 line-clamp-2 hover:text-amber-500 transition-colors duration-300 leading-tight">
            {product.name}
          </h3>
        </Link>
        
        {/* Price & Rating */}
        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex flex-col">
            {product.salePrice && (
              <span className="text-[10px] text-gray-400 line-through font-bold mb-1 uppercase tracking-widest">
                {product.price.toLocaleString()} RWF
              </span>
            )}
            <span className="text-xl font-black text-black tracking-tight">
              {product.salePrice 
                ? `${product.salePrice.toLocaleString()} RWF` 
                : `${product.price.toLocaleString()} RWF`}
            </span>
          </div>
          
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl">
            <span className="text-amber-500 text-xs">★</span>
            <span className="text-[10px] font-black">{product.rating || '5.0'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
