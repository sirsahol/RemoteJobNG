# Authentication & Security

RemoteWorkNaija uses JWT (JSON Web Tokens) for stateless authentication across both the Django backend and Next.js frontend.

---

## JWT Configuration

Configured in `backend/remotejobs_backend/settings.py`:

```python
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
}
```

| Setting | Value | Why |
|---|---|---|
| Access token lifetime | 60 minutes | Short enough to limit exposure if leaked |
| Refresh token lifetime | 7 days | Keeps users logged in across sessions |
| Rotate refresh tokens | True | Each refresh call issues a NEW refresh token |
| Blacklist after rotation | True | Old refresh tokens cannot be reused after rotation |
| Update last login | True | Tracks active users via `User.last_login` |

---

## Token Endpoints

```
POST /api/token/           → obtain {access, refresh}
POST /api/token/refresh/   → exchange refresh → new {access}
POST /api/token/verify/    → validate any token
```

The `DEFAULT_AUTHENTICATION_CLASSES` in REST_FRAMEWORK is set to `JWTAuthentication` only — no session auth, no basic auth.

---

## Default Permissions

```python
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ),
}
```

This means:
- **GET requests** to any endpoint are public (unauthenticated users can browse jobs, categories, profiles)
- **POST/PATCH/DELETE requests** require a valid access token

Individual ViewSets override this for more restrictive endpoints (e.g. notifications require full auth for GET too).

---

## Frontend Auth Flow

### AuthContext (`context/AuthContext.js`)

React Context wrapping the entire app via `layout.js`. Provides authentication state and methods to all pages.

**State:**
```javascript
{
  user: Object|null,          // Full user profile from /users/me/
  token: String|null,         // Current access token
  refreshToken: String|null,  // Current refresh token
  loading: Boolean,           // True during initial hydration
  isAuthenticated: Boolean,   // Derived: !!token
  isEmployer: Boolean,        // Derived: user?.role === 'employer'
  isSeeker: Boolean,          // Derived: user?.role === 'job_seeker'
}
```

**Methods:**
```javascript
login(access, refresh)
// 1. Saves both tokens to localStorage
// 2. Calls GET /users/me/ to hydrate user object
// 3. Sets access_token cookie for SSR middleware
// 4. Updates all state

logout()
// 1. Removes access_token, refresh_token, user from localStorage
// 2. Clears access_token cookie
// 3. Resets all state to null/false

refreshAccessToken()
// 1. Reads refresh_token from localStorage
// 2. Calls POST /api/token/refresh/
// 3. On success: updates access_token in localStorage and state, returns new token
// 4. On failure: calls logout(), returns null
```

**Hydration on mount:**
```javascript
useEffect(() => {
  const savedToken = localStorage.getItem("access_token");
  const savedRefresh = localStorage.getItem("refresh_token");
  const savedUser = localStorage.getItem("user");
  if (savedToken) setToken(savedToken);
  if (savedRefresh) setRefreshToken(savedRefresh);
  if (savedUser) setUser(JSON.parse(savedUser));
  setLoading(false);
}, []);
```

`loading=true` during this phase. All auth-gated pages check `if (loading) return <spinner>` to avoid redirect flashes before hydration completes.

---

## axiosInstance (`utils/axiosInstance.js`)

All API calls go through a single axios instance. Never use `fetch()` or `axios.create()` directly in page components.

### Request Interceptor

```javascript
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

The `typeof window !== "undefined"` guard makes this SSR-safe — during server-side rendering, localStorage is not available.

### Response Interceptor (401 auto-refresh)

```javascript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;         // Prevent infinite retry loop
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        try {
          const res = await axios.post(`${API_URL}/api/token/refresh/`, { refresh });
          const newAccess = res.data.access;
          localStorage.setItem("access_token", newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);         // Retry original request
        } catch {
          // Refresh failed — force logout
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user");
          if (typeof window !== "undefined") window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);
```

This is completely transparent to page components — they never need to handle token refresh manually.

---

## Next.js Middleware (`middleware.js`)

Runs at the **Edge** before every SSR page render. Uses the `access_token` cookie (set by `AuthContext.login()`) to protect routes.

**Protected routes:**
```javascript
const PROTECTED = [
  "/dashboard/seeker",
  "/dashboard/employer",
  "/post_job",
  "/profile/edit",
  "/notifications",
];
```

**Logic:**
```javascript
export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED.some(route => pathname.startsWith(route));
  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("access_token")?.value;
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
```

The `?redirect=` parameter is used by the login page to send the user back where they came from after authenticating.

**Why a cookie AND localStorage?**
- `localStorage` is used by the axiosInstance (client-side API calls)
- `cookie` is used by the middleware (server-side route protection)
- `AuthContext.login()` sets both simultaneously

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
