import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/axiosInstance";

export const useProfileEdit = () => {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, user: authUser } = useAuth();
  
  const [form, setForm] = useState({
    first_name: "", 
    last_name: "", 
    headline: "", 
    bio: "",
    location: "", 
    website: "", 
    linkedin_url: "", 
    github_url: "",
    years_of_experience: "", 
    is_profile_public: true,
  });
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [badges, setBadges] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [infra, setInfra] = useState({
    solar: false, 
    dual_isp: false, 
    starlink: false, 
    backup_battery: false
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/profile/edit");
      return;
    }
    
    if (isAuthenticated) {
      // Fetch Profile Data
      api.get("/users/me/").then(res => {
        const u = res.data;
        setForm({
          first_name: u.first_name || "",
          last_name: u.last_name || "",
          headline: u.headline || "",
          bio: u.bio || "",
          location: u.location || "",
          website: u.website || "",
          linkedin_url: u.linkedin_url || "",
          github_url: u.github_url || "",
          years_of_experience: u.years_of_experience || "",
          is_profile_public: u.is_profile_public ?? true,
        });
      }).catch(console.error);

      // Fetch Verification Data
      api.get("/v1/verification/badges/my_badges/").then(res => setBadges(res.data)).catch(console.error);
      api.get("/v1/verification/requests/").then(res => {
        const latest = res.data[0];
        if (latest) setVerificationStatus(latest);
      }).catch(console.error);
    }
  }, [authLoading, isAuthenticated, router]);

  const handleChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [e.target.name]: val }));
  };

  const handleInfraToggle = (key) => {
    setInfra(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const setVisibility = (value) => {
    setForm(prev => ({ ...prev, is_profile_public: value }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.patch("/users/me/", form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to commit changes to protocol.");
    } finally {
      setSaving(false);
    }
  };

  const handleRequestVerification = async (type, file = null) => {
    try {
      const formData = new FormData();
      formData.append("request_type", type);
      formData.append("metadata", JSON.stringify({ source: "web_v4_editor" }));
      if (file) {
        formData.append("evidence", file);
      }

      const res = await api.post("/v1/verification/requests/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setVerificationStatus(res.data);
      alert("Verification protocol initiated. Evidence uploaded. Awaiting review.");
    } catch (err) {
      alert("Failed to initiate verification. Ensure file is within size limits.");
    }
  };

  return {
    form,
    infra,
    badges,
    verificationStatus,
    saving,
    success,
    error,
    authLoading,
    isAuthenticated,
    handleChange,
    handleInfraToggle,
    handleSubmit,
    handleRequestVerification,
    setVisibility,
    router
  };
};
