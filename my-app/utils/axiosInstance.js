import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // The backend CookieTokenRefreshView will read the refresh token from HttpOnly cookie
        await axios.post(`${API_URL}/api/token/refresh/`, {}, { withCredentials: true });
        
        // Retry the original request (now that cookies are updated)
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, we should logout or redirect to login
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
