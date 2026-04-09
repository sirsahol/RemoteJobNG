"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

export default function SeekerDashboard() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [newAlert, setNewAlert] = useState({ name: "", keywords: "", job_type: "", frequency: "daily" });

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    api.get("/job-alerts/")
      .then(res => setAlerts(res.data.results || res.data))
      .catch(console.error);
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

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Seeker Dashboard</h1>

        {/* Job Alerts Section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6">
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
