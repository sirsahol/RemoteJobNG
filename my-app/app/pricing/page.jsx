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

  const handleSelectPlan = async (plan) => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/pricing");
      return;
    }
    if (!isEmployer) {
      alert("Only employers can purchase talent acquisition plans. Please sign up as an employer.");
      return;
    }
    setInitiating(plan.id);
    try {
      const res = await api.post("/payment/initiate/", {
        plan_id: plan.id,
        tier: plan.tier,
      });
      if (res.data.authorization_url) {
        window.location.href = res.data.authorization_url;
      } else if (res.data.payment_url) {
        window.location.href = res.data.payment_url;
      } else {
        router.push(`/jobs/post?plan=${plan.tier}`);
      }
    } catch (err) {
      console.error("Payment initiation failed:", err);
      alert("Failed to initiate payment protocol. Please retry.");
    } finally {
      setInitiating(null);
    }
  };

  const TIER_STYLING = {
    basic: "border-glass-border bg-glass-surface",
    featured: "border-blue-500/30 bg-blue-500/5 ring-1 ring-blue-500/20 shadow-featured",
    premium: "border-indigo-500/30 bg-indigo-500/5 shadow-neural",
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <span className="text-blue-400 font-bold tracking-[0.4em] text-[10px] uppercase mb-4 block">Deployment Plans</span>
          <h1 className="text-4xl md:text-6xl font-black text-text-main tracking-tight leading-none mb-6">
            Amplify <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Technical Transmission.</span>
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto font-medium">
            Interface with high-fidelity Nigerian talent nodes through our verified listing protocols.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, i) => (
            <div 
              key={plan.id}
              className={`glass-card p-10 flex flex-col border animate-in fade-in slide-in-from-bottom-8 duration-700 ${TIER_STYLING[plan.tier] || "border-glass-border"}`}
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {plan.tier === "featured" && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                   <span className="bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-signal">Featured Protocol</span>
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-black text-text-main mb-2 tracking-tight">{plan.name}</h3>
                <p className="text-text-muted/60 text-xs font-medium leading-relaxed">{plan.description}</p>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-text-main tracking-tighter">₦{Number(plan.price_ngn).toLocaleString()}</span>
                  <span className="text-text-muted/40 text-[10px] font-black uppercase tracking-widest">/ Listing</span>
                </div>
                <p className="text-text-muted/40 text-[9px] font-bold uppercase tracking-tighter mt-1">≈ ${Number(plan.price_usd).toFixed(0)} USD Global Rate</p>
              </div>

              <ul className="space-y-4 mb-12 flex-1">
                {(plan.features || []).map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-text-muted font-medium">
                    <span className="text-blue-500 mt-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan)}
                disabled={initiating === plan.id}
                className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50 ${
                  plan.tier === "featured"
                    ? "bg-blue-600 text-white hover:bg-blue-500 shadow-signal"
                    : "bg-glass-surface text-text-main/80 hover:bg-glass-surface/80 border border-glass-border"
                }`}
              >
                {initiating === plan.id ? "Initializing..." : "Commit Protocol"}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center animate-in fade-in duration-1000 delay-500">
          <p className="text-text-muted/40 text-[9px] font-black uppercase tracking-[0.3em] flex flex-wrap justify-center items-center gap-x-6 gap-y-4">
            <span>SECURED BY PAYSTACK PROTOCOL</span>
            <span className="w-1 h-1 rounded-full bg-glass-border"></span>
            <span>VAT APPLICABLE AT SOURCE</span>
            <span className="w-1 h-1 rounded-full bg-glass-border"></span>
            <a href="mailto:ops@remotejobng.com" className="text-blue-500/50 hover:text-blue-500 transition-colors">DIRECT CHANNEL SUPPORT</a>
          </p>
        </div>
      </div>
    </div>
  );
}
