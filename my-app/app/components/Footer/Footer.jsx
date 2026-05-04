"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-32 px-4 border-t border-glass-border bg-bg-page/90 relative z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-20">
          <div className="md:col-span-1">
            <h4 className="text-2xl font-black text-text-main mb-8 tracking-tighter italic">RemoteJob<span className="text-blue-400">NG</span></h4>
            <p className="text-sm font-medium text-text-muted/60 leading-relaxed">The authoritative talent interface for Nigerian engineering excellence in the global remote market. Engineered for 2026.</p>
          </div>
          <div>
            <h4 className="text-blue-400 font-bold mb-8 text-[10px] uppercase tracking-[0.4em]">Nodes</h4>
            <ul className="space-y-5 text-xs font-black uppercase tracking-widest">
              <li><Link href="/jobs" className="text-text-muted/60 hover:text-text-main hover:translate-x-1 transition-all inline-block">Job Protocol</Link></li>
              <li><Link href="/pricing" className="text-text-muted/60 hover:text-text-main hover:translate-x-1 transition-all inline-block">Deployment Plans</Link></li>
              <li><Link href="/signup" className="text-text-muted/60 hover:text-text-main hover:translate-x-1 transition-all inline-block">Identity Setup</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-blue-400 font-bold mb-8 text-[10px] uppercase tracking-[0.4em]">Corporate</h4>
            <ul className="space-y-5 text-xs font-black uppercase tracking-widest">
              <li><Link href="/about" className="text-text-muted/60 hover:text-text-main hover:translate-x-1 transition-all inline-block">Vision Architecture</Link></li>
              <li><Link href="/contact" className="text-text-muted/60 hover:text-text-main hover:translate-x-1 transition-all inline-block">Terminal Support</Link></li>
              <li><Link href="/terms" className="text-text-muted/60 hover:text-text-main hover:translate-x-1 transition-all inline-block">Operating Protocol</Link></li>
              <li><Link href="/privacy" className="text-text-muted/60 hover:text-text-main hover:translate-x-1 transition-all inline-block">Privacy Protocol</Link></li>
              <li><Link href="/cookies" className="text-text-muted/60 hover:text-text-main hover:translate-x-1 transition-all inline-block">Persistence Protocol</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-blue-500 font-bold mb-8 text-[10px] uppercase tracking-[0.4em]">Status</h4>
            <div className="p-6 rounded-2xl bg-glass-surface border border-glass-border shadow-glass hover:shadow-blue-500/5 transition-all duration-500 group">
              <div className="flex items-center gap-4 mb-2">
                <div className="relative flex items-center justify-center">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  <span className="absolute w-4 h-4 bg-emerald-500/30 rounded-full animate-ping"></span>
                </div>
                <span className="text-[10px] font-black text-text-main uppercase tracking-widest group-hover:text-blue-400 transition-colors">Network Online</span>
              </div>
              <p className="text-[9px] font-medium text-text-muted uppercase tracking-widest ml-6 opacity-60">Latency: 14ms Global</p>
            </div>
          </div>
        </div>
        
        <div className="pt-10 border-t border-glass-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted/20">
            © 2026 RemoteJobNG. Transmitting from Lagos, NG.
          </p>
          <div className="flex gap-8">
            {["Twitter", "LinkedIn", "GitHub"].map(link => (
              <Link key={link} href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted/20 hover:text-blue-400 hover:-translate-y-0.5 transition-all">{link}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
