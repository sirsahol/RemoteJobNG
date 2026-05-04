// @dsp obj-b88cacfb
"use client";

import React from "react";
import { useAdminVerification } from "@/hooks/useAdminVerification";
import { VerificationHeader, VerificationTable } from "@/app/components/admin/verification";

/**
 * AdminVerificationPage (Orchestration Tier)
 * Composes the logic hook and UI components for the verification audit.
 */
export default function AdminVerificationPage() {
  const { requests, loading, error, handleApprove, handleReject } = useAdminVerification();

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

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <VerificationHeader />

        {error && (
          <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 rounded-2xl text-center font-bold">
            {error}
          </div>
        )}

        <VerificationTable
          requests={requests}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>
    </div>
  );
}
