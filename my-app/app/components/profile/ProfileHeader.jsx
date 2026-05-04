"use client";

import React from 'react';

const ProfileHeader = ({ router }) => {
  return (
    <>
      <button
        onClick={() => router.back()}
        className="text-text-muted hover:text-text-main transition-colors mb-8 flex items-center gap-2 group"
      >
        <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Terminate Session</span>
      </button>

      <div className="mb-12">
        <span className="text-blue-400 font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">Identity Protocol</span>
        <h1 className="text-4xl font-black text-text-main tracking-tight leading-tight">
          Configure <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Node Parameters</span>
        </h1>
        <p className="text-text-muted mt-3 font-medium">Calibrate your professional presence for the global market.</p>
      </div>
    </>
  );
};

export default ProfileHeader;
