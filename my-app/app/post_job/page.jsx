"use client";

import { useState, useEffect } from "react";
import axios from "axios";

export default function PostJobPage() {
  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    location: "Remote - Nigeria",
    type: "",
    salary: "",
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  // ✅ Load token once when page loads
  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    setToken(storedToken);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!token) {
      setError("You must be logged in to post a job.");
      setLoading(false);
      return;
    }

    // ✅ Match Django serializer fields exactly
    const payload = {
      title: formData.title,
      company_name: formData.company_name,
      description: formData.description,
      location: formData.location,
      job_type: formData.type,
      salary: formData.salary,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/jobs/create/",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Job submitted:", response.data);
      setSubmitted(true);

      // Reset form
      setFormData({
        title: "",
        company_name: "",
        location: "Remote - Nigeria",
        type: "",
        salary: "",
        description: "",
      });
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        setError("Authentication failed. Please log in again.");
        localStorage.removeItem("accessToken");
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Failed to post job. Please try again.");
      }
    } finally {
      setLoading(false);
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-blue-700 text-center mb-2">
          Post a Remote Job
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Reach top remote talents across Nigeria 🌍
        </p>

        {/* ✅ Success Message */}
        {submitted && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-center">
            ✅ Job posted successfully!
          </div>
        )}

        {/* ❌ Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="e.g. CodeHaven"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Type</option>
              <option value="full_time">Full-time</option>
              <option value="part_time">Part-time</option>
              <option value="remote">Remote</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          {/* Salary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Salary (optional)
            </label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="₦200,000 - ₦300,000 monthly"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write key responsibilities and requirements..."
              rows="5"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
}
