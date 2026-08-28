import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const SectionHeader = ({ 
  title, 
  subtitle, 
  badge, 
  viewAllLink, 
  viewAllText = "View All", 
  className = "" 
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2 ${className}`}>
      <div>
        {badge && (
          <span className="inline-block px-2.5 py-0.5 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200 rounded-full">
            {badge}
          </span>
        )}
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {viewAllLink && (
        <Link
          to={viewAllLink}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-sky-600 hover:text-sky-700 group transition-colors self-start sm:self-auto mt-2 sm:mt-0"
        >
          <span>{viewAllText}</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  );
};

export default SectionHeader;
