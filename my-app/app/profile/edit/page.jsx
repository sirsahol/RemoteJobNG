"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/axiosInstance";

export default function EditProfilePage() {
  const router = useRouter();
  const { isAuthenticated, loading, user: authUser } = useAuth();
  const [form, setForm] = useState({
    first_name: "", last_name: "", headline: "", bio: "",
    location: "", website: "", linkedin_url: "", github_url: "",
    years_of_experience: "", is_profile_public: true,
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?redirect=/profile/edit");
      return;
    }
    api.get("/users/me/").then(res => {
      const u = res.data;
      setForm({
        first_name: u.first_name || "",
        last_name: u.last_name || "",
        headline: u.headline || "",
        bio: u.bio || "",
        location: u.location || "",
        website: u.website || "",
        linkedin_url: u.linkedin_url || "",
        github_url: u.github_url || "",
        years_of_experience: u.years_of_experience || "",
        is_profile_public: u.is_profile_public ?? true,
      });
    }).catch(console.error);
  }, [loading, isAuthenticated]);

  const handleChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.patch("/users/me/", form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">Profile saved successfully.</div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {["first_name", "last_name"].map(name => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{name.replace("_", " ")}</label>
                <input type="text" name={name} value={form[name]} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
          </div>
          {[
            { name: "headline", label: "Headline", placeholder: "e.g. Senior React Developer" },
            { name: "location", label: "Location", placeholder: "e.g. Lagos, Nigeria" },
            { name: "website", label: "Website", placeholder: "https://yoursite.com" },
            { name: "linkedin_url", label: "LinkedIn URL", placeholder: "https://linkedin.com/in/..." },
            { name: "github_url", label: "GitHub URL", placeholder: "https://github.com/..." },
          ].map(({ name, label, placeholder }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type="text" name={name} value={form[name]} onChange={handleChange}
                placeholder={placeholder}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
            <input type="number" name="years_of_experience" value={form.years_of_experience} onChange={handleChange}
              min="0" max="50"
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea name="bio" value={form.bio} onChange={handleChange} rows={5}
              placeholder="Tell employers about yourself..."
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" name="is_profile_public" id="is_profile_public"
              checked={form.is_profile_public} onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded" />
            <label htmlFor="is_profile_public" className="text-sm text-gray-700">Make my profile public</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-60">
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button type="button" onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
