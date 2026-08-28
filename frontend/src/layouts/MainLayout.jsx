import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import CategoryNavigation from '../components/common/CategoryNavigation';
import Footer from '../components/common/Footer';

export const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sticky Header */}
      <Header />

      {/* Horizontally scrollable Category Navigation Bar */}
      <CategoryNavigation />

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
