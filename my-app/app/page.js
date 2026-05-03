"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

const STATS = [
  { label: "Remote Jobs", value: "10K+" },
  { label: "Active Nodes", value: "500+" },
  { label: "Talent Verified", value: "15K+" },
  { label: "Global Reach", value: "50+" },
];

const POPULAR_CATEGORIES = [
  { name: "Engineering", icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ), slug: "technology" },
  { name: "Product Design", icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ), slug: "design-creative" },
  { name: "Intelligence", icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ), slug: "data-analytics" },
  { name: "Sales Strategy", icon: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ), slug: "marketing-sales" },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredJobs, setFeaturedJobs] = useState([]);

  useEffect(() => {
    api.get("/jobs/?is_featured=true&page_size=6")
      .then(res => setFeaturedJobs(res.data.results || res.data || []))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/jobs");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#05070a]">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] translate-y-1/2"></div>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-4">
        <div className="max-w-6xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-2.5 rounded-full mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Intelligence Protocol v2.26</span>
            </div>
          
          <h1 className="text-6xl md:text-9xl font-black mb-10 leading-[0.85] tracking-tighter text-white animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Work Globally.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500">Stay Local.</span>
          </h1>
          
          <p className="text-white/40 text-xl md:text-2xl mb-16 max-w-3xl mx-auto leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            The authoritative interface connecting Nigeria&apos;s technical elite with the world&apos;s most ambitious decentralized organizations.
          </p>

          {/* Search Protocol */}
          <div className="max-w-4xl mx-auto mb-20 animate-in fade-in zoom-in-95 duration-1000 delay-500">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 glass-card p-2 md:p-3 border-white/10 shadow-2xl shadow-blue-500/10">
              <div className="flex-1 relative flex items-center">
                  <svg className="w-5 h-5 absolute left-6 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                      type="text"
                      placeholder="Search roles, protocols, or verified stacks..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-16 pr-6 py-6 bg-transparent text-white placeholder-white/20 focus:outline-none text-xl font-medium"
                  />
              </div>
              <button type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.3em] px-14 py-6 rounded-2xl transition-all shadow-xl shadow-blue-600/30 active:scale-95">
                Explore Nodes
              </button>
            </form>
          </div>

          <div className="flex flex-wrap justify-center gap-12 text-white/20 animate-in fade-in duration-1000 delay-700">
            {STATS.map(stat => (
              <div key={stat.label} className="text-center group cursor-default">
                <p className="text-3xl font-black text-white/60 group-hover:text-blue-400 transition-colors duration-500 tracking-tighter">{stat.value}</p>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] mt-2 group-hover:text-white/40 transition-colors">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Integrity Protocol (NEW) */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="glass-card border-blue-500/20 bg-gradient-to-br from-blue-600/5 to-transparent p-12 md:p-20 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Global Verification Protocol</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[0.95]">
                Proof of <br />
                <span className="text-blue-400">Reliability.</span>
              </h2>
              <p className="text-white/40 text-xl font-medium leading-relaxed">
                We&apos;ve established the world&apos;s first decentralized trust system for remote work. From Starlink-verified connectivity to Solar-backed infrastructure, we verify the signals that matter.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                {[
                  { icon: "🛡️", label: "Identity Verified" },
                  { icon: "📡", label: "Starlink Proof" },
                  { icon: "☀️", label: "Solar Powered" },
                  { icon: "🏆", label: "Elite Talent" },
                ].map(badge => (
                  <div key={badge.label} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-blue-500/20 transition-all">
                    <span className="text-2xl">{badge.icon}</span>
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full max-w-md">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full"></div>
                <div className="glass-card p-8 border-white/10 relative z-10 transform lg:rotate-6 hover:rotate-0 transition-transform duration-700">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-xl font-black italic">RJ</div>
                    <div>
                      <div className="text-white font-bold">Verified Talent Node</div>
                      <div className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Integrity Score: 98%</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-[98%] bg-gradient-to-r from-blue-600 to-indigo-400"></div>
                    </div>
                    <div className="flex justify-between text-[9px] font-black text-white/20 uppercase tracking-widest">
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

      {/* Categories Architecture */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-4">Domain Selection</h2>
                <h3 className="text-4xl font-black text-white tracking-tight">Browse via <span className="text-white/40">Technical Pillars</span></h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {POPULAR_CATEGORIES.map(cat => (
                    <Link key={cat.slug} href={`/jobs?category=${cat.slug}`} 
                        className="glass-card p-10 border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all duration-500 group text-center">
                        <div className="w-14 h-14 bg-white/5 rounded-[1.25rem] flex items-center justify-center text-white/40 group-hover:text-blue-400 group-hover:bg-blue-500/20 transition-all mx-auto mb-8 ring-1 ring-white/5 group-hover:ring-blue-500/20">
                            {cat.icon}
                        </div>
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{cat.name}</h4>
                    </Link>
                ))}
            </div>
        </div>
      </section>

      {/* Featured Streams */}
      {featuredJobs.length > 0 && (
        <section className="py-32 px-4 relative">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div>
                <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-4">Live Opportunities</h2>
                <h3 className="text-5xl font-black text-white tracking-tight leading-none">Premium <br /><span className="text-white/40">Role Streams.</span></h3>
              </div>
              <Link href="/jobs" className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all shadow-xl shadow-blue-600/5">
                Full Protocol View
              </Link>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuredJobs.slice(0, 6).map((job, idx) => (
                <Link key={job.id} href={`/jobs/${job.slug || job.id}`}
                  className="glass-card p-1 md:p-1.5 border-white/5 flex flex-col group hover:border-blue-500/20 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 shadow-2xl shadow-blue-600/0 hover:shadow-blue-600/5"
                  style={{ animationDelay: `${idx * 100}ms` }}>
                  
                  <div className="bg-slate-950/40 rounded-[1.4rem] p-8 flex flex-col gap-8 h-full backdrop-blur-2xl">
                    <div className="flex items-start justify-between">
                      <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-black text-2xl overflow-hidden group-hover:scale-110 transition-all duration-500">
                        {job.company_logo_url
                          ? <Image src={job.company_logo_url} alt={job.company_name} width={64} height={64} className="h-full w-full object-contain p-3 opacity-80 group-hover:opacity-100" />
                          : job.company_name?.charAt(0)
                        }
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-blue-500/20">
                          {job.job_type?.replace("_", " ")}
                        </span>
                        {job.is_featured && (
                          <span className="text-[8px] font-black text-amber-400/60 uppercase tracking-widest">Verified Priority</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-black text-white text-2xl mb-3 group-hover:text-blue-400 transition-colors tracking-tight leading-snug">{job.title}</h3>
                      <div className="flex items-center gap-3 text-white/30 text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-white/60">{job.company_name}</span>
                          <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                          <span>{job.location || "Global Remote"}</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Est. Compensation</span>
                        <span className="text-sm font-black text-white/80 tracking-tight">
                          {job.salary_min && job.is_salary_public 
                            ? `$${(Number(job.salary_min)/1000).toFixed(0)}K+ / YR`
                            : "High-Tier Package"
                          }
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg group-hover:shadow-blue-600/20 ring-1 ring-white/5 group-hover:ring-blue-500/20">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Global CTA Architecture */}
      <section className="py-40 px-4">
        <div className="max-w-6xl mx-auto glass-card bg-gradient-to-br from-blue-600/20 via-[#0a0c10] to-indigo-600/20 border-white/10 p-1 md:p-1.5 overflow-hidden relative group">
          <div className="bg-slate-950/60 backdrop-blur-3xl rounded-[1.4rem] p-16 md:p-28 text-center relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] group-hover:bg-blue-500/20 transition-all duration-1000" />
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] group-hover:bg-indigo-500/20 transition-all duration-1000" />
            
            <h2 className="text-6xl md:text-8xl font-black text-white mb-10 relative z-10 tracking-tighter leading-[0.85]">Expand Your <br /><span className="text-blue-400">Horizon.</span></h2>
            <p className="text-white/40 mb-16 text-xl md:text-2xl relative z-10 max-w-2xl mx-auto font-medium leading-relaxed">Join 15,000+ elite technical nodes interfacing with the global decentralized economy.</p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
              <Link href="/signup" className="bg-white text-black font-black text-xs uppercase tracking-[0.3em] px-16 py-7 rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-white/10 active:scale-95">
                Establish Identity
              </Link>
              <Link href="/jobs" className="glass-card px-16 py-7 text-white font-black text-xs uppercase tracking-[0.3em] border-white/10 hover:bg-white/5 transition-all active:scale-95 bg-white/2">
                Explore Nodes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Footer */}
      <footer className="py-32 px-4 border-t border-white/5 bg-black/40">
        <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-20">
                <div className="md:col-span-1">
                    <h4 className="text-2xl font-black text-white mb-8 tracking-tighter italic">RemoteJob<span className="text-blue-400">NG</span></h4>
                    <p className="text-sm font-medium text-white/30 leading-relaxed">The authoritative talent interface for Nigerian engineering excellence in the global remote market. Engineered for 2026.</p>
                </div>
                <div>
                    <h4 className="text-blue-400 font-bold mb-8 text-[10px] uppercase tracking-[0.4em]">Nodes</h4>
                    <ul className="space-y-5 text-xs font-black uppercase tracking-widest">
                        <li><Link href="/jobs" className="text-white/40 hover:text-white transition-colors">Job Protocol</Link></li>
                        <li><Link href="/pricing" className="text-white/40 hover:text-white transition-colors">Deployment Plans</Link></li>
                        <li><Link href="/signup" className="text-white/40 hover:text-white transition-colors">Identity Setup</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-blue-400 font-bold mb-8 text-[10px] uppercase tracking-[0.4em]">Corporate</h4>
                    <ul className="space-y-5 text-xs font-black uppercase tracking-widest">
                        <li><Link href="/about" className="text-white/40 hover:text-white transition-colors">Vision Architecture</Link></li>
                        <li><Link href="/contact" className="text-white/40 hover:text-white transition-colors">Terminal Support</Link></li>
                        <li><Link href="/terms" className="text-white/40 hover:text-white transition-colors">Protocol Legal</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-blue-400 font-bold mb-8 text-[10px] uppercase tracking-[0.4em]">Status</h4>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">Network Online</span>
                        </div>
                        <p className="text-[9px] font-medium text-white/20 uppercase tracking-widest">Latency: 14ms Global</p>
                    </div>
                </div>
            </div>
            
            <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10">
                    © 2026 RemoteJobNG. Transmitting from Lagos, NG.
                </p>
                <div className="flex gap-8">
                    {["Twitter", "LinkedIn", "GitHub"].map(link => (
                        <Link key={link} href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10 hover:text-blue-400 transition-colors">{link}</Link>
                    ))}
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}
