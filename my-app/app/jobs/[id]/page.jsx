"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";

export default function JobDetails() {
    const { id } = useParams();
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await api.get(`/jobs/${id}/`);
                setJob(res.data);
            } catch (error) {
                console.error("Error fetching job details:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchJob();
    }, [id]);

    useEffect(() => {
        if (!isAuthenticated || !id) return;
        api.get("/jobs/saved-jobs/")
            .then(res => {
                const savedList = res.data.results || res.data;
                const isSaved = savedList.some(s => String(s.job?.id || s.job_id) === String(id));
                setSaved(isSaved);
            })
            .catch(() => {});
    }, [isAuthenticated, id]);

    const handleSave = async () => {
        if (!isAuthenticated) {
            router.push(`/login?redirect=/jobs/${id}`);
            return;
        }
        setSaving(true);
        try {
            if (saved) {
                await api.delete(`/jobs/${id}/save/`);
                setSaved(false);
            } else {
                await api.post(`/jobs/${id}/save/`);
                setSaved(true);
            }
        } catch (error) {
            console.error("Error saving job:", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-white/20">
                <div className="relative w-12 h-12">
                    <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (!job || job.detail === "Not found.") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-white/40">
                <p className="text-xl font-bold">Opportunity not found.</p>
                <button
                    onClick={() => router.push("/jobs")}
                    className="text-blue-400 mt-4 hover:underline font-black uppercase text-xs tracking-widest"
                >
                    &larr; Return to Market
                </button>
            </div>
        );
    }

    const formatSalary = () => {
        if (!job.is_salary_public || (!job.salary_min && !job.salary_max)) return null;
        const currency = job.salary_currency || "USD";
        const symbols = { USD: "$", GBP: "£", EUR: "€", NGN: "₦", CAD: "CA$", AUD: "A$" };
        const sym = symbols[currency] || currency;
        if (job.salary_min && job.salary_max) return `${sym}${Number(job.salary_min).toLocaleString()} – ${sym}${Number(job.salary_max).toLocaleString()}`;
        if (job.salary_min) return `From ${sym}${Number(job.salary_min).toLocaleString()}`;
        return `Up to ${sym}${Number(job.salary_max).toLocaleString()}`;
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="text-white/40 hover:text-white transition-colors mb-8 flex items-center gap-2 group"
                >
                    <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Market Feed</span>
                </button>

                <div className="glass-card overflow-hidden border-white/10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    {/* Hero Section */}
                    <div className="p-8 md:p-12 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row gap-8 items-start md:items-center">
                        {job.company_logo_url ? (
                            <Image src={job.company_logo_url} alt={job.company_name} width={80} height={80} className="h-20 w-20 rounded-2xl object-contain bg-white/5 border border-white/10 p-2 shadow-xl" />
                        ) : (
                            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-3xl shadow-xl">
                                {job.company_name?.charAt(0) || "C"}
                            </div>
                        )}
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">{job.title}</h1>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4">
                                <span className="text-blue-400 font-bold text-sm tracking-tight">{job.company_name}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-white/10"></span>
                                <span className="text-white/40 text-sm font-medium">{job.location || "Remote"}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-white/10"></span>
                                <span className="text-white/40 text-sm font-black uppercase tracking-widest text-[10px]">{job.job_type?.replace("_", " ")}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
                        {/* Main Content */}
                        <div className="lg:col-span-2 p-8 md:p-12 space-y-10">
                            <section>
                                <h2 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                    <span className="w-2 h-4 bg-blue-500 rounded-full"></span>
                                    Position intelligence
                                </h2>
                                <div className="text-white/70 leading-relaxed whitespace-pre-wrap font-medium text-lg">
                                    {job.description}
                                </div>
                            </section>

                            <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all border ${
                                        saved
                                            ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                            : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                                    } disabled:opacity-50`}
                                >
                                    {saved ? "★ Saved to Watchlist" : "☆ Save Position"}
                                </button>
                                <Link
                                    href={`/jobs/${job.slug || job.id}/apply`}
                                    className="flex-[1.5] bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest text-center transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                                >
                                    Transmit Application
                                </Link>
                            </div>
                        </div>

                        {/* Side Panel */}
                        <div className="p-8 md:p-12 bg-white/[0.01] space-y-10">
                            <section>
                                <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-4">Metadata</h3>
                                <div className="space-y-6">
                                    {formatSalary() && (
                                        <div>
                                            <p className="text-white font-bold text-xl tracking-tight">{formatSalary()}</p>
                                            <p className="text-white/20 text-[9px] font-black uppercase mt-1">Annual Compensation</p>
                                        </div>
                                    )}
                                    <div className="flex flex-wrap gap-2">
                                        {job.remote_type && (
                                            <span className="bg-white/5 border border-white/10 text-white/60 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                {job.remote_type.replace("_", " ")}
                                            </span>
                                        )}
                                        {job.experience_level && job.experience_level !== "any" && (
                                            <span className="bg-white/5 border border-white/10 text-white/60 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest capitalize">
                                                {job.experience_level}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-white/5">
                                <h4 className="text-white font-black text-xs uppercase tracking-widest mb-2">Verified Opportunity</h4>
                                <p className="text-white/40 text-[10px] leading-relaxed font-medium">This listing has been indexed by our 2026 talent protocol. Verified Nigerian remote role.</p>
                            </section>

                            <section className="pt-6 border-t border-white/5">
                                <p className="text-[9px] font-black text-white/10 uppercase tracking-widest mb-1">Posted on</p>
                                <p className="text-white/40 text-xs font-bold">{new Date(job.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
