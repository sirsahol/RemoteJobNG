// @dsp obj-ui02
import React from 'react';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  loading = false,
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center font-black uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-xl";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-signal",
    secondary: "bg-glass-surface hover:bg-text-main text-text-main hover:text-bg-page border border-glass-border",
    outline: "bg-transparent border border-blue-500/50 text-blue-400 hover:bg-blue-500/10",
    danger: "bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20"
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-6 py-4 text-xs",
    lg: "px-8 py-5 text-sm"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
          Processing
        </span>
      ) : children}
    </button>
  );
}
export default Button;
