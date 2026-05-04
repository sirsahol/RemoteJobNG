// @dsp obj-l02
import React from "react";

export function LoginHeader() {
  return (
    <div className="text-center mb-12 relative z-10">
      <span className="text-blue-400 font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">
        Auth Protocol
      </span>
      <h2 className="text-4xl font-black text-text-main tracking-tight leading-tight">
        Initiate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Session</span>
      </h2>
      <p className="text-text-muted mt-3 font-medium text-sm">Authenticating Node Presence.</p>
    </div>
  );
}
