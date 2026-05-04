import React from 'react';
import Link from 'next/link';
import { GlassCard } from '../ui/GlassCard';

const NeuralMatches = ({ matches }) => {
  return (
    <GlassCard 
      className="animate-in fade-in slide-in-from-right-4 duration-1000"
      variant="default"
      noPadding
    >
      <div className="p-8 border-b border-glass-border bg-gradient-to-r from-blue-600/5 to-transparent">
        <h2 className="text-xl font-black text-text-main uppercase tracking-tighter flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          Neural Convergence
        </h2>
        <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mt-1 italic">
          AI Optimized Match Factor
        </p>
      </div>
      <div className="p-6 space-y-4">
        {matches.length > 0 ? (
          matches.slice(0, 3).map((match, i) => (
            <div key={i} className="p-5 rounded-2xl bg-glass-surface border border-glass-border hover:border-blue-500/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3">
                <span className="text-[10px] font-black text-blue-600 italic">98.4% Match</span>
              </div>
              <h3 className="font-black text-text-main group-hover:text-blue-600 transition-colors uppercase text-sm tracking-tight mb-1">
                {match.title || 'Network Infrastructure Specialist'}
              </h3>
              <p className="text-[10px] text-text-muted uppercase font-black tracking-widest mb-4">
                {match.company || 'CyberDyne Systems'}
              </p>
              <Link href={`/jobs/${match.id || i}`} className="text-[9px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                Access Node <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
            </div>
          ))
        ) : (
          <div className="py-8 text-center">
             <p className="text-[10px] font-black text-text-muted uppercase tracking-widest italic animate-pulse">
               Scanning Global Job Clusters...
             </p>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default NeuralMatches;

