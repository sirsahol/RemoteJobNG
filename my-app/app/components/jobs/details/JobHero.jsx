import Image from "next/image";

export function JobHero({ job }) {
  return (
    <div className="p-8 md:p-12 border-b border-glass-border bg-glass-surface flex flex-col md:flex-row gap-8 items-start md:items-center">
      {job.company_logo_url ? (
        <Image src={job.company_logo_url} alt={job.company_name} width={80} height={80} className="h-20 w-20 rounded-2xl object-contain bg-glass-surface border border-glass-border p-2 shadow-xl" />
      ) : (
        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-3xl shadow-xl">
          {job.company_name?.charAt(0) || "C"}
        </div>
      )}
      <div className="flex-1">
        <h1 className="text-3xl md:text-4xl font-black text-text-main tracking-tight leading-tight">{job.title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4">
          <span className="text-blue-600 dark:text-blue-400 font-bold text-sm tracking-tight">{job.company_name}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-text-muted/20"></span>
          <span className="text-text-muted text-sm font-medium">{job.location || "Remote"}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-text-muted/20"></span>
          <span className="text-text-muted text-sm font-black uppercase tracking-widest text-[10px]">{job.job_type?.replace("_", " ")}</span>
        </div>
      </div>
    </div>
  );
}
