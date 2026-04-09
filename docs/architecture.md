# System Architecture

## Overview

RemoteWorkNaija follows a decoupled frontend/backend architecture. The Django REST Framework backend exposes a versioned JSON API consumed by the Next.js frontend. They communicate exclusively over HTTP — no server-side rendering from Django, no shared sessions.

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  Next.js 16 (React 19) │ Tailwind CSS │ Axios HTTP Client   │
│  App Router │ SSR/SSG │ Edge Middleware │ AuthContext        │
└───────────────────────────┬──────────────────────────────────┘
                             │ HTTPS + JWT Bearer tokens
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
    │          │
┌───▼──────────▼─────────────────────────────────────────────┐
│                    AGGREGATION LAYER                        │
│  BaseJobParser │ RemotiveRSSParser │ WeWorkRemotelyParser   │
│  ingest_jobs() deduplication │ FetchLog audit trail        │
│  fetch_jobs management command (--dry-run support)         │
└────────────────────────────┬───────────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────┐
│                       DATA LAYER                            │
│  SQLite (dev) │ PostgreSQL (production)                    │
│  Cloudinary (media, optional) │ Local filesystem (default) │
└────────────────────────────────────────────────────────────┘
```

---

## Backend App Structure

The backend is organized as 7 independent Django apps, each owning its models, serializers, views, and migrations.

### `users`
Custom `AbstractUser` extension. Every user has a `role` (job_seeker or employer) that controls which dashboards and endpoints they can access. `UserSkill` provides a many-to-one skill taxonomy linked to `categories.SkillTag`.

**Key files:**
- `models.py` — User (15+ fields beyond AbstractUser), UserSkill
- `serializers.py` — UserSerializer with nested skills
- `views.py` — UserViewSet with `/me/` custom action
- `admin.py` — registered with all profile fields visible

### `jobs`
Core listings model. `Job` has 30+ fields covering everything from salary range to aggregation metadata. `SavedJob` is a user-job bookmark table with unique constraint. `JobFilter` provides 14 filterable fields via `django-filter`.

**Key files:**
- `models.py` — Job, SavedJob
- `filters.py` — JobFilter (14 fields: title, company, job_type, remote_type, experience_level, salary range, category, skill, is_featured, is_aggregated, date range)
- `serializers.py` — JobListSerializer (compact), JobDetailSerializer (full)
- `views.py` — JobViewSet, SavedJobViewSet

### `applications`
8-status ATS pipeline tracking every job application. Status flow: `pending → reviewing → shortlisted → interview_scheduled → offer_made → accepted → rejected / withdrawn`. Supports resume file upload (local or Cloudinary) and cover letter text.

**Key files:**
- `models.py` — Application with full ATS fields
- `views.py` — ApplicationViewSet with employer/seeker permission split

### `categories`
Read-only taxonomy. 10 Categories (Technology, Design & Creative, Marketing & Sales, etc.) and 94 SkillTags. Seeded via `seed_categories` management command. Used as FK on Job and M2M on Job for skill_tags.

### `aggregation`
The pipeline that keeps the job board alive. Parses RSS feeds from multiple sources, normalizes job data, deduplicates by `source_url`, and saves to the `jobs` table. `FetchLog` tracks every run with full telemetry (fetched, created, skipped, updated, errors, duration).

**Key files:**
- `parsers/base.py` — BaseJobParser abstract class
- `parsers/remotive.py` — RemotiveRSSParser (Remotive RSS feed)
- `parsers/weworkremotely.py` — WeWorkRemotelyParser (5 WWR category feeds)
- `ingestor.py` — ingest_jobs() with get_or_create deduplication
- `management/commands/fetch_jobs.py` — CLI: `python manage.py fetch_jobs [--source] [--dry-run]`
- `management/commands/expire_jobs.py` — marks expired listings

### `notifications`
Two models: `Notification` (individual in-app messages with read/unread state) and `JobAlert` (user-defined alert criteria with `matches_job(job)` method). Notification types: application_update, new_job_match, job_alert, system.

### `payments`
Paystack payment integration. `PaymentPlan` defines 3 tiers (basic, featured, premium) with NGN and USD pricing. `JobPayment` records every transaction with full Paystack response data. `services.py` is mock-safe — works without a real Paystack key in local dev.

---

## Frontend App Structure

Next.js 16 App Router. All pages are React Server Components by default; interactive pages use `"use client"` directive.

### Route Map

```
/                           → page.js (redirects to homepage)
/jobs                       → jobs/page.jsx (listing)
/jobs/[id]                  → jobs/[id]/page.jsx (detail)
/jobs/[id]/apply            → jobs/[id]/apply/page.jsx (application form) [auth]
/login                      → login/page.jsx
/signup                     → signup/page.jsx
/dashboard/seeker           → dashboard/seeker/page.jsx [auth]
/dashboard/employer         → dashboard/employer/page.jsx [auth]
/post_job                   → post_job/page.jsx [auth]
/notifications              → notifications/page.jsx [auth]
/pricing                    → pricing/page.jsx
/payment/verify             → payment/verify/page.jsx (Paystack callback)
/about                      → about/page.js
/profile/[username]         → profile/[username]/page.jsx (public)
/profile/edit               → profile/edit/page.jsx [auth]
```

### Shared Infrastructure

**`context/AuthContext.js`**
React Context providing authentication state to the entire app. Hydrates from `localStorage` on mount, exposes `user`, `token`, `isAuthenticated`, `isEmployer`, `isSeeker`, `login()`, `logout()`, `refreshAccessToken()`. Wrapped around the app in `layout.js`.

**`utils/axiosInstance.js`**
Pre-configured axios instance with `baseURL = ${NEXT_PUBLIC_API_URL}/api/v1`. Two interceptors: (1) attaches `Authorization: Bearer` header on every request, (2) auto-refreshes expired tokens on 401 response and retries the original request transparently. All API calls go through this instance.

**`middleware.js`**
Next.js Edge middleware. Runs before every SSR request. Checks for `access_token` cookie on protected routes. Redirects to `/login?redirect=<original>` if missing. Protected routes: `/dashboard/*`, `/post_job`, `/profile/edit`, `/notifications`.

**`app/components/Navbar/Navbar.jsx`**
Persistent navigation bar. Shows notification bell with unread count badge for authenticated users. Dashboard link routes to `/dashboard/employer` or `/dashboard/seeker` based on `isEmployer`. Logout clears all auth state.

---

## Request Flow — Authenticated API Call

```
1. User action triggers API call in page component
2. axiosInstance.request interceptor attaches Bearer token from localStorage
3. Request sent to Django backend
4. DRF JWTAuthentication validates token
5. If valid: view executes, returns JSON response
6. If 401 (expired):
   a. axiosInstance.response interceptor intercepts
   b. Calls POST /api/token/refresh/ with refresh token
   c. On success: stores new access token, retries original request
   d. On failure: clears storage, redirects to /login
```

---

## Request Flow — Aggregation Pipeline

```
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

```
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
|---|---|
| API authentication | SimpleJWT Bearer tokens |
| Token rotation | Refresh tokens blacklisted after use |
| Permissions | `IsAuthenticatedOrReadOnly` (read public, write auth) |
| Sensitive data | All secrets in `.env`, never committed |
| CORS | Restricted to `CORS_ALLOWED_ORIGINS` env var |
| File uploads | WhiteNoise for static, Cloudinary/local for media |
| Frontend routes | Edge middleware cookie check |
| HTTP headers | X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict |
| Paystack webhooks | HMAC-SHA512 signature verification |
