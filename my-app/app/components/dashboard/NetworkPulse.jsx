"use client";

import React from 'react';

const NetworkPulse = () => {
  return (
    <div className="glass-card border-glass-border p-8 animate-in fade-in slide-in-from-right-4 duration-1000 relative overflow-hidden group">
      {/* Decorative Network Grid */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] group-hover:opacity-[0.05] transition-opacity"></div>
      
      <div className="relative z-10">
        <h2 className="text-xl font-black text-text-main uppercase tracking-tighter italic mb-6">Network Pulse</h2>
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mb-1">Global Latency</p>
              <p className="text-2xl font-black text-blue-600">12ms</p>
            </div>
            <div className="flex gap-1 h-8 items-end">
              {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                <div key={i} className="w-1.5 bg-blue-600/20 rounded-full overflow-hidden relative">
                  <div className="absolute bottom-0 left-0 w-full bg-blue-600 animate-pulse" style={{ height: `${h}%`, animationDelay: `${i * 150}ms` }}></div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-6 border-t border-glass-border">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">
              <span>Security Protocols</span>
              <span className="text-emerald-500 italic font-black uppercase">Active</span>
            </div>
            <div className="w-full h-1.5 bg-glass-surface rounded-full overflow-hidden border border-glass-border">
              <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 w-[94%] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkPulse;
