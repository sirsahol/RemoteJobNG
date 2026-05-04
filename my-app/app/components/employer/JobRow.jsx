import Link from "next/link";
import { Badge } from "../ui/Badge";

const STATUS_VARIANTS = {
  active: "success",
  draft: "default",
  paused: "warning",
  closed: "danger",
  expired: "warning",
};

export function JobRow({ job, onClose }) {
  return (
    <tr className="group hover:bg-glass-surface/40 transition-colors">
      <td className="px-8 py-6">
        <Link href={`/jobs/${job.slug || job.id}`} className="font-bold text-text-main group-hover:text-blue-400 transition-colors text-sm">
          {job.title}
        </Link>
        <p className="text-text-muted/30 text-[10px] font-medium mt-1">Ref ID: #{job.id?.toString().slice(-4)}</p>
      </td>
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
           <div className="text-center">
             <p className="text-text-main font-bold text-xs">{job.application_count || 0}</p>
             <p className="text-text-muted/50 text-[9px] font-black uppercase tracking-tighter">Applied</p>
           </div>
           <div className="w-px h-6 bg-glass-border/20"></div>
           <div className="text-center">
             <p className="text-text-main font-bold text-xs">{job.view_count || 0}</p>
             <p className="text-text-muted/50 text-[9px] font-black uppercase tracking-tighter">Views</p>
           </div>
        </div>
      </td>
      <td className="px-8 py-6">
         <Link href={`/dashboard/employer/jobs/${job.id}/applicants`} className="text-blue-400 text-[10px] font-black uppercase tracking-widest hover:text-blue-300 transition-colors bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
           View Applicants
         </Link>
      </td>
      <td className="px-8 py-6">
        <Badge variant={STATUS_VARIANTS[job.status] || "default"}>
          {job.status}
        </Badge>
      </td>
      <td className="px-8 py-6 text-right">
        <div className="flex justify-end gap-4">
          <Link href={`/jobs/${job.slug || job.id}/edit`} className="text-text-muted/40 hover:text-text-main transition-colors">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </Link>
          {job.status !== "closed" && (
            <button onClick={() => onClose(job.id)} className="text-text-muted/40 hover:text-red-400 transition-colors">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

