"use client";

import Link from "next/link";

export default function CookiesPage() {
  const cookieTypes = [
    {
      title: "Critical Persistence",
      description: "Mandatory persistence nodes required for session integrity and identity authentication. Termination of these nodes will disrupt the interface."
    },
    {
      title: "Network Analytics",
      description: "Telemetry nodes used to monitor transmission latency and system health. This data is essential for optimizing the Nigeria-global pipeline."
    },
    {
      title: "Interface Parameters",
      description: "Static variables that preserve your theme selection and localized configurations. These are optional but enable an optimized session architecture."
    }
  ];

  return (
    <main className="min-h-screen pt-32 pb-20 px-4">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        <header className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest">
              Cookie Protocol
            </span>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">
              Audit v2.26
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-text-main tracking-tighter mb-8 italic">
            Persistence <span className="text-blue-500">Protocol</span>
          </h1>
          <p className="text-xl text-text-muted/60 leading-relaxed max-w-2xl font-medium">
            We utilize cookies to enforce the technical continuity of the RemoteJobNG session.
          </p>
        </header>

        <div className="glass-card p-8 md:p-16 border-glass-border animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          <div className="space-y-12">
            {cookieTypes.map((type, index) => (
              <div key={index} className="border-b border-glass-border pb-12 last:border-0 last:pb-0">
                <h3 className="text-lg font-black text-text-main uppercase tracking-tight mb-4">{type.title}</h3>
                <p className="text-text-muted font-medium leading-relaxed">{type.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-10 border-t border-glass-border flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs font-black uppercase tracking-widest text-text-muted/40">
              Session persistence is active.
            </p>
            <div className="flex gap-8">
              <Link href="/privacy" className="text-xs font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">Privacy Protocol</Link>
              <Link href="/terms" className="text-xs font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">Operating Protocol</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
