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
    if (!confirm("Delete this alert?")) return;
    try {
      await api.delete(`/job-alerts/${id}/`);
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (err) { console.error(err); }
  };

  if (loading || dataLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
    </div>
  );

  const stats = [
    { label: "Saved Jobs", value: savedJobs.length, color: "bg-blue-50 text-blue-700" },
    { label: "Applications", value: applications.length, color: "bg-green-50 text-green-700" },
    { label: "Active Alerts", value: alerts.filter(a => a.is_active).length, color: "bg-purple-50 text-purple-700" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Seeker Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Welcome back, {profile?.username || user?.username}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map(stat => (
            <div key={stat.label} className={`${stat.color} rounded-xl p-4`}>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Saved Jobs */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Saved Jobs ({savedJobs.length})</h2>
          {savedJobs.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No saved jobs yet. <Link href="/jobs" className="text-green-700 hover:underline">Browse jobs</Link></p>
          ) : (
            <div className="space-y-2">
              {savedJobs.map(saved => (
                <div key={saved.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
                  <div>
                    <Link href={`/jobs/${saved.job?.slug || saved.job?.id || saved.job_id}`} className="font-medium text-gray-900 text-sm hover:text-green-700">
                      {saved.job?.title || saved.job_title || "Job"}
                    </Link>
                    <p className="text-xs text-gray-400">{saved.job?.company_name || saved.company_name || ""}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Applications */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My Applications ({applications.length})</h2>
          {applications.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No applications yet. <Link href="/jobs" className="text-green-700 hover:underline">Find jobs to apply</Link></p>
          ) : (
            <div className="space-y-2">
              {applications.map(app => (
                <div key={app.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{app.job?.title || app.job_title || "Job Application"}</p>
                    <p className="text-xs text-gray-400">{app.job?.company_name || app.company_name || ""} · {app.status || "submitted"}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    app.status === "accepted" ? "bg-green-100 text-green-700" :
                    app.status === "rejected" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-500"
                  }`}>
                    {app.status || "submitted"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Job Alerts Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Job Alerts ({alerts.length})</h2>
            <button
              onClick={() => setShowAlertForm(!showAlertForm)}
              className="text-sm bg-green-700 text-white px-3 py-1.5 rounded-lg hover:bg-green-800 transition"
            >
              + New Alert
            </button>
          </div>

          {showAlertForm && (
            <form onSubmit={handleCreateAlert} className="bg-gray-50 rounded-xl p-4 mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Alert name (e.g. Python Remote Jobs)"
                value={newAlert.name}
                onChange={e => setNewAlert({...newAlert, name: e.target.value})}
                className="border rounded-lg px-3 py-2 text-sm col-span-full focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <input
                type="text"
                placeholder="Keywords (comma-separated, e.g. Python, Django, React)"
                value={newAlert.keywords}
                onChange={e => setNewAlert({...newAlert, keywords: e.target.value})}
                className="border rounded-lg px-3 py-2 text-sm col-span-full focus:outline-none focus:ring-2 focus:ring-green-600"
                required
              />
              <select
                value={newAlert.job_type}
                onChange={e => setNewAlert({...newAlert, job_type: e.target.value})}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="">Any Job Type</option>
                <option value="full_time">Full Time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>
              <select
                value={newAlert.frequency}
                onChange={e => setNewAlert({...newAlert, frequency: e.target.value})}
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
              >
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Digest</option>
                <option value="instant">Instant</option>
              </select>
              <div className="col-span-full flex gap-2">
                <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-800 transition">
                  Create Alert
                </button>
                <button type="button" onClick={() => setShowAlertForm(false)} className="text-gray-500 text-sm px-4 py-2">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {alerts.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No alerts yet. Create one to get notified of new jobs.</p>
          ) : (
            <div className="space-y-2">
              {alerts.map(alert => (
                <div key={alert.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{alert.name || alert.keywords}</p>
                    <p className="text-xs text-gray-400">{alert.frequency} · {alert.is_active ? "Active" : "Paused"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleAlert(alert.id)}
                      className={`text-xs px-2 py-1 rounded-full ${alert.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
                    >
                      {alert.is_active ? "Active" : "Paused"}
                    </button>
                    <button onClick={() => handleDeleteAlert(alert.id)} className="text-xs text-red-400 hover:text-red-600">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
