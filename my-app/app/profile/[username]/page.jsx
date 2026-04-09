"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/utils/axiosInstance";

export default function PublicProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/users/${username}/`)
      .then(res => setProfile(res.data))
      .catch(err => {
        if (err.response?.status === 404) setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold text-gray-800">Profile not found</h1>
      <p className="text-gray-500">This profile doesn't exist or is private.</p>
      <Link href="/jobs" className="text-blue-600 hover:underline">Browse Jobs</Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Profile header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
          <div className="flex items-start gap-6">
            {profile.profile_picture ? (
              <img src={profile.profile_picture} alt={profile.full_name || profile.username}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                {(profile.full_name || profile.username)?.[0]?.toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{profile.full_name || profile.username}</h1>
              {profile.headline && <p className="text-gray-500 mt-1">{profile.headline}</p>}
              {profile.location && <p className="text-sm text-gray-400 mt-1">{profile.location}</p>}
              <div className="flex gap-4 mt-3">
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline">Website</a>
                )}
                {profile.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline">LinkedIn</a>
                )}
                {profile.github_url && (
                  <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline">GitHub</a>
                )}
              </div>
            </div>
          </div>
          {profile.bio && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h2 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">About</h2>
              <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
            </div>
          )}
        </div>

        {/* Skills */}
        {profile.skills?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span key={skill.id || skill.name}
                  className="bg-blue-50 text-blue-700 text-sm px-3 py-1 rounded-full border border-blue-100">
                  {skill.name || skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {profile.years_of_experience && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Experience</h2>
            <p className="text-gray-600">{profile.years_of_experience} years of professional experience</p>
          </div>
        )}
      </div>
    </main>
  );
}
