"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/axiosInstance";

const JOB_STATUS_COLORS = {
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
  draft: "bg-slate-500/20 text-slate-400 border-slate-500/20",
  paused: "bg-amber-500/20 text-amber-400 border-amber-500/20",
  closed: "bg-red-500/20 text-red-400 border-red-500/20",
  expired: "bg-orange-500/20 text-orange-400 border-orange-500/20",
};

export default function EmployerDashboard() {
  const { user, isAuthenticated, isEmployer, loading } = useAuth();
  const router = useRouter();
  const [myJobs, setMyJobs] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isEmployer)) {
      router.push("/login?redirect=/dashboard/employer");
    }
  }, [loading, isAuthenticated, isEmployer, router]);

  useEffect(() => {
    if (!isAuthenticated || !isEmployer) return;
    api.get("/jobs/my-jobs/")
      .then(res => setMyJobs(res.data.results || res.data))
      .catch(console.error)
      .finally(() => setDataLoading(false));
  }, [isAuthenticated, isEmployer]);

  if (loading || dataLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );

  const activeJobs = myJobs.filter(j => j.status === "active");
  const totalApplications = myJobs.reduce((sum, j) => sum + (j.application_count || 0), 0);

  const stats = [
    { label: "Active Listings", value: activeJobs.length, icon: "⚡" },
    { label: "Total Reach", value: myJobs.reduce((sum, j) => sum + (j.view_count || 0), 0), icon: "📈" },
    { label: "Talent Pool", value: totalApplications, icon: "💎" },
    { label: "Efficiency", value: "94%", icon: "🎯" },
  ];

  const handleClose = async (jobId) => {
    if (!confirm("Are you sure you want to close this global talent listing?")) return;
    try {
      await api.delete(`/jobs/${jobId}/`);
      setMyJobs(jobs => jobs.map(j => j.id === jobId ? { ...j, status: "closed" } : j));
    } catch { alert("Action failed."); }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <span className="text-blue-400 font-bold tracking-widest text-xs uppercase mb-2 block">Enterprise Command</span>
            <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tight">
              {user?.company_name || user?.username} <span className="text-text-muted/30">Terminal</span>
            </h1>
            <p className="text-text-muted mt-3 text-lg uppercase tracking-widest font-black text-xs">Acquire Elite Nigerian Technical Nodes</p>
          </div>
          
          <Link href="/jobs/post" className="bg-text-main text-bg-page hover:opacity-90 px-8 py-4 rounded-2xl font-black transition-all text-sm shadow-xl shadow-glass active:scale-95 animate-in fade-in slide-in-from-right-4 duration-700">
             BROADCAST NEW PROTOCOL
          </Link>
        </div>

        {/* Intelligence Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div 
              key={stat.label} 
              className="glass-card p-6 border-glass-border/30 group hover:border-glass-border transition-all animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xl group-hover:scale-110 transition-transform">{stat.icon}</span>
                <p className="text-text-muted font-bold uppercase tracking-widest text-[9px]">{stat.label}</p>
              </div>
              <p className="text-3xl font-black text-text-main">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Talent Management Table */}
        <div className="glass-card overflow-hidden border-glass-border/50 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="p-8 border-b border-glass-border/30 flex items-center justify-between bg-glass-surface/50">
             <h2 className="text-xl font-bold text-text-main flex items-center gap-3">
               <span className="w-2 h-6 bg-blue-500 rounded-full animate-pulse"></span>
               Active Talent Channels
             </h2>
             <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500/20"></div>
                <div className="w-2 h-2 rounded-full bg-blue-500/20"></div>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-glass-border/30 text-text-muted/50 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-8 py-6">Position Title</th>
                  <th className="px-8 py-6">Engagement</th>
                  <th className="px-8 py-6">Intelligence</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-glass-border/30">
                {myJobs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <p className="text-text-muted/50 font-bold uppercase tracking-widest text-xs mb-4">No active talent channels</p>
                      <Link href="/jobs/post" className="text-blue-400 font-black text-[10px] uppercase tracking-widest border-b border-blue-400/30 pb-1 hover:border-blue-400 transition-all">
                        Initialize first talent channel
                      </Link>
                    </td>
                  </tr>
                ) : (
                  myJobs.map(job => (
                    <tr key={job.id} className="group hover:bg-glass-surface/40 transition-colors">
                      <td className="px-8 py-6">
                        <Link href={`/jobs/${job.slug || job.id}`} className="font-bold text-text-main group-hover:text-blue-400 transition-colors text-sm">
                          {job.title}
                        </Link>
                        <p className="text-text-muted/30 text-[10px] font-medium mt-1">Ref ID: #{job.id?.toString().slice(-4)}</p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                           <div className="text-center">
                             <p className="text-text-main font-bold text-xs">{job.application_count || 0}</p>
                             <p className="text-text-muted/50 text-[9px] font-black uppercase tracking-tighter">Applied</p>
                           </div>
                           <div className="w-px h-6 bg-glass-border/20"></div>
                           <div className="text-center">
                             <p className="text-text-main font-bold text-xs">{job.view_count || 0}</p>
                             <p className="text-text-muted/50 text-[9px] font-black uppercase tracking-tighter">Views</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <Link href={`/dashboard/employer/jobs/${job.id}/applicants`} className="text-blue-400 text-[10px] font-black uppercase tracking-widest hover:text-blue-300 transition-colors bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                           View Applicants
                         </Link>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${JOB_STATUS_COLORS[job.status] || "bg-glass-surface text-text-muted border-glass-border"}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-4">
                          <Link href={`/jobs/${job.slug || job.id}/edit`} className="text-text-muted/40 hover:text-text-main transition-colors">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </Link>
                          {job.status !== "closed" && (
                            <button onClick={() => handleClose(job.id)} className="text-text-muted/40 hover:text-red-400 transition-colors">
                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="p-6 bg-glass-surface/50 border-t border-glass-border/30 flex justify-between items-center">
             <p className="text-[10px] font-bold text-text-muted/50 uppercase tracking-widest">Global Talent Distribution: 100% Remote-First</p>
             <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                   <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-blue-500' : 'bg-glass-border/20'}`}></div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
