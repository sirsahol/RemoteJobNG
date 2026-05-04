// @dsp obj-4ae28e80
import React from "react";

export function VerificationHeader() {
  return (
    <div className="mb-12 animate-in fade-in slide-in-from-left-4 duration-700">
      <span className="text-blue-500 dark:text-blue-400 font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">
        Network Integrity Terminal
      </span>
      <h1 className="text-4xl md:text-6xl font-black text-text-main tracking-tight leading-tight">
        Node <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400">
          Verification Audit.
        </span>
      </h1>
      <p className="text-text-muted mt-6 text-lg max-w-xl">
        Processing authorization protocols for talent nodes within the integrity protocol.
      </p>
    </div>
  );
}
