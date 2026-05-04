"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/axiosInstance";

/**
 * Hook to manage Signup logic.
 */
export function useSignup() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "job_seeker",
    phone: "",
    company_name: "",
    bio: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await api.post("/users/register/", formData);

      if (res.data.id) {
        setSuccess("Account created successfully! Securely redirecting...");
        setTimeout(() => router.push("/login"), 1000);
      } else {
        setError(
          res.data?.username?.[0] ||
          res.data?.email?.[0] ||
          "Registration failed. Please check your inputs."
        );
      }
    } catch (err) {
      const data = err.response?.data;
      setError(
        data?.username?.[0] ||
        data?.email?.[0] ||
        data?.detail ||
        "Failed to sign up. Connection issue."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    error,
    success,
    handleChange,
    handleSignup
  };
}
