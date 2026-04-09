"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

    // Check if job is already saved
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
            <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
            </div>
        );
    }

    if (!job || job.detail === "Not found.") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
                <p>Job not found.</p>
                <button
                    onClick={() => router.push("/jobs")}
                    className="text-green-700 mt-4 hover:underline"
                >
                    &larr; Back to jobs
                </button>
            </div>
        );
    }

    const formatSalary = () => {
        if (!job.is_salary_public || (!job.salary_min && !job.salary_max)) return null;
        const currency = job.salary_currency || "USD";
        const symbols = { USD: "$", GBP: "\u00a3", EUR: "\u20ac", NGN: "\u20a6", CAD: "CA$", AUD: "A$" };
        const sym = symbols[currency] || currency;
        if (job.salary_min && job.salary_max) return `${sym}${Number(job.salary_min).toLocaleString()} \u2013 ${sym}${Number(job.salary_max).toLocaleString()}`;
        if (job.salary_min) return `From ${sym}${Number(job.salary_min).toLocaleString()}`;
        return `Up to ${sym}${Number(job.salary_max).toLocaleString()}`;
    };

    return (
        <section className="max-w-3xl mx-auto py-12 px-6">
            <button
                onClick={() => router.back()}
                className="text-green-700 hover:underline mb-6"
            >
                &larr; Back to jobs
            </button>

            <div className="bg-white shadow-md rounded-2xl p-8">
                <div className="flex items-start gap-4 mb-4">
                    {job.company_logo_url ? (
                        <img src={job.company_logo_url} alt={job.company_name} className="h-14 w-14 rounded-lg object-contain bg-gray-50 border" />
                    ) : (
                        <div className="h-14 w-14 rounded-lg bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg flex-shrink-0">
                            {job.company_name?.charAt(0) || "C"}
                        </div>
                    )}
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                        <p className="text-gray-600 mt-1">
                            {job.company_name} {job.location && `\u00b7 ${job.location}`} {job.job_type && `\u00b7 ${job.job_type.replace("_", " ").toUpperCase()}`}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    {job.remote_type && (
                        <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">
                            {job.remote_type.replace("_", " ")}
                        </span>
                    )}
                    {job.experience_level && job.experience_level !== "any" && (
                        <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-xs font-medium capitalize">
                            {job.experience_level}
                        </span>
                    )}
                    {job.is_featured && (
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-semibold">Featured</span>
                    )}
                </div>

                {formatSalary() && (
                    <p className="font-medium text-gray-900 mb-4 text-lg">{formatSalary()}</p>
                )}

                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
                    <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`px-5 py-2 rounded-lg font-medium transition border ${
                            saved
                                ? "bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
                                : "text-gray-600 border-gray-300 hover:bg-gray-50"
                        } disabled:opacity-50`}
                    >
                        {saving ? "..." : saved ? "Saved" : "Save Job"}
                    </button>
                    <Link
                        href={`/jobs/${job.slug || job.id}/apply`}
                        className="bg-green-700 text-white px-5 py-2 rounded-lg font-medium hover:bg-green-800 transition"
                    >
                        Apply Now
                    </Link>
                </div>
            </div>
        </section>
    );
}
