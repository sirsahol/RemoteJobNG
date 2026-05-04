"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/axiosInstance";

export default function ApplyPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`/login?redirect=/jobs/${id}/apply`);
      return;
    }
    if (id) {
      api.get(`/jobs/${id}/`).then(res => setJob(res.data)).catch(console.error);
    }
  }, [id, isAuthenticated, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");
    try {
      const formData = new FormData();
      formData.append("job", id);
      formData.append("cover_letter", coverLetter);
      if (resume) formData.append("resume", resume);
      await api.post("/applications/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Transmission Successful! Your application has been logged.");
      setTimeout(() => router.push("/dashboard/seeker"), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || "Signal failure. Please attempt transmission again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !job) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <button
            onClick={() => router.back()}
            className="text-text-muted hover:text-text-main transition-colors mb-8 flex items-center gap-2 group"
        >
            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cancel Transmission</span>
        </button>

        <div className="glass-card p-10 border-glass-border shadow-2xl animate-in zoom-in-95 duration-700">
          <div className="mb-10 text-center md:text-left">
            <span className="text-blue-500 dark:text-blue-400 font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">Application Protocol</span>
            <h1 className="text-3xl font-black text-text-main tracking-tight leading-tight">
               Apply for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400 dark:from-blue-400 dark:to-indigo-400">{job.title}</span>
            </h1>
            <p className="text-text-muted mt-2 font-medium">{job.company_name} · {job.location}</p>
          </div>

          {message && (
            <div className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-center font-bold animate-in fade-in slide-in-from-top-2 duration-300">
              {message}
            </div>
          )}
          {error && (
            <div className="mb-8 p-6 bg-red-500/10 border border-red-200 text-red-400 rounded-2xl text-center font-bold animate-in fade-in slide-in-from-top-2 duration-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-text-muted/60 uppercase tracking-[0.2em] mb-4">Value Proposition (Cover Letter)</label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                required
                rows={8}
                placeholder="Detail your unique expertise and strategic alignment..."
                className="w-full bg-glass-surface border border-glass-border rounded-2xl p-6 text-text-main placeholder-text-muted/40 focus:outline-none focus:bg-glass-surface/80 focus:border-blue-500/50 transition-all resize-none font-medium leading-relaxed"
              />
            </div>

            <div className="p-8 rounded-2xl bg-glass-surface border border-glass-border border-dashed hover:border-blue-500/30 transition-all group">
              <label className="block text-[10px] font-black text-text-muted/60 uppercase tracking-[0.2em] mb-4">Supporting Documentation (Resume)</label>
              <div className="relative">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResume(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="w-12 h-12 rounded-full bg-glass-surface border border-glass-border flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-text-muted/40 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  </div>
                  <p className="text-text-main font-bold text-xs">{resume ? resume.name : "Select PDF or DOCX"}</p>
                  <p className="text-text-muted/30 text-[9px] mt-1 uppercase font-black tracking-tighter">Max file size 5MB</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 disabled:opacity-50"
            >
              {submitting ? "Transmitting..." : "Initiate Application"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
