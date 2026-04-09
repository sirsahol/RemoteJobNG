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

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    api.get("/notifications/")
      .then(res => setNotifications(res.data.results || res.data))
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
          <div className="space-y-2">
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
      </div>
    </div>
  );
}
