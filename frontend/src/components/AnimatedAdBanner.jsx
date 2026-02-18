import React, { useState, useEffect } from 'react';
import { promotionService } from '../api';
import { ChevronRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AnimatedAdBanner() {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await promotionService.getAll({ activeOnly: 'true' });
        if (res.data) {
          const adPromotions = res.data.filter(p => p.type === 'ad_only' && p.isActive);
          setAds(adPromotions);
        }
      } catch (err) {
        console.error('Failed to fetch ads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [ads.length]);

  if (loading || ads.length === 0 || !visible) return null;

  const currentAd = ads[currentIndex];

  // Helper to determine link destination
  const getLinkTo = (ad) => {
    if (ad.applicableTo === 'products' && ad.products?.length > 0) {
      return `/product/${ad.products[0]}`;
    }
    if (ad.applicableTo === 'categories' && ad.categories?.length > 0) {
      return `/products?category=${ad.categories[0]}`;
    }
    return '/products';
  };

  const linkTo = getLinkTo(currentAd);

  return (
    <div className="relative w-full overflow-hidden bg-black text-white">
      {/* Background Image with Overlay */}
      <div 
        key={`bg-${currentIndex}`}
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out animate-in fade-in zoom-in-50"
        style={{ 
          backgroundImage: currentAd.bannerImage ? `url(${currentAd.bannerImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.3
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent" />

      <div className="relative container mx-auto px-4 py-3 md:py-4 flex justify-between items-center z-10">
        <div className="flex-1 pr-8">
          <div key={`content-${currentIndex}`} className="animate-in slide-in-from-bottom-2 fade-in duration-500">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest">
                New
              </span>
              <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                Limited Time Offer
              </span>
            </div>
            <h3 className="text-sm md:text-lg font-bold text-white leading-tight">
              {currentAd.title}
            </h3>
            {currentAd.description && (
              <p className="text-gray-300 text-xs mt-1 line-clamp-1 hidden md:block max-w-xl">
                {currentAd.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <Link 
            to={linkTo} 
            className="group flex items-center gap-1 text-xs font-black uppercase tracking-widest text-amber-500 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 hover:border-amber-500/50"
          >
            Explore 
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <button 
            onClick={() => setVisible(false)}
            className="text-gray-500 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Progress Bar for multiple ads */}
      {ads.length > 1 && (
        <div className="absolute bottom-0 left-0 h-0.5 bg-white/10 w-full">
           <div 
             key={currentIndex} 
             className="h-full bg-amber-500 origin-left animate-[grow_5s_linear]" 
             style={{
               animationName: 'grow',
               animationDuration: '5s',
               animationTimingFunction: 'linear',
               animationFillMode: 'forwards'
             }}
           />
           <style>{`
             @keyframes grow {
               from { width: 0%; }
               to { width: 100%; }
             }
           `}</style>
        </div>
      )}
    </div>
  );
}
