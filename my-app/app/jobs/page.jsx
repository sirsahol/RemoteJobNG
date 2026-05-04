"use client";
import { Suspense } from "react";
import { useJobs } from "@/hooks/useJobs";
import { JobFilterForm } from "@/app/components/jobs/JobFilterForm";
import { JobCard } from "@/app/components/jobs/JobCard";
import { JobsPagination } from "@/app/components/jobs/JobsPagination";
import { JobsSkeleton } from "@/app/components/jobs/JobsSkeleton";

function AllJobsContent() {
  const {
    jobs,
    loading,
    error,
    totalCount,
    nextPage,
    prevPage,
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
    page,
    setPage,
    handleSearchSubmit,
    formatSalary,
  } = useJobs();

  return (
    <div className="min-h-screen pt-28">
      {/* Search & Filter Header */}
      <section className="px-4 mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-4xl font-bold text-text-main mb-2 tracking-tight">
               Identify Your Next <span className="text-blue-600 dark:text-blue-400">Remote Pivot</span>
            </h1>
            <p className="text-text-muted font-medium">
              {totalCount > 0 ? `${totalCount.toLocaleString()} verified nodes identified.` : "Access high-impact remote roles."}
            </p>
          </div>
        </div>
      </section>

      <JobFilterForm 
        search={search}
        setSearch={setSearch}
        searchMode={searchMode}
        setSearchMode={setSearchMode}
        jobType={jobType}
        setJobType={setJobType}
        remoteType={remoteType}
        setRemoteType={setRemoteType}
        experienceLevel={experienceLevel}
        setExperienceLevel={setExperienceLevel}
        setPage={setPage}
        handleSearchSubmit={handleSearchSubmit}
      />

      <div className="max-w-6xl mx-auto px-4 pb-20">
        {error && (
          <div className="glass-card border-red-500/20 bg-red-500/5 text-red-500 dark:text-red-400 px-6 py-4 mb-8 text-sm font-medium">{error}</div>
        )}

        {loading ? (
          <JobsSkeleton />
        ) : jobs.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} formatSalary={formatSalary} />
              ))}
            </div>

            <JobsPagination 
              page={page}
              setPage={setPage}
              nextPage={nextPage}
              prevPage={prevPage}
            />
          </>
        ) : (
          <div className="text-center py-32 glass-card border-dashed border-glass-border">
            <div className="text-4xl mb-4 opacity-40">🔍</div>
            <p className="text-text-muted text-lg font-bold mb-2">Zero matching nodes identified</p>
            <p className="text-text-muted/60 text-sm">Adjust parameters to expand search radius.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AllJobsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    }>
      <AllJobsContent />
    </Suspense>
  );
}
