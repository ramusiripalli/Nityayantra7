import React from 'react';

export const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`max-w-[1400px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
