import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200/80 text-slate-700 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Brand & Positioning */}
          <div className="space-y-3 lg:col-span-2">
            <Logo size="medium" showTagline={false} variant="dark" />
            
            <p className="text-xs sm:text-sm font-bold text-slate-900">
              Discover better. Choose smarter. Buy directly.
            </p>

            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-md">
              Useful products, simple collections and transparent marketplace links.
            </p>

            <div className="pt-2 flex items-center gap-2 text-[11.5px] font-semibold text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Direct marketplace links • Zero markup</span>
            </div>
          </div>

          {/* Column 2: Explore */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200/80 pb-2">
              Explore
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              <li>
                <Link to="/" className="hover:text-sky-600 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-sky-600 transition-colors">Categories</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-sky-600 transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/category/deals" className="hover:text-sky-600 transition-colors">Trending Deals</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200/80 pb-2">
              Information
            </h4>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              <li>
                <Link to="/about" className="hover:text-sky-600 transition-colors">About</Link>
              </li>
              <li>
                <Link to="/affiliate-disclosure" className="hover:text-sky-600 transition-colors">Affiliate Disclosure</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-sky-600 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-sky-600 transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-sky-600 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Explicit Affiliate Disclosure & Legal Disclaimers */}
        <div className="border-t border-slate-200/80 pt-6 space-y-2 text-xs text-slate-500 font-medium">
          <p className="font-semibold text-slate-700">
            Affiliate Disclosure:
          </p>
          <p className="leading-relaxed">
            Some links on Nitya Yantra are affiliate links. If you purchase through one of these links, we may earn a commission at no additional cost to you.
          </p>
          <p className="text-[11px] text-slate-400">
            Prices, discounts, availability, ratings and reviews may change on the respective marketplace.
          </p>
          <p className="text-[11px] text-slate-400 pt-2">
            © 2026 Nitya Yantra. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
