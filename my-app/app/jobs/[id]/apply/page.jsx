// @dsp obj-19d54ebf
"use client";

import React from "react";
import { useApply } from "@/hooks/useApply";
import { ApplyHeader } from "@/app/components/apply/ApplyHeader";
import { ApplyForm } from "@/app/components/apply/ApplyForm";
import { ApplyStatus } from "@/app/components/apply/ApplyStatus";
import { ApplyBackButton } from "@/app/components/apply/ApplyBackButton";

export default function ApplyPage() {
  const {
    job,
    loading,
    coverLetter,
    setCoverLetter,
    resume,
    setResume,
    submitting,
    message,
    error,
    handleSubmit,
    goBack
  } = useApply();

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
      <div className="max-w-2xl mx-auto">
        <ApplyBackButton onBack={goBack} />

        <div className="glass-card p-10 border-glass-border shadow-2xl animate-in zoom-in-95 duration-700">
          <ApplyHeader job={job} />
          <ApplyStatus message={message} error={error} />
          <ApplyForm 
            coverLetter={coverLetter}
            setCoverLetter={setCoverLetter}
            resume={resume}
            setResume={setResume}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
