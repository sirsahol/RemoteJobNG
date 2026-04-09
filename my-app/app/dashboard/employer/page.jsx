"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/axiosInstance";

const JOB_STATUS_COLORS = {
  active: "bg-green-100 text-green-800",
  draft: "bg-gray-100 text-gray-600",
  paused: "bg-yellow-100 text-yellow-800",
  closed: "bg-red-100 text-red-800",
  expired: "bg-orange-100 text-orange-800",
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
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
    </div>
  );

  const activeJobs = myJobs.filter(j => j.status === "active");
  const totalApplications = myJobs.reduce((sum, j) => sum + (j.application_count || 0), 0);

  const stats = [
    { label: "Active Listings", value: activeJobs.length, color: "bg-green-50 text-green-700" },
    { label: "Total Listings", value: myJobs.length, color: "bg-blue-50 text-blue-700" },
    { label: "Total Applications", value: totalApplications, color: "bg-purple-50 text-purple-700" },
    { label: "Total Views", value: myJobs.reduce((sum, j) => sum + (j.view_count || 0), 0), color: "bg-orange-50 text-orange-700" },
  ];

  const handleClose = async (jobId) => {
    if (!confirm("Close this job listing?")) return;
    try {
      await api.delete(`/jobs/${jobId}/`);
      setMyJobs(jobs => jobs.map(j => j.id === jobId ? { ...j, status: "closed" } : j));
    } catch { alert("Failed to close job."); }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employer Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">{user?.company_name || user?.username}</p>
          </div>
          <Link href="/jobs/post" className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition">
            + Post a Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(stat => (
            <div key={stat.label} className={`${stat.color} rounded-xl p-4`}>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Job Listings Table */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Job Listings</h2>
          {myJobs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 text-sm mb-4">No job listings yet.</p>
              <Link href="/jobs/post" className="bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition">
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 text-left">
                    <th className="pb-3 font-medium">Job Title</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Applications</th>
                    <th className="pb-3 font-medium">Views</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myJobs.map(job => (
                    <tr key={job.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3">
                        <Link href={`/jobs/${job.slug || job.id}`} className="font-medium text-gray-900 hover:text-green-700">
                          {job.title}
                        </Link>
                      </td>
                      <td className="py-3 text-gray-500 capitalize">{job.job_type?.replace("_", " ")}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${JOB_STATUS_COLORS[job.status] || "bg-gray-100"}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <Link href={`/dashboard/employer/jobs/${job.id}/applicants`} className="text-blue-600 hover:underline">
                          {job.application_count || 0} applicants
                        </Link>
                      </td>
                      <td className="py-3 text-gray-500">{job.view_count || 0}</td>
                      <td className="py-3">
                        <div className="flex gap-3">
                          <Link href={`/jobs/${job.slug || job.id}/edit`} className="text-green-700 hover:underline text-xs">Edit</Link>
                          {job.status !== "closed" && (
                            <button onClick={() => handleClose(job.id)} className="text-red-500 hover:underline text-xs">Close</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
