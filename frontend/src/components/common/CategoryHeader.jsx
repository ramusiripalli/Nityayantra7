import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import * as Icons from 'lucide-react';

export const CategoryHeader = ({ title, slug, iconName, productCount }) => {
  const IconComponent = iconName && Icons[iconName] ? Icons[iconName] : null;

  return (
    <div className="flex items-center justify-between mb-3.5 px-0.5">
      <div className="flex items-center gap-2.5">
        {IconComponent && (
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200/80 shadow-2xs">
            <IconComponent className="w-4 h-4 text-sky-600" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-none">
              {title}
            </h2>
            {productCount !== undefined && (
              <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {productCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {slug && slug !== 'all' && (
        <Link
          to={`/category/${slug}`}
          className="group inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-sky-600 hover:text-sky-700 transition-colors"
        >
          <span>See All</span>
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
};

export default CategoryHeader;
