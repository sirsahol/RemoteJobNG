"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);          // full user object
  const [token, setToken] = useState(null);         // access token
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);     // initial hydration

  // Hydrate from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    const savedRefresh = localStorage.getItem("refresh_token");
    const savedUser = localStorage.getItem("user");
    if (savedToken) setToken(savedToken);
    if (savedRefresh) setRefreshToken(savedRefresh);
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch {}
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (access, refresh) => {
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    setToken(access);
    setRefreshToken(refresh);
    // Fetch user profile immediately after login
    try {
      const res = await fetch(`${API_URL}/api/v1/users/me/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        // Set cookie for middleware SSR route protection
        document.cookie = `access_token=${access}; path=/; max-age=3600; SameSite=Lax`;
      }
    } catch (e) {
      console.error("Failed to fetch user profile after login", e);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    document.cookie = "access_token=; path=/; max-age=0";
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    const storedRefresh = localStorage.getItem("refresh_token");
    if (!storedRefresh) return null;
    try {
      const res = await fetch(`${API_URL}/api/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: storedRefresh }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("access_token", data.access);
        setToken(data.access);
        return data.access;
      } else {
        logout();
        return null;
      }
    } catch {
      logout();
      return null;
    }
  }, [logout]);

  const isAuthenticated = Boolean(token);
  const isEmployer = user?.role === "employer";
  const isSeeker = user?.role === "job_seeker";

  return (
    <AuthContext.Provider value={{
      user, token, refreshToken, loading,
      isAuthenticated, isEmployer, isSeeker,
      login, logout, refreshAccessToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
