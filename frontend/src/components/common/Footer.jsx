import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { categoryService } from '../../services/categoryService';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

// Supported Marketplace Badges (Simple text + subtle dots)
const SUPPORTED_MARKETPLACES = [
  { name: 'Amazon', dot: '🟠', bg: 'bg-amber-50 text-amber-950 border-amber-200/90' },
  { name: 'Flipkart', dot: '🟡', bg: 'bg-yellow-50 text-yellow-950 border-yellow-300/90' },
  { name: 'Meesho', dot: '🟣', bg: 'bg-purple-50 text-purple-950 border-purple-200/90' },
  { name: 'Myntra', dot: '🩷', bg: 'bg-pink-50 text-pink-950 border-pink-200/90' },
];

export const Footer = () => {
  const [categories, setCategories] = useState([]);

  // Fetch real categories from MongoDB (zero hardcoded dummy categories)
  useEffect(() => {
    let isMounted = true;
    categoryService.getCategories()
      .then((data) => {
        if (isMounted && Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => {
        console.error('Failed to load footer categories:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-700 pt-10 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* 1. TOP CALL-TO-ACTION CARD */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px] mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Smart Curation</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Found something useful?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Discover more products selected for everyday life across your favorite stores.
            </p>
          </div>

          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xs hover:shadow-md transition-all shrink-0"
          >
            <span>Explore Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 2. MAIN FOOTER CONTENT GRID (Desktop: 4 columns, Tablet: 2 columns, Mobile: 1 column) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Column 1: Brand & Trust Highlight */}
          <div className="space-y-4 lg:col-span-1">
            <Logo size="medium" showTagline={true} variant="dark" />
            
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Discover useful products, compare prices and find trusted places to buy.
            </p>

            {/* Small Visually Attractive Trust Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 space-y-2.5 shadow-2xs">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Shop directly from trusted marketplaces</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                We help you discover products in one place. When you choose a marketplace, you'll be taken directly to that store.
              </p>
              <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10.5px] font-bold text-slate-700">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Direct store links</span>
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Curated products</span>
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>Simple pricing</span>
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>No extra cost</span>
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Nitya Yantra Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200/80 pb-2">
              Nitya Yantra
            </h3>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              <li>
                <Link to="/" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span>All Products</span>
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span>Trending Deals</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories (Dynamic from MongoDB, zero dummy data) */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200/80 pb-2">
              Categories
            </h3>
            {categories.length > 0 ? (
              <ul className="space-y-2 text-xs font-semibold text-slate-600">
                {categories.map((cat) => (
                  <li key={cat._id || cat.id || cat.slug}>
                    <Link
                      to={`/category/${cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
                    >
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                      <span>{cat.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">Categories will appear here.</p>
            )}
          </div>

          {/* Column 4: Help & Information (All clean, working routes) */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200/80 pb-2">
              Help & Information
            </h3>
            <ul className="space-y-2 text-xs font-semibold text-slate-600">
              <li>
                <Link to="/about" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span>About Nitya Yantra</span>
                </Link>
              </li>
              <li>
                <Link to="/affiliate-disclosure" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span>Affiliate Disclosure</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span>Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* 3. WHERE YOU CAN SHOP (Supported Marketplaces Bar) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs text-center sm:text-left">
          <div className="space-y-0.5">
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 block">
              Where you can shop
            </span>
            <p className="text-[11px] text-slate-500">
              Purchase directly from the marketplace. Marketplace links may include affiliate links.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {SUPPORTED_MARKETPLACES.map((m) => (
              <span
                key={m.name}
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${m.bg}`}
              >
                <span className="text-xs">{m.dot}</span>
                <span>{m.name}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 4. AFFILIATE DISCLOSURE & AMAZON DISCLOSURE (Transparent, readable card) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 space-y-2.5 shadow-2xs text-xs text-slate-600 leading-relaxed">
          <h3 className="font-black uppercase tracking-wider text-slate-900 text-[11px] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Affiliate Disclosure</span>
          </h3>
          <p>
            Nitya Yantra is a product discovery and affiliate website. Some links on this website are affiliate links, which means we may earn a commission if you make a qualifying purchase through those links, at no additional cost to you.
          </p>
          <p className="font-bold text-slate-800 bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
            "As an Amazon Associate I earn from qualifying purchases."
          </p>
          <p className="text-[11px] text-slate-500">
            Prices, availability, offers and product information may change on the marketplace websites. Please check the final price and product details on the marketplace before purchasing.
          </p>
        </div>

        {/* 5. BOTTOM BAR & COPYRIGHT */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-200/80 text-xs text-slate-500 font-medium text-center sm:text-left">
          <p>© {new Date().getFullYear()} Nitya Yantra. All rights reserved.</p>
          <p className="text-slate-400">Made for smarter product discovery.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
