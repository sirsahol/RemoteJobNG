"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);          // full user object
  const [token, setToken] = useState(null);         // access token
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);     // initial hydration

  // Hydrate from localStorage on mount (only user object, tokens are in HttpOnly cookies)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch {}
    }
    
    // Check if we are still logged in by fetching /me/
    const verifyAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/users/me/`, {
          credentials: 'include',
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          setToken("PRESENT"); // Dummy value to indicate we have a cookie
        } else {
          logout();
        }
      } catch (e) {
        // If fetch fails, we might be offline or session expired
        console.error("Auth verification failed", e);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [logout]);

  const login = useCallback(async (access, refresh) => {
    // access and refresh are still in response body for now, 
    // but they are also set as HttpOnly cookies by the backend.
    setToken("PRESENT");
    setRefreshToken("PRESENT");
    
    // Fetch user profile immediately after login
    try {
      const res = await fetch(`${API_URL}/api/v1/users/me/`, {
        credentials: 'include',
      });
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (e) {
      console.error("Failed to fetch user profile after login", e);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/api/v1/users/logout/`, {
        method: "POST",
        credentials: 'include',
      });
    } catch (e) {
      console.error("Logout request failed", e);
    }
    
    localStorage.removeItem("user");
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/token/refresh/`, {
        method: "POST",
        credentials: 'include',
      });
      if (res.ok) {
        setToken("PRESENT");
        return "PRESENT";
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
  const isAdmin = user?.is_staff || false;

  return (
    <AuthContext.Provider value={{
      user, token, refreshToken, loading,
      isAuthenticated, isEmployer, isSeeker, isAdmin,
      login, logout, refreshAccessToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
