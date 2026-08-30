import React from 'react';
import { Sparkles, Info } from 'lucide-react';

export const MarketplaceDisclosureBanner = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl p-3 sm:px-5 sm:py-2.5 border border-slate-200 shadow-2xs space-y-1.5 ${className}`}>
      {/* Primary Line: Main Message + Marketplace Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
        
        {/* Left: Primary Message */}
        <div className="flex items-start sm:items-center gap-2 min-w-0">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-100/90 text-sky-800 font-black text-[10.5px] shrink-0 mt-0.5 sm:mt-0">
            <Sparkles className="w-3 h-3 text-sky-600" />
            <span>Discover</span>
          </span>
          <p className="text-slate-900 font-bold text-xs sm:text-[13px] leading-snug">
            Compare verified prices &amp; buy directly from trusted stores • <span className="text-slate-800 font-extrabold">Same price as the marketplace</span>
          </p>
        </div>

        {/* Right: Recognizable Marketplace Badges */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-amber-200/90 bg-amber-50 text-amber-950 font-bold text-xs shadow-2xs">
            <span className="text-[11px]">🟠</span>
            <span>Amazon</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-yellow-300/90 bg-yellow-50 text-yellow-950 font-bold text-xs shadow-2xs">
            <span className="text-[11px]">🟡</span>
            <span>Flipkart</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-purple-200/90 bg-purple-50 text-purple-950 font-bold text-xs shadow-2xs">
            <span className="text-[11px]">🟣</span>
            <span>Meesho</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-pink-200/90 bg-pink-50 text-pink-950 font-bold text-xs shadow-2xs">
            <span className="text-[11px]">🩷</span>
            <span>Myntra</span>
          </span>
        </div>

      </div>

      {/* Secondary Line: Transparent Disclaimer */}
      <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 text-[11px] text-slate-500 font-medium leading-relaxed">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <p>
          Prices shown are based on the latest available marketplace listings and may change. You’ll be redirected directly to the marketplace to complete your purchase.
        </p>
      </div>
    </div>
  );
};

export default MarketplaceDisclosureBanner;
