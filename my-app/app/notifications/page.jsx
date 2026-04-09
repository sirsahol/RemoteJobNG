"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";
import Link from "next/link";

const TYPE_ICONS = {
  application_update: "\uD83D\uDCCB",
  new_job_match: "\uD83C\uDFAF",
  job_alert: "\uD83D\uDD14",
  system: "\u2139\uFE0F",
};

export default function NotificationsPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [newAlert, setNewAlert] = useState({ name: "", keywords: "", job_type: "", frequency: "daily" });

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    Promise.all([
      api.get("/notifications/").then(res => setNotifications(res.data.results || res.data)),
      api.get("/job-alerts/").then(res => setAlerts(res.data.results || res.data)),
    ])
      .catch(console.error)
      .finally(() => setDataLoading(false));
  }, [isAuthenticated]);

  const markAllRead = async () => {
    await api.post("/notifications/mark-all-read/");
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read/`);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/job-alerts/", newAlert);
      setAlerts(prev => [res.data, ...prev]);
      setShowAlertForm(false);
      setNewAlert({ name: "", keywords: "", job_type: "", frequency: "daily" });
    } catch (err) { console.error(err); }
  };

  if (loading || dataLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {notifications.some(n => !n.is_read) && (
            <button onClick={markAllRead} className="text-sm text-green-700 hover:underline">
              Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center text-gray-400">No notifications yet.</div>
        ) : (
          <div className="space-y-2 mb-8">
            {notifications.map(n => (
              <div
                key={n.id}
                onClick={() => !n.is_read && markRead(n.id)}
                className={`bg-white rounded-xl p-4 border cursor-pointer transition ${
                  n.is_read ? "border-gray-100" : "border-green-200 bg-green-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{TYPE_ICONS[n.notification_type] || "\uD83D\uDD14"}</span>
                  <div className="flex-1">
                    <p className={`font-medium text-sm ${n.is_read ? "text-gray-700" : "text-gray-900"}`}>{n.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                    {n.link && (
                      <Link href={n.link} className="text-xs text-green-700 hover:underline mt-1 inline-block" onClick={e => e.stopPropagation()}>
                        {"View \u2192"}
                      </Link>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(n.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Job Alerts Subscription */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Job Alerts ({alerts.length})</h2>
            <button
              onClick={() => setShowAlertForm(!showAlertForm)}
              className="text-sm bg-green-700 text-white px-3 py-1.5 rounded-lg hover:bg-green-800 transition"
            >
              + Subscribe to Alert
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
                  Subscribe
                </button>
                <button type="button" onClick={() => setShowAlertForm(false)} className="text-gray-500 text-sm px-4 py-2">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {alerts.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">No job alert subscriptions. Create one to get notified of new matching jobs.</p>
          ) : (
            <div className="space-y-2">
              {alerts.map(alert => (
                <div key={alert.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{alert.name || alert.keywords}</p>
                    <p className="text-xs text-gray-400">{alert.frequency} · {alert.is_active ? "Active" : "Paused"}</p>
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
