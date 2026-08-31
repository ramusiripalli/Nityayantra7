import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChefHat, 
  Utensils, 
  Tag, 
  Zap, 
  Home as HomeIcon, 
  Sparkles, 
  Smartphone, 
  Gamepad2, 
  ShoppingBag, 
  Flame, 
  LayoutGrid
} from 'lucide-react';
import { categoryService } from '../../services/categoryService';

// Icon Map with fallback to Tag
const Icons = {
  ChefHat,
  Utensils,
  Tag,
  Zap,
  Home: HomeIcon,
  Sparkles,
  Smartphone,
  Gamepad2,
  ShoppingBag,
  Flame,
  LayoutGrid
};

export const CategoryNavigation = ({ onSelectCategory }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollRef = useRef(null);

  const [categories, setCategories] = useState([
    { id: 'all', name: 'All Categories', slug: 'all', icon: 'LayoutGrid' }
  ]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  // Load real active categories from MongoDB
  useEffect(() => {
    categoryService.getCategories().then((cats) => {
      if (Array.isArray(cats) && cats.length > 0) {
        const formatted = cats.map((c) => ({
          id: c._id || c.id || c.slug,
          name: c.name,
          slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
          icon: c.icon || 'Tag'
        }));
        setCategories([
          { id: 'all', name: 'All', slug: 'all', icon: 'LayoutGrid' },
          ...formatted
        ]);
      }
    });
  }, []);

  // Determine current active category from path
  const currentCategory = React.useMemo(() => {
    const path = location.pathname;
    if (path === '/products') {
      return 'all';
    }
    if (path.startsWith('/category/')) {
      return path.replace('/category/', '');
    }
    const segments = path.replace(/^\//, '').split('/');
    return segments[0] || '';
  }, [location.pathname]);

  // Check scroll position to display navigation arrows
  const checkScrollPosition = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setShowLeftArrow(scrollLeft > 5);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
  }, []);

  useEffect(() => {
    const timer = setTimeout(checkScrollPosition, 100);
    window.addEventListener('resize', checkScrollPosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [checkScrollPosition, categories]);

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
        navigate(`/${category.slug}`);
      }
    }
  };

  return (
    <div className="relative w-full bg-white border-b border-slate-200/90 py-1.5 px-2 sm:px-4 h-[44px] sm:h-[48px] flex items-center shadow-2xs overflow-hidden">
      <div className="max-w-7xl mx-auto relative w-full flex items-center overflow-hidden">
        
        {/* Left Arrow (Desktop/Tablet) */}
        {showLeftArrow && (
          <>
            <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white via-white/90 to-transparent pointer-events-none z-10" />
            <button
              type="button"
              onClick={() => handleScroll('left')}
              aria-label="Scroll categories left"
              className="hidden sm:flex absolute left-1 z-20 w-7 h-7 rounded-full bg-white text-slate-700 hover:text-sky-600 border border-slate-200 shadow-sm items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Scrollable Category Pill Container (Self-contained horizontal scroll with zero whole-page overflow) */}
        <div
          ref={scrollRef}
          onScroll={checkScrollPosition}
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap w-full py-1 px-1"
        >
          {categories.map((cat) => {
            const IconComponent = Icons[cat.icon] || Icons.Tag;
            const isActive = currentCategory === cat.slug;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className={`group flex items-center gap-1.5 px-3 sm:px-3.5 py-1 rounded-full text-xs font-semibold shrink-0 transition-all duration-200 h-[30px] sm:h-[32px] border cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80 hover:border-slate-300'
                }`}
              >
                <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Arrow (Desktop/Tablet) */}
        {showRightArrow && (
          <>
            <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/90 to-transparent pointer-events-none z-10" />
            <button
              type="button"
              onClick={() => handleScroll('right')}
              aria-label="Scroll categories right"
              className="hidden sm:flex absolute right-1 z-20 w-7 h-7 rounded-full bg-white text-slate-700 hover:text-sky-600 border border-slate-200 shadow-sm items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
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
