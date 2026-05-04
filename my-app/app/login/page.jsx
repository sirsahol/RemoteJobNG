// @dsp obj-l05
"use client";

import React, { Suspense } from "react";
import { useLogin } from "@/hooks/useLogin";
import { LoginHeader } from "@/app/components/auth/login/LoginHeader";
import { LoginForm } from "@/app/components/auth/login/LoginForm";
import { LoginFooter } from "@/app/components/auth/login/LoginFooter";

function LoginContainer() {
  const {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    handleSubmit
  } = useLogin();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="glass-card p-12 w-full max-w-md border-glass-border relative overflow-hidden animate-in zoom-in-95 duration-700">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <LoginHeader />
        
        <LoginForm 
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          loading={loading}
          error={error}
          onSubmit={handleSubmit}
        />

        <LoginFooter />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <LoginContainer />
    </Suspense>
  );
}
