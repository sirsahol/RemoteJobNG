// @dsp func-1036ede9
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/axiosInstance";

/**
 * Logic Tier: useAdminVerification
 * Handles the state and actions for the admin verification node audit.
 */
export function useAdminVerification() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [requests, setRequests] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");

  // Staff check redirection
  useEffect(() => {
    if (!loading && (!isAuthenticated || !user?.is_staff)) {
      router.push("/");
    }
  }, [loading, isAuthenticated, user, router]);

  // Initial data fetch
  useEffect(() => {
    if (isAuthenticated && user?.is_staff) {
      fetchRequests();
    }
  }, [isAuthenticated, user]);

  const fetchRequests = async () => {
    try {
      setDataLoading(true);
      const res = await api.get("/v1/verification/requests/");
      setRequests(res.data.results || res.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch verification stream.");
    } finally {
      setDataLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post(`/v1/verification/requests/${id}/approve/`);
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'VERIFIED' } : r));
    } catch (err) {
      alert("Failed to authorize node.");
    }
  };

  const handleReject = async (id) => {
    const reason = prompt("Enter rejection reason (transmission log):");
    if (reason === null) return;
    try {
      await api.post(`/v1/verification/requests/${id}/reject/`, { notes: reason });
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED', notes: reason } : r));
    } catch (err) {
      alert("Failed to reject node.");
    }
  };

  return {
    requests,
    loading: loading || dataLoading,
    error,
    handleApprove,
    handleReject,
    refresh: fetchRequests
  };
}
