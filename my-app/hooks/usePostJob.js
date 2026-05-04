import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/axiosInstance";

const INITIAL = {
  title: "", company_name: "", location: "Remote",
  job_type: "", remote_type: "fully_remote",
  experience_level: "", salary_min: "", salary_max: "",
  salary_currency: "USD", description: "", application_url: "",
};

export function usePostJob() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/post_job");
    }
  }, [authLoading, isAuthenticated, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    
    try {
      await api.post("/jobs/", {
        ...formData,
        salary_min: formData.salary_min || null,
        salary_max: formData.salary_max || null,
      });
      setSubmitted(true);
      setFormData(INITIAL);
      setTimeout(() => router.push("/dashboard/employer"), 2500);
    } catch (err) {
      const data = err.response?.data;
      setError(data?.detail || Object.values(data || {})[0]?.[0] || "Failed to post job.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    formData,
    submitted,
    submitting,
    error,
    loading: authLoading,
    handleChange,
    handleSubmit,
  };
}
