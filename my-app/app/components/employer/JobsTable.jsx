import Link from "next/link";
import { JobRow } from "./JobRow";
import { GlassCard } from "../ui/GlassCard";

export function JobsTable({ myJobs, handleCloseJob }) {
  return (
    <GlassCard 
      className="overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000"
      variant="default"
      noPadding
    >
      <div className="p-8 border-b border-glass-border/30 flex items-center justify-between bg-glass-surface/50">
         <h2 className="text-xl font-bold text-text-main flex items-center gap-3">
           <span className="w-2 h-6 bg-blue-500 rounded-full animate-pulse"></span>
           Active Talent Channels
         </h2>
         <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500/20"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500/20"></div>
         </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-glass-border/30 text-text-muted/50 text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="px-8 py-6">Position Title</th>
              <th className="px-8 py-6">Engagement</th>
              <th className="px-8 py-6">Intelligence</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-glass-border/30">
            {myJobs.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-8 py-20 text-center">
                  <p className="text-text-muted/50 font-bold uppercase tracking-widest text-xs mb-4">
                    No active talent channels
                  </p>
                  <Link href="/jobs/post" className="text-blue-400 font-black text-[10px] uppercase tracking-widest border-b border-blue-400/30 pb-1 hover:border-blue-400 transition-all">
                    Initialize first talent channel
                  </Link>
                </td>
              </tr>
            ) : (
              myJobs.map(job => (
                <JobRow 
                  key={job.id} 
                  job={job} 
                  onClose={handleCloseJob} 
                />
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-6 bg-glass-surface/50 border-t border-glass-border/30 flex justify-between items-center">
         <p className="text-[10px] font-bold text-text-muted/50 uppercase tracking-widest">
           Global Talent Distribution: 100% Remote-First
         </p>
         <div className="flex gap-1">
            {[1, 2, 3].map(i => (
               <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-blue-500' : 'bg-glass-border/20'}`}></div>
            ))}
         </div>
      </div>
    </GlassCard>
  );
}

