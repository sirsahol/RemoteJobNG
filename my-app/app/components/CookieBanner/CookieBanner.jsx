"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("remotejob-cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAction = (type) => {
    localStorage.setItem("remotejob-cookie-consent", type);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-[400px] z-[100] animate-in slide-in-from-bottom-20 duration-1000 ease-out">
      <div className="glass-card p-6 border-blue-500/20 shadow-2xl shadow-blue-500/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <h4 className="text-[10px] font-black text-text-main uppercase tracking-[0.3em]">Telemetry Consent Required</h4>
        </div>
        
        <p className="text-[11px] font-medium text-text-muted leading-relaxed mb-6 uppercase tracking-wider">
          We utilize persistence nodes to maintain the technical integrity of the Nigeria-Global transmission layer. Review our <Link href="/cookies" className="text-blue-400 hover:underline">Persistence Protocol</Link>.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => handleAction("declined")}
            className="px-4 py-3 rounded-xl border border-glass-border text-[10px] font-black uppercase tracking-widest text-text-muted hover:bg-white/5 transition-colors"
          >
            Reject
          </button>
          <button 
            onClick={() => handleAction("accepted")}
            className="px-4 py-3 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Authorize Node
          </button>
        </div>
      </div>
    </div>
  );
}
