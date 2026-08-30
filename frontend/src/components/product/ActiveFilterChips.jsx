import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export const ActiveFilterChips = ({ filters, onFilterChange, onClearAll, className = '' }) => {
  const chips = [];

  // Category chip
  if (filters.category && filters.category !== 'all') {
    const catObj = CATEGORIES.find((c) => c.slug === filters.category);
    const catLabel = catObj ? catObj.name : filters.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    chips.push({
      id: 'category',
      label: `Category: ${catLabel}`,
      onRemove: () => onFilterChange({ category: 'all' }),
    });
  }

  // Price chip
  if (filters.pricePreset) {
    const labelMap = {
      under_500: 'Under ₹500',
      '500_1000': '₹500 - ₹1,000',
      '1000_5000': '₹1,000 - ₹5,000',
      '5000_10000': '₹5,000 - ₹10,000',
      above_10000: 'Above ₹10,000',
    };
    chips.push({
      id: 'pricePreset',
      label: labelMap[filters.pricePreset] || filters.pricePreset,
      onRemove: () => onFilterChange({ pricePreset: '', minPrice: '', maxPrice: '' }),
    });
  } else if (filters.minPrice || filters.maxPrice) {
    const minText = filters.minPrice ? `₹${filters.minPrice}` : '₹0';
    const maxText = filters.maxPrice ? `₹${filters.maxPrice}` : 'Any';
    chips.push({
      id: 'customPrice',
      label: `${minText} - ${maxText}`,
      onRemove: () => onFilterChange({ minPrice: '', maxPrice: '' }),
    });
  }

  // Rating chip
  if (filters.minRating) {
    chips.push({
      id: 'rating',
      label: `${filters.minRating}★ & above`,
      onRemove: () => onFilterChange({ minRating: '' }),
    });
  }

  // Marketplace chips
  if (filters.marketplaces && filters.marketplaces.length > 0) {
    filters.marketplaces.forEach((mp) => {
      chips.push({
        id: `mp_${mp}`,
        label: mp.charAt(0).toUpperCase() + mp.slice(1),
        onRemove: () =>
          onFilterChange({
            marketplaces: filters.marketplaces.filter((m) => m !== mp),
          }),
      });
    });
  }

  // Discount chip
  if (filters.minDiscount) {
    chips.push({
      id: 'discount',
      label: `${filters.minDiscount}%+ OFF`,
      onRemove: () => onFilterChange({ minDiscount: '' }),
    });
  }

  // Video Review chip
  if (filters.hasVideoReview) {
    chips.push({
      id: 'video',
      label: 'Video Reviews',
      onRemove: () => onFilterChange({ hasVideoReview: false }),
    });
  }

  // In Stock chip
  if (filters.inStockOnly) {
    chips.push({
      id: 'stock',
      label: 'In Stock',
      onRemove: () => onFilterChange({ inStockOnly: false }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className={`flex items-center gap-2 flex-wrap py-2 px-0.5 overflow-x-auto no-scrollbar ${className}`}>
      <span className="text-xs font-bold text-slate-500 shrink-0">Active Filters:</span>
      
      {chips.map((chip) => (
        <span
          key={chip.id}
          className="inline-flex items-center gap-1 bg-sky-50 text-sky-800 border border-sky-200 text-xs font-bold px-2.5 py-1 rounded-full shadow-2xs shrink-0"
        >
          <span>{chip.label}</span>
          <button
            type="button"
            onClick={chip.onRemove}
            className="p-0.5 hover:bg-sky-200 text-sky-700 hover:text-sky-900 rounded-full transition-colors cursor-pointer"
            aria-label={`Remove ${chip.label} filter`}
          >
            <X className="w-3 h-3 stroke-[2.5]" />
          </button>
        </span>
      ))}

      <button
        type="button"
        onClick={onClearAll}
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-sky-600 underline ml-1 cursor-pointer shrink-0"
      >
        <RotateCcw className="w-3 h-3" />
        <span>Clear All</span>
      </button>
    </div>
  );
};

export default ActiveFilterChips;
