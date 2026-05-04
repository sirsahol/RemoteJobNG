// @dsp obj-12ff6dad
"use client";

import React from "react";
import Link from "next/link";
import { usePublicProfile } from "@/hooks/usePublicProfile";
import {
  ProfileHeader,
  ProfileBio,
  ProfileStats,
  ProfileSkills,
} from "@/app/components/profile/public";

/**
 * PublicProfilePage (Orchestration Tier)
 * Composes the profile view from modular UI units and the data hook.
 */
export default function PublicProfilePage() {
  const { profile, loading, notFound } = usePublicProfile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center bg-bg-page">
        <div className="w-24 h-24 rounded-3xl bg-glass-surface border border-glass-border flex items-center justify-center text-text-muted/20 mb-4">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-text-main tracking-tight">Profile Not Found</h1>
        <p className="text-text-muted max-w-md font-medium">
          This profile does not exist or has been restricted by the owner&apos;s privacy protocols.
        </p>
        <Link
          href="/jobs"
          className="bg-glass-surface hover:bg-glass-surface/80 text-text-main border border-glass-border px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
        >
          Browse Active Roles
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="glass-card p-10 border-glass-border relative overflow-hidden group">
          <ProfileHeader profile={profile} />
          <ProfileBio bio={profile.bio} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ProfileStats yearsOfExperience={profile.years_of_experience} />
          <ProfileSkills skills={profile.skills} />
        </div>
      </div>
    </main>
  );
}
