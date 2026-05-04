# System Architecture

## Overview

RemoteWorkNaija follows a decoupled frontend/backend architecture. The Django REST Framework backend exposes a versioned JSON API consumed by the Next.js frontend. They communicate exclusively over HTTP — no server-side rendering from Django, no shared sessions.

```text
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  Next.js 16 (React 19) │ Tailwind CSS │ Axios HTTP Client   │
│  App Router │ Hook-driven Logic │ ThemeContext │ AuthContext │
└───────────────────────────┬──────────────────────────────────┘
                             │ HTTPS + HttpOnly Cookies
┌───────────────────────────▼──────────────────────────────────┐
│                       API GATEWAY                            │
│  Django 5.2 + Django REST Framework                         │
│  drf-spectacular (OpenAPI 3) │ SimpleJWT │ django-filter    │
│  WhiteNoise (static) │ CORS headers                         │
└───┬──────────┬──────────┬──────────┬───────────┬────────────┘
    │          │          │          │           │
┌───▼──┐ ┌────▼───┐ ┌────▼──┐ ┌────▼───┐ ┌────▼──────┐
│users │ │ jobs   │ │ apps  │ │notifs  │ │ payments  │
│      │ │filters │ │       │ │alerts  │ │ Paystack  │
└──────┘ └────────┘ └───────┘ └────────┘ └───────────┘
    │          │           │          │           │
┌───▼──────────▼───────────▼──────────▼───────────▼──────────┐
│                    INTELLIGENCE LAYER                       │
│  pgvector Embeddings │ Semantic Job Matching │ ATS Scoring  │
└────────────────────────────────────────────────────────────┘
    │          │
┌───▼──────────▼─────────────────────────────────────────────┐
│                    VERIFICATION LAYER                       │
│  Identity │ Skill Certs │ Infrastructure │ Trust Badges    │
└────────────────────────────┬───────────────────────────────┘
                             │
┌────────────────────────────▼───────────────────────────────┐
│                    AGGREGATION LAYER                        │
│  BaseJobParser │ RemotiveRSSParser │ WeWorkRemotelyParser   │
│  ingest_jobs() deduplication │ FetchLog audit trail        │
└────────────────────────────┬───────────────────────────────┘
                             │
┌────────────────────────────▼───────────────────────────────┐
│                       DATA LAYER                            │
│  SQLite (dev) │ PostgreSQL + pgvector (production)          │
└────────────────────────────────────────────────────────────┘
```

---

## Backend App Structure

The backend is organized as 8 independent Django apps, each owning its models, serializers, views, and migrations.

### `users`

Custom `AbstractUser` extension with role-based access control.

### `jobs`

Core job listing management with advanced filtering.

### `applications`

ATS pipeline for tracking job applications.

### `categories`

Taxonomy management for industries and skills.

### `aggregation`

RSS aggregation pipeline for external job sources.

### `notifications`

In-app notifications and keyword-based job alerts.

### `payments`

Tiered payment plans integrated with Paystack.

### `intelligence`

AI-driven matching layer. Uses `pgvector` to store semantic embeddings of jobs and user profiles. Provides `ATSMatch` scores based on vector similarity.

### `verification`

Trust & safety layer. Manages verification requests for identities, skills, and remote-work infrastructure (Solar, Starlink). Issues `TrustBadges` to verified users/employers.

---

## Frontend Architecture

The frontend follows a **Hook-driven** pattern where all business logic, state management, and API interactions are extracted from the UI components into custom hooks.

### Custom Hooks (`hooks/`)

Hooks act as the "controllers" for pages. They encapsulate:

- Authentication guards.
- Data fetching (via `axiosInstance`).
- Action handlers (form submissions, deletions).
- Derived state (computed totals, status checks).

**Example pattern:**

```javascript
// useJobs.js
export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const fetchJobs = async () => { /* api call */ };
  return { jobs, fetchJobs };
}
```

### Components (`app/components/`)

Components are kept thin and "dumb," focusing primarily on rendering the glassmorphism UI. They consume state and methods directly from the custom hooks.

### Routing & Middleware

Next.js App Router with Edge Middleware for SSR route protection. Auth state is managed via `AuthContext.jsx` using secure cookies.

---

## Request Flow — Authenticated API Call

```text
1. User action triggers hook method (e.g., useJobs)
2. axiosInstance makes request with `withCredentials: true`
3. Browser automatically attaches `access_token` HttpOnly cookie
4. DRF CustomJWTAuthentication reads cookie, validates token
5. If expired (401):
   a. axiosInstance interceptor calls /api/token/refresh/
   b. Backend reads refresh_token cookie, sets new access/refresh cookies
   c. Original request retried automatically
   d. If refresh fails: state cleared, user redirected to /login
```

---

## Request Flow — Aggregation Pipeline

```bash
1. python manage.py fetch_jobs (or Celery task in future)
2. Creates FetchLog entry with status='running'
3. For each parser (Remotive, WWR):
   a. Parser.fetch() → parses RSS feed → returns list[dict]
   b. ingest_jobs(jobs, log) called
   c. For each job dict:
      - Job.objects.get_or_create(source_url=job['source_url'])
      - New: creates Job, increments created count
      - Exists: skips, increments skipped count
   d. Matches against active JobAlerts → creates Notifications
4. FetchLog updated: status, counts, completed_at
```

---

## Data Flow — Job Posting (Employer)

```text
1. Employer authenticates → receives JWT pair
2. POST /api/v1/jobs/ with job data
3. JobViewSet.create() validates serializer
4. Job saved with employer FK, is_aggregated=False
5. If Featured plan purchased: is_featured=True → appears in featured filter
6. Job visible at GET /api/v1/jobs/{id}/
7. Seekers can apply via POST /api/v1/applications/
8. Employer views applications via GET /api/v1/applications/?job={id}
9. Employer updates status via PATCH /api/v1/applications/{id}/
10. Notification created for seeker on status change (planned: email via Celery)
```

---

## Security Model

| Layer | Mechanism |
| :--- | :--- |
| API authentication | HttpOnly Cookies (JWT) |
| Token rotation | Refresh tokens blacklisted after use |
| CSRF protection | SameSite=Lax + backend CSRF enforcement |
| Permissions | `IsAuthenticatedOrReadOnly` (read public, write auth) |
| Sensitive data | All secrets in `.env`, never committed |
| CORS | Restricted to `CORS_ALLOWED_ORIGINS` env var |
| File uploads | WhiteNoise for static, Cloudinary for media |
| Frontend routes | Edge middleware cookie check |
| HTTP headers | X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict |
| Paystack webhooks | HMAC-SHA512 signature verification |
