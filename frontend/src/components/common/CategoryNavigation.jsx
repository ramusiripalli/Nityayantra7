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

  // Intelligent scroll position detector
  const checkScrollPosition = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    // Initial check after DOM render
    const timer = setTimeout(checkScrollPosition, 100);
    window.addEventListener('resize', checkScrollPosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [checkScrollPosition]);

  // Smooth scroll handler for chevron buttons
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
    <div className="relative w-full bg-slate-50/90 border-t border-b border-slate-200/80 py-2 px-2 sm:px-4 min-h-[52px] flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto relative w-full flex items-center overflow-hidden">
        
        {/* Left Edge Fade & Floating Chevron Left Button */}
        {showLeftArrow && (
          <>
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-slate-50 via-slate-50/90 to-transparent pointer-events-none z-10" />
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Scroll categories left"
              className="absolute left-1 z-20 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs text-slate-700 hover:text-sky-600 border border-slate-200/90 shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Horizontally Scrollable Category List */}
        <div
          ref={scrollRef}
          onScroll={checkScrollPosition}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap w-full py-1.5 px-1 sm:px-2"
        >
          {CATEGORIES.map((cat) => {
            const IconComponent = Icons[cat.icon] || Icons.Tag;
            const isActive = currentCategory === cat.slug;
            const isDeal = cat.isSpecial;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors duration-200 border ${
                  isActive
                    ? isDeal 
                      ? 'bg-amber-500 text-white border-amber-500 font-bold shadow-2xs'
                      : 'bg-sky-600 text-white border-sky-600 font-bold shadow-2xs'
                    : isDeal
                    ? 'bg-white text-amber-700 border-amber-300 hover:bg-amber-50 hover:border-amber-500 shadow-2xs'
                    : 'bg-white text-slate-800 border-slate-200/90 hover:border-sky-500 hover:text-sky-600 hover:bg-sky-50/40 shadow-2xs'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${
                  isActive 
                    ? 'text-white' 
                    : isDeal 
                    ? 'text-amber-600' 
                    : 'text-slate-400 group-hover:text-sky-600 transition-colors'
                }`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Edge Fade & Floating Chevron Right Button */}
        {showRightArrow && (
          <>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 via-slate-50/90 to-transparent pointer-events-none z-10" />
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Scroll categories right"
              className="absolute right-1 z-20 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs text-slate-700 hover:text-sky-600 border border-slate-200/90 shadow-sm flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
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
