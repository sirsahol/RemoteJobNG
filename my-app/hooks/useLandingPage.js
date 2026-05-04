import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

export function useLandingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredJobs, setFeaturedJobs] = useState([]);

  useEffect(() => {
    api.get("/jobs/?is_featured=true&page_size=6")
      .then(res => setFeaturedJobs(res.data.results || res.data || []))
      .catch(() => {});
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/jobs?search=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/jobs");
    }
  };

  return {
    searchQuery,
    setSearchQuery,
    featuredJobs,
    handleSearch,
  };
}
