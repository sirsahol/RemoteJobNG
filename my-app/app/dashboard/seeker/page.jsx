"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/axiosInstance";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  reviewing: "bg-blue-100 text-blue-800",
  shortlisted: "bg-purple-100 text-purple-800",
  interview_scheduled: "bg-indigo-100 text-indigo-800",
  offer_made: "bg-green-100 text-green-800",
  accepted: "bg-green-200 text-green-900",
  rejected: "bg-red-100 text-red-800",
  withdrawn: "bg-gray-100 text-gray-600",
};

export default function SeekerDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login?redirect=/dashboard/seeker");
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    Promise.all([
      api.get("/applications/"),
      api.get("/saved-jobs/"),
    ]).then(([appRes, savedRes]) => {
      setApplications(appRes.data.results || appRes.data);
      setSavedJobs(savedRes.data.results || savedRes.data);
    }).catch(console.error).finally(() => setDataLoading(false));
  }, [isAuthenticated]);

  if (loading || dataLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
    </div>
  );

  const stats = [
    { label: "Applications Sent", value: applications.length, color: "bg-blue-50 text-blue-700" },
    { label: "Pending Review", value: applications.filter(a => a.status === "pending").length, color: "bg-yellow-50 text-yellow-700" },
    { label: "Interviews", value: applications.filter(a => a.status === "interview_scheduled").length, color: "bg-purple-50 text-purple-700" },
    { label: "Saved Jobs", value: savedJobs.length, color: "bg-green-50 text-green-700" },
  ];

  const profileComplete = user?.bio && user?.headline && user?.skills?.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.first_name || user?.username}</h1>
            <p className="text-gray-500 text-sm mt-1">Your job search dashboard</p>
          </div>
          <Link href="/jobs" className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition">
            Browse Jobs
          </Link>
        </div>

        {/* Profile completion prompt */}
        {!profileComplete && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div>
              <p className="font-medium text-amber-800">Complete your profile to stand out</p>
              <p className="text-sm text-amber-600">Add your headline, bio, and skills to increase visibility</p>
            </div>
            <Link href="/profile/edit" className="text-sm font-medium text-amber-800 underline hover:no-underline">
              Edit Profile &rarr;
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(stat => (
            <div key={stat.label} className={`${stat.color} rounded-xl p-4`}>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h2>
          {applications.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No applications yet. <Link href="/jobs" className="text-green-700 underline">Browse jobs &rarr;</Link></p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 text-left">
                    <th className="pb-3 font-medium">Job</th>
                    <th className="pb-3 font-medium">Company</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 10).map(app => (
                    <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3">
                        <Link href={`/jobs/${app.job_detail?.slug || app.job}`} className="font-medium text-gray-900 hover:text-green-700">
                          {app.job_detail?.title || `Job #${app.job}`}
                        </Link>
                      </td>
                      <td className="py-3 text-gray-500">{app.job_detail?.company_name || "\u2014"}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[app.status] || "bg-gray-100"}`}>
                          {app.status?.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400">
                        {new Date(app.applied_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Saved Jobs */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Saved Jobs ({savedJobs.length})</h2>
          {savedJobs.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No saved jobs yet. Click the bookmark icon on any job to save it.</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {savedJobs.slice(0, 6).map(saved => (
                <Link key={saved.id} href={`/jobs/${saved.job?.slug || saved.job?.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition">
                  <div className="h-9 w-9 rounded-lg bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                    {saved.job?.company_name?.charAt(0) || "C"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{saved.job?.title}</p>
                    <p className="text-xs text-gray-400 truncate">{saved.job?.company_name}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
