"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/axiosInstance";

import { Flash, GraphUp, UserBadgeCheck, Archery } from "iconoir-react";

/**
 * Hook to manage Employer Dashboard logic.
 * Handles fetching employer-specific jobs and calculating dashboard metrics.
 */
export function useEmployerDashboard() {
  const { user, isAuthenticated, isEmployer, loading: authLoading } = useAuth();
  const router = useRouter();
  const [myJobs, setMyJobs] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Redirect if not authorized
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isEmployer)) {
      router.push("/login?redirect=/dashboard/employer");
    }
  }, [authLoading, isAuthenticated, isEmployer, router]);

  // Fetch jobs
  useEffect(() => {
    if (!isAuthenticated || !isEmployer) return;
    
    api.get("/jobs/my-jobs/")
      .then(res => setMyJobs(res.data.results || res.data))
      .catch(err => {
        console.error("Failed to fetch employer jobs:", err);
      })
      .finally(() => setDataLoading(false));
  }, [isAuthenticated, isEmployer]);

  // Derived stats
  const stats = useMemo(() => {
    const activeJobs = myJobs.filter(j => j.status === "active");
    const totalApplications = myJobs.reduce((sum, j) => sum + (j.application_count || 0), 0);
    const totalViews = myJobs.reduce((sum, j) => sum + (j.view_count || 0), 0);

    return [
      { label: "Active Listings", value: activeJobs.length, icon: <Flash strokeWidth={1.5} /> },
      { label: "Total Reach", value: totalViews, icon: <GraphUp strokeWidth={1.5} /> },
      { label: "Talent Pool", value: totalApplications, icon: <UserBadgeCheck strokeWidth={1.5} /> },
      { label: "Efficiency", value: "94%", icon: <Archery strokeWidth={1.5} /> },
    ];
  }, [myJobs]);

  const handleCloseJob = async (jobId) => {
    if (!confirm("Are you sure you want to close this global talent listing?")) return;
    try {
      await api.delete(`/jobs/${jobId}/`);
      setMyJobs(jobs => jobs.map(j => 
        j.id === jobId ? { ...j, status: "closed" } : j
      ));
    } catch (err) {
      console.error("Action failed:", err);
      alert("Action failed.");
    }
  };

  return {
    user,
    myJobs,
    stats,
    isLoading: authLoading || dataLoading,
    handleCloseJob
  };
}
