"use client";

import Link from "next/link";

export default function TermsPage() {
  const sections = [
    {
      id: "01",
      title: "System Consent",
      content: "Entering the RemoteJobNG interface constitutes a binding legal agreement. Access is conditional upon absolute adherence to this Operating Protocol. If you reject any parameter of this contract, terminate your session immediately."
    },
    {
      id: "02",
      title: "Identity Audit",
      content: "Every engineer must undergo identity setup and technical audit. We maintain total authority to terminate any node that fails to meet the specific engineering benchmarks of the Lagos-global transmission layer."
    },
    {
      id: "03",
      title: "Resource Allocation",
      content: "Deployment costs are fixed as stated in the Pricing node. RemoteJobNG provides the transmission architecture only. Employment contracts remain strictly between the talent node and the hiring entity."
    },
    {
      id: "04",
      title: "Network Security",
      content: "Probing, reverse-engineering, or disrupting the Ethereal Frost architecture is strictly forbidden. We enforce these boundaries through permanent IP blacklisting and legal recourse."
    }
  ];

  return (
    <main className="min-h-screen pt-32 pb-20 px-4">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-4xl mx-auto">
        <header className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest">
              Protocol v2.0.26
            </span>
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">
              Last Verified: May 2026
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-text-main tracking-tighter mb-8 italic">
            Operating <span className="text-blue-500">Protocol</span>
          </h1>
          <p className="text-xl text-text-muted/60 leading-relaxed max-w-2xl font-medium">
            The fundamental legal framework governing the RemoteJobNG ecosystem and talent transmission.
          </p>
        </header>

        <div className="glass-card p-8 md:p-16 border-glass-border animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          <div className="space-y-16">
            {sections.map((section) => (
              <section key={section.id} className="relative pl-12 md:pl-20">
                <span className="absolute left-0 top-0 text-3xl md:text-5xl font-black text-blue-500/10 italic select-none">
                  {section.id}
                </span>
                <h2 className="text-2xl font-black text-text-main mb-4 tracking-tight uppercase">
                  {section.title}
                </h2>
                <p className="text-text-muted font-medium leading-relaxed">
                  {section.content}
                </p>
              </section>
            ))}
          </div>

          <div className="mt-20 pt-10 border-t border-glass-border flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm font-medium text-text-muted/60">
              Technical queries regarding the protocol?
            </p>
            <Link 
              href="/contact" 
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase text-xs tracking-widest rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20"
            >
              Contact Support Terminal
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
