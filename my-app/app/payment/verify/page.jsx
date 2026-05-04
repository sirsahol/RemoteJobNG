"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utils/axiosInstance";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState(reference ? "verifying" : "failed"); // verifying | success | failed
  const [message, setMessage] = useState(reference ? "" : "Protocol error: No transmission reference found.");

  useEffect(() => {
    if (!reference) return;
    api.get(`/payment/verify/?reference=${reference}`)
      .then(res => {
        setStatus("success");
        setMessage(res.data?.message || "Transaction synchronized successfully.");
        setTimeout(() => router.push("/dashboard/employer"), 3000);
      })
      .catch(err => {
        setStatus("failed");
        setMessage(err.response?.data?.detail || "Transaction verification failed.");
      });
  }, [reference, router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-12 max-w-md w-full text-center border-glass-border relative overflow-hidden animate-in zoom-in-95 duration-700">
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        {status === "verifying" && (
          <div className="relative z-10">
            <div className="relative w-16 h-16 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
            <h1 className="text-xl font-black text-text-main uppercase tracking-[0.2em] mb-2">Synchronizing</h1>
            <p className="text-text-muted text-xs font-medium uppercase tracking-widest">Verifying payment protocol. Do not interrupt transmission.</p>
          </div>
        )}
        
        {status === "success" && (
          <div className="relative z-10">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h1 className="text-2xl font-black text-text-main uppercase tracking-tighter mb-4">Protocol Verified</h1>
            <p className="text-emerald-500 dark:text-emerald-400/80 font-bold text-sm mb-8 leading-relaxed">{message}</p>
            <div className="flex items-center justify-center gap-3">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <p className="text-[10px] font-black text-text-muted/30 uppercase tracking-[0.3em]">Redirecting to Command Center</p>
            </div>
          </div>
        )}
        
        {status === "failed" && (
          <div className="relative z-10">
            <div className="w-16 h-16 bg-red-500/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-8 animate-in zoom-in duration-500">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            <h1 className="text-2xl font-black text-text-main uppercase tracking-tighter mb-4">Protocol Rejection</h1>
            <p className="text-red-500 dark:text-red-400/80 font-bold text-sm mb-8 leading-relaxed">{message}</p>
            <Link href="/pricing"
              className="inline-block w-full bg-glass-surface hover:bg-text-main text-text-main hover:text-bg-page py-4 rounded-xl font-black text-xs uppercase tracking-widest border border-glass-border transition-all">
              Restart Protocol
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
