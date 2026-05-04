import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/axiosInstance";

export const useSeekerDashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [neuralMatches, setNeuralMatches] = useState([]);
  const [badges, setBadges] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [newAlert, setNewAlert] = useState({ name: "", keywords: "", job_type: "", frequency: "daily" });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/login");
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    setDataLoading(true);
    Promise.all([
      api.get("/users/me/").then(res => setProfile(res.data)).catch(console.error),
      api.get("/jobs/saved-jobs/").then(res => setSavedJobs(res.data.results || res.data)).catch(console.error),
      api.get("/applications/").then(res => setApplications(res.data.results || res.data)).catch(console.error),
      api.get("/job-alerts/").then(res => setAlerts(res.data.results || res.data)).catch(console.error),
      api.get("/v1/intelligence/matches/").then(res => setNeuralMatches(res.data)).catch(() => setNeuralMatches([])),
      api.get("/v1/verification/badges/my_badges/").then(res => setBadges(res.data)).catch(() => setBadges([])),
    ]).finally(() => setDataLoading(false));
  }, [isAuthenticated]);

  const handleCreateAlert = async (e) => {
    if (e) e.preventDefault();
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
    if (!confirm("Permanently delete this alert?")) return;
    try {
      await api.delete(`/job-alerts/${id}/`);
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (err) { console.error(err); }
  };

  const stats = [
    { label: "Saved Jobs", value: savedJobs.length, icon: "🔖", color: "from-blue-500/20 to-indigo-500/20" },
    { label: "Applications", value: applications.length, icon: "📄", color: "from-emerald-500/20 to-teal-500/20" },
    { label: "Active Alerts", value: alerts.filter(a => a.is_active).length, icon: "🔔", color: "from-purple-500/20 to-pink-500/20" },
  ];

  const integrityScore = Math.min(40 + (badges.length * 12), 100);

  return {
    user,
    profile,
    savedJobs,
    applications,
    alerts,
    neuralMatches,
    badges,
    dataLoading: authLoading || dataLoading,
    showAlertForm,
    setShowAlertForm,
    newAlert,
    setNewAlert,
    handleCreateAlert,
    handleToggleAlert,
    handleDeleteAlert,
    stats,
    integrityScore,
    router
  };
};
