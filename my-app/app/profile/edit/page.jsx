"use client";

import { useProfileEdit } from "@/hooks/useProfileEdit";
import ProfileHeader from "@/app/components/profile/ProfileHeader";
import VerificationSection from "@/app/components/profile/VerificationSection";
import ProfileForm from "@/app/components/profile/ProfileForm";

export default function EditProfilePage() {
  const {
    form,
    infra,
    badges,
    verificationStatus,
    saving,
    success,
    error,
    authLoading,
    isAuthenticated,
    handleChange,
    handleInfraToggle,
    handleSubmit,
    handleRequestVerification,
    setVisibility,
    router
  } = useProfileEdit();

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <ProfileHeader router={router} />

        <div className="glass-card p-10 border-glass-border animate-in zoom-in-95 duration-700">
          {success && (
            <div className="mb-8 p-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-center font-bold animate-in fade-in duration-300">
              Protocol Synchronized. Profile updated successfully.
            </div>
          )}
          {error && (
            <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-center font-bold animate-in fade-in duration-300">
              {error}
            </div>
          )}

          <div className="space-y-12">
            <ProfileForm 
              form={form}
              infra={infra}
              saving={saving}
              success={success}
              error={error}
              onChange={handleChange}
              onInfraToggle={handleInfraToggle}
              onSubmit={handleSubmit}
              setVisibility={setVisibility}
            />

            <VerificationSection 
              badges={badges}
              verificationStatus={verificationStatus}
              onVerify={handleRequestVerification}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
