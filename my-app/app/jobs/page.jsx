"use client";
import { useEffect, useState, useCallback, Suspense } from "react";
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
  const [jobType, setJobType] = useState(searchParams.get("job_type") || "");
  const [remoteType, setRemoteType] = useState(searchParams.get("remote_type") || "");
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get("experience_level") || "");
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (jobType) params.set("job_type", jobType);
      if (remoteType) params.set("remote_type", remoteType);
      if (experienceLevel) params.set("experience_level", experienceLevel);
      params.set("page", page);

      const res = await api.get(`/jobs/?${params.toString()}`);
      setJobs(res.data.results || res.data);
      setTotalCount(res.data.count || 0);
      setNextPage(res.data.next);
      setPrevPage(res.data.previous);
    } catch (err) {
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, jobType, remoteType, experienceLevel, page]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const formatSalary = (job) => {
    if (!job.is_salary_public || (!job.salary_min && !job.salary_max)) return null;
    const currency = job.salary_currency || "USD";
    const symbols = { USD: "$", GBP: "\u00a3", EUR: "\u20ac", NGN: "\u20a6", CAD: "CA$", AUD: "A$" };
    const sym = symbols[currency] || currency;
    if (job.salary_min && job.salary_max) return `${sym}${Number(job.salary_min).toLocaleString()} \u2013 ${sym}${Number(job.salary_max).toLocaleString()}`;
    if (job.salary_min) return `From ${sym}${Number(job.salary_min).toLocaleString()}`;
    return `Up to ${sym}${Number(job.salary_max).toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search & Filter Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Search jobs, skills, companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <select value={jobType} onChange={(e) => { setJobType(e.target.value); setPage(1); }}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600">
              {JOB_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select value={remoteType} onChange={(e) => { setRemoteType(e.target.value); setPage(1); }}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600">
              {REMOTE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select value={experienceLevel} onChange={(e) => { setExperienceLevel(e.target.value); setPage(1); }}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600">
              {EXPERIENCE_LEVELS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <button type="submit"
              className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition font-medium">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {totalCount > 0 ? `${totalCount.toLocaleString()} Remote Jobs` : "Remote Jobs"}
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>
        )}

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
                <div className="h-3 bg-gray-200 rounded mb-2 w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <div key={job.id}
                  className={`bg-white p-6 rounded-2xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${job.is_featured ? "border-green-300 ring-1 ring-green-200" : "border-gray-100"}`}>
                  {job.is_featured && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded mb-2">Featured</span>
                  )}
                  <div className="flex items-start gap-3 mb-3">
                    {job.company_logo_url ? (
                      <img src={job.company_logo_url} alt={job.company_name} className="h-10 w-10 rounded-lg object-contain bg-gray-50 border" />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                        {job.company_name?.charAt(0) || "C"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
                      <p className="text-sm text-gray-500 truncate">{job.company_name}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                      {job.job_type?.replace("_", " ")}
                    </span>
                    <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">
                      {job.remote_type?.replace("_", " ")}
                    </span>
                    {job.experience_level && job.experience_level !== "any" && (
                      <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-xs font-medium capitalize">
                        {job.experience_level}
                      </span>
                    )}
                  </div>

                  {formatSalary(job) && (
                    <p className="text-sm font-medium text-gray-700 mb-3">{formatSalary(job)}</p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {job.source_name ? `via ${job.source_name}` : job.location || "Remote"}
                    </span>
                    <Link href={`/jobs/${job.slug || job.id}`}
                      className="text-sm font-medium text-green-700 hover:text-green-900 transition">
                      View &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 mt-10">
              <button onClick={() => setPage(p => p - 1)} disabled={!prevPage}
                className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
                &larr; Previous
              </button>
              <span className="text-sm text-gray-500">Page {page}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={!nextPage}
                className="px-4 py-2 border rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
                Next &rarr;
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-2">No jobs found</p>
            <p className="text-gray-300 text-sm">Try adjusting your filters</p>
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
      </div>
    }>
      <AllJobsContent />
    </Suspense>
  );
}
