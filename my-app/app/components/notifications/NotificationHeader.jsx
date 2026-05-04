import React from "react";

export function NotificationHeader({ hasUnread, markAllRead }) {
  return (
    <div className="flex items-end justify-between">
        <div>
            <span className="text-blue-400 font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">System Comms</span>
            <h1 className="text-4xl font-black text-text-main tracking-tight leading-tight">Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Stream</span></h1>
        </div>
        {hasUnread && (
            <button 
                onClick={markAllRead} 
                className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-text-main transition-colors pb-1 border-b border-blue-400/20 hover:border-text-muted"
            >
                Clear All Frequency
            </button>
        )}
    </div>
  );
}
