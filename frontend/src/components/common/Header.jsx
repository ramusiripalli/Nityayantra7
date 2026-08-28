import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Flame, 
  Home, 
  LayoutGrid, 
  ShoppingBag, 
  User 
} from 'lucide-react';
import Logo from './Logo';
import SearchBar from './SearchBar';
import CategoryNavigation from './CategoryNavigation';
import logoImg from '../../assets/logo.png';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Products', path: '/products', icon: LayoutGrid },
    { name: 'Trending Deals', path: '/category/deals', isHot: true, icon: Flame },
  ];

  return (
    <header className="sticky top-0 z-40 shadow-md">
      
      {/* DESKTOP & TABLET TOP NAVBAR (≥768px): ZEPTO-INSPIRED GRADIENT BAR (~74px Height) */}
      <div className="hidden md:block bg-gradient-to-r from-blue-600 via-purple-600 via-pink-500 to-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[74px] gap-4">
            
            {/* Left: Brand Logo Asset + Title & Tagline */}
            <div className="flex-shrink-0">
              <Logo size="medium" variant="light" />
            </div>

            {/* Center: Large 42px Height Search Bar (480px - 520px Width) */}
            <div className="flex-1 flex justify-center mx-4">
              <SearchBar />
            </div>

            {/* Right: Main Navigation Links + Useful Actions (Cart & Profile) */}
            <div className="flex items-center gap-6 shrink-0">
              
              {/* Navigation Links */}
              <nav className="flex items-center gap-5">
                {navLinks.map((link) => {
                  const IconComp = link.icon;
                  return (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      className={({ isActive }) =>
                        `flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-all py-1 border-b-2 ${
                          isActive
                            ? 'border-white font-black text-white'
                            : 'border-transparent text-white/90 hover:text-white hover:border-white/60'
                        }`
                      }
                    >
                      {link.isHot ? (
                        <Flame className="w-4 h-4 text-amber-300 fill-amber-300 animate-pulse" />
                      ) : (
                        <IconComp className="w-4 h-4 text-white/90" />
                      )}
                      <span>{link.name}</span>
                    </NavLink>
                  );
                })}
              </nav>

              {/* Action Icons: Cart with Badge '3' & Profile */}
              <div className="flex items-center gap-3 pl-2 border-l border-white/20">
                
                {/* Cart Icon with Badge '3' */}
                <Link 
                  to="/products" 
                  className="p-1.5 text-white/90 hover:text-white rounded-full hover:bg-white/10 transition-colors relative"
                  aria-label="Shopping Cart"
                >
                  <ShoppingBag className="w-5.5 h-5.5" />
                  <span className="absolute -top-1 -right-1 bg-pink-500 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-purple-600 shadow-2xs">
                    3
                  </span>
                </Link>

                {/* Account / Profile Icon */}
                <Link 
                  to="/products" 
                  className="p-1.5 text-white/90 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                  aria-label="User Account"
                >
                  <User className="w-5.5 h-5.5" />
                </Link>

              </div>

            </div>

          </div>
        </div>
      </div>

      {/* MOBILE TOP NAVBAR (<768px): GRADIENT BRAND HEADER (~60px Height) */}
      <div className="md:hidden bg-gradient-to-r from-blue-600 via-purple-600 via-pink-500 to-orange-500 text-white px-3.5 h-[60px] flex items-center justify-between shadow-sm">
        
        {/* Mobile Left: Hamburger + Logo + Brand Title & Tagline */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 -ml-1 text-white rounded-lg hover:bg-white/10 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5">
            <div className="relative rounded-lg overflow-hidden border border-white/20 bg-slate-900 w-[38px] h-[38px] shrink-0">
              <img src={logoImg} alt="Nitya Yantra Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-white font-black text-[16px] sm:text-[17px] tracking-tight">
                NITYA YANTRA
              </span>
              <span className="text-sky-100 font-semibold text-[9px] tracking-wide">
                Smart Gadgets for Everyday Life
              </span>
            </div>
          </Link>
        </div>

        {/* Mobile Right: Cart (with Badge '3') + Profile (NO Heart, NO Search Icon) */}
        <div className="flex items-center gap-2.5">
          <Link 
            to="/products" 
            className="p-1.5 text-white hover:text-white/90 transition-colors relative" 
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5.5 h-5.5" />
            <span className="absolute -top-1 -right-1 bg-pink-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-purple-600 shadow-2xs">
              3
            </span>
          </Link>

          <Link 
            to="/products" 
            className="p-1.5 text-white hover:text-white/90 transition-colors" 
            aria-label="User Account"
          >
            <User className="w-5.5 h-5.5" />
          </Link>
        </div>

      </div>

      {/* ROW 2: UNIFORM CATEGORY NAVIGATION BAR (~48px Height) */}
      <CategoryNavigation />

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-5 space-y-2 shadow-lg animate-fadeIn">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const IconComp = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50 hover:text-sky-600 rounded-lg transition-colors"
                >
                  <IconComp className="w-4 h-4 text-slate-500" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

    </header>
  );
};

export default Header;
