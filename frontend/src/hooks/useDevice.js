import { useState, useEffect } from 'react';

export const useDevice = () => {
  const [device, setDevice] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isMobileApp: false,
    isPortrait: true,
    isLandscape: false,
    width: 0,
    height: 0,
    pixelRatio: 1,
    touchSupported: false,
    os: 'unknown'
  });

  useEffect(() => {
    // Check if running as PWA (standalone mode)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone === true;

    // Detect touch support
    const touchSupported = 'ontouchstart' in window || 
                          navigator.maxTouchPoints > 0;

    // Detect OS
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    let os = 'unknown';
    if (/android/i.test(userAgent)) {
      os = 'android';
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      os = 'ios';
    } else if (/Windows Phone/i.test(userAgent)) {
      os = 'windows';
    }

    const updateDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;
      const isPortrait = height > width;
      const isLandscape = width > height;

      setDevice({
        isMobile,
        isTablet,
        isDesktop,
        isMobileApp: isStandalone || (isMobile && touchSupported),
        isPortrait,
        isLandscape,
        width,
        height,
        pixelRatio: window.devicePixelRatio || 1,
        touchSupported,
        os
      });
    };

    // Initial check
    updateDevice();

    // Listen for changes
    window.addEventListener('resize', updateDevice);
    window.addEventListener('orientationchange', updateDevice);

    // Listen for display mode changes (PWA)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e) => {
      setDevice(prev => ({ ...prev, isMobileApp: e.matches || (prev.isMobile && prev.touchSupported) }));
    };
    mediaQuery.addEventListener('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('resize', updateDevice);
      window.removeEventListener('orientationchange', updateDevice);
      mediaQuery.removeEventListener('change', handleDisplayModeChange);
    };
  }, []);

  return device;
};

export default useDevice;
