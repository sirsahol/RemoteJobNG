"use client";

import React from 'react';
import Link from 'next/link';

const VerificationRibbon = ({ badges, integrityScore }) => {
  return (
    <div className="fixed top-20 left-0 w-full z-40 animate-in slide-in-from-top duration-1000">
      <div className="bg-blue-600/10 backdrop-blur-md border-y border-glass-border py-2 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20"></div>
              </div>
              <span className="text-[10px] font-black text-text-main uppercase tracking-[0.2em]">
                Verified Integrity Score: <span className="text-emerald-600 dark:text-emerald-400">{integrityScore}%</span>
              </span>
            </div>

            {/* Top Bar Badges */}
            <div className="hidden md:flex gap-2">
              {badges.map(b => (
                <div key={b.id} title={b.badge.name} className="w-5 h-5 rounded-full bg-glass-surface border border-glass-border flex items-center justify-center text-[10px]">
                  {b.badge.icon}
                </div>
              ))}
            </div>
          </div>
          <Link href="/profile/edit" className="text-[9px] font-black text-blue-600 dark:text-blue-400 hover:text-text-main transition-colors uppercase tracking-widest flex items-center gap-2">
            Optimize Dossier <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerificationRibbon;
