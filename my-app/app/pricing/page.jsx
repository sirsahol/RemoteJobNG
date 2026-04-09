"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

export default function PricingPage() {
  const { isAuthenticated, isEmployer } = useAuth();
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initiating, setInitiating] = useState(null);

  useEffect(() => {
    api.get("/payment/plans/")
      .then(res => setPlans(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSelectPlan = (plan) => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/pricing");
      return;
    }
    if (!isEmployer) {
      alert("Only employers can post jobs. Please sign up as an employer.");
      return;
    }
    // Redirect to job post form with selected plan
    router.push(`/jobs/post?plan=${plan.tier}`);
  };

  const TIER_COLORS = {
    basic: "border-gray-200",
    featured: "border-green-400 ring-2 ring-green-300",
    premium: "border-purple-300",
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Post a Job</h1>
          <p className="text-gray-500 text-lg">Reach thousands of skilled Nigerian remote professionals</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div key={plan.id}
              className={`bg-white rounded-2xl p-6 border-2 ${TIER_COLORS[plan.tier] || "border-gray-200"} relative`}>
              {plan.tier === "featured" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full">Most Popular</span>
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">₦{Number(plan.price_ngn).toLocaleString()}</span>
                <span className="text-gray-400 text-sm ml-1">/ listing</span>
                <p className="text-gray-400 text-xs mt-0.5">≈ ${Number(plan.price_usd).toFixed(0)} USD</p>
              </div>

              <ul className="space-y-2 mb-6">
                {(plan.features || []).map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="text-green-600">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition ${
                  plan.tier === "featured"
                    ? "bg-green-700 text-white hover:bg-green-800"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          Payments secured by Paystack · VAT may apply · {" "}
          <a href="mailto:support@remoteworknaija.com" className="hover:text-green-700">Contact support</a>
        </p>
      </div>
    </div>
  );
}
