export function JobSidebar({ job, formattedSalary }) {
  return (
    <div className="p-8 md:p-12 bg-glass-surface space-y-10">
      <section>
        <h3 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-4">Protocol Parameters</h3>
        <div className="space-y-6">
          {formattedSalary && (
            <div>
              <p className="text-text-main font-bold text-xl tracking-tight">{formattedSalary}</p>
              <p className="text-text-muted text-[9px] font-black uppercase mt-1">Annual Compensation</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {job.remote_type && (
              <span className="bg-glass-surface border border-glass-border text-text-muted px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest">
                {job.remote_type.replace("_", " ")}
              </span>
            )}
            {job.experience_level && job.experience_level !== "any" && (
              <span className="bg-glass-surface border border-glass-border text-text-muted px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest capitalize">
                {job.experience_level}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="p-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-glass-border">
        <h4 className="text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest mb-2">Verified Signal</h4>
        <p className="text-text-muted text-[10px] leading-relaxed font-medium">This listing has been indexed by our 2026 talent protocol. Verified Nigerian remote role.</p>
      </section>

      <section className="pt-6 border-t border-glass-border">
        <p className="text-[9px] font-black text-text-muted/40 uppercase tracking-widest mb-1">Posted on</p>
        <p className="text-text-muted text-xs font-bold">{new Date(job.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </section>
    </div>
  );
}
