import React from 'react';

export const LoadingState = ({ message = 'Loading dashboard data...' }) => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 p-8 flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-3 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
};

export default LoadingState;
