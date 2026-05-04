# Authentication & Security

RemoteWorkNaija uses secure, HttpOnly cookie-based JWT (JSON Web Tokens) for authentication. This shift from Bearer tokens in localStorage provides better protection against XSS (Cross-Site Scripting) and simplifies Server-Side Rendering (SSR) authorization.

---

## Backend Configuration

### JWT Settings (`backend/remotejobs_backend/settings.py`)

The platform uses `CustomJWTAuthentication` to support reading tokens from both headers (fallback) and cookies (primary).

```python
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
    
    # Cookie Configuration
    "AUTH_COOKIE": "access_token",
    "REFRESH_COOKIE": "refresh_token",
    "AUTH_COOKIE_HTTP_ONLY": True,
    "AUTH_COOKIE_SECURE": True, # Enabled in production
    "AUTH_COOKIE_SAMESITE": "Lax",
}
```

### Custom Authentication (`backend/users/authenticate.py`)

The `CustomJWTAuthentication` class extends DRF SimpleJWT to extract the token from the `access_token` cookie if the `Authorization` header is missing.

```python
class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        if header is None:
            raw_token = request.COOKIES.get("access_token")
        else:
            raw_token = self.get_raw_token(header)
        # ... validation logic
```

---

## Token Endpoints

```
POST /api/token/           → Returns {access, refresh} AND sets HttpOnly cookies
POST /api/token/refresh/   → Reads refresh cookie → Sets new access/refresh cookies
POST /api/v1/users/logout/ → Clears all authentication cookies
```

---

## Frontend Implementation

### withCredentials Configuration

All API requests made via `axiosInstance` or `fetch` must include `withCredentials: true` (or `credentials: 'include'`) to ensure cookies are sent automatically by the browser.

### AuthContext (`context/AuthContext.jsx`)

The `AuthContext` no longer stores tokens in `localStorage`. Instead, it manages the user profile state and provides methods that interact with cookie-setting endpoints.

**Methods:**
- `login(access, refresh)`: Updates local state after the backend has set the cookies.
- `logout()`: Calls the backend logout endpoint to clear cookies and resets local state.
- `refreshAccessToken()`: Calls the refresh endpoint; the browser handles sending and receiving the HttpOnly refresh cookie.

### Hydration & Verification

On mount, `AuthContext` calls `GET /api/v1/users/me/`. 
- **Success**: Cookies were valid; the user is logged in. State is hydrated with the profile.
- **Failure (401)**: Cookies expired or missing; the user is logged out.

---

## axiosInstance (`utils/axiosInstance.js`)

The centralized axios instance handles automatic token refreshing transparently using a response interceptor.

```javascript
const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  withCredentials: true, // Crucial for cookie transmission
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Backend reads refresh_token cookie and sets new cookies
      await axios.post(`${API_URL}/api/token/refresh/`, {}, { withCredentials: true });
      return api(error.config); // Retry original request
    }
    return Promise.reject(error);
  }
);
```

---

## Next.js Middleware (`middleware.js`)

Since `access_token` is a cookie, the Edge Middleware can read it directly during SSR to protect routes without needing client-side hydration.

```javascript
export function middleware(request) {
  const token = request.cookies.get("access_token")?.value;
  if (!token && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
```

---

## Security Hardening

### Backend

| Issue (original) | Fix applied |
|---|---|
| `SECRET_KEY` hardcoded in `settings.py` | Loaded via `python-decouple` from `.env` |
| `AllowAny` on all endpoints | `IsAuthenticatedOrReadOnly` globally; stricter per-view |
| SQLite committed to repo | Added `db.sqlite3` to `.gitignore` |
| User files (PDFs) committed | Removed from history, added `media/` to `.gitignore` |
| No CORS configuration | `CORS_ALLOWED_ORIGINS` from env |
| No pagination | `PageNumberPagination` with PAGE_SIZE=20 globally |

### Frontend

| Issue (original) | Fix applied |
|---|---|
| `localhost:8000` hardcoded everywhere | All requests via `axiosInstance` using `NEXT_PUBLIC_API_URL` |
| `.next/` and `node_modules/` committed | Proper `.gitignore` |
| No `.env` management | `.env.example` template, `.env.local` gitignored |
| Minimal AuthContext (no refresh, no persistence) | Full rewrite with dual-token, hydration, refresh |
| Mixed axios + fetch | All calls unified through `axiosInstance` |

### HTTP Security Headers (next.config.mjs)

Applied to all routes:
```javascript
{ key: "X-Frame-Options", value: "DENY" }
// Prevents clickjacking

{ key: "X-Content-Type-Options", value: "nosniff" }
// Prevents MIME type sniffing

{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
// Controls what referrer info is sent
```

### Paystack Webhook Verification

```python
def verify_webhook_signature(payload_bytes: bytes, signature: str) -> bool:
    secret = get_secret_key()
    if not secret:
        return True  # Skip in mock mode
    expected = hmac.new(secret.encode(), payload_bytes, hashlib.sha512).hexdigest()
    return hmac.compare_digest(expected, signature)  # Timing-safe comparison
```

`hmac.compare_digest()` is used instead of `==` to prevent timing attacks.

---

## Common Auth Patterns in Pages

### Client component with auth guard
```javascript
"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?redirect=/my-page");
    }
  }, [loading, isAuthenticated]);

  if (loading) return <Spinner />;
  // ... page content
}
```

### Employer-only page
```javascript
const { isAuthenticated, isEmployer, loading } = useAuth();

useEffect(() => {
  if (!loading && (!isAuthenticated || !isEmployer)) {
    router.push("/login");
  }
}, [loading, isAuthenticated, isEmployer]);
```

### API call
```javascript
import api from "@/utils/axiosInstance";

// GET with query params
const res = await api.get("/jobs/", { params: { job_type: "full_time", page: 2 } });

// POST JSON
const res = await api.post("/saved-jobs/", { job: jobId });

// PATCH
const res = await api.patch("/users/me/", { headline: "Senior Developer" });

// DELETE
await api.delete(`/saved-jobs/${savedJobId}/`);
```
