import React from 'react';

/**
 * Standardized TextArea component for RemoteJobNG.
 * Features glassmorphism styling consistent with the Neural design system.
 */
const TextArea = ({ 
  label, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-blue-100/80 ml-1">
          {label}
        </label>
      )}
      <textarea
        className={`
          w-full px-4 py-3 bg-white/5 border rounded-xl outline-none transition-all duration-300
          text-white placeholder:text-white/30 min-h-[120px] resize-y
          hover:bg-white/10 hover:border-blue-500/30
          focus:bg-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
          ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10'}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-400 ml-1 animate-pulse">
          {error}
        </span>
      )}
    </div>
  );
};

export default TextArea;
