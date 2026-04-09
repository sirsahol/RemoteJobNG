"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/axiosInstance";

const INITIAL = {
  title: "", company_name: "", location: "Remote",
  job_type: "", remote_type: "fully_remote",
  experience_level: "", salary_min: "", salary_max: "",
  salary_currency: "USD", description: "", application_url: "",
};

export default function PostJobPage() {
  const router = useRouter();
  const { isAuthenticated, isEmployer, loading } = useAuth();
  const [formData, setFormData] = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login?redirect=/post_job");
  }, [loading, isAuthenticated]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/jobs/", {
        ...formData,
        salary_min: formData.salary_min || null,
        salary_max: formData.salary_max || null,
      });
      setSubmitted(true);
      setFormData(INITIAL);
      setTimeout(() => router.push("/dashboard/employer"), 2500);
    } catch (err) {
      const data = err.response?.data;
      setError(data?.detail || Object.values(data || {})[0]?.[0] || "Failed to post job.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-2">Post a Remote Job</h1>
        <p className="text-center text-gray-500 mb-8">Reach top remote talent from Nigeria and beyond</p>
        {submitted && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-center">
            Job posted! Redirecting to your dashboard...
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { name: "title", label: "Job Title", placeholder: "e.g. Senior Frontend Developer" },
            { name: "company_name", label: "Company Name", placeholder: "e.g. Paystack" },
            { name: "location", label: "Location", placeholder: "e.g. Remote — Worldwide" },
            { name: "application_url", label: "Application URL (optional)", placeholder: "https://..." },
          ].map(({ name, label, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type="text" name={name} value={formData[name]} onChange={handleChange}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <select name="job_type" value={formData.job_type} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
              <select name="experience_level" value={formData.experience_level} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Any</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead / Principal</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary Min</label>
              <input type="number" name="salary_min" value={formData.salary_min} onChange={handleChange}
                placeholder="e.g. 50000"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary Max</label>
              <input type="number" name="salary_max" value={formData.salary_max} onChange={handleChange}
                placeholder="e.g. 80000"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select name="salary_currency" value={formData.salary_currency} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="USD">USD</option>
                <option value="NGN">NGN</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange}
              required rows={6} placeholder="Key responsibilities, requirements, benefits..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-60">
            {submitting ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
}
