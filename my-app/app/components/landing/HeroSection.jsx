import React from "react";
import { Button } from "@/app/components/ui/Button";

const STATS = [
  { label: "Remote Jobs", value: "10K+" },
  { label: "Active Nodes", value: "500+" },
  { label: "Talent Verified", value: "15K+" },
  { label: "Global Reach", value: "50+" },
];

export function HeroSection({ searchQuery, setSearchQuery, handleSearch }) {
  return (
    <section className="relative pt-48 pb-32 px-4">
        <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-3 bg-glass-surface border border-glass-border px-6 py-2.5 rounded-full mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-text-muted">Intelligence Protocol v2.26</span>
            </div>
          
          <h1 className="text-6xl md:text-9xl font-black mb-10 leading-[0.85] tracking-tighter text-text-main animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Global Execution.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500">Local Sovereignty.</span>
          </h1>
          
          <p className="text-text-muted text-xl md:text-2xl mb-16 max-w-3xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            The authoritative interface integrating Nigeria&apos;s technical elite into high-bandwidth global organizations. Fixed for the 2026 talent economy.
          </p>

          <div className="max-w-4xl mx-auto mb-20 animate-in fade-in zoom-in-95 duration-1000 delay-500">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 glass-card p-2 md:p-3 border-glass-border shadow-2xl shadow-blue-500/10" aria-label="Search Nodes">
              <div className="flex-1 relative flex items-center">
                  <svg className="w-5 h-5 absolute left-6 text-text-muted/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                      type="text"
                      placeholder="Search roles, protocols, or verified stacks..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-16 pr-6 py-6 bg-transparent text-text-main placeholder-text-muted/40 focus:outline-none text-xl font-medium"
                      aria-label="Search Query"
                  />
              </div>
              <Button 
                type="submit"
                className="px-14 py-6 rounded-2xl"
              >
                Query Nodes
              </Button>
            </form>
          </div>

          <div className="flex flex-wrap justify-center gap-12 text-text-muted animate-in fade-in duration-1000 delay-700">
            {STATS.map(stat => (
              <div key={stat.label} className="text-center group cursor-default">
                <p className="text-3xl font-black text-text-main group-hover:text-blue-500 transition-colors duration-500 tracking-tighter">{stat.value}</p>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mt-2 group-hover:text-text-muted transition-colors">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
    </section>
  );
}
