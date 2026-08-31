import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
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
  BookOpen,
  Dumbbell
} from 'lucide-react';

const ICON_CONFIG = {
  Utensils: { icon: Utensils, bg: 'bg-amber-50 text-amber-600 border-amber-200/80', gradient: 'from-amber-500/10 to-orange-500/5' },
  ChefHat: { icon: ChefHat, bg: 'bg-orange-50 text-orange-600 border-orange-200/80', gradient: 'from-orange-500/10 to-amber-500/5' },
  Home: { icon: HomeIcon, bg: 'bg-emerald-50 text-emerald-600 border-emerald-200/80', gradient: 'from-emerald-500/10 to-teal-500/5' },
  Zap: { icon: Zap, bg: 'bg-blue-50 text-blue-600 border-blue-200/80', gradient: 'from-blue-500/10 to-indigo-500/5' },
  Sparkles: { icon: Sparkles, bg: 'bg-pink-50 text-pink-600 border-pink-200/80', gradient: 'from-pink-500/10 to-rose-500/5' },
  Smartphone: { icon: Smartphone, bg: 'bg-indigo-50 text-indigo-600 border-indigo-200/80', gradient: 'from-indigo-500/10 to-purple-500/5' },
  Gamepad2: { icon: Gamepad2, bg: 'bg-purple-50 text-purple-600 border-purple-200/80', gradient: 'from-purple-500/10 to-pink-500/5' },
  ShoppingBag: { icon: ShoppingBag, bg: 'bg-sky-50 text-sky-600 border-sky-200/80', gradient: 'from-sky-500/10 to-blue-500/5' },
  Flame: { icon: Flame, bg: 'bg-rose-50 text-rose-600 border-rose-200/80', gradient: 'from-rose-500/10 to-orange-500/5' },
  Tag: { icon: Tag, bg: 'bg-slate-50 text-slate-600 border-slate-200/80', gradient: 'from-slate-500/10 to-slate-500/5' },
  Dumbbell: { icon: Dumbbell, bg: 'bg-cyan-50 text-cyan-600 border-cyan-200/80', gradient: 'from-cyan-500/10 to-teal-500/5' },
  BookOpen: { icon: BookOpen, bg: 'bg-violet-50 text-violet-600 border-violet-200/80', gradient: 'from-violet-500/10 to-purple-500/5' },
};

export const CategoryCard = ({ category }) => {
  if (!category) return null;

  const {
    name,
    slug,
    icon = 'Tag',
    collectionCount = 0,
  } = category;

  const cleanSlug = slug || name.toLowerCase().replace(/\s+/g, '-');
  const publicUrl = `/${cleanSlug}`;

  const iconData = ICON_CONFIG[icon] || ICON_CONFIG.Tag;
  const IconComp = iconData.icon;

  return (
    <Link
      to={publicUrl}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-sky-300 hover:-translate-y-0.5 transition-all duration-300 text-left overflow-hidden p-2.5 sm:p-3"
    >
      {/* Square Icon Container with subtle pastel gradient */}
      <div className={`relative w-full aspect-square bg-gradient-to-br ${iconData.gradient} rounded-xl overflow-hidden mb-2 flex flex-col items-center justify-center border border-slate-100/90 group-hover:scale-102 transition-transform duration-300`}>
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${iconData.bg} border shadow-2xs flex items-center justify-center group-hover:scale-108 transition-all duration-300`}>
          <IconComp className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>

        {/* Collection Count Pill */}
        <span className="absolute top-1.5 right-1.5 inline-flex items-center text-[10px] sm:text-[10.5px] font-bold text-slate-700 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full border border-slate-200/80 shadow-2xs">
          {collectionCount} {collectionCount === 1 ? 'collection' : 'collections'}
        </span>
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-sky-600 transition-colors tracking-tight line-clamp-1">
            {name}
          </h3>
          <p className="text-[11px] text-slate-400 font-medium line-clamp-1 mt-0.5">
            {collectionCount} curated {collectionCount === 1 ? 'collection' : 'collections'}
          </p>
        </div>

        {/* Explore CTA */}
        <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-sky-600 group-hover:text-sky-700">
          <span>Explore</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
