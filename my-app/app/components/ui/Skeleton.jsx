import React from 'react';

/**
 * Standardized Skeleton component for RemoteJobNG.
 * Used to create shimmering loading placeholders.
 */
const Skeleton = ({ 
  width = '100%', 
  height = '1rem', 
  circle = false,
  className = '' 
}) => {
  return (
    <div 
      className={`
        bg-white/5 animate-pulse overflow-hidden relative
        ${circle ? 'rounded-full' : 'rounded-lg'}
        ${className}
      `}
      style={{ width, height }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
    </div>
  );
};

export default Skeleton;
