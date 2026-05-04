// @dsp func-e2c8d689
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import api from "@/utils/axiosInstance";

/**
 * Logic Tier: usePublicProfile
 * Encapsulates the logic for fetching a user's public node identity.
 */
export function usePublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!username) return;

    setLoading(true);
    api.get(`/users/${username}/`)
      .then(res => {
        setProfile(res.data);
        setNotFound(false);
      })
      .catch(err => {
        if (err.response?.status === 404) {
          setNotFound(true);
        }
      })
      .finally(() => setLoading(false));
  }, [username]);

  return {
    profile,
    loading,
    notFound,
    username
  };
}
