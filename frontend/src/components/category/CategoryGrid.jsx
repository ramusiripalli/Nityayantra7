import React from 'react';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

export const CategoryGrid = () => {
  // Filter out 'all' and 'deals' to display core product categories
  const mainCategories = CATEGORIES.filter(
    (c) => c.slug !== 'all' && c.slug !== 'deals'
  );

  // Category image backgrounds matching real gadgets
  const categoryImages = {
    kitchen: "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=400&q=80",
    home: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&w=400&q=80",
    electronics: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80",
    beauty: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80",
    fashion: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80",
    mobiles: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
    toys: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=400&q=80",
    gadgets: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=400&q=80"
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {mainCategories.map((cat) => {
        const IconComponent = Icons[cat.icon] || Icons.Tag;
        const bgImg = categoryImages[cat.slug] || categoryImages.gadgets;

        return (
          <Link
            key={cat.id}
            to={`/category/${cat.slug}`}
            className="group relative flex flex-col items-center justify-between p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-card hover:-translate-y-1 transition-all duration-300 overflow-hidden text-center"
          >
            {/* Background Accent Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent z-10 opacity-80 group-hover:opacity-90 transition-opacity" />

            {/* Category Visual Image */}
            <img
              src={bgImg}
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />

            {/* Top Icon Badge */}
            <div className="relative z-20 self-start p-2 rounded-xl bg-white/90 backdrop-blur-md text-sky-600 shadow-2xs group-hover:bg-sky-600 group-hover:text-white transition-colors duration-300">
              <IconComponent className="w-4 h-4" />
            </div>

            {/* Bottom Title & Explorer text */}
            <div className="relative z-20 mt-12 text-left w-full">
              <h3 className="text-base font-extrabold text-white tracking-tight leading-tight">
                {cat.name}
              </h3>
              <span className="text-[11px] font-semibold text-slate-200 opacity-90 group-hover:text-sky-300 transition-colors">
                Explore Products →
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default CategoryGrid;
