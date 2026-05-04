import React from "react";
import { JOB_TYPES, REMOTE_TYPES, EXPERIENCE_LEVELS } from "@/hooks/useJobs";
import { GlassCard } from "../ui/GlassCard";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";

export function JobFilterForm({
  search,
  setSearch,
  searchMode,
  setSearchMode,
  jobType,
  setJobType,
  remoteType,
  setRemoteType,
  experienceLevel,
  setExperienceLevel,
  setPage,
  handleSearchSubmit
}) {
  return (
    <section className="px-4 mb-12">
      <div className="max-w-6xl mx-auto">
        <GlassCard className="p-2" variant="default">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative flex items-center">
              <Input
                type="text"
                placeholder={searchMode === "neural" ? "Ask naturally: 'React jobs in Europe with high pay'..." : "Filter by role, stack, or organization..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
              <button
                type="button"
                onClick={() => setSearchMode(searchMode === "standard" ? "neural" : "standard")}
                className={`absolute right-4 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all z-10 ${
                  searchMode === "neural" 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40" 
                    : "bg-glass-surface text-text-muted hover:text-text-main border border-glass-border"
                }`}
              >
                {searchMode === "neural" ? "Neural Active" : "Standard"}
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 px-2 md:px-0">
              <select 
                value={jobType} 
                onChange={(e) => { setJobType(e.target.value); setPage(1); }}
                className="bg-glass-surface border border-glass-border rounded-xl px-4 py-4 text-sm text-text-main focus:outline-none focus:border-blue-500/50 transition-colors cursor-pointer"
                aria-label="Job Type"
              >
                {JOB_TYPES.map(t => <option key={t.value} value={t.value} className="bg-bg-page text-text-main">{t.label}</option>)}
              </select>
              <select 
                value={remoteType} 
                onChange={(e) => { setRemoteType(e.target.value); setPage(1); }}
                className="bg-glass-surface border border-glass-border rounded-xl px-4 py-4 text-sm text-text-main focus:outline-none focus:border-blue-500/50 transition-colors cursor-pointer"
                aria-label="Remote Type"
              >
                {REMOTE_TYPES.map(t => <option key={t.value} value={t.value} className="bg-bg-page text-text-main">{t.label}</option>)}
              </select>
              <select 
                value={experienceLevel} 
                onChange={(e) => { setExperienceLevel(e.target.value); setPage(1); }}
                className="bg-glass-surface border border-glass-border rounded-xl px-4 py-4 text-sm text-text-main focus:outline-none focus:border-blue-500/50 transition-colors cursor-pointer"
                aria-label="Experience Level"
              >
                {EXPERIENCE_LEVELS.map(t => <option key={t.value} value={t.value} className="bg-bg-page text-text-main">{t.label}</option>)}
              </select>
            </div>

            <Button 
              type="submit"
              variant="primary"
              className="px-8 py-4 whitespace-nowrap"
            >
              Execute
            </Button>
          </form>
        </GlassCard>
      </div>
    </section>
  );
}

