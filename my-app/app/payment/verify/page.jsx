"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utils/axiosInstance";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState("verifying"); // verifying | success | failed
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!reference) {
      setStatus("failed");
      setMessage("No payment reference found.");
      return;
    }
    api.get(`/payment/verify/?reference=${reference}`)
      .then(res => {
        setStatus("success");
        setMessage(res.data?.message || "Payment verified successfully.");
        setTimeout(() => router.push("/dashboard/employer"), 3000);
      })
      .catch(err => {
        setStatus("failed");
        setMessage(err.response?.data?.detail || "Payment verification failed.");
      });
  }, [reference]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full text-center">
        {status === "verifying" && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-gray-800">Verifying your payment...</h1>
            <p className="text-gray-500 mt-2">Please wait, do not close this page.</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-green-700 mb-2">Payment Successful</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <p className="text-sm text-gray-400">Redirecting to your dashboard...</p>
          </>
        )}
        {status === "failed" && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-700 mb-2">Payment Failed</h1>
            <p className="text-gray-600 mb-6">{message}</p>
            <Link href="/pricing"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition">
              Try Again
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentVerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
