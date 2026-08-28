import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export const CategoryNavigation = ({ activeCategory, onSelectCategory }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine current active category from props or URL pathname
  const currentCategory = activeCategory || (
    location.pathname.startsWith('/category/') 
      ? location.pathname.split('/category/')[1] 
      : 'all'
  );

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
    <div className="w-full bg-white border-b border-slate-200/80 shadow-xs py-2.5 px-4 sticky top-16 z-30">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        {CATEGORIES.map((cat) => {
          const IconComponent = Icons[cat.icon] || Icons.Tag;
          const isActive = currentCategory === cat.slug;
          const isDeal = cat.isSpecial;

          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border shrink-0 ${
                isActive
                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                  : isDeal
                  ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100 animate-pulse'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <IconComponent className={`w-3.5 h-3.5 ${isActive ? 'text-white' : isDeal ? 'text-amber-600' : 'text-slate-500'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNavigation;
