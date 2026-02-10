import React, { useState, useEffect } from 'react';
import { useStore } from '../store';

export default function QuickAddModal({ product, isOpen, onClose }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const { addToCart } = useStore();

  // Update state when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes?.[0] || '');
      setSelectedColor(product.colors?.[0] || '');
      setQuantity(1);
    }
  }, [product]);

  const handleAddToCartClick = () => {
    if (!product) return;
    addToCart({
      productId: product._id,
      quantity,
      size: selectedSize,
      color: selectedColor,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.images?.[0]
    });
    onClose();
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] max-w-lg w-full overflow-hidden shadow-2xl transform animate-in zoom-in slide-in-from-bottom-8 duration-500">
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/500'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-xl hover:bg-white transition-all shadow-lg z-10"
          >
            ✕
          </button>
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        </div>

        <div className="px-8 pb-10 -mt-12 relative z-10">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-50">
            <div className="mb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-600 mb-2 block">
                {product.brand || 'Premium Selection'}
              </span>
              <h2 className="text-3xl font-black uppercase tracking-tight leading-tight mb-2">
                {product.name}
              </h2>
              <p className="text-2xl font-black text-black">
                {(product.salePrice || product.price).toLocaleString()} RWF
              </p>
            </div>

            <div className="space-y-8">
              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Select Size</label>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[4rem] h-12 rounded-2xl border-2 font-black text-xs transition-all ${
                          selectedSize === size
                            ? 'border-black bg-black text-white'
                            : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Select Color</label>
                  <div className="flex flex-wrap gap-4">
                    {product.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all p-1 ${
                          selectedColor === color ? 'border-amber-500 scale-110' : 'border-transparent'
                        }`}
                      >
                        <div 
                          className="w-full h-full rounded-full shadow-inner border border-black/5" 
                          style={{ backgroundColor: color.toLowerCase() }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Actions */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <div className="flex items-center bg-gray-100 p-1.5 rounded-2xl w-full sm:w-auto">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center font-bold hover:bg-white rounded-xl transition-all"
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-black">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center font-bold hover:bg-white rounded-xl transition-all"
                  >
                    +
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCartClick} 
                  className="flex-1 w-full bg-amber-500 text-black h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all shadow-xl shadow-amber-500/20 active:scale-95"
                >
                  ⚡ Add to Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
