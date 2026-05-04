// @dsp func-l01
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/axiosInstance";

export function useLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);
    try {
      console.log("Submitting login...");
      const res = await api.post("/token/", { username, password });
      console.log("Login success, calling login function...");
      await login(res.data.access, res.data.refresh);
      console.log("Login function completed.");
      
      const savedUser = localStorage.getItem("user");
      let role = "job_seeker";
      if (savedUser) {
        try { role = JSON.parse(savedUser).role; } catch {}
      }
      
      const redirectTo = searchParams.get("redirect") ||
        (role === "employer" ? "/dashboard/employer" : "/dashboard/seeker");
      
      router.push(redirectTo);
    } catch (err) {
      setError(err.message || "Protocol rejection: Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    loading,
    error,
    handleSubmit
  };
}
