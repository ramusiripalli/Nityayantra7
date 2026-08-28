import React from 'react';
import { MARKETPLACES } from '../../utils/constants';

export const MarketplaceBadge = ({ marketplaceId, price, isLowest = false }) => {
  const mp = MARKETPLACES[marketplaceId?.toLowerCase()] || {
    name: marketplaceId,
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-800',
    borderColor: 'border-slate-200'
  };

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${mp.badgeBg} ${mp.badgeText} ${mp.borderColor}`}>
      {isLowest && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />}
      <span>{mp.name}</span>
      {price && <span>₹{price.toLocaleString('en-IN')}</span>}
    </span>
  );
};

export default MarketplaceBadge;
