// @dsp obj-ui01
import React from 'react';

export function GlassCard({ children, className = "", noPadding = false }) {
  return (
    <div className={`glass-card ${noPadding ? '' : 'p-8 md:p-12'} border-glass-border relative overflow-hidden ${className}`}>
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
export default GlassCard;
