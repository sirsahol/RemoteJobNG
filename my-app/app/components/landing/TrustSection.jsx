import React from "react";

export function TrustSection() {
  return (
    <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="glass-card border-blue-500/20 bg-gradient-to-br from-blue-600/5 to-transparent p-12 md:p-20 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Global Verification Protocol</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-text-main tracking-tight leading-[0.95]">
                Verified <br />
                <span className="text-blue-500">Infrastructure.</span>
              </h2>
              <p className="text-text-muted text-xl font-medium leading-relaxed">
                We enforce the standards of the modern remote stack. From Starlink-verified connectivity to active solar backup, we validate the hardware and the human behind it.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                {[
                  { icon: "🛡️", label: "Identity Verified" },
                  { icon: "📡", label: "Starlink Proof" },
                  { icon: "☀️", label: "Solar Powered" },
                  { icon: "🏆", label: "Elite Talent" },
                ].map(badge => (
                  <div key={badge.label} className="flex items-center gap-3 p-4 rounded-2xl bg-glass-surface border border-glass-border group hover:border-blue-500/20 transition-all">
                    <span className="text-2xl">{badge.icon}</span>
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full max-w-md">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full"></div>
                  <div className="glass-card p-8 border-glass-border relative z-10 transform lg:rotate-6 hover:rotate-0 transition-transform duration-700 shadow-xl">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-12 h-12 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 text-xl font-black italic">RJ</div>
                      <div>
                        <div className="text-text-main font-bold">Verified Talent Node</div>
                        <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Integrity Score: 98%</div>
                      </div>
                    </div>
                  <div className="space-y-4">
                    <div className="h-2 w-full bg-glass-surface rounded-full overflow-hidden ring-1 ring-glass-border">
                      <div className="h-full w-[98%] bg-gradient-to-r from-blue-600 to-indigo-400"></div>
                    </div>
                    <div className="flex justify-between text-[9px] font-black text-text-muted/40 uppercase tracking-widest">
                      <span>Signal Strength</span>
                      <span>100% Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}
