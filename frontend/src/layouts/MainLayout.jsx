import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/70 font-sans text-slate-900">
      {/* Two-Row Sticky Header (Row 1: Brand + Search + Nav Links, Row 2: Category Bar) */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
