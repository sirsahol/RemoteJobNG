import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { Badge } from '../ui/Badge';

const ApplicationsFeed = ({ applications }) => {
  return (
    <GlassCard 
      className="md:col-span-2 overflow-hidden animate-in fade-in slide-in-from-left-4 duration-1000"
      variant="default"
      noPadding
    >
      <div className="p-8 border-b border-glass-border flex justify-between items-center bg-glass-surface/50">
        <div>
          <h2 className="text-xl font-black text-text-main uppercase tracking-tighter italic">
            Active Transmissions
          </h2>
          <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mt-1">
            Ongoing Signal Intercepts
          </p>
        </div>
        <Badge variant="success">
          {applications.length} Packets
        </Badge>
      </div>
      <div className="divide-y divide-glass-border">
        {applications.length > 0 ? (
          applications.slice(0, 5).map((app, i) => (
            <div key={app.id} className="p-6 hover:bg-glass-surface transition-all group flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-600 font-black text-xl">
                  {app.job_title?.[0] || 'J'}
                </div>
                <div>
                  <h3 className="font-black text-text-main group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                    {app.job_title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">
                      {app.company_name}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-glass-border"></span>
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest italic">
                      {new Date(app.applied_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <Badge variant={
                  app.status === 'hired' ? 'success' : 
                  app.status === 'rejected' ? 'danger' : 
                  'primary'
                }>
                  {app.status || 'Pending'}
                </Badge>
                <p className="text-[9px] text-text-muted mt-2 font-black uppercase tracking-widest">
                  Signal Locked
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center text-text-muted font-black uppercase tracking-[0.3em] text-[10px] italic">
            Zero active transmissions detected...
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default ApplicationsFeed;

