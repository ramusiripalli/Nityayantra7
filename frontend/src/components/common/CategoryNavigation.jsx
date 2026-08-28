import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export const CategoryNavigation = ({ activeCategory, onSelectCategory }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef(null);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Determine active category slug from props or URL pathname
  const currentCategory = activeCategory || (
    location.pathname.startsWith('/category/') 
      ? location.pathname.split('/category/')[1] 
      : location.pathname === '/products'
      ? 'all'
      : ''
  );

  // Category Icon Accents Color Map matching reference screenshot
  const categoryIconColors = {
    all: "text-white",
    kitchen: "text-emerald-600",
    home: "text-blue-600",
    electronics: "text-purple-600",
    beauty: "text-pink-600",
    fashion: "text-teal-600",
    mobiles: "text-blue-600",
    toys: "text-amber-500",
    gadgets: "text-indigo-600",
    deals: "text-amber-600",
  };

  // Intelligent scroll position detector
  const checkScrollPosition = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    const timer = setTimeout(checkScrollPosition, 100);
    window.addEventListener('resize', checkScrollPosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [checkScrollPosition]);

  const handleScroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -200 : 200;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const handleCategoryClick = (category) => {
    if (onSelectCategory) {
      onSelectCategory(category.slug);
    } else {
      if (category.slug === 'all') {
        navigate('/products');
      } else {
        navigate(`/category/${category.slug}`);
      }
    }
  };

  return (
    <div className="relative w-full bg-white border-b border-slate-200/90 py-2.5 px-2 sm:px-4 h-[50px] flex items-center shadow-2xs">
      <div className="max-w-7xl mx-auto relative w-full flex items-center overflow-hidden">
        
        {/* Left Edge Fade & Floating Chevron Left Button */}
        {showLeftArrow && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none z-10" />
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Scroll categories left"
              className="absolute left-1 z-20 w-7 h-7 rounded-full bg-white text-slate-700 hover:text-sky-600 border border-slate-200 shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Horizontally Scrollable Category List (Uniform Chip Sizing) */}
        <div
          ref={scrollRef}
          onScroll={checkScrollPosition}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap w-full py-1 px-1 sm:px-2"
        >
          {CATEGORIES.map((cat) => {
            const IconComponent = Icons[cat.icon] || Icons.Tag;
            const isActive = currentCategory === cat.slug;
            const isDeal = cat.isSpecial;
            const iconColor = categoryIconColors[cat.slug] || "text-slate-500";

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className={`group flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all duration-200 h-[34px] border ${
                  isActive
                    ? isDeal 
                      ? 'bg-amber-500 text-white border-amber-500 font-bold shadow-2xs'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                    : isDeal
                    ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 shadow-2xs'
                    : 'bg-white text-slate-800 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : iconColor}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Edge Fade & Floating Chevron Right Button */}
        {showRightArrow && (
          <>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/90 to-transparent pointer-events-none z-10" />
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Scroll categories right"
              className="absolute right-1 z-20 w-7 h-7 rounded-full bg-white text-slate-700 hover:text-sky-600 border border-slate-200 shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default CategoryNavigation;
