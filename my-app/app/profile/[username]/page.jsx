"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
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
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center bg-bg-page">
      <div className="w-24 h-24 rounded-3xl bg-glass-surface border border-glass-border flex items-center justify-center text-text-muted/20 mb-4">
        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h1 className="text-3xl font-black text-text-main tracking-tight">Profile Not Found</h1>
      <p className="text-text-muted max-w-md font-medium">This profile does not exist or has been restricted by the owner&apos;s privacy protocols.</p>
      <Link href="/jobs" className="bg-glass-surface hover:bg-glass-surface/80 text-text-main border border-glass-border px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all">
        Browse Active Roles
      </Link>
    </div>
  );

  return (
    <main className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header Protocol */}
        <div className="glass-card p-10 border-glass-border relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-700"></div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
            <div className="relative">
              {profile.profile_picture ? (
                <Image src={profile.profile_picture} alt={profile.full_name || profile.username}
                  width={128} height={128}
                  className="w-32 h-32 rounded-[2.5rem] object-cover border-2 border-glass-border p-1 shadow-2xl" />
              ) : (
                <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-2xl">
                  {(profile.full_name || profile.username)?.[0]?.toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-bg-page flex items-center justify-center">
                 <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <span className="text-blue-500 dark:text-blue-400 font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">Talent Identity verified</span>
              <h1 className="text-4xl font-black text-text-main tracking-tight leading-tight mb-2">
                {profile.full_name || profile.username}
              </h1>
              {profile.headline && (
                <p className="text-xl font-medium text-text-muted tracking-tight">{profile.headline}</p>
              )}
              {profile.location && (
                <div className="flex items-center justify-center md:justify-start gap-2 mt-4 text-text-muted/60">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-widest">{profile.location}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8">
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer"
                    className="px-6 py-3 bg-glass-surface hover:bg-glass-surface/80 border border-glass-border rounded-xl text-[10px] font-black uppercase tracking-widest text-text-main transition-all">
                    Network Node
                  </a>
                )}
                {profile.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                    className="px-6 py-3 bg-[#0077b5]/10 hover:bg-[#0077b5]/20 border border-[#0077b5]/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#00a0dc] transition-all">
                    Professional
                  </a>
                )}
                {profile.github_url && (
                  <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                    className="px-6 py-3 bg-glass-surface hover:bg-glass-surface/80 border border-glass-border rounded-xl text-[10px] font-black uppercase tracking-widest text-text-main transition-all">
                    Repository
                  </a>
                )}
              </div>
            </div>
          </div>

          {profile.bio && (
            <div className="mt-12 pt-10 border-t border-glass-border/50">
              <h2 className="text-[10px] font-black text-text-muted/40 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                <span className="w-4 h-px bg-glass-border"></span>
                Intelligence Dossier
              </h2>
              <p className="text-text-muted leading-relaxed font-medium text-lg max-w-3xl italic">&quot;{profile.bio}&quot;</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Experience Card */}
            <div className="glass-card p-8 border-glass-border md:col-span-1">
                <h2 className="text-[10px] font-black text-text-muted/40 uppercase tracking-[0.3em] mb-6">Service Tenure</h2>
                <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-text-main">{profile.years_of_experience || "0"}</span>
                    <span className="text-xs font-bold text-text-muted/60 uppercase tracking-widest">Years</span>
                </div>
                <p className="text-text-muted/30 text-[9px] font-medium uppercase tracking-widest mt-4">Verified Professional cycle</p>
            </div>

            {/* Skills Card */}
            {profile.skills?.length > 0 && (
                <div className="glass-card p-8 border-glass-border md:col-span-2">
                    <h2 className="text-[10px] font-black text-text-muted/40 uppercase tracking-[0.3em] mb-6">Core Competencies</h2>
                    <div className="flex flex-wrap gap-3">
                        {profile.skills.map((skill) => (
                            <span key={skill.id || skill.name}
                                className="px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-xl">
                                {skill.name || skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>
    </main>
  );
}
