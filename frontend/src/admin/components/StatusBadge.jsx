import React from 'react';

export const StatusBadge = ({ isPublished, isFeatured, isTrending, isActive }) => {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {/* Published / Draft */}
      {isPublished !== undefined && (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
            isPublished
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}
        >
          {isPublished ? 'Published' : 'Draft'}
        </span>
      )}

      {/* Featured */}
      {isFeatured && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
          Featured
        </span>
      )}

      {/* Trending */}
      {isTrending && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          Trending
        </span>
      )}

      {/* Inactive Alert if applicable */}
      {isActive === false && (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          Inactive
        </span>
      )}
    </div>
  );
};

export default StatusBadge;
