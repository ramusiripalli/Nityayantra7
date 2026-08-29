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
      : 'all'
  );

  // Category Accent Colors & Light Tint Container Map matching reference screenshot
  const categoryColorStyles = {
    all: {
      activeBg: "bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xs",
      activeText: "text-blue-600 font-extrabold",
      inactiveBg: "bg-blue-50 text-blue-600 border border-blue-100",
      inactiveText: "text-slate-700 font-bold",
      iconColor: "text-blue-600",
    },
    kitchen: {
      activeBg: "bg-emerald-600 text-white shadow-xs",
      activeText: "text-emerald-700 font-extrabold",
      inactiveBg: "bg-emerald-50 text-emerald-600 border border-emerald-100/90",
      inactiveText: "text-slate-700 font-bold",
      iconColor: "text-emerald-600",
    },
    home: {
      activeBg: "bg-blue-600 text-white shadow-xs",
      activeText: "text-blue-700 font-extrabold",
      inactiveBg: "bg-blue-50 text-blue-600 border border-blue-100/90",
      inactiveText: "text-slate-700 font-bold",
      iconColor: "text-blue-600",
    },
    electronics: {
      activeBg: "bg-purple-600 text-white shadow-xs",
      activeText: "text-purple-700 font-extrabold",
      inactiveBg: "bg-purple-50 text-purple-600 border border-purple-100/90",
      inactiveText: "text-slate-700 font-bold",
      iconColor: "text-purple-600",
    },
    beauty: {
      activeBg: "bg-pink-600 text-white shadow-xs",
      activeText: "text-pink-700 font-extrabold",
      inactiveBg: "bg-pink-50 text-pink-600 border border-pink-100/90",
      inactiveText: "text-slate-700 font-bold",
      iconColor: "text-pink-600",
    },
    fashion: {
      activeBg: "bg-teal-600 text-white shadow-xs",
      activeText: "text-teal-700 font-extrabold",
      inactiveBg: "bg-teal-50 text-teal-600 border border-teal-100/90",
      inactiveText: "text-slate-700 font-bold",
      iconColor: "text-teal-600",
    },
    mobiles: {
      activeBg: "bg-blue-600 text-white shadow-xs",
      activeText: "text-blue-700 font-extrabold",
      inactiveBg: "bg-blue-50 text-blue-600 border border-blue-100/90",
      inactiveText: "text-slate-700 font-bold",
      iconColor: "text-blue-600",
    },
    toys: {
      activeBg: "bg-amber-500 text-white shadow-xs",
      activeText: "text-amber-600 font-extrabold",
      inactiveBg: "bg-amber-50 text-amber-500 border border-amber-100/90",
      inactiveText: "text-slate-700 font-bold",
      iconColor: "text-amber-500",
    },
    gadgets: {
      activeBg: "bg-indigo-600 text-white shadow-xs",
      activeText: "text-indigo-700 font-extrabold",
      inactiveBg: "bg-indigo-50 text-indigo-600 border border-indigo-100/90",
      inactiveText: "text-slate-700 font-bold",
      iconColor: "text-indigo-600",
    },
    deals: {
      activeBg: "bg-orange-600 text-white shadow-xs",
      activeText: "text-orange-600 font-extrabold",
      inactiveBg: "bg-orange-50 text-orange-600 border border-orange-200/90",
      inactiveText: "text-orange-600 font-extrabold",
      iconColor: "text-orange-600",
    },
  };

  // Intelligent scroll position detector for desktop
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
    <>
      {/* 1. DESKTOP & TABLET CATEGORY BAR (≥768px): HORIZONTAL SCROLL WITH ARROWS */}
      <div className="hidden md:flex relative w-full bg-white border-b border-slate-200/90 py-2.5 px-4 h-[50px] items-center shadow-2xs">
        <div className="max-w-7xl mx-auto relative w-full flex items-center overflow-hidden">
          
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

          <div
            ref={scrollRef}
            onScroll={checkScrollPosition}
            className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap w-full py-1 px-2"
          >
            {CATEGORIES.map((cat) => {
              const IconComponent = Icons[cat.icon] || Icons.Tag;
              const isActive = currentCategory === cat.slug;
              const isDeal = cat.isSpecial;
              const styles = categoryColorStyles[cat.slug] || categoryColorStyles.all;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat)}
                  className={`group flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all duration-200 h-[34px] border cursor-pointer ${
                    isActive
                      ? isDeal 
                        ? 'bg-amber-500 text-white border-amber-500 font-bold shadow-2xs'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                      : isDeal
                      ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 shadow-2xs'
                      : 'bg-white text-slate-800 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
                  }`}
                >
                  <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : styles.iconColor}`} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

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

      {/* 2. MOBILE CATEGORY GRID (<768px): EXACT 5-COLUMN x 2-ROW GRID (NO ARROWS, ALL VISIBLE) */}
      <div className="md:hidden w-full bg-white border-b border-slate-200/90 px-2 py-3">
        <div className="grid grid-cols-5 gap-y-3 gap-x-1 sm:gap-x-2 text-center">
          {CATEGORIES.map((cat) => {
            const IconComponent = Icons[cat.icon] || Icons.Tag;
            const isActive = currentCategory === cat.slug;
            const styles = categoryColorStyles[cat.slug] || categoryColorStyles.all;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className="flex flex-col items-center justify-center group cursor-pointer w-full focus:outline-none"
                aria-label={`Category ${cat.name}`}
              >
                {/* Circular/Rounded Icon Background Box */}
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center mb-1 transition-all duration-200 ${
                    isActive ? styles.activeBg : styles.inactiveBg
                  }`}
                >
                  <IconComponent className={`w-5 h-5 ${isActive ? 'text-white' : styles.iconColor}`} />
                </div>

                {/* Category Name Label */}
                <span
                  className={`text-[10px] sm:text-[11px] leading-tight text-center truncate w-full ${
                    isActive ? styles.activeText : styles.inactiveText
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CategoryNavigation;
