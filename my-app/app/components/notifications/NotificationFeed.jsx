import React from "react";
import { NotificationItem } from "./NotificationItem";

export function NotificationFeed({ notifications, markRead }) {
  if (notifications.length === 0) {
    return (
        <div className="glass-card p-20 text-center border-glass-border">
            <p className="text-text-muted/20 font-black text-xs uppercase tracking-[0.3em]">Zero signals detected.</p>
        </div>
    );
  }

  return (
    <div className="space-y-4">
        {notifications.map((n, idx) => (
            <NotificationItem 
              key={n.id} 
              notification={n} 
              markRead={markRead} 
              idx={idx} 
            />
        ))}
    </div>
  );
}
