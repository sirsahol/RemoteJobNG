// @dsp obj-ui03
import React from 'react';

export function Input({ 
  label, 
  error, 
  className = '', 
  id,
  ...props 
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label 
          htmlFor={id}
          className="block text-[10px] font-black text-text-muted/40 uppercase tracking-[0.2em]"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full bg-glass-surface border ${error ? 'border-red-500/50' : 'border-glass-border'} rounded-xl p-4 text-text-main placeholder-text-muted/20 focus:outline-none focus:border-blue-500/50 transition-all font-medium text-sm`}
        {...props}
      />
      {error && (
        <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest animate-in fade-in slide-in-from-top-1 duration-300">
          {error}
        </p>
      )}
    </div>
  );
}
export default Input;
