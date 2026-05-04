"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";
import { useAuth } from "@/context/AuthContext";

/**
 * Hook to manage Job Details logic.
 */
export function useJobDetails(jobId) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);

    // Fetch job details
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await api.get(`/jobs/${jobId}/`);
                setJob(res.data);
            } catch (error) {
                console.error("Error fetching job details:", error);
            } finally {
                setLoading(false);
            }
        };
        if (jobId) fetchJob();
    }, [jobId]);

    // Check if job is saved
    useEffect(() => {
        if (!isAuthenticated || !jobId) return;
        api.get("/jobs/saved-jobs/")
            .then(res => {
                const savedList = res.data.results || res.data;
                const isSaved = savedList.some(s => String(s.job?.id || s.job_id) === String(jobId));
                setSaved(isSaved);
            })
            .catch(() => {});
    }, [isAuthenticated, jobId]);

    const handleSave = async () => {
        if (!isAuthenticated) {
            router.push(`/login?redirect=/jobs/${jobId}`);
            return;
        }
        setSaving(true);
        try {
            if (saved) {
                await api.delete(`/jobs/${jobId}/save/`);
                setSaved(false);
            } else {
                await api.post(`/jobs/${jobId}/save/`);
                setSaved(true);
            }
        } catch (error) {
            console.error("Error saving job:", error);
        } finally {
            setSaving(false);
        }
    };

    const formatSalary = useCallback(() => {
        if (!job || !job.is_salary_public || (!job.salary_min && !job.salary_max)) return null;
        const currency = job.salary_currency || "USD";
        const symbols = { USD: "$", GBP: "£", EUR: "€", NGN: "₦", CAD: "CA$", AUD: "A$" };
        const sym = symbols[currency] || currency;
        
        if (job.salary_min && job.salary_max) {
            return `${sym}${Number(job.salary_min).toLocaleString()} – ${sym}${Number(job.salary_max).toLocaleString()}`;
        }
        if (job.salary_min) return `From ${sym}${Number(job.salary_min).toLocaleString()}`;
        return `Up to ${sym}${Number(job.salary_max).toLocaleString()}`;
    }, [job]);

    return {
        job,
        loading,
        saved,
        saving,
        handleSave,
        formatSalary
    };
}
