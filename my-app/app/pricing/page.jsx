// @dsp obj-6237b690
"use client";

import React from "react";
import { usePricing } from "@/hooks/usePricing";
import { PricingHeader } from "@/app/components/pricing/PricingHeader";
import { PricingCard } from "@/app/components/pricing/PricingCard";
import { PricingFooter } from "@/app/components/pricing/PricingFooter";

export default function PricingPage() {
  const { plans, loading, initiating, handleSelectPlan } = usePricing();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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
        <PricingHeader />
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, i) => (
            <PricingCard 
              key={plan.id}
              plan={plan}
              index={i}
              initiating={initiating}
              onSelect={handleSelectPlan}
            />
          ))}
        </div>

        <PricingFooter />
      </div>
    </div>
  );
}
