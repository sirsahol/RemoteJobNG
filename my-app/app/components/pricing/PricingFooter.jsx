// @dsp obj-7a64b309
import React from "react";

export function PricingFooter() {
  return (
    <div className="text-center animate-in fade-in duration-1000 delay-500">
      <p className="text-text-muted/40 text-[9px] font-black uppercase tracking-[0.3em] flex flex-wrap justify-center items-center gap-x-6 gap-y-4">
        <span>SECURED BY PAYSTACK PROTOCOL</span>
        <span className="w-1 h-1 rounded-full bg-glass-border"></span>
        <span>VAT APPLICABLE AT SOURCE</span>
        <span className="w-1 h-1 rounded-full bg-glass-border"></span>
        <a href="mailto:ops@remotejobng.com" className="text-blue-500/50 hover:text-blue-500 transition-colors">
          DIRECT CHANNEL SUPPORT
        </a>
      </p>
    </div>
  );
}
