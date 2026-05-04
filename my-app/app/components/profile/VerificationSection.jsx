"use client";

import React from 'react';

const VerificationSection = ({ badges, verificationStatus, onVerify }) => {
  return (
    <section className="space-y-6">
      <h2 className="text-[10px] font-black text-text-muted/40 uppercase tracking-[0.3em] flex items-center gap-3">
        <span className="w-4 h-px bg-glass-border/20"></span>
        Verification Protocol
      </h2>

      {/* Badges Display */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          {badges.map(b => (
            <div key={b.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
              <span className="text-sm">{b.badge.icon}</span>
              <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">{b.badge.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* Identity Verification */}
      <div className="p-6 rounded-2xl bg-blue-600/5 border border-blue-500/10 flex items-center justify-between group">
        <div className="flex gap-4 items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <span className="text-[11px] font-bold text-text-main block">Identity Verification</span>
            <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
              {badges.find(b => b.badge.slug === 'identity-verified') ? "Verified" : "Elevate your trust score by 40%"}
            </p>
          </div>
        </div>
        {!badges.find(b => b.badge.slug === 'identity-verified') && (
          <button
            type="button"
            onClick={() => onVerify('IDENTITY')}
            className="text-[9px] font-black text-blue-400 uppercase tracking-widest hover:text-text-main transition-colors"
          >
            Request Link
          </button>
        )}
      </div>

      {/* Infrastructure Audit */}
      <div className="p-6 rounded-2xl bg-indigo-600/5 border border-indigo-500/10 space-y-6 group">
        <div className="flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="text-[11px] font-bold text-text-main block">Infrastructure Audit</span>
              <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
                {badges.find(b => b.badge.slug === 'starlink-verified' || b.badge.slug === 'solar-powered') ? "Verified Assets" : "Verify Starlink/Solar Reliability"}
              </p>
            </div>
          </div>
          {!verificationStatus || verificationStatus.status === 'REJECTED' ? (
            <label className="cursor-pointer text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-text-main transition-colors">
              Upload Evidence
              <input
                type="file"
                className="hidden"
                accept="image/*,.pdf"
                onChange={(e) => onVerify('INFRASTRUCTURE', e.target.files[0])}
              />
            </label>
          ) : (
            <span className="text-[9px] font-black text-text-muted/40 uppercase tracking-widest">{verificationStatus.status}</span>
          )}
        </div>
        {verificationStatus?.rejection_reason && verificationStatus.status === 'REJECTED' && (
          <p className="text-[10px] text-red-400/60 font-medium bg-red-500/5 p-3 rounded-xl border border-red-500/10">
            Rejection Reason: {verificationStatus.rejection_reason}
          </p>
        )}
      </div>

      {/* Skill Verification */}
      <div className="p-6 rounded-2xl bg-glass-surface border border-glass-border flex items-center justify-between group">
        <div className="flex gap-4 items-center">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div>
            <span className="text-[11px] font-bold text-text-main block">Elite Skill Certification</span>
            <p className="text-text-muted text-[9px] font-black uppercase tracking-widest">
              {badges.find(b => b.badge.slug === 'elite-talent') ? "Certified" : "Verify Technical Dominance"}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onVerify('SKILL')}
          className="text-[9px] font-black text-purple-400 uppercase tracking-widest hover:text-text-main transition-colors"
        >
          Request Exam
        </button>
      </div>
    </section>
  );
};

export default VerificationSection;
