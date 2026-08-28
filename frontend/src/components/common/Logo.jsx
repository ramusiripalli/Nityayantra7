import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.jpg';

export const Logo = ({ size = 'medium', showTagline = true, className = '' }) => {
  const logoSizes = {
    small: 'h-9 w-9',
    medium: 'h-11 w-11',
    large: 'h-14 w-14',
  };

  const titleSizes = {
    small: 'text-base font-bold',
    medium: 'text-lg sm:text-xl font-extrabold',
    large: 'text-2xl font-black',
  };

  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 group transition-opacity hover:opacity-95 ${className}`}>
      <div className={`relative rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-900 ${logoSizes[size] || logoSizes.medium}`}>
        <img 
          src={logoImg} 
          alt="Nitya Yantra Logo" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="hidden absolute inset-0 bg-sky-600 text-white font-bold items-center justify-center text-xs">
          NY
        </div>
      </div>

      <div className="flex flex-col leading-tight">
        <span className={`tracking-tight bg-gradient-to-r from-sky-600 via-blue-600 to-amber-500 bg-clip-text text-transparent ${titleSizes[size] || titleSizes.medium}`}>
          NITYA YANTRA
        </span>
        {showTagline && (
          <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium tracking-wide">
            Smart Gadgets for Everyday Life
          </span>
        )}
      </div>
    </Link>
  );
};

export default Logo;
