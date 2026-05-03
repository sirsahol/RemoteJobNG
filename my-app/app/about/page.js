import Link from "next/link";

export const metadata = {
  title: "Vision & Architecture | RemoteJobNG",
  description: "Redefining the Nigerian remote career trajectory through 2026-ready talent matching.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-32 pb-20">
      {/* Narrative Hero */}
      <section className="max-w-5xl mx-auto px-4 text-center mb-24 animate-in fade-in slide-in-from-top-4 duration-700">
        <span className="text-blue-400 font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block">The Vision</span>
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-8">
          The Hub of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Nigerian Talent.</span>
        </h1>
        <p className="text-xl md:text-2xl text-white/40 max-w-3xl mx-auto font-medium leading-relaxed">
          RemoteJobNG is an advanced talent protocol engineered to connect elite Nigerian professionals with the world&apos;s most innovative remote opportunities.
        </p>
      </section>

      {/* Core Protocol Section */}
      <section className="max-w-6xl mx-auto px-4 mb-32">
        <div className="glass-card p-12 md:p-20 border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full -mr-48 -mt-48 transition-all group-hover:bg-blue-500/20"></div>
          <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-black text-white mb-6 tracking-tight">Our Mission</h2>
              <p className="text-white/60 text-lg leading-relaxed font-medium mb-6">
                We exist to bridge the gap between Nigeria&apos;s untapped expertise and the global digital economy. In a world without borders, location should never be a constraint for brilliance.
              </p>
              <div className="flex gap-4">
                <div className="w-12 h-1 bg-blue-500 rounded-full"></div>
                <div className="w-4 h-1 bg-white/10 rounded-full"></div>
                <div className="w-4 h-1 bg-white/10 rounded-full"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="glass-card p-6 bg-white/5 border-white/5">
                 <p className="text-2xl font-black text-white mb-1">50K+</p>
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Active Seekers</p>
               </div>
               <div className="glass-card p-6 bg-white/5 border-white/5">
                 <p className="text-2xl font-black text-white mb-1">2.4k</p>
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Daily Jobs</p>
               </div>
               <div className="glass-card p-6 bg-white/5 border-white/5">
                 <p className="text-2xl font-black text-white mb-1">100%</p>
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Remote-Only</p>
               </div>
               <div className="glass-card p-6 bg-white/5 border-white/5">
                 <p className="text-2xl font-black text-white mb-1">Top 5</p>
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Global Sourcing</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Protocol */}
      <section className="max-w-6xl mx-auto px-4 mb-32">
        <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-12 text-center">Protocol Capabilities</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              title: "Global Aggregation", 
              desc: "Deep indexing of top remote platforms including Remotive, WWR, and specialized venture feeds.",
              icon: "🌐"
            },
            { 
              title: "Intelligence Alerts", 
              desc: "Real-time notification engine that matches your technical stack with fresh global opportunities.",
              icon: "⚡"
            },
            { 
              title: "Enterprise Direct", 
              desc: "Direct channel for Nigerian employers to broadcast high-impact roles to a verified talent pool.",
              icon: "🏢"
            },
          ].map(({ title, desc, icon }) => (
            <div key={title} className="glass-card p-10 border-white/5 hover:border-blue-500/30 transition-all group">
              <div className="text-4xl mb-6 group-hover:scale-110 transition-transform">{icon}</div>
              <h3 className="text-xl font-bold text-white mb-4">{title}</h3>
              <p className="text-white/40 text-sm font-medium leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="glass-card p-16 border-white/10 bg-gradient-to-br from-blue-600/20 to-indigo-700/20">
          <h2 className="text-3xl font-black text-white mb-6 tracking-tight">Ready to initiate your next career phase?</h2>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/jobs"
              className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95">
              Launch Search
            </Link>
            <Link href="/signup"
              className="glass-card px-10 py-4 border-white/10 hover:bg-white/5 text-white font-black text-xs uppercase tracking-widest transition-all">
              Join Protocol
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
