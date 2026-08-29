import React from 'react';
import { CATEGORIES } from '../../data/categories';
import { Filter, X, RotateCcw, Check, Star, PlayCircle, CheckCircle } from 'lucide-react';

export const MobileFilterSheet = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFilterChange, 
  onClearAll 
}) => {
  if (!isOpen) return null;

  const marketplacesList = [
    { id: 'amazon', name: 'Amazon', color: 'text-amber-700' },
    { id: 'flipkart', name: 'Flipkart', color: 'text-blue-700' },
    { id: 'meesho', name: 'Meesho', color: 'text-purple-700' },
    { id: 'myntra', name: 'Myntra', color: 'text-pink-700' },
  ];

  const pricePresets = [
    { id: 'under_500', label: 'Under ₹500' },
    { id: '500_1000', label: '₹500 – ₹1,000' },
    { id: '1000_5000', label: '₹1,000 – ₹5,000' },
    { id: '5000_10000', label: '₹5,000 – ₹10,000' },
    { id: 'above_10000', label: '₹10,000+' },
  ];

  const toggleMarketplace = (mpId) => {
    const current = filters.marketplaces || [];
    let updated;
    if (current.includes(mpId)) {
      updated = current.filter((m) => m !== mpId);
    } else {
      updated = [...current, mpId];
    }
    onFilterChange({ marketplaces: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-xs animate-fadeIn lg:hidden">
      <div className="w-full bg-white rounded-t-3xl p-5 space-y-5 max-h-[85vh] overflow-y-auto shadow-2xl animate-slideUp text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 font-black text-slate-900 text-base">
            <Filter className="w-4.5 h-4.5 text-sky-600" />
            <span>Filter Products</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 cursor-pointer"
            aria-label="Close filter sheet"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. CATEGORY */}
        <div className="space-y-2">
          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Category
          </span>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => {
              const isActive = (filters.category || 'all') === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onFilterChange({ category: cat.slug })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'bg-sky-600 text-white font-bold shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. PRICE RANGE PRESETS */}
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Price Range
          </span>
          <div className="flex flex-wrap gap-1.5">
            {pricePresets.map((preset) => {
              const isSelected = filters.pricePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() =>
                    onFilterChange({
                      pricePreset: isSelected ? '' : preset.id,
                      minPrice: '',
                      maxPrice: '',
                    })
                  }
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-600 text-white font-bold shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. RATING */}
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Minimum Rating
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { value: '4', label: '4★ & above' },
              { value: '3', label: '3★ & above' },
              { value: '2', label: '2★ & above' },
            ].map((r) => {
              const isSelected = filters.minRating === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => onFilterChange({ minRating: isSelected ? '' : r.value })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-white font-bold shadow-2xs'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  ⭐ {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. MARKETPLACE */}
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Marketplace
          </span>
          <div className="grid grid-cols-2 gap-2">
            {marketplacesList.map((mp) => {
              const isChecked = (filters.marketplaces || []).includes(mp.id);
              return (
                <label
                  key={mp.id}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${
                    isChecked ? 'bg-sky-50 border-sky-300' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleMarketplace(mp.id)}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                  />
                  <span className={`text-xs font-bold ${mp.color}`}>{mp.name}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 5. DISCOUNT */}
        <div className="space-y-2 pt-3 border-t border-slate-100">
          <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Minimum Discount
          </span>
          <div className="flex flex-wrap gap-1.5">
            {['10', '20', '30', '50'].map((d) => {
              const isSelected = filters.minDiscount === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => onFilterChange({ minDiscount: isSelected ? '' : d })}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {d}% Off or more
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. SPECIAL TOGGLES */}
        <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
          <label className="flex items-center gap-2 cursor-pointer p-2 bg-slate-50 border border-slate-200 rounded-xl">
            <input
              type="checkbox"
              checked={Boolean(filters.hasVideoReview)}
              onChange={(e) => onFilterChange({ hasVideoReview: e.target.checked })}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
            />
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <PlayCircle className="w-4 h-4 text-red-500" />
              <span>Products with video reviews only</span>
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer p-2 bg-slate-50 border border-slate-200 rounded-xl">
            <input
              type="checkbox"
              checked={Boolean(filters.inStockOnly)}
              onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
            />
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>In stock items only</span>
            </span>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClearAll}
            className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-200 cursor-pointer transition-colors"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-sky-600 text-white font-bold text-xs rounded-xl shadow-md hover:bg-sky-700 cursor-pointer transition-colors"
          >
            Apply Filters
          </button>
        </div>

      </div>
    </div>
  );
};

export default MobileFilterSheet;
