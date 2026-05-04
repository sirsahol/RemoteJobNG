import React from "react";
import Link from "next/link";
import { GlassCard } from "../ui/GlassCard";

const TYPE_ICONS = {
  application_update: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01" />
    </svg>
  ),
  new_job_match: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  job_alert: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  system: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export function NotificationItem({ notification, markRead, idx }) {
  const n = notification;
  return (
    <GlassCard
      onClick={() => !n.is_read && markRead(n.id)}
      className={`p-6 cursor-pointer transition-all duration-500 group relative overflow-hidden ${
          !n.is_read ? "border-blue-500/30 bg-blue-500/5 shadow-notification" : "opacity-60 hover:opacity-100"
      }`}
      style={{ animationDelay: `${idx * 50}ms` }}
      variant="default"
    >
      {!n.is_read && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 animate-pulse"></div>}
      
      <div className="flex items-start gap-6 relative z-10">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
              !n.is_read ? "bg-blue-500/20 text-blue-400" : "bg-glass-surface text-text-muted/40"
          }`}>
              {TYPE_ICONS[n.notification_type] || TYPE_ICONS.job_alert}
          </div>
          
          <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                  <h3 className={`text-sm font-black uppercase tracking-widest ${!n.is_read ? "text-text-main" : "text-text-muted"}`}>
                      {n.title}
                  </h3>
                  <span className="text-[10px] font-medium text-text-muted/40 uppercase tracking-widest">
                      {new Date(n.created_at).toLocaleDateString()}
                  </span>
              </div>
              <p className={`text-sm leading-relaxed font-medium ${!n.is_read ? "text-text-main/70" : "text-text-muted/50"}`}>
                  {n.message}
              </p>
              {n.link && (
                  <Link 
                      href={n.link} 
                      className="inline-flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-text-main transition-all group/link"
                      onClick={e => e.stopPropagation()}
                  >
                      Access Node <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                  </Link>
              )}
          </div>
      </div>
    </GlassCard>
  );
}

