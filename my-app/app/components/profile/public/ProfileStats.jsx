// @dsp obj-8800199a
import React from "react";

export function ProfileStats({ yearsOfExperience }) {
  return (
    <div className="glass-card p-8 border-glass-border md:col-span-1">
      <h2 className="text-[10px] font-black text-text-muted/40 uppercase tracking-[0.3em] mb-6">
        Operational Lifecycle
      </h2>
      <div className="flex items-baseline gap-2">
        <span className="text-5xl font-black text-text-main">
          {yearsOfExperience || "0"}
        </span>
        <span className="text-xs font-bold text-text-muted/60 uppercase tracking-widest">
          Years
        </span>
      </div>
      <p className="text-text-muted/30 text-[9px] font-medium uppercase tracking-widest mt-4">
        Verified Protocol Cycle
      </p>
    </div>
  );
}
