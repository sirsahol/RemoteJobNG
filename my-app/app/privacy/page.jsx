"use client";

import Link from "next/link";

export default function PrivacyPage() {
  const points = [
    {
      title: "Data Hardening",
      description: "We transmit only the telemetry essential for job execution. Profile data remains locked to verified employer nodes. No secondary distribution exists."
    },
    {
      title: "Active Encryption",
      description: "Data is fortified at rest and during transmission via mandatory encryption nodes. We protect the engineering footprint with extreme technical overhead."
    },
    {
      title: "Node Sovereignty",
      description: "You maintain total authority over your data. Demand extraction or node termination at any time. We execute these commands instantly."
    }
  ];

  return (
    <main className="min-h-screen pt-32 pb-20 px-4">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[120px] translate-x-1/2 animate-pulse"></div>
        <div className="absolute top-3/4 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -translate-x-1/2"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        <header className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
              Secured Node
            </span>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">
              Privacy First Architecture
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-text-main tracking-tighter mb-8 italic">
            Privacy <span className="text-emerald-500">Protocol</span>
          </h1>
          <p className="text-xl text-text-muted/60 leading-relaxed max-w-2xl font-medium">
            We do not compromise. This protocol dictates how we defend your digital footprint.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {points.map((point, index) => (
            <div 
              key={index} 
              className="glass-card p-8 border-glass-border animate-in fade-in slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <h3 className="text-sm font-black text-text-main uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                {point.title}
              </h3>
              <p className="text-xs font-medium text-text-muted leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        <div className="glass-card p-8 md:p-16 border-glass-border animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-400">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-2xl font-black text-text-main mb-8 tracking-tight uppercase">Operational Transparency</h2>
            <p className="text-text-muted font-medium leading-relaxed mb-6">
              Our commitment to privacy is not a policy; it is hard-coded into the architecture. We do not sell user telemetry to third-party entities. Revenue is generated strictly through our Resource Allocation plans.
            </p>
            <p className="text-text-muted font-medium leading-relaxed mb-6">
              RemoteJobNG uses advanced telemetry to monitor network health and prevent fraudulent access. This data is anonymized and purged according to our 30-day retention protocol.
            </p>
          </div>

          <div className="mt-20 pt-10 border-t border-glass-border flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              </div>
              <p className="text-xs font-black text-text-main uppercase tracking-widest">
                Data Sovereignty Confirmed
              </p>
            </div>
            <Link 
              href="/terms" 
              className="text-xs font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors"
            >
              View Operating Protocol →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
