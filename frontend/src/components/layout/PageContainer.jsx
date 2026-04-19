import React from 'react';



export const PageContainer = ({ 
  children, 
  className = "", 
  maxWidth = "max-w-7xl" 
}) => {
  return (
    <div className={`w-full ${maxWidth} mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-8 md:py-16 ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
