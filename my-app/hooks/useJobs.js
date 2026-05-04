import { useState, useCallback, useEffect } from "react";
import api from "@/utils/axiosInstance";
import { useRouter, useSearchParams } from "next/navigation";

export const JOB_TYPES = [
  { value: "", label: "All Types" },
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
  { value: "internship", label: "Internship" },
];

export const REMOTE_TYPES = [
  { value: "", label: "All Locations" },
  { value: "fully_remote", label: "Fully Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "on_site", label: "On-Site" },
];

export const EXPERIENCE_LEVELS = [
  { value: "", label: "Any Experience" },
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead / Principal" },
];

export function useJobs() {
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

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
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

  return {
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
  };
}
