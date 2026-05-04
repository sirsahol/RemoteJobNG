import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

export function useNotifications() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [newAlert, setNewAlert] = useState({ 
    name: "", 
    keywords: "", 
    job_type: "", 
    frequency: "daily" 
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;
    setDataLoading(true);
    try {
      const [notifRes, alertRes] = await Promise.all([
        api.get("/notifications/"),
        api.get("/job-alerts/"),
      ]);
      setNotifications(notifRes.data.results || notifRes.data || []);
      setAlerts(alertRes.data.results || alertRes.data || []);
    } catch (err) {
      console.error("Failed to fetch notification data:", err);
    } finally {
      setDataLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const markAllRead = async () => {
    try {
      await api.post("/notifications/mark-all-read/");
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const markRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read/`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error(`Failed to mark notification ${id} as read:`, err);
    }
  };

  const handleCreateAlert = async (e) => {
    if (e) e.preventDefault();
    try {
      const res = await api.post("/job-alerts/", newAlert);
      setAlerts(prev => [res.data, ...prev]);
      setShowAlertForm(false);
      setNewAlert({ name: "", keywords: "", job_type: "", frequency: "daily" });
    } catch (err) {
      console.error("Failed to create job alert:", err);
    }
  };

  return {
    notifications,
    alerts,
    loading: authLoading || dataLoading,
    showAlertForm,
    setShowAlertForm,
    newAlert,
    setNewAlert,
    markAllRead,
    markRead,
    handleCreateAlert,
    refresh: fetchData
  };
}
