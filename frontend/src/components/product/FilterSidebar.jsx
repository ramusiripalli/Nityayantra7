import React, { useState } from 'react';
import { CATEGORIES } from '../../data/categories';
import { Filter, RotateCcw, ChevronDown, Check, Star, PlayCircle, CheckCircle } from 'lucide-react';

export const FilterSidebar = ({ filters, onFilterChange, onClearAll, className = '' }) => {
  const [customMin, setCustomMin] = useState(filters.minPrice || '');
  const [customMax, setCustomMax] = useState(filters.maxPrice || '');

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

  const handlePresetClick = (presetId) => {
    if (filters.pricePreset === presetId) {
      onFilterChange({ pricePreset: '', minPrice: '', maxPrice: '' });
      setCustomMin('');
      setCustomMax('');
    } else {
      onFilterChange({ pricePreset: presetId, minPrice: '', maxPrice: '' });
    }
  };

  const handleCustomPriceApply = (e) => {
    e.preventDefault();
    onFilterChange({
      pricePreset: '',
      minPrice: customMin,
      maxPrice: customMax,
    });
  };

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
    <aside className={`w-[230px] shrink-0 bg-white rounded-2xl border border-slate-200/90 p-4 space-y-5 shadow-2xs text-left ${className}`}>
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
          <Filter className="w-4 h-4 text-sky-600" />
          <span>FILTERS</span>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:text-sky-800 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* 1. CATEGORIES */}
      <div className="space-y-2">
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
          Category
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar pr-1">
          {CATEGORIES.map((cat) => {
            const isActive = (filters.category || 'all') === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onFilterChange({ category: cat.slug })}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{cat.name}</span>
                {isActive && <Check className="w-3.5 h-3.5 text-sky-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. PRICE PRESETS & CUSTOM RANGE */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
          Price Range
        </h4>
        <div className="space-y-1">
          {pricePresets.map((preset) => {
            const isSelected = filters.pricePreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetClick(preset.id)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{preset.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-sky-600" />}
              </button>
            );
          })}
        </div>

        {/* Custom Min/Max Input Form */}
        <form onSubmit={handleCustomPriceApply} className="pt-1.5 space-y-2">
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              placeholder="Min ₹"
              value={customMin}
              onChange={(e) => setCustomMin(e.target.value)}
              className="w-1/2 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-sky-500 font-medium"
            />
            <span className="text-slate-400 text-xs">-</span>
            <input
              type="number"
              placeholder="Max ₹"
              value={customMax}
              onChange={(e) => setCustomMax(e.target.value)}
              className="w-1/2 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-sky-500 font-medium"
            />
          </div>
          <button
            type="submit"
            className="w-full py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            Apply Range
          </button>
        </form>
      </div>

      {/* 3. RATING */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
          Minimum Rating
        </h4>
        <div className="space-y-1">
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
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-amber-50 text-amber-900 font-bold border border-amber-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  <span>{r.label}</span>
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. MARKETPLACE */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
          Marketplace
        </h4>
        <div className="space-y-1.5">
          {marketplacesList.map((mp) => {
            const isChecked = (filters.marketplaces || []).includes(mp.id);
            return (
              <label key={mp.id} className="flex items-center gap-2 px-1 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleMarketplace(mp.id)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <span className={`font-bold ${mp.color}`}>{mp.name}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 5. DISCOUNT */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
          Discount
        </h4>
        <div className="space-y-1">
          {['10', '20', '30', '50'].map((d) => {
            const isSelected = filters.minDiscount === d;
            return (
              <button
                key={d}
                type="button"
                onClick={() => onFilterChange({ minDiscount: isSelected ? '' : d })}
                className={`w-full flex items-center justify-between px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{d}% Off or more</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. SPECIAL TOGGLES (Video Reviews & In Stock) */}
      <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(filters.hasVideoReview)}
            onChange={(e) => onFilterChange({ hasVideoReview: e.target.checked })}
            className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
          />
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <PlayCircle className="w-3.5 h-3.5 text-red-500" />
            <span>Video reviews only</span>
          </span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={Boolean(filters.inStockOnly)}
            onChange={(e) => onFilterChange({ inStockOnly: e.target.checked })}
            className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
          />
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>In stock only</span>
          </span>
        </label>
      </div>

    </aside>
  );
};

export default FilterSidebar;
