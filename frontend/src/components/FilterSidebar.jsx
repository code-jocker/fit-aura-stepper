import React, { useState } from 'react';

export default function FilterSidebar({
  categories = [],
  selectedCategory,
  onCategoryChange,
  selectedAudience,
  onAudienceChange,
  priceRange,
  onPriceChange,
  selectedSizes,
  onSizesChange,
  selectedColors,
  onColorsChange,
  isSaleOnly,
  onSaleChange,
  isComingSoon,
  onComingSoonChange,
  isOpen,
  onClose
}) {
  const [expandedFilter, setExpandedFilter] = useState({
    category: true,
    audience: true,
    price: true,
    size: true,
    color: true,
  });

  const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const AVAILABLE_COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Gray', 'Brown'];
  const AVAILABLE_AUDIENCES = ['Unisex', 'Men', 'Women', 'Kids'];

  const toggleFilter = (filter) => {
    setExpandedFilter(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  const handleSizeToggle = (size) => {
    if (selectedSizes.includes(size)) {
      onSizesChange(selectedSizes.filter(s => s !== size));
    } else {
      onSizesChange([...selectedSizes, size]);
    }
  };

  const handleColorToggle = (color) => {
    if (selectedColors.includes(color)) {
      onColorsChange(selectedColors.filter(c => c !== color));
    } else {
      onColorsChange([...selectedColors, color]);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:static inset-y-0 left-0 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 md:z-0 md:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } overflow-y-auto`}
      >
        <div className="p-6">
          {/* Close Button (Mobile Only) */}
          <button
            onClick={onClose}
            className="md:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>

          {/* Title */}
          <h2 className="text-2xl font-bold mb-6">Filters</h2>

          {/* Sale Toggle */}
          <div className="mb-6 pb-6 border-b space-y-4">
            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={isSaleOnly}
                onChange={(e) => onSaleChange(e.target.checked)}
                className="w-5 h-5 accent-red-500 rounded"
              />
              <span className="ml-3 font-black text-xs uppercase tracking-widest text-red-600 group-hover:translate-x-1 transition-transform">🔥 Sale Items Only</span>
            </label>

            <label className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={isComingSoon}
                onChange={(e) => onComingSoonChange(e.target.checked)}
                className="w-5 h-5 accent-purple-600 rounded"
              />
              <span className="ml-3 font-black text-xs uppercase tracking-widest text-purple-600 group-hover:translate-x-1 transition-transform">🔜 Coming Soon Drops</span>
            </label>
          </div>

          {/* Category Filter */}
          <div className="mb-6 pb-6 border-b">
            <button
              onClick={() => toggleFilter('category')}
              className="flex justify-between items-center w-full font-bold text-lg mb-4 hover:text-amber-500"
            >
              Category
              <span className="text-sm">{expandedFilter.category ? '−' : '+'}</span>
            </button>
            {expandedFilter.category && (
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={selectedCategory === ''}
                    onChange={() => onCategoryChange('')}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="ml-3 text-gray-700 group-hover:text-amber-500">All Categories</span>
                </label>
                {categories.map(cat => (
                  <label key={cat} className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={selectedCategory === cat}
                      onChange={() => onCategoryChange(cat)}
                      className="w-4 h-4 accent-amber-500"
                    />
                    <span className="ml-3 text-gray-700 capitalize group-hover:text-amber-500">
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Audience Filter */}
          <div className="mb-6 pb-6 border-b">
            <button
              onClick={() => toggleFilter('audience')}
              className="flex justify-between items-center w-full font-bold text-lg mb-4 hover:text-amber-500"
            >
              👥 For
              <span className="text-sm">{expandedFilter.audience ? '−' : '+'}</span>
            </button>
            {expandedFilter.audience && (
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="audience"
                    value=""
                    checked={selectedAudience === ''}
                    onChange={() => onAudienceChange('')}
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span className="ml-3 text-gray-700 group-hover:text-amber-500">All</span>
                </label>
                {AVAILABLE_AUDIENCES.map(audience => (
                  <label key={audience} className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="audience"
                      value={audience.toLowerCase()}
                      checked={selectedAudience === audience.toLowerCase()}
                      onChange={() => onAudienceChange(audience.toLowerCase())}
                      className="w-4 h-4 accent-amber-500"
                    />
                    <span className="ml-3 text-gray-700 group-hover:text-amber-500">
                      {audience}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Price Range Filter */}
          <div className="mb-6 pb-6 border-b">
            <button
              onClick={() => toggleFilter('price')}
              className="flex justify-between items-center w-full font-bold text-lg mb-4 hover:text-amber-500"
            >
              Price Range
              <span className="text-sm">{expandedFilter.price ? '−' : '+'}</span>
            </button>
            {expandedFilter.price && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min: ${priceRange[0].toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    value={priceRange[0]}
                    onChange={(e) => onPriceChange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full accent-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max: ${priceRange[1].toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    value={priceRange[1]}
                    onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-amber-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Size Filter */}
          <div className="mb-6 pb-6 border-b">
            <button
              onClick={() => toggleFilter('size')}
              className="flex justify-between items-center w-full font-bold text-lg mb-4 hover:text-amber-500"
            >
              Size
              <span className="text-sm">{expandedFilter.size ? '−' : '+'}</span>
            </button>
            {expandedFilter.size && (
              <div className="grid grid-cols-3 gap-2">
                {AVAILABLE_SIZES.map(size => (
                  <button
                    key={size}
                    onClick={() => handleSizeToggle(size)}
                    className={`py-2 px-3 rounded border-2 font-bold transition ${
                      selectedSizes.includes(size)
                        ? 'border-amber-500 bg-amber-500 text-white'
                        : 'border-gray-200 hover:border-amber-500'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color Filter */}
          <div className="mb-6">
            <button
              onClick={() => toggleFilter('color')}
              className="flex justify-between items-center w-full font-bold text-lg mb-4 hover:text-amber-500"
            >
              Color
              <span className="text-sm">{expandedFilter.color ? '−' : '+'}</span>
            </button>
            {expandedFilter.color && (
              <div className="space-y-2">
                {AVAILABLE_COLORS.map(color => (
                  <label key={color} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={() => handleColorToggle(color)}
                      className="w-4 h-4 accent-amber-500 rounded"
                    />
                    <span className="ml-3 text-gray-700 group-hover:text-amber-500">{color}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={() => {
              onCategoryChange('');
              onPriceChange([0, 100000]);
              onSizesChange([]);
              onColorsChange([]);
              onSaleChange(false);
            }}
            className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  );
}
