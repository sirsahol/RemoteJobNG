"use client";

import React from 'react';
import Link from 'next/link';

const DashboardHeader = ({ username, onShowAlertForm }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pt-6">
      <div className="animate-in fade-in slide-in-from-left-4 duration-700">
        <span className="text-blue-600 dark:text-blue-400 font-bold tracking-widest text-xs uppercase mb-2 block">Command Center</span>
        <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tight">
          Identity <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-indigo-400">{username}</span> Synchronized
        </h1>
        <p className="text-text-muted mt-3 text-lg uppercase tracking-widest font-black text-xs">Global Trajectory: ACTIVE</p>
      </div>
      
      <div className="flex gap-3 animate-in fade-in slide-in-from-right-4 duration-700">
         <Link href="/jobs" className="glass-card px-6 py-3 border-glass-border hover:bg-glass-surface text-text-main font-bold transition-all text-sm flex items-center gap-2">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
           Query Market Nodes
         </Link>
         <button onClick={() => onShowAlertForm(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all text-sm shadow-lg shadow-blue-600/20">
           + Establish Alert
         </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
