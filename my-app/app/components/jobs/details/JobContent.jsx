import Link from "next/link";

export function JobContent({ job, saved, saving, onSave }) {
  return (
    <div className="lg:col-span-2 p-8 md:p-12 space-y-10">
      <section>
        <h2 className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
          <span className="w-2 h-4 bg-blue-500 rounded-full"></span>
          Node Requirements
        </h2>
        <div className="text-text-main/80 leading-relaxed whitespace-pre-wrap font-medium text-lg">
          {job.description}
        </div>
      </section>

      <div className="flex items-center gap-4 pt-6 border-t border-glass-border">
        <button
          onClick={onSave}
          disabled={saving}
          className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all border ${
            saved
              ? "bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-600/30"
              : "bg-glass-surface text-text-muted border-glass-border hover:bg-text-muted/5"
          } disabled:opacity-50`}
        >
          {saved ? "★ Saved to Watchlist" : "☆ Pin Protocol"}
        </button>
        <Link
          href={`/jobs/${job.slug || job.id}/apply`}
          className="flex-[1.5] bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest text-center transition-all shadow-signal active:scale-95"
        >
          Broadcast Intent
        </Link>
      </div>
    </div>
  );
}
