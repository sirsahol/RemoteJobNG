import React from "react";

export function JobsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="glass-card p-8 animate-pulse border-glass-border">
          <div className="h-4 bg-text-muted/10 rounded-full mb-4 w-3/4" />
          <div className="h-3 bg-text-muted/10 rounded-full mb-3 w-1/2" />
          <div className="h-3 bg-text-muted/10 rounded-full w-1/3" />
        </div>
      ))}
    </div>
  );
}
