"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";
import Link from "next/link";

export default function SeekerDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [neuralMatches, setNeuralMatches] = useState([]);
  const [badges, setBadges] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [newAlert, setNewAlert] = useState({ name: "", keywords: "", job_type: "", frequency: "daily" });

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    Promise.all([
      api.get("/users/me/").then(res => setProfile(res.data)).catch(console.error),
      api.get("/jobs/saved-jobs/").then(res => setSavedJobs(res.data.results || res.data)).catch(console.error),
      api.get("/applications/").then(res => setApplications(res.data.results || res.data)).catch(console.error),
      api.get("/job-alerts/").then(res => setAlerts(res.data.results || res.data)).catch(console.error),
      api.get("/v1/intelligence/matches/").then(res => setNeuralMatches(res.data)).catch(() => setNeuralMatches([])),
      api.get("/v1/verification/badges/my_badges/").then(res => setBadges(res.data)).catch(() => setBadges([])),
    ]).finally(() => setDataLoading(false));
  }, [isAuthenticated]);

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/job-alerts/", newAlert);
      setAlerts(prev => [res.data, ...prev]);
      setShowAlertForm(false);
      setNewAlert({ name: "", keywords: "", job_type: "", frequency: "daily" });
    } catch (err) { console.error(err); }
  };

  const handleToggleAlert = async (id) => {
    try {
      const res = await api.patch(`/job-alerts/${id}/toggle/`);
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_active: res.data.is_active } : a));
    } catch (err) { console.error(err); }
  };

  const handleDeleteAlert = async (id) => {
    if (!confirm("Permanently delete this alert?")) return;
    try {
      await api.delete(`/job-alerts/${id}/`);
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (err) { console.error(err); }
  };

  if (loading || dataLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );

  const stats = [
    { label: "Saved Jobs", value: savedJobs.length, icon: "🔖", color: "from-blue-500/20 to-indigo-500/20" },
    { label: "Applications", value: applications.length, icon: "📄", color: "from-emerald-500/20 to-teal-500/20" },
    { label: "Active Alerts", value: alerts.filter(a => a.is_active).length, icon: "🔔", color: "from-purple-500/20 to-pink-500/20" },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      {/* Verification Ribbon */}
      <div className="fixed top-20 left-0 w-full z-40 animate-in slide-in-from-top duration-1000">
        <div className="bg-blue-600/10 backdrop-blur-md border-y border-white/5 py-2 px-4 overflow-hidden">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/20"></div>
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                  Verified Integrity Score: <span className="text-emerald-400">{Math.min(40 + (badges.length * 12), 100)}%</span>
                </span>
              </div>

              {/* Top Bar Badges */}
              <div className="hidden md:flex gap-2">
                {badges.map(b => (
                  <div key={b.id} title={b.badge.name} className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px]">
                    {b.badge.icon}
                  </div>
                ))}
              </div>
            </div>
            <Link href="/profile/edit" className="text-[9px] font-black text-blue-400 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2">
              Optimize Dossier <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pt-6">
          <div className="animate-in fade-in slide-in-from-left-4 duration-700">
            <span className="text-blue-400 font-bold tracking-widest text-xs uppercase mb-2 block">Command Center</span>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{profile?.username || user?.username}</span>
            </h1>
            <p className="text-white/40 mt-3 text-lg">Your global career trajectory is active.</p>
          </div>
          
          <div className="flex gap-3 animate-in fade-in slide-in-from-right-4 duration-700">
             <Link href="/jobs" className="glass-card px-6 py-3 border-white/5 hover:bg-white/5 text-white font-bold transition-all text-sm flex items-center gap-2">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
               Signal Search
             </Link>
             <button onClick={() => setShowAlertForm(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold transition-all text-sm shadow-lg shadow-blue-600/20">
               + Establish Alert
             </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, i) => (
            <div 
              key={stat.label} 
              className={`glass-card p-8 border-white/5 bg-gradient-to-br ${stat.color} animate-in fade-in slide-in-from-bottom-4 duration-700`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-white/20 font-black text-4xl">0{i+1}</span>
              </div>
              <p className="text-4xl font-black text-white mb-1">{stat.value}</p>
              <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed: Applications */}
          <div className="lg:col-span-2 space-y-8">
            <section className="glass-card p-8 border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                Active Transmissions
              </h2>
              
              {applications.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-white/20 font-medium mb-4">No active transmissions detected.</p>
                  <Link href="/jobs" className="text-blue-400 font-bold hover:underline">Establish first connection</Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {applications.map(app => (
                    <div key={app.id} className="group p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-blue-500/30 transition-all flex items-center justify-between">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center font-bold text-white shadow-lg overflow-hidden">
                          {app.job?.company_name?.[0] || app.company_name?.[0] || "J"}
                        </div>
                        <div>
                          <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{app.job?.title || "Job Position"}</h3>
                          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">{app.job?.company_name || app.company_name || "Confidential"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border ${
                          app.status === "accepted" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" :
                          app.status === "rejected" ? "border-red-500/30 bg-red-500/10 text-red-400" :
                          "border-blue-500/30 bg-blue-500/10 text-blue-400"
                        }`}>
                          {app.status || "Pending"}
                        </span>
                        <p className="text-white/20 text-[9px] mt-2 font-black uppercase tracking-tighter">Syncing... 2d</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Neural Matches Section */}
            <section className="glass-card p-8 border-white/10 relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <span className="w-2 h-6 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
                  Neural Matches
                </h2>
                <span className="bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">AI Synchronized</span>
              </div>
              
              <div className="space-y-4">
                {neuralMatches.length === 0 ? (
                  <div className="py-12 text-center bg-white/[0.02] rounded-3xl border border-dashed border-white/10 group hover:border-indigo-500/30 transition-colors">
                    <p className="text-white/20 text-xs font-bold uppercase tracking-widest mb-4">Neural Profile Incomplete</p>
                    <Link href="/profile/edit" className="text-indigo-400 font-bold text-sm hover:text-white transition-colors">Update Bio to Sync</Link>
                  </div>
                ) : (
                  neuralMatches.map(job => (
                    <Link href={`/jobs/${job.slug}`} key={job.id} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/40 transition-all group relative overflow-hidden">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/10">
                          {job.company_name?.[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{job.title}</p>
                          <p className="text-[10px] text-white/40 uppercase font-black tracking-wider mt-0.5">{job.company_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-indigo-400">94.8%</p>
                        <p className="text-[8px] text-white/20 uppercase font-bold tracking-tighter">Correlation</p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>

            {/* Saved Jobs Island */}
            <section className="glass-card p-8 border-white/10">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-2 h-6 bg-purple-500 rounded-full"></span>
                Intercepted Signals
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedJobs.length === 0 ? (
                  <p className="text-white/20 text-sm py-4 col-span-full">Your watchlist is empty.</p>
                ) : (
                  savedJobs.map(saved => (
                    <Link key={saved.id} href={`/jobs/${saved.job?.slug || saved.job?.id}`} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/10 transition-all block group">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors text-sm">{saved.job?.title || "Saved Job"}</h4>
                        <span className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </div>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{saved.job?.company_name || ""}</p>
                    </Link>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sidebar: Alerts & Real-Time Pulse */}
          <div className="space-y-8">
            {/* Real-Time Job Pulse */}
            <section className="glass-card p-8 border-white/10 overflow-hidden relative">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Network Pulse</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">LIVE</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { text: "Frontend Signal Intercepted in Lagos", time: "2m ago", icon: "🌐" },
                  { text: "Verification Protocol Completed: Adebayo O.", time: "5m ago", icon: "✅" },
                  { text: "New Role Stream: Senior Dev (USD)", time: "12m ago", icon: "💎" },
                  { text: "Payment Verified: Talent Transmission #492", time: "15m ago", icon: "💳" }
                ].map((pulse, i) => (
                  <div key={i} className="flex gap-4 items-start animate-in slide-in-from-right duration-500" style={{ animationDelay: `${i * 200}ms` }}>
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm shrink-0 border border-white/5">
                      {pulse.icon}
                    </div>
                    <div>
                      <p className="text-[11px] text-white/70 font-bold leading-snug">{pulse.text}</p>
                      <p className="text-[9px] text-white/20 font-black uppercase mt-1">{pulse.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/5">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/20">
                  <span>Global Reach</span>
                  <span>14.2k Active</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                  <div className="w-[84%] h-full bg-blue-500/50"></div>
                </div>
              </div>
            </section>

            <section className="glass-card p-8 border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Alert Config</h2>
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              </div>

              {showAlertForm && (
                <form onSubmit={handleCreateAlert} className="space-y-4 mb-6 p-4 rounded-xl bg-white/[0.03] border border-blue-500/20 animate-in zoom-in-95 duration-300">
                  <input
                    type="text"
                    placeholder="PROTOCOL NAME"
                    value={newAlert.name}
                    onChange={e => setNewAlert({...newAlert, name: e.target.value})}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-blue-500 transition-all"
                  />
                  <input
                    type="text"
                    placeholder="KEYWORDS (REACT, DESIGN)"
                    value={newAlert.keywords}
                    onChange={e => setNewAlert({...newAlert, keywords: e.target.value})}
                    className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-blue-500 transition-all"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={newAlert.frequency}
                      onChange={e => setNewAlert({...newAlert, frequency: e.target.value})}
                      className="bg-slate-900 border border-white/10 rounded-xl p-3 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="instant">Instant</option>
                    </select>
                    <button type="submit" className="bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all">Establish</button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {alerts.map(alert => (
                  <div key={alert.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
                    <div className="flex items-center justify-between mb-2">
                       <h3 className="font-bold text-white text-xs tracking-tight">{alert.name || alert.keywords}</h3>
                       <button onClick={() => handleDeleteAlert(alert.id)} className="text-white/20 hover:text-red-400 transition-colors">
                         <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/20 text-[9px] font-black uppercase tracking-[0.1em]">{alert.frequency} · {alert.is_active ? "Active" : "Offline"}</span>
                      <button
                        onClick={() => handleToggleAlert(alert.id)}
                        className={`w-9 h-5 rounded-full relative transition-all duration-500 ${alert.is_active ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]" : "bg-white/10"}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-500 shadow-sm ${alert.is_active ? "left-5" : "left-1"}`}></div>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="glass-card p-8 border-white/10 bg-gradient-to-br from-indigo-600/20 to-blue-600/20 group cursor-pointer hover:from-indigo-600/30 hover:to-blue-600/30 transition-all">
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">🤖</div>
                 <h3 className="text-white font-bold">Neural Resume Sync</h3>
               </div>
               <p className="text-white/40 text-[11px] mb-4 font-medium leading-relaxed">Our 2026 intelligence engine will automatically map your dossier to the global grid. Phase 5 initialization pending.</p>
               <div className="w-full bg-white/5 border border-white/10 py-3 rounded-xl text-white/20 font-black text-[9px] uppercase tracking-[0.2em] text-center">
                 Awaiting Protocol Link
               </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
