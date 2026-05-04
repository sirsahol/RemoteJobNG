import React from "react";
import Button from "../ui/Button";

const TIER_STYLING = {
  basic: "border-glass-border bg-glass-surface",
  featured: "border-blue-500/30 bg-blue-500/5 ring-1 ring-blue-500/20 shadow-featured",
  premium: "border-indigo-500/30 bg-indigo-500/5 shadow-neural",
};

export function PricingCard({ plan, index, initiating, onSelect }) {
  return (
    <div 
      className={`glass-card p-10 flex flex-col border animate-in fade-in slide-in-from-bottom-8 duration-700 relative ${TIER_STYLING[plan.tier] || "border-glass-border"}`}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {plan.tier === "featured" && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
           <span className="bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-signal">
             Featured Protocol
           </span>
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="text-2xl font-black text-text-main mb-2 tracking-tight">{plan.name}</h3>
        <p className="text-text-muted/60 text-xs font-medium leading-relaxed">{plan.description}</p>
      </div>

      <div className="mb-10">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-text-main tracking-tighter">
            ₦{Number(plan.price_ngn).toLocaleString()}
          </span>
          <span className="text-text-muted/40 text-[10px] font-black uppercase tracking-widest">/ Listing</span>
        </div>
        <p className="text-text-muted/40 text-[9px] font-bold uppercase tracking-tighter mt-1">
          ≈ ${Number(plan.price_usd).toFixed(0)} USD Global Rate
        </p>
      </div>

      <ul className="space-y-4 mb-12 flex-1">
        {(plan.features || []).map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-text-muted font-medium">
            <span className="text-blue-500 mt-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <Button
        onClick={() => onSelect(plan)}
        isLoading={initiating === plan.id}
        variant={plan.tier === "featured" ? "primary" : "outline"}
        className="w-full py-5 text-[10px] uppercase tracking-[0.2em]"
      >
        Commit Protocol
      </Button>
    </div>
  );
}

