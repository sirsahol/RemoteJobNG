// @dsp obj-cfbcafce
import React from "react";
import Image from "next/image";

export function ProfileHeader({ profile }) {
  if (!profile) return null;

  return (
    <div className="glass-card p-10 border-glass-border relative overflow-hidden group">
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all duration-700"></div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-10 relative z-10">
        <div className="relative">
          {profile.profile_picture ? (
            <Image
              src={profile.profile_picture}
              alt={profile.full_name || profile.username}
              width={128}
              height={128}
              className="w-32 h-32 rounded-[2.5rem] object-cover border-2 border-glass-border p-1 shadow-neural"
            />
          ) : (
            <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-black shadow-neural">
              {(profile.full_name || profile.username)?.[0]?.toUpperCase()}
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-bg-page flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-signal"></div>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <span className="text-blue-500 dark:text-blue-400 font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">
            Node Identity: Verified
          </span>
          <h1 className="text-4xl font-black text-text-main tracking-tight leading-tight mb-2">
            {profile.full_name || profile.username}
          </h1>
          {profile.headline && (
            <p className="text-xl font-medium text-text-muted tracking-tight">
              {profile.headline}
            </p>
          )}
          {profile.location && (
            <div className="flex items-center justify-center md:justify-start gap-2 mt-4 text-text-muted/60">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-xs font-bold uppercase tracking-widest">
                {profile.location}
              </span>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-8">
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-glass-surface hover:bg-glass-surface/80 border border-glass-border rounded-xl text-[10px] font-black uppercase tracking-widest text-text-main transition-all"
              >
                Network Node
              </a>
            )}
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-[#0077b5]/10 hover:bg-[#0077b5]/20 border border-[#0077b5]/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#00a0dc] transition-all"
              >
                Neural ID
              </a>
            )}
            {profile.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-glass-surface hover:bg-glass-surface/80 border border-glass-border rounded-xl text-[10px] font-black uppercase tracking-widest text-text-main transition-all"
              >
                Source Protocol
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
