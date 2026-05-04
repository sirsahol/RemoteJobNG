"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/axiosInstance";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/token/", { username, password });
      await login(res.data.access, res.data.refresh);
      const savedUser = localStorage.getItem("user");
      let role = "job_seeker";
      if (savedUser) {
        try { role = JSON.parse(savedUser).role; } catch {}
      }
      const redirectTo = searchParams.get("redirect") ||
        (role === "employer" ? "/dashboard/employer" : "/dashboard/seeker");
      router.push(redirectTo);
    } catch (err) {
      setError(err.message || "Protocol rejection: Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="glass-card p-12 w-full max-w-md border-glass-border relative overflow-hidden animate-in zoom-in-95 duration-700">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="text-center mb-12 relative z-10">
          <span className="text-blue-400 font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">Secure Auth</span>
          <h2 className="text-4xl font-black text-text-main tracking-tight leading-tight">Access <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Node</span></h2>
          <p className="text-text-muted mt-3 font-medium text-sm">Synchronizing your professional trajectory.</p>
        </div>

        <form className="space-y-8 relative z-10" onSubmit={handleSubmit}>
          <div>
            <label className="block text-[10px] font-black text-text-muted/40 uppercase tracking-[0.2em] mb-3">
              Identity Identifier
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full bg-glass-surface border border-glass-border rounded-xl p-4 text-text-main placeholder-text-muted/20 focus:outline-none focus:border-blue-500/50 transition-all font-medium text-sm"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-[10px] font-black text-text-muted/40 uppercase tracking-[0.2em]">
                Secret Sequence
              </label>
              <Link href="#" className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-text-main transition-colors">Recover</Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-glass-surface border border-glass-border rounded-xl p-4 text-text-main placeholder-text-muted/20 focus:outline-none focus:border-blue-500/50 transition-all font-medium text-sm"
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-black uppercase tracking-widest text-center animate-in fade-in duration-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Initiate Session"}
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-glass-border text-center relative z-10">
          <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">
            Unregistered?{" "}
            <Link
              href="/signup"
              className="text-blue-400 font-black hover:text-text-main transition-colors ml-2"
            >
              Establish Identity
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
