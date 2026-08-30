import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-8 pb-6 border-t border-slate-800 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Brand & Mission Line */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800 text-center sm:text-left">
          <div className="space-y-1">
            <Logo size="medium" showTagline={true} className="brightness-110 justify-center sm:justify-start" />
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg w-fit mx-auto sm:mx-0">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Direct Trusted Marketplace Links</span>
          </div>
        </div>

        {/* Affiliate & Pricing Disclosure */}
        <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-center space-y-1">
          <p className="text-xs text-slate-400 leading-relaxed">
            Prices and availability may change on marketplace websites.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Some links may be affiliate links and we may earn a commission at no extra cost to you.
          </p>
        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-1">
          <p>© {new Date().getFullYear()} Nitya Yantra. All rights reserved.</p>
          <p className="mt-1 sm:mt-0">Discover products and buy directly on India's top marketplaces.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
