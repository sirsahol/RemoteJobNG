import React from 'react';
import Link from 'next/link';
import { GlassCard } from '../ui/GlassCard';

const SavedJobs = ({ savedJobs }) => {
  return (
    <GlassCard 
      className="animate-in fade-in slide-in-from-left-4 duration-1000"
      variant="default"
      noPadding
    >
      <div className="p-8 border-b border-glass-border">
        <h2 className="text-xl font-black text-text-main uppercase tracking-tighter italic">
          Intercepted Signals
        </h2>
        <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mt-1">
          Saved Nodes for Acquisition
        </p>
      </div>
      <div className="p-6">
        {savedJobs.length > 0 ? (
          <div className="space-y-4">
            {savedJobs.slice(0, 3).map((job, i) => (
              <div key={job.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 font-black text-sm">
                    {job.title?.[0] || 'S'}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-text-main group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                      {job.title}
                    </h3>
                    <p className="text-[9px] text-text-muted uppercase font-black tracking-widest">
                      {job.company}
                    </p>
                  </div>
                </div>
                <Link href={`/jobs/${job.id}`} className="w-8 h-8 rounded-full border border-glass-border flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all text-text-muted">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-text-muted font-black uppercase tracking-widest text-[10px]">
            Node cache empty...
          </div>
        )}
        <Link href="/jobs/saved" className="mt-8 block text-center py-3 border border-glass-border rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-glass-surface transition-all text-text-main">
          Access Full Archive
        </Link>
      </div>
    </GlassCard>
  );
};

export default SavedJobs;

