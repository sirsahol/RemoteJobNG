"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/utils/axiosInstance";

const JOB_TYPES = [
  { value: "", label: "All Types" },
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
];

const REMOTE_TYPES = [
  { value: "", label: "All Locations" },
  { value: "fully_remote", label: "Fully Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "on_site", label: "On-Site" },
];

const EXPERIENCE_LEVELS = [
  { value: "", label: "Any Experience" },
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead / Principal" },
];

function AllJobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  // Filter state
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [searchMode, setSearchMode] = useState("standard"); // "standard" or "neural"
  const [jobType, setJobType] = useState(searchParams.get("job_type") || "");
  const [remoteType, setRemoteType] = useState(searchParams.get("remote_type") || "");
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get("experience_level") || "");
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      if (jobType) params.set("job_type", jobType);
      if (remoteType) params.set("remote_type", remoteType);
      if (experienceLevel) params.set("experience_level", experienceLevel);
      params.set("page", page);

      let endpoint = "/jobs/";
      if (searchMode === "neural" && search) {
        endpoint = "/intelligence/search/";
      } else if (search) {
        params.set("search", search);
      }

      const res = await api.get(`${endpoint}?${params.toString()}`);
      const data = res.data.results || res.data || [];
      setJobs(Array.isArray(data) ? data : []);
      setTotalCount(res.data.count || (Array.isArray(data) ? data.length : 0));
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
    } catch (err) {
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, searchMode, jobType, remoteType, experienceLevel, page]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const formatSalary = (job) => {
    if (!job.is_salary_public || (!job.salary_min && !job.salary_max)) return null;
    const currency = job.salary_currency || "USD";
    const symbols = { USD: "$", GBP: "£", EUR: "€", NGN: "₦", CAD: "CA$", AUD: "A$" };
    const sym = symbols[currency] || currency;
    if (job.salary_min && job.salary_max) return `${sym}${Number(job.salary_min).toLocaleString()} – ${sym}${Number(job.salary_max).toLocaleString()}`;
    if (job.salary_min) return `From ${sym}${Number(job.salary_min).toLocaleString()}`;
    return `Up to ${sym}${Number(job.salary_max).toLocaleString()}`;
  };

  return (
    <div className="min-h-screen pt-28">
      {/* Search & Filter Header */}
      <section className="px-4 mb-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-text-main mb-2 tracking-tight">
               Discover Your Next <span className="text-blue-600 dark:text-blue-400">Remote Move</span>
            </h1>
            <p className="text-text-muted font-medium">
              {totalCount > 0 ? `${totalCount.toLocaleString()} verified roles found.` : "Explore high-impact remote careers."}
            </p>
          </div>

          <form onSubmit={handleSearch} className="glass-card p-2 flex flex-col md:flex-row gap-2 border-glass-border">
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                placeholder={searchMode === "neural" ? "Ask naturally: 'React jobs in Europe with high pay'..." : "Search jobs, skills, companies..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent px-6 py-4 text-text-main placeholder-text-muted focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchMode(searchMode === "standard" ? "neural" : "standard")}
                className={`mr-4 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${searchMode === "neural" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40" : "bg-glass-surface text-text-muted hover:text-text-main"}`}
              >
                {searchMode === "neural" ? "Neural Active" : "Standard"}
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 px-2 md:px-0">
              <select value={jobType} onChange={(e) => { setJobType(e.target.value); setPage(1); }}
                className="bg-glass-surface border border-glass-border rounded-xl px-4 py-4 text-sm text-text-main focus:outline-none transition-colors">
                {JOB_TYPES.map(t => <option key={t.value} value={t.value} className="bg-bg-page text-text-main">{t.label}</option>)}
              </select>
              <select value={remoteType} onChange={(e) => { setRemoteType(e.target.value); setPage(1); }}
                className="bg-glass-surface border border-glass-border rounded-xl px-4 py-4 text-sm text-text-main focus:outline-none transition-colors">
                {REMOTE_TYPES.map(t => <option key={t.value} value={t.value} className="bg-bg-page text-text-main">{t.label}</option>)}
              </select>
              <select value={experienceLevel} onChange={(e) => { setExperienceLevel(e.target.value); setPage(1); }}
                className="bg-glass-surface border border-glass-border rounded-xl px-4 py-4 text-sm text-text-main focus:outline-none transition-colors">
                {EXPERIENCE_LEVELS.map(t => <option key={t.value} value={t.value} className="bg-bg-page text-text-main">{t.label}</option>)}
              </select>
            </div>

            <button type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95">
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-20">
        {error && (
          <div className="glass-card border-red-500/20 bg-red-500/5 text-red-500 dark:text-red-400 px-6 py-4 mb-8 text-sm font-medium">{error}</div>
        )}

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-8 animate-pulse border-glass-border">
                <div className="h-4 bg-text-muted/10 rounded-full mb-4 w-3/4" />
                <div className="h-3 bg-text-muted/10 rounded-full mb-3 w-1/2" />
                <div className="h-3 bg-text-muted/10 rounded-full w-1/3" />
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <div key={job.id}
                  className={`glass-card p-6 flex flex-col gap-4 group transition-all duration-300 hover:border-blue-500/40 ${job.is_featured ? "border-blue-500/30 ring-1 ring-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.1)]" : "border-glass-border"}`}>
                  
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      {job.company_logo_url ? (
                        <Image src={job.company_logo_url} alt={job.company_name} width={48} height={48} className="h-12 w-12 rounded-xl object-contain bg-glass-surface p-1.5 border border-glass-border" />
                      ) : (
                        <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                          {job.company_name?.charAt(0) || "C"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-bold text-text-main group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">{job.title}</h3>
                        <p className="text-xs text-text-muted font-medium truncate uppercase tracking-wider">{job.company_name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="bg-glass-surface border border-glass-border text-text-muted px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {job.job_type?.replace("_", " ")}
                    </span>
                    <span className="bg-glass-surface border border-glass-border text-text-muted px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      {job.remote_type?.replace("_", " ")}
                    </span>
                    {job.experience_level && job.experience_level !== "any" && (
                      <span className="bg-blue-500/5 border border-blue-500/10 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {job.experience_level}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto pt-6 border-t border-glass-border flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold mb-1">Potential Pay</span>
                      <span className="text-sm font-bold text-text-main">
                        {formatSalary(job) || "Competitive"}
                      </span>
                    </div>
                    <Link href={`/jobs/${job.slug || job.id}`}
                      className="bg-glass-surface hover:bg-blue-500 hover:text-white text-text-main p-3 rounded-xl transition-all border border-glass-border group-hover:border-blue-500/30 group-hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-6 mt-16">
              <button onClick={() => setPage(p => p - 1)} disabled={!prevPage}
                className="glass-card px-6 py-3 text-sm font-bold text-text-muted disabled:opacity-20 hover:text-text-main transition-all active:scale-95">
                ← Previous
              </button>
              <div className="h-8 w-[1px] bg-glass-border" />
              <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Page {page}</span>
              <div className="h-8 w-[1px] bg-glass-border" />
              <button onClick={() => setPage(p => p + 1)} disabled={!nextPage}
                className="glass-card px-6 py-3 text-sm font-bold text-text-muted disabled:opacity-20 hover:text-text-main transition-all active:scale-95">
                Next →
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-32 glass-card border-dashed border-glass-border">
            <div className="text-4xl mb-4 opacity-40">🔍</div>
            <p className="text-text-muted text-lg font-bold mb-2">No matching roles found</p>
            <p className="text-text-muted/60 text-sm">Try broadening your filters or search terms.</p>
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
