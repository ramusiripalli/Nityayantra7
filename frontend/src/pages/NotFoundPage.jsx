import React from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import { Compass, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-white rounded-3xl border border-slate-200 shadow-xs my-8">
        <Compass className="w-16 h-16 text-sky-500 animate-spin-slow" />
        <h1 className="text-3xl font-black text-slate-900">404 - Page Not Found</h1>
        <p className="text-sm text-slate-500 max-w-md">
          The page you are looking for might have been moved or does not exist. Explore our product catalog instead.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </PageContainer>
  );
};

export default NotFoundPage;
