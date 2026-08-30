import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { AFFILIATE_DISCLOSURE_TEXT, MARKETPLACES } from '../../utils/constants';
import { ShieldCheck, Youtube, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Logo size="medium" showTagline={true} className="brightness-110" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Nitya Yantra is India's premier product discovery and video review platform for everyday gadgets, kitchen tools, and smart home tech.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Unbiased Editorial Reviews</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3.5">
              Product Categories
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/category/kitchen" className="hover:text-sky-400 transition-colors">Kitchen Smart Gadgets</Link></li>
              <li><Link to="/category/electronics" className="hover:text-sky-400 transition-colors">Electronics & Audio</Link></li>
              <li><Link to="/category/home" className="hover:text-sky-400 transition-colors">Home & Living Appliances</Link></li>
              <li><Link to="/category/mobiles" className="hover:text-sky-400 transition-colors">Smartphones & Accessories</Link></li>
              <li><Link to="/category/deals" className="hover:text-amber-400 transition-colors">Top Trending Deals</Link></li>
            </ul>
          </div>

          {/* Supported Marketplaces */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3.5">
              Marketplace Partners
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Compare prices across India's top marketplaces:
            </p>
            <div className="flex flex-wrap gap-2">
              {Object.values(MARKETPLACES).map((mp) => (
                <span 
                  key={mp.id}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 bg-slate-800 text-slate-200 rounded border border-slate-700"
                >
                  <span>{mp.name}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Platform Information */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 mb-3.5">
              About Nitya Yantra
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/products" className="hover:text-sky-400 transition-colors">All Products Listing</Link></li>
              <li><span className="text-slate-500 cursor-not-allowed">Editorial Review Guidelines</span></li>
              <li><span className="text-slate-500 cursor-not-allowed">Privacy Policy</span></li>
              <li><span className="text-slate-500 cursor-not-allowed">Terms of Service</span></li>
            </ul>
          </div>

        </div>

        {/* Affiliate Disclosure Box */}
        <div className="my-6 p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-400 leading-relaxed">
          <span className="font-bold text-slate-300 block mb-1">Disclaimer & Affiliate Disclosure:</span>
          {AFFILIATE_DISCLOSURE_TEXT}
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-2">
          <p>© {new Date().getFullYear()} Nitya Yantra. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Designed with modern Light-First UI</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
