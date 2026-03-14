import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  circle?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  width, 
  height, 
  circle = false 
}) => {
  const style = {
    width: width || '100%',
    height: height || '100%',
    borderRadius: circle ? '50%' : 'var(--radius-sm)',
  };

  return (
    <div
      className={`animate-pulse bg-gray-300 dark:bg-gray-700 ${className}`}
      style={style}
    />
  );
};
