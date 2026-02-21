import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-600 to-amber-500"></div>
      
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Brand Identity */}
          <div className="max-w-xs">
            <Link to="/" className="mb-8 block">
              <img src="/mbabazi.png" alt="MBABAZI CLOSET" className="h-12 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-gray-400 text-lg font-medium leading-relaxed mb-8">
              Rwanda's ultimate destination for premium sneakers and modern streetwear. Elevating your style, one step at a time.
            </p>
            <div className="flex gap-4">
              {['𝕏', '📷', '👍', '▶️'].map((icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Shop */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500 mb-8">Quick Shop</h4>
            <ul className="space-y-4">
              {['Men', 'Women', 'Shoes', 'Clothing', 'New Arrivals', 'Sale'].map((link) => (
                <li key={link}>
                  <Link 
                    to={link === 'New Arrivals' ? '/products?isNew=true' : link === 'Sale' ? '/products?sale=true' : `/products?category=${link.toLowerCase()}`}
                    className="text-gray-400 font-bold hover:text-white transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Help */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500 mb-8">Support</h4>
            <ul className="space-y-4">
              {[
                { name: 'Track Order', path: '/track-order' },
                { name: 'Returns & Exchanges', path: '/returns' },
                { name: 'Shipping Info', path: '/shipping' },
                { name: 'Size Guide', path: '/size-guide' },
                { name: 'Store Locations', path: '/store-locations' },
                { name: 'Contact Us', path: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="text-gray-400 font-bold hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Newsletter Placeholder */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500 mb-8">Newsletter</h4>
            <p className="text-gray-400 font-bold mb-6">Get 10% off your first order when you join the squad.</p>
            <Link to="/" className="inline-block px-8 py-3 bg-white text-black rounded-full text-xs font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all">
              Subscribe Now
            </Link>
            
            <div className="mt-12">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-amber-500 mb-4">Policies</h4>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold text-gray-500 mb-4">
                <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                <Link to="/returns" className="hover:text-white transition-colors">Returns</Link>
              </div>
              <div className="flex flex-col gap-2">
                <Link to="/login?delivery=true" className="text-[10px] text-gray-600 hover:text-amber-500 transition-colors font-bold uppercase tracking-widest">
                  Delivery Login
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <p className="text-gray-500 font-bold text-sm">
              © 2026 MBABAZI CLOSET. Crafted for Rwanda 🇷🇼
            </p>
            <p className="text-gray-600 font-bold text-[10px] mt-1 uppercase tracking-widest">
              Made by <Link to="/portfolio" className="text-amber-500 hover:text-white transition-colors">C</Link> - Clever Digital Solutions
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
            {['MTN MOMO', 'AIRTEL MONEY', 'VISA', 'MASTERCARD', 'CASH ON DELIVERY'].map(method => (
              <span key={method} className="text-[10px] font-black border border-white/40 px-3 py-1 rounded tracking-widest">{method}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
