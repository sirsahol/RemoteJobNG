"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "job_seeker",
    phone: "",
    company_name: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await api.post("/users/register/", formData);

      if (res.data.id) {
        setSuccess("Account created successfully! Securely redirecting...");
        setTimeout(() => router.push("/login"), 1000);
      } else {
        setError(
          res.data?.username?.[0] ||
          res.data?.email?.[0] ||
          "Registration failed. Please check your inputs."
        );
      }
    } catch (err) {
      const data = err.response?.data;
      setError(
        data?.username?.[0] ||
        data?.email?.[0] ||
        data?.detail ||
        "Failed to sign up. Connection issue."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-32 pb-20">
      <div className="glass-card p-10 w-full max-w-lg border-glass-border shadow-blue-500/10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-text-main mb-2">Join RemoteJobNG</h2>
          <p className="text-text-muted text-sm">Empowering Nigerian talent for a global future.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSignup}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="UserHandle"
                className="w-full bg-glass-surface border border-glass-border rounded-xl p-4 text-text-main placeholder-text-muted/40 focus:outline-none focus:bg-glass-surface/80 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@domain.com"
                className="w-full bg-glass-surface border border-glass-border rounded-xl p-4 text-text-main placeholder-text-muted/40 focus:outline-none focus:bg-glass-surface/80 transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-glass-surface border border-glass-border rounded-xl p-4 text-text-main placeholder-text-muted/40 focus:outline-none focus:bg-glass-surface/80 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-glass-surface border border-glass-border rounded-xl p-4 text-text-main focus:outline-none focus:bg-glass-surface/80 transition-colors"
              >
                <option value="job_seeker" className="bg-bg-page">Job Seeker</option>
                <option value="employer" className="bg-bg-page">Employer</option>
              </select>
            </div>
          </div>

          {formData.role === "employer" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Acme Global Inc."
                className="w-full bg-glass-surface border border-glass-border rounded-xl p-4 text-text-main placeholder-text-muted/40 focus:outline-none focus:bg-glass-surface/80 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-[0.2em] mb-2">
              Bio / Intro
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              placeholder="Tell the global market about your expertise..."
              className="w-full bg-glass-surface border border-glass-border rounded-xl p-4 text-text-main placeholder-text-muted/40 focus:outline-none focus:bg-glass-surface/80 transition-colors"
            ></textarea>
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-medium">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-xs font-medium">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Initializing..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-text-muted text-sm mt-8">
          Already a member?{" "}
          <Link href="/login" className="text-blue-400 font-bold hover:text-text-main transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
