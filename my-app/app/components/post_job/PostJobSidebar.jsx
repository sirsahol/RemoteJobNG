import React from "react";
import Link from "next/link";

export function PostJobSidebar() {
  return (
    <div className="space-y-8 lg:pt-36">
        <div className="glass-card p-8 border-blue-500/20 bg-blue-500/5 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
            <h3 className="text-blue-500 dark:text-blue-400 font-bold text-[10px] uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                Authority Signal
            </h3>
            <p className="text-text-main font-bold text-sm mb-4">Nodes with verified status receive 3x higher signal density.</p>
            <p className="text-text-muted text-xs leading-relaxed mb-6">Verified entities are prioritized in market queries and receive higher-quality signal transmissions from top-tier talent.</p>
            <Link href="/profile/edit" className="text-[10px] font-black text-text-main uppercase tracking-widest bg-glass-surface border border-glass-border px-6 py-3 rounded-xl hover:bg-text-main hover:text-bg-page transition-all block text-center">
                Elevate Status
            </Link>
        </div>

        <div className="glass-card p-8 border-glass-border bg-glass-surface/30 animate-in fade-in slide-in-from-right-4 duration-700 delay-500">
            <h4 className="text-text-muted/30 font-black text-[9px] uppercase tracking-widest mb-6">Network Distribution</h4>
            <div className="space-y-4">
                {[
                    { label: "Neural Index", val: "Instant" },
                    { label: "Notification Nodes", val: "500+" },
                    { label: "Global Latency", val: "14ms" }
                ].map(item => (
                    <div key={item.label} className="flex justify-between items-center text-[10px]">
                        <span className="text-text-muted/60 font-bold">{item.label}</span>
                        <span className="text-blue-500 dark:text-blue-400 font-black">{item.val}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
}
