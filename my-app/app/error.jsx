"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("System Protocol Breach:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#05070a] text-center px-4 relative overflow-hidden">
      {/* Critical State Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px]"></div>
      
      <div className="relative z-10 space-y-10 animate-in zoom-in-95 duration-1000">
        <div className="inline-flex items-center gap-3 bg-red-500/10 border border-red-500/20 px-5 py-2 rounded-full mb-4">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400">Critical System Failure</span>
        </div>
        
        <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-none">
                Protocol <span className="text-red-500">Interrupted.</span>
            </h1>
            <p className="text-white/40 max-w-lg mx-auto font-medium text-lg leading-relaxed">
              {error?.message || "An unexpected divergence occurred in the platform core logic. Attempting to isolate the anomaly."}
            </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
                onClick={reset} 
                className="bg-white text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95"
            >
                Initialize Recovery
            </button>
            <button 
                onClick={() => window.location.reload()} 
                className="bg-white/5 border border-white/10 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-white/10 active:scale-95"
            >
                Hard Reset
            </button>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-black text-white/5 uppercase tracking-[0.3em]">
        RemoteJobNG Core Diagnostics // ERROR_LOG_TRANSMISSION_ACTIVE
      </div>
    </div>
  );
}
