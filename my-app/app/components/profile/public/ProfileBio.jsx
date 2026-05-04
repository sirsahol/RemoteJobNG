// @dsp obj-2c99c89d
import React from "react";

export function ProfileBio({ bio }) {
  if (!bio) return null;

  return (
    <div className="mt-12 pt-10 border-t border-glass-border/50">
      <h2 className="text-[10px] font-black text-text-muted/40 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
        <span className="w-4 h-px bg-glass-border"></span>
        Intelligence Dossier
      </h2>
      <p className="text-text-muted leading-relaxed font-medium text-lg max-w-3xl italic">
        &quot;{bio}&quot;
      </p>
    </div>
  );
}
