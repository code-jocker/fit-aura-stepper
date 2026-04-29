import React from 'react';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000">
      <div className="text-center animate-pulse">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-widest mb-4">
          MBABAZI
          <span className="text-amber-500"> CLOSET</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base tracking-[0.5em] uppercase">
          Premium Fashion & Sneakers
        </p>
        <div className="mt-8 flex justify-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
