import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 0, reviewCount, size = "small" }) => {
  const starSizes = {
    small: "w-3.5 h-3.5",
    medium: "w-4 h-4",
    large: "w-5 h-5",
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-xs font-bold">
        <span>{rating}</span>
        <Star className={`${starSizes[size]} fill-amber-400 text-amber-500`} />
      </div>
      {reviewCount !== undefined && (
        <span className="text-[11px] text-slate-500 font-medium">
          ({reviewCount.toLocaleString('en-IN')})
        </span>
      )}
    </div>
  );
};

export default RatingStars;
