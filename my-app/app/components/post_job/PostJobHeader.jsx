import React from "react";

export function PostJobHeader() {
  return (
    <div className="mb-12 animate-in fade-in slide-in-from-left-4 duration-700">
        <span className="text-blue-500 dark:text-blue-400 font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">Broadcast Node</span>
        <h1 className="text-5xl md:text-8xl font-black text-text-main tracking-tighter leading-[0.85] mb-8">
            Initiate <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-500 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-500">Protocol Broadcast.</span>
        </h1>
        <p className="text-text-muted text-xl max-w-xl leading-relaxed font-medium">Transmitting requirements to the neural talent market.</p>
    </div>
  );
}
