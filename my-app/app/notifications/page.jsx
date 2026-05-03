"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";
import Link from "next/link";

const TYPE_ICONS = {
  application_update: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01m-.01 4h.01" />
    </svg>
  ),
  new_job_match: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  job_alert: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  system: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function NotificationsPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [newAlert, setNewAlert] = useState({ name: "", keywords: "", job_type: "", frequency: "daily" });

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    Promise.all([
      api.get("/notifications/").then(res => setNotifications(res.data.results || res.data)),
      api.get("/job-alerts/").then(res => setAlerts(res.data.results || res.data)),
    ])
      .catch(console.error)
      .finally(() => setDataLoading(false));
  }, [isAuthenticated]);

  const markAllRead = async () => {
    await api.post("/notifications/mark-all-read/");
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read/`);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/job-alerts/", newAlert);
      setAlerts(prev => [res.data, ...prev]);
      setShowAlertForm(false);
      setNewAlert({ name: "", keywords: "", job_type: "", frequency: "daily" });
    } catch (err) { console.error(err); }
  };

  if (loading || dataLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* Header Protocol */}
        <div className="flex items-end justify-between">
            <div>
                <span className="text-blue-400 font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">System Comms</span>
                <h1 className="text-4xl font-black text-white tracking-tight leading-tight">Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Stream</span></h1>
            </div>
            {notifications.some(n => !n.is_read) && (
                <button 
                    onClick={markAllRead} 
                    className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-white transition-colors pb-1 border-b border-blue-400/20 hover:border-white/40"
                >
                    Clear All Frequency
                </button>
            )}
        </div>

        {/* Notifications Feed */}
        <section className="space-y-4">
            {notifications.length === 0 ? (
                <div className="glass-card p-20 text-center border-white/5">
                    <p className="text-white/20 font-black text-xs uppercase tracking-[0.3em]">Zero signals detected.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((n, idx) => (
                        <div
                            key={n.id}
                            onClick={() => !n.is_read && markRead(n.id)}
                            className={`glass-card p-6 border-white/5 cursor-pointer transition-all duration-500 group relative overflow-hidden ${
                                !n.is_read ? "border-blue-500/30 bg-blue-500/5 shadow-[0_0_30px_-10px_rgba(59,130,246,0.2)]" : "opacity-60 hover:opacity-100"
                            }`}
                            style={{ animationDelay: `${idx * 50}ms` }}
                        >
                            {!n.is_read && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 animate-pulse"></div>}
                            
                            <div className="flex items-start gap-6 relative z-10">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                                    !n.is_read ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-white/20"
                                }`}>
                                    {TYPE_ICONS[n.notification_type] || TYPE_ICONS.job_alert}
                                </div>
                                
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className={`text-sm font-black uppercase tracking-widest ${!n.is_read ? "text-white" : "text-white/40"}`}>
                                            {n.title}
                                        </h3>
                                        <span className="text-[10px] font-medium text-white/20 uppercase tracking-widest">
                                            {new Date(n.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className={`text-sm leading-relaxed font-medium ${!n.is_read ? "text-white/70" : "text-white/30"}`}>
                                        {n.message}
                                    </p>
                                    {n.link && (
                                        <Link 
                                            href={n.link} 
                                            className="inline-flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-white transition-all group/link"
                                            onClick={e => e.stopPropagation()}
                                        >
                                            Access Node <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>

        {/* Job Alert Deployment Section */}
        <section className="pt-10 border-t border-white/5">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-black text-white tracking-tight">Deployment <span className="text-blue-400">Triggers</span></h2>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mt-1">Automated role detection protocols.</p>
                </div>
                <button
                    onClick={() => setShowAlertForm(!showAlertForm)}
                    className="px-6 py-3 bg-white/10 hover:bg-white text-white hover:text-black rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                >
                    {showAlertForm ? "Abort" : "+ Configure Alert"}
                </button>
            </div>

            {showAlertForm && (
                <div className="glass-card p-8 border-blue-500/20 bg-blue-500/5 mb-8 animate-in slide-in-from-top-4 duration-500">
                    <form onSubmit={handleCreateAlert} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Protocol Label</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Distributed Systems Remote"
                                    value={newAlert.name}
                                    onChange={e => setNewAlert({...newAlert, name: e.target.value})}
                                    className="w-full bg-[#0a0c10] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Filter Keywords (CSV)</label>
                                <input
                                    type="text"
                                    placeholder="React, Rust, AWS, Architecture"
                                    value={newAlert.keywords}
                                    onChange={e => setNewAlert({...newAlert, keywords: e.target.value})}
                                    className="w-full bg-[#0a0c10] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm font-medium"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Engagement Model</label>
                                <select
                                    value={newAlert.job_type}
                                    onChange={e => setNewAlert({...newAlert, job_type: e.target.value})}
                                    className="w-full bg-[#0a0c10] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm font-black uppercase tracking-widest"
                                >
                                    <option value="">Agnostic</option>
                                    <option value="full_time">Full Time</option>
                                    <option value="contract">Contract</option>
                                    <option value="freelance">Freelance</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Sync Frequency</label>
                                <select
                                    value={newAlert.frequency}
                                    onChange={e => setNewAlert({...newAlert, frequency: e.target.value})}
                                    className="w-full bg-[#0a0c10] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm font-black uppercase tracking-widest"
                                >
                                    <option value="daily">Daily Cycle</option>
                                    <option value="weekly">Weekly Cycle</option>
                                    <option value="instant">Real-time Stream</option>
                                </select>
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20">
                            Deploy Intelligence Trigger
                        </button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alerts.length === 0 ? (
                    <div className="md:col-span-2 p-10 rounded-2xl border border-white/5 bg-white/2 text-center">
                         <p className="text-white/20 font-black text-[10px] uppercase tracking-widest">No active triggers detected.</p>
                    </div>
                ) : (
                    alerts.map(alert => (
                        <div key={alert.id} className="glass-card p-5 border-white/5 flex items-center justify-between group hover:border-white/20 transition-all">
                            <div>
                                <h4 className="font-black text-white text-xs uppercase tracking-widest mb-1">{alert.name || alert.keywords}</h4>
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-bold text-white/30 uppercase tracking-[0.2em]">{alert.frequency}</span>
                                    <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${alert.is_active ? "text-emerald-400" : "text-white/20"}`}>
                                        {alert.is_active ? "Operational" : "Offline"}
                                    </span>
                                </div>
                            </div>
                            <div className="w-2 h-2 rounded-full bg-blue-500/40 group-hover:bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all"></div>
                        </div>
                    ))
                )}
            </div>
        </section>
      </div>
    </div>
  );
}
