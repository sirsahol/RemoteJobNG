import React from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";

export function CallToAction() {
  return (
    <section className="py-40 px-4">
        <div className="max-w-6xl mx-auto glass-card bg-gradient-to-br from-blue-600/20 via-bg-page to-indigo-600/20 border-glass-border p-1 md:p-1.5 overflow-hidden relative group">
          <div className="bg-bg-page/40 backdrop-blur-3xl rounded-[1.4rem] p-16 md:p-28 text-center relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] group-hover:bg-blue-500/20 transition-all duration-1000" />
            <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] group-hover:bg-indigo-500/20 transition-all duration-1000" />
            
            <h2 className="text-6xl md:text-8xl font-black text-text-main mb-10 relative z-10 tracking-tighter leading-[0.85]">Scale Your <br /><span className="text-blue-500">Execution.</span></h2>
            <p className="text-text-muted mb-16 text-xl md:text-2xl relative z-10 max-w-2xl mx-auto font-medium leading-relaxed">Establish your node. Join 15,000+ engineers already deployed within the global technical network.</p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
              <Button 
                variant="primary"
                size="lg"
                className="px-16 py-7 rounded-2xl bg-text-main text-bg-page hover:bg-text-main/90"
                onClick={() => window.location.href = '/signup'}
              >
                Establish Identity
              </Button>
              <Button 
                variant="secondary"
                size="lg"
                className="px-16 py-7 rounded-2xl"
                onClick={() => window.location.href = '/jobs'}
              >
                Query Nodes
              </Button>
            </div>
          </div>
        </div>
    </section>
  );
}
