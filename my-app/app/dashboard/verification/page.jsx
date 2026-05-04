"use client";

import React from 'react';
import { useVerification } from '@/hooks/useVerification';
import { VerificationForm } from '@/app/components/dashboard/verification/VerificationForm';
import { VerificationStatusList } from '@/app/components/dashboard/verification/VerificationStatusList';
import { ShieldCheck, ArrowLeft } from 'iconoir-react';
import Link from 'next/link';

export default function VerificationPage() {
  const { requests, loading, submitting, submitRequest } = useVerification();

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs / Back */}
        <Link 
          href="/dashboard/seeker" 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4 flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-500/30">
              <ShieldCheck className="w-10 h-10 text-blue-500" />
            </div>
            Trust & Verification
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Build credibility and increase your visibility to employers by verifying your identity, 
            skills, and work infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Submission Form */}
          <div className="lg:col-span-7">
            <VerificationForm onSubmit={submitRequest} submitting={submitting} />
          </div>

          {/* Status & Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-gradient-to-br from-indigo-600/20 to-blue-600/20 border border-white/10 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="text-blue-400" />
                Why get verified?
              </h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-xs font-bold flex-shrink-0">1</div>
                  <span><strong className="text-white">Priority Ranking:</strong> Verified profiles appear higher in search results.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-xs font-bold flex-shrink-0">2</div>
                  <span><strong className="text-white">Trust Badges:</strong> Display badges on your profile for employers to see.</span>
                </li>
                <li className="flex gap-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-xs font-bold flex-shrink-0">3</div>
                  <span><strong className="text-white">Higher Reputation:</strong> Each verification boosts your integrity score.</span>
                </li>
              </ul>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            ) : (
              <VerificationStatusList requests={requests} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
