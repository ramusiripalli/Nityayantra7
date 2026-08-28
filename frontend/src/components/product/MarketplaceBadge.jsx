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
    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${mp.badgeBg} ${mp.badgeText} ${mp.borderColor}`}>
      {isLowest && (
        <span className="bg-emerald-600 text-white font-extrabold text-[9px] px-1 py-0.2 rounded uppercase">
          Best Price
        </span>
      )}
      <span>{mp.name}</span>
      {price && <span>₹{price.toLocaleString('en-IN')}</span>}
    </span>
  );
};

export default MarketplaceBadge;
