import React from 'react';

/**
 * Standardized Select component for RemoteJobNG.
 * Features glassmorphism styling consistent with the Neural design system.
 */
const Select = ({ 
  label, 
  error, 
  className = '', 
  options = [], 
  ...props 
}) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-blue-100/80 ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        <select
          className={`
            w-full px-4 py-3 bg-white/5 border rounded-xl outline-none transition-all duration-300
            appearance-none cursor-pointer
            text-white placeholder:text-white/30
            hover:bg-white/10 hover:border-blue-500/30
            focus:bg-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
            ${error ? 'border-red-500/50 focus:border-red-500' : 'border-white/10'}
          `}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
              {opt.label}
            </option>
          ))}
        </select>
        
        {/* Custom Arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50 group-hover:text-white/80 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
          </svg>
        </div>
      </div>
      {error && (
        <span className="text-xs text-red-400 ml-1 animate-pulse">
          {error}
        </span>
      )}
    </div>
  );
};

export default Select;
