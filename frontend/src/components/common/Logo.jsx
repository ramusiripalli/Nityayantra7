import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.png';

export const Logo = ({ size = 'medium', showTagline = true, className = '' }) => {
  const logoSizes = {
    small: 'h-9 w-9',
    medium: 'h-[44px] w-[44px]',
    large: 'h-14 w-14',
  };

  const titleSizes = {
    small: 'text-base font-extrabold',
    medium: 'text-[18px] sm:text-[20px] font-black',
    large: 'text-2xl font-black',
  };

  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 group transition-opacity hover:opacity-95 ${className}`}>
      {/* Official Logo Container */}
      <div className={`relative rounded-xl overflow-hidden shadow-2xs border border-slate-200/80 bg-slate-900 shrink-0 ${logoSizes[size] || logoSizes.medium}`}>
        <img 
          src={logoImg} 
          alt="Nitya Yantra Logo" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="hidden absolute inset-0 bg-sky-600 text-white font-black items-center justify-center text-xs">
          NY
        </div>
      </div>

      {/* Brand Title & Tagline */}
      <div className="flex flex-col leading-tight">
        <span className={`tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors ${titleSizes[size] || titleSizes.medium}`}>
          NITYA YANTRA
        </span>
        {showTagline && (
          <span className="text-[11px] text-slate-500 font-semibold tracking-wide">
            Smart Gadgets for Everyday Life
          </span>
        )}
      </div>
    </Link>
  );
};

export default Logo;
