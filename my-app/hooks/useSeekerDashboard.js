import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/axiosInstance";
import { Bookmark, Page, Bell } from "iconoir-react";

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
    
    let isMounted = true;

    const fetchData = async () => {
      // We don't call setDataLoading(true) synchronously here because it's already true by default
      // or set to true when the user logs in via the initial state or a reset.
      try {
        const [me, saved, apps, alertsRes, matches, badgesRes] = await Promise.all([
          api.get("/users/me/"),
          api.get("/jobs/saved-jobs/"),
          api.get("/applications/"),
          api.get("/job-alerts/"),
          api.get("/v1/intelligence/matches/").catch(() => ({ data: [] })),
          api.get("/v1/verification/badges/my_badges/").catch(() => ({ data: [] })),
        ]);

        if (!isMounted) return;

        setProfile(me.data);
        setSavedJobs(saved.data.results || saved.data);
        setApplications(apps.data.results || apps.data);
        setAlerts(alertsRes.data.results || alertsRes.data);
        setNeuralMatches(matches.data);
        setBadges(badgesRes.data);
      } catch (err) {
        console.error("Dashboard data fetch failed:", err);
      } finally {
        if (isMounted) setDataLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
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
    { label: "Saved Jobs", value: savedJobs.length, icon: <Bookmark strokeWidth={1.5} />, color: "from-blue-500/20 to-indigo-500/20" },
    { label: "Applications", value: applications.length, icon: <Page strokeWidth={1.5} />, color: "from-emerald-500/20 to-teal-500/20" },
    { label: "Active Alerts", value: alerts.filter(a => a.is_active).length, icon: <Bell strokeWidth={1.5} />, color: "from-purple-500/20 to-pink-500/20" },
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
