// @dsp func-29aa5085
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/axiosInstance";

export function useApply() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/jobs/${id}/apply`);
      return;
    }
    if (id) {
      api.get(`/jobs/${id}/`)
        .then(res => setJob(res.data))
        .catch(console.error);
    }
  }, [id, isAuthenticated, authLoading, router]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");
    try {
      const formData = new FormData();
      formData.append("job", id);
      formData.append("cover_letter", coverLetter);
      if (resume) formData.append("resume", resume);
      await api.post("/applications/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("Transmission Successful! Your application has been logged.");
      setTimeout(() => router.push("/dashboard/seeker"), 2000);
    } catch (err) {
      setError(err.response?.data?.detail || "Signal failure. Please attempt transmission again.");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    job,
    loading: authLoading || !job,
    coverLetter,
    setCoverLetter,
    resume,
    setResume,
    submitting,
    message,
    error,
    handleSubmit,
    goBack: () => router.back()
  };
}
