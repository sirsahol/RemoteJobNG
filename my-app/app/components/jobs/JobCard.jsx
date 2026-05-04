import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GlassCard } from "../ui/GlassCard";
import { Badge } from "../ui/Badge";

export function JobCard({ job, formatSalary }) {
  return (
    <GlassCard 
      className="h-full flex flex-col gap-4 group hover:border-blue-500/40"
      variant={job.is_featured ? "premium" : "default"}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          {job.company_logo_url ? (
            <Image 
              src={job.company_logo_url} 
              alt={job.company_name} 
              width={48} 
              height={48} 
              className="h-12 w-12 rounded-xl object-contain bg-glass-surface p-1.5 border border-glass-border" 
            />
          ) : (
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
              {job.company_name?.charAt(0) || "C"}
            </div>
          )}
          <div className="min-w-0">
            <h3 className="font-bold text-text-main group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
              {job.title}
            </h3>
            <p className="text-xs text-text-muted font-medium truncate uppercase tracking-wider">
              {job.company_name}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">
          {job.job_type?.replace("_", " ")}
        </Badge>
        <Badge variant="secondary">
          {job.remote_type?.replace("_", " ")}
        </Badge>
        {job.experience_level && job.experience_level !== "any" && (
          <Badge variant="outline">
            {job.experience_level}
          </Badge>
        )}
      </div>

      <div className="mt-auto pt-6 border-t border-glass-border flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold mb-1">
            Resource Allocation
          </span>
          <span className="text-sm font-bold text-text-main">
            {formatSalary(job) || "Competitive Protocol"}
          </span>
        </div>
        <Link 
          href={`/jobs/${job.slug || job.id}`}
          className="bg-glass-surface hover:bg-blue-500 hover:text-white text-text-main p-3 rounded-xl transition-all border border-glass-border group-hover:border-blue-500/30 group-hover:scale-110"
          aria-label={`View details for ${job.title}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </GlassCard>
  );
}

