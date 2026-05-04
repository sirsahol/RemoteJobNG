"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/axiosInstance";

const INITIAL = {
  title: "", company_name: "", location: "Remote",
  job_type: "", remote_type: "fully_remote",
  experience_level: "", salary_min: "", salary_max: "",
  salary_currency: "USD", description: "", application_url: "",
};

export default function PostJobPage() {
  const router = useRouter();
  const { isAuthenticated, isEmployer, loading } = useAuth();
  const [formData, setFormData] = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login?redirect=/post_job");
  }, [loading, isAuthenticated, router]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/jobs/", {
        ...formData,
        salary_min: formData.salary_min || null,
        salary_max: formData.salary_max || null,
      });
      setSubmitted(true);
      setFormData(INITIAL);
      setTimeout(() => router.push("/dashboard/employer"), 2500);
    } catch (err) {
      const data = err.response?.data;
      setError(data?.detail || Object.values(data || {})[0]?.[0] || "Failed to post job.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative">
      {/* Background Polish */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/4"></div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="mb-12 animate-in fade-in slide-in-from-left-4 duration-700">
            <span className="text-blue-500 dark:text-blue-400 font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">Broadcast Node</span>
            <h1 className="text-5xl md:text-8xl font-black text-text-main tracking-tighter leading-[0.85] mb-8">
              Initiate <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-500 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-500">Protocol Broadcast.</span>
            </h1>
            <p className="text-text-muted text-xl max-w-xl leading-relaxed font-medium">Transmitting requirements to the neural talent market.</p>
          </div>

          <div className="glass-card p-1 md:p-1.5 border-glass-border bg-glass-surface/50 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="bg-glass-surface backdrop-blur-3xl rounded-[1.4rem] p-8 md:p-12">
              {submitted && (
                <div className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 rounded-2xl text-center font-bold animate-in zoom-in-95 duration-300">
                  Transmission Successful! Redirecting to Command Center...
                </div>
              )}
              
              {error && (
                <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 rounded-2xl text-center font-bold animate-in zoom-in-95 duration-300">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-text-muted/60 uppercase tracking-[0.2em]">Position Title</label>
                    <input 
                      type="text" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleChange}
                      placeholder="e.g. Senior Systems Architect" 
                      required
                      className="w-full bg-glass-surface border border-glass-border rounded-xl p-5 text-text-main placeholder-text-muted/30 focus:outline-none focus:bg-glass-surface/80 focus:border-blue-500/30 transition-all ring-1 ring-glass-border" 
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-text-muted/60 uppercase tracking-[0.2em]">Company Identifier</label>
                    <input 
                      type="text" 
                      name="company_name" 
                      value={formData.company_name} 
                      onChange={handleChange}
                      placeholder="e.g. GlobalTech Solutions" 
                      required
                      className="w-full bg-glass-surface border border-glass-border rounded-xl p-5 text-text-main placeholder-text-muted/30 focus:outline-none focus:bg-glass-surface/80 focus:border-blue-500/30 transition-all ring-1 ring-glass-border" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-text-muted/60 uppercase tracking-[0.2em]">Contract Protocol</label>
                    <div className="relative group">
                      <select 
                        name="job_type" 
                        value={formData.job_type} 
                        onChange={handleChange} 
                        required
                        className="w-full bg-glass-surface border border-glass-border rounded-xl p-5 text-text-main focus:outline-none focus:bg-glass-surface/80 transition-all appearance-none ring-1 ring-glass-border"
                      >
                        <option value="" className="bg-bg-page">Select Protocol</option>
                        <option value="full_time" className="bg-bg-page">Full Time</option>
                        <option value="part_time" className="bg-bg-page">Part Time</option>
                        <option value="contract" className="bg-bg-page">Contract</option>
                        <option value="freelance" className="bg-bg-page">Freelance</option>
                        <option value="internship" className="bg-bg-page">Internship</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted/30">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-text-muted/60 uppercase tracking-[0.2em]">Spatial Requirement</label>
                    <input 
                      type="text" 
                      name="location" 
                      value={formData.location} 
                      onChange={handleChange}
                      placeholder="e.g. Remote (GMT+1 Focus)" 
                      className="w-full bg-glass-surface border border-glass-border rounded-xl p-5 text-text-main placeholder-text-muted/30 focus:outline-none focus:bg-glass-surface/80 focus:border-blue-500/30 transition-all ring-1 ring-glass-border" 
                    />
                  </div>
                </div>

                <div className="p-8 rounded-2xl bg-glass-surface/30 border border-glass-border ring-1 ring-glass-border space-y-6">
                  <label className="block text-[10px] font-black text-text-muted/60 uppercase tracking-[0.2em]">Resource Allocation</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <input 
                      type="number" 
                      name="salary_min" 
                      value={formData.salary_min} 
                      onChange={handleChange}
                      placeholder="Min" 
                      className="w-full bg-glass-surface border border-glass-border rounded-xl p-4 text-text-main placeholder-text-muted/30 focus:outline-none focus:bg-glass-surface/80 transition-all" 
                    />
                    <input 
                      type="number" 
                      name="salary_max" 
                      value={formData.salary_max} 
                      onChange={handleChange}
                      placeholder="Max" 
                      className="w-full bg-glass-surface border border-glass-border rounded-xl p-4 text-text-main placeholder-text-muted/30 focus:outline-none focus:bg-glass-surface/80 transition-all" 
                    />
                    <select 
                      name="salary_currency" 
                      value={formData.salary_currency} 
                      onChange={handleChange}
                      className="w-full bg-glass-surface border border-glass-border rounded-xl p-4 text-text-main focus:outline-none focus:bg-glass-surface/80 transition-all appearance-none"
                    >
                      <option value="USD" className="bg-bg-page">USD</option>
                      <option value="NGN" className="bg-bg-page">NGN</option>
                      <option value="EUR" className="bg-bg-page">EUR</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-text-muted/60 uppercase tracking-[0.2em]">Requirement Parameters</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange}
                    required 
                    rows={10} 
                    placeholder="Define the mission, technical stack, and impact..."
                    className="w-full bg-glass-surface border border-glass-border rounded-xl p-8 text-text-main placeholder-text-muted/30 focus:outline-none focus:bg-glass-surface/80 focus:border-blue-500/30 transition-all resize-none ring-1 ring-glass-border" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-signal active:scale-[0.98] disabled:opacity-50 group"
                >
                  <span className="flex items-center justify-center gap-3">
                    {submitting ? "Broadcasting..." : "Establish Role Transmission"}
                    {!submitting && <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>}
                  </span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Trust Signals Sidebar */}
        <div className="space-y-8 lg:pt-36">
          <div className="glass-card p-8 border-blue-500/20 bg-blue-500/5 animate-in fade-in slide-in-from-right-4 duration-700 delay-300">
            <h3 className="text-blue-500 dark:text-blue-400 font-bold text-[10px] uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Authority Signal
            </h3>
            <p className="text-text-main font-bold text-sm mb-4">Nodes with verified status receive 3x higher signal density.</p>
            <p className="text-text-muted text-xs leading-relaxed mb-6">Verified entities are prioritized in market queries and receive higher-quality signal transmissions from top-tier talent.</p>
            <Link href="/profile/edit" className="text-[10px] font-black text-text-main uppercase tracking-widest bg-glass-surface border border-glass-border px-6 py-3 rounded-xl hover:bg-text-main hover:text-bg-page transition-all block text-center">
              Elevate Status
            </Link>
          </div>

          <div className="glass-card p-8 border-glass-border bg-glass-surface/30 animate-in fade-in slide-in-from-right-4 duration-700 delay-500">
            <h4 className="text-text-muted/30 font-black text-[9px] uppercase tracking-widest mb-6">Network Distribution</h4>
            <div className="space-y-4">
              {[
                { label: "Neural Index", val: "Instant" },
                { label: "Notification Nodes", val: "500+" },
                { label: "Global Latency", val: "14ms" }
              ].map(item => (
                <div key={item.label} className="flex justify-between items-center text-[10px]">
                  <span className="text-text-muted/60 font-bold">{item.label}</span>
                  <span className="text-blue-500 dark:text-blue-400 font-black">{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
