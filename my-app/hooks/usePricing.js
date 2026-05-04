// @dsp func-33fc8fcb
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

export function usePricing() {
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

  return {
    plans,
    loading,
    initiating,
    handleSelectPlan
  };
}
