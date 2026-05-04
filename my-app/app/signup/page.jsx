"use client";
import { useSignup } from "@/hooks/useSignup";
import { SignupHeader, SignupForm, SignupFooter } from "@/app/components/auth";

/**
 * Signup Page Orchestration Tier.
 * Composes the layout using logic from useSignup and UI from auth components.
 */
export default function SignupPage() {
  const {
    formData,
    loading,
    error,
    success,
    handleChange,
    handleSignup
  } = useSignup();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-32 pb-20">
      <div className="glass-card p-10 w-full max-w-lg border-glass-border shadow-blue-500/10">
        <SignupHeader />

        <SignupForm 
          formData={formData}
          loading={loading}
          error={error}
          success={success}
          onChange={handleChange}
          onSubmit={handleSignup}
        />

        <SignupFooter />
      </div>
    </div>
  );
}
