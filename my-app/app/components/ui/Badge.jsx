// @dsp obj-ui04
import React from 'react';

export function Badge({ 
  children, 
  variant = 'blue', 
  className = '' 
}) {
  const variants = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    gray: "bg-white/5 text-text-muted border-white/10"
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
export default Badge;
