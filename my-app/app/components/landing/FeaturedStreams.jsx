import React from "react";
import Link from "next/link";
import Image from "next/image";

export function FeaturedStreams({ featuredJobs }) {
  if (featuredJobs.length === 0) return null;

  return (
    <section className="py-32 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">Live Opportunities</h2>
            <h3 className="text-5xl font-black text-text-main tracking-tight leading-none">Premium <br /><span className="text-text-muted">Role Streams.</span></h3>
          </div>
          <Link href="/jobs" className="px-10 py-5 bg-glass-surface border border-glass-border rounded-2xl text-[10px] font-black uppercase tracking-widest text-text-main hover:bg-text-main hover:text-bg-page transition-all shadow-xl shadow-blue-500/5">
            Full Protocol View
          </Link>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredJobs.slice(0, 6).map((job, idx) => (
            <Link key={job.id} href={`/jobs/${job.slug || job.id}`}
              className="glass-card p-1 md:p-1.5 border-glass-border flex flex-col group hover:border-blue-500/20 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 shadow-2xl shadow-blue-600/0 hover:shadow-blue-600/5"
              style={{ animationDelay: `${idx * 100}ms` }}>
              
              <div className="bg-glass-surface border border-glass-border rounded-[1.4rem] p-8 flex flex-col gap-8 h-full backdrop-blur-2xl">
                <div className="flex items-start justify-between">
                  <div className="h-16 w-16 rounded-2xl bg-glass-surface border border-glass-border flex items-center justify-center text-text-main font-black text-2xl overflow-hidden group-hover:scale-110 transition-all duration-500">
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
                  <h3 className="font-black text-text-main text-2xl mb-3 group-hover:text-blue-500 transition-colors tracking-tight leading-snug">{job.title}</h3>
                  <div className="flex items-center gap-3 text-text-muted text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-main/60">{job.company_name}</span>
                      <span className="w-1 h-1 bg-glass-border rounded-full"></span>
                      <span>{job.location || "Global Remote"}</span>
                  </div>
                </div>

                <div className="mt-auto pt-8 border-t border-glass-border flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">Est. Compensation</span>
                    <span className="text-sm font-black text-main/80 tracking-tight">
                      {job.salary_min && job.is_salary_public 
                        ? `$${(Number(job.salary_min)/1000).toFixed(0)}K+ / YR`
                        : "High-Tier Package"
                      }
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-glass-surface flex items-center justify-center text-text-muted group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg group-hover:shadow-blue-500/20 ring-1 ring-glass-border group-hover:ring-blue-500/20">
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
  );
}
