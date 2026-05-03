"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/axiosInstance";

export default function AdminVerificationPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [requests, setRequests] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && (!isAuthenticated || !user?.is_staff)) {
      router.push("/");
    }
  }, [loading, isAuthenticated, user, router]);

  useEffect(() => {
    if (isAuthenticated && user?.is_staff) {
      fetchRequests();
    }
  }, [isAuthenticated, user]);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/v1/verification/requests/");
      setRequests(res.data.results || res.data);
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
      alert("Failed to approve node.");
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

  if (loading || dataLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 animate-in fade-in slide-in-from-left-4 duration-700">
          <span className="text-blue-400 font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">Central Command</span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Verification <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Stream Audit.</span>
          </h1>
          <p className="text-white/40 mt-6 text-lg max-w-xl">Review and authorize global talent nodes within the integrity protocol.</p>
        </div>

        {error && (
          <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center font-bold">
            {error}
          </div>
        )}

        <div className="glass-card border-white/5 bg-white/2 p-1 overflow-hidden">
          <div className="bg-slate-950/40 backdrop-blur-3xl rounded-[1.4rem] overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Node User</th>
                  <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Protocol Type</th>
                  <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Timestamp</th>
                  <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center text-white/20 font-bold italic">No pending transmissions detected.</td>
                  </tr>
                ) : (
                  requests.map(req => (
                    <tr key={req.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/20 flex items-center justify-center text-blue-400 font-black text-[10px]">
                            {req.user?.username?.charAt(0) || "U"}
                          </div>
                          <span className="text-sm font-bold text-white">{req.user?.username || "Unknown Node"}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-[10px] font-black text-white/60 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-md border border-white/5">
                          {req.request_type}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            req.status === 'VERIFIED' ? 'bg-emerald-500' :
                            req.status === 'REJECTED' ? 'bg-red-500' :
                            'bg-amber-500 animate-pulse'
                          }`}></span>
                          <span className={`text-[9px] font-black uppercase tracking-widest ${
                            req.status === 'VERIFIED' ? 'text-emerald-400' :
                            req.status === 'REJECTED' ? 'text-red-400' :
                            'text-amber-400'
                          }`}>
                            {req.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-[10px] font-medium text-white/20 uppercase tracking-tighter">
                        {new Date(req.created_at).toLocaleString()}
                      </td>
                      <td className="px-8 py-6 text-right">
                        {req.status === 'PENDING' && (
                          <div className="flex justify-end gap-3">
                            <button
                              onClick={() => handleReject(req.id)}
                              className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-red-500 hover:text-white transition-all"
                            >
                              Deny
                            </button>
                            <button
                              onClick={() => handleApprove(req.id)}
                              className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
                            >
                              Verify
                            </button>
                          </div>
                        )}
                        {req.status !== 'PENDING' && (
                          <span className="text-[9px] font-black text-white/10 uppercase tracking-widest">Logged</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
