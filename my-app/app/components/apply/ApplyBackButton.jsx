// @dsp obj-32f26fe5
import React from "react";

export function ApplyBackButton({ onBack }) {
  return (
    <button
      onClick={onBack}
      className="text-text-muted hover:text-text-main transition-colors mb-8 flex items-center gap-2 group"
    >
      <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cancel Transmission</span>
    </button>
  );
}
