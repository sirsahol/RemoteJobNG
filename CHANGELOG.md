# Changelog

All notable changes to RemoteWorkNaija are documented here.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions follow [Semantic Versioning](https://semver.org/).

---

## [Unreleased]

### Planned (Phase 3)

- Real-time job matching notifications (WebSockets)
- Advanced analytics dashboard for employers
- Multi-currency support for job postings
- Integration with Nigerian professional associations for automated verification

---

## [1.1.0] — 2026-05-03

Major architectural overhaul focused on security hardening, semantic intelligence, and developer experience.

### Added — Security & Authentication

- **HttpOnly Cookie Auth**: Fully migrated from Bearer JWTs in localStorage to secure, browser-managed HttpOnly cookies for `access_token` and `refresh_token`.
- **Auth Hardening**: Implemented `set_auth_cookies` and `clear_auth_cookies` utilities in backend views.
- **CSRF Protection**: Enhanced CSRF protection for all state-changing operations.

### Added — Intelligence & Matching

- **Semantic Search**: Integrated `pgvector` for high-performance vector similarity search across job listings and user profiles.
- **ATS Matching**: Implemented `ATSMatch` model and matching pipeline to rank candidates against job requirements using semantic embeddings.
- **Embeddings Pipeline**: Automatic generation of OpenAI-compatible embeddings for jobs and profiles.

### Added — Verification & Trust

- **Trust Badges**: Added `TrustBadge` and `UserBadge` models to provide visual indicators of verified identity and skills.
- **Verification Workflow**: Dedicated `VerificationRequest` system for administrative review of user credentials.
- **Security Nodes**: Implemented verification-gated access to premium employer features.

### Added — Frontend & DX

- **Hook-Driven Architecture**: Standardized the use of custom hooks in `my-app/hooks/` for all business logic, data fetching, and state management.
- **E2E Testing Suite**: Integrated Playwright for comprehensive end-to-end testing, including automated UI flows and API mocking.
- **Railway Deployment**: Finalized `railway.json` and production environment configurations for the Railway cloud platform.

### Changed — Documentation Overhaul

- **System Docs**: Created `docs/intelligence.md` and `docs/verification.md`.
- **API Reference**: Updated `docs/api-reference.md` with new endpoints and cookie-auth details.
- **Data Models**: Updated `docs/data-models.md` with definitions for the Intelligence and Verification models.
- **README/CLAUDE**: Synchronized root documentation with the new 8-app backend structure and hook-driven development rules.

---

## [1.0.0] — 2025-04-08

First production-grade release of RemoteWorkNaija. Complete platform rebuild from the original RemoteJobNG fork.

### Added — Sprint 1: Security Hardening & Foundation

- **Security**: Removed hardcoded `SECRET_KEY` from settings; all secrets moved to environment variables
- **Security**: Replaced `DEBUG=True` hardcoded with `os.environ.get('DEBUG', 'False')`
- **Security**: Replaced global `AllowAny` permissions with `IsAuthenticated` default + explicit public overrides
- **Security**: Added `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `SECURE_*` headers for production
- **Custom User model**: Extended `AbstractUser` with 15 additional fields — `is_employer`, `bio`, `location`, `website`, `linkedin_url`, `github_url`, `avatar`, `resume`, `skills_text`, `experience_years`, `preferred_job_type`, `availability`, `salary_expectation`, `is_verified`, `slug`
- **UserSkill model**: Many-to-many skill tagging for seeker profiles
- **Categories app**: `Category` model (10 categories seeded) + `SkillTag` model (94 tags seeded)
- **Management commands**: `seed_categories` and `seed_plans` for reproducible seeding
- **SQLite removed from version control**: Added `db.sqlite3` to `.gitignore`
- **requirements.txt**: Pinned all dependencies with exact versions

### Added — Sprint 2: API, Search & Auth Upgrade

- **DRF ViewSets**: Migrated all views to `ModelViewSet` / `ReadOnlyModelViewSet` registered via `DefaultRouter`
- **JWT authentication**: `djangorestframework-simplejwt` replacing session auth; `/api/auth/token/` + `/api/auth/token/refresh/`
- **Job search & filtering**: `django-filter` with `JobFilter` across 14 fields — title, company, location, job_type, category, tags, salary range, date range, remote-only, featured
- **Pagination**: `PageNumberPagination` on all list endpoints (default 20, max 100)
- **API documentation**: `drf-spectacular` generating OpenAPI 3 schema + Swagger UI at `/api/docs/`
- **Employer dashboard endpoint**: `/api/jobs/my-jobs/` returning employer's own listings
- **Seeker dashboard endpoint**: `/api/applications/my-applications/` with status history
- **SavedJob endpoint**: `/api/jobs/saved/` — save/unsave with `@action`
- **User registration endpoint**: `/api/auth/register/` with password confirmation
- **Profile endpoint**: `/api/auth/profile/` (GET + PATCH, authenticated)

### Added — Sprint 3: Aggregation Pipeline & Alerts

- **Aggregation app**: `FetchLog` model recording every aggregation run (source, jobs fetched, jobs created, duration, errors)
- **BaseJobParser**: Abstract base class defining the parser contract (`fetch()`, `normalize()`, `ingest()`)
- **RemotiveRSSParser**: Parses Remotive RSS feed — confirmed 22 live jobs per run
- **WeWorkRemotelyParser**: Parses WeWorkRemotely RSS feed — confirmed 217 live jobs per run
- **`ingest_jobs()` service**: Orchestrates all parsers, deduplicates by `source_url` using `get_or_create`, writes `FetchLog` on each run
- **`fetch_jobs` management command**: `python manage.py fetch_jobs` (live ingest) + `python manage.py fetch_jobs --dry-run` (parse-only, no DB writes)
- **Notifications app**: `Notification` model (user, message, `is_read`, `created_at`)
- **JobAlert model**: Keyword + filter-based alerts with `matches_job()` method for real-time matching
- **Notification endpoints**: `/api/notifications/` (list, mark-as-read action)
- **Job alert endpoints**: `/api/notifications/alerts/` CRUD

### Added — Sprint 4: Payments, Media & Production Infrastructure

- **Payments app**: `PaymentPlan` model (3 tiers seeded: Free, Professional, Enterprise), `JobPayment` model tracking payment status per job post
- **Paystack integration**: `PaystackService` class wrapping Paystack API — initialize payment, verify payment — mock-safe (works without a real key in dev)
- **Payment endpoints**: `/api/payments/plans/`, `/api/payments/initialize/`, `/api/payments/verify/`
- **Cloudinary integration**: `django-cloudinary-storage` for avatar and resume file uploads
- **Docker setup**: `backend/Dockerfile`, `my-app/Dockerfile`, `docker-compose.yml` with auto-migration and seeding on boot
- **Homepage redesign**: Full hero section, live job count, category grid, featured jobs, how-it-works, testimonials
- **Job detail page**: Full job description, apply button, save button, share, related jobs
- **Pricing page**: 3-tier pricing cards with Paystack checkout integration
- **Post job page**: Full employer job posting form with category/tag selectors
- **Notifications page**: Real-time notification list with mark-as-read

### Added — Frontend Completeness Pass

- **AuthContext** (`context/AuthContext.js`): Complete rewrite with JWT access + refresh token management, user object hydration, role detection (`is_employer`), auto-logout on 401 cascade
- **axiosInstance** (`utils/axiosInstance.js`): Axios instance with `Authorization: Bearer <token>` header injection, 401 interceptor with automatic token refresh, SSR-safe guard (`typeof window !== 'undefined'`)
- **middleware.js**: Next.js edge middleware protecting `/dashboard/*`, `/profile/edit`, `/post_job`, `/notifications` — redirects unauthenticated users to `/login`
- **Apply page** (`/jobs/[id]/apply`): Full application form with CV upload, cover letter, answers to custom questions, axiosInstance submission
- **Profile pages**: `/profile/[username]` (public view) and `/profile/edit` (authenticated edit form with Cloudinary avatar upload)
- **About page**: Company story, mission, team, stats, contact
- **Payment verify page** (`/payment/verify`): Paystack callback handler verifying payment and activating job post
- **Legacy cleanup**: Deleted `utils/api.js` (replaced by `axiosInstance`); updated all 19 pages to use `axiosInstance`

### Added — Documentation

- `README.md`: Complete root README with quick start, architecture diagram, environment reference, live verification stats
- `my-app/README.md`: Frontend-specific README with page inventory, auth flow, environment setup
- `docs/architecture.md`: System architecture diagram, app dependency graph, request flow diagrams
- `docs/api-reference.md`: Every endpoint documented with method, URL, auth requirement, request body, response schema, error codes
- `docs/data-models.md`: All 12 models with every field, type, constraint, and relationship
- `docs/aggregation.md`: Parser architecture, deduplication strategy, adding new sources, FetchLog schema
- `docs/authentication.md`: JWT configuration, AuthContext internals, axiosInstance interceptor chain, middleware route protection
- `docs/payments.md`: Paystack flow, mock mode, webhook handling, payment plan configuration
- `docs/deployment.md`: Docker production deployment, PostgreSQL migration, Nginx reverse proxy, SSL, environment checklist
- `docs/roadmap.md`: 5 future phases with granular feature lists and effort estimates
- `docs/contributing.md`: Branch strategy, commit convention, backend/frontend conventions, PR checklist
- `docs/adr/`: Architecture Decision Records for all major technical decisions
- `CONTRIBUTING.md`: Root contributor guide (GitHub surfaces this automatically)
- `CHANGELOG.md`: This file
- `SECURITY.md`: Vulnerability disclosure policy
- `CODE_OF_CONDUCT.md`: Contributor Covenant v2.1
- `.github/PULL_REQUEST_TEMPLATE.md`: Structured PR template
- `.github/ISSUE_TEMPLATE/`: Bug report + feature request templates

### Added — Quality & CI

- **35 backend tests** across all 6 apps: users (7), jobs (9), applications (4), categories (5), aggregation (5), notifications (5) — all passing
- **Serializer audit**: Removed references to 9 non-existent model fields from Job serializers (would have caused `AttributeError` at runtime)
- **GitHub Actions CI** (`.github/workflows/ci.yml`): Backend tests against PostgreSQL 15 + Next.js production build — triggered on every push and PR to `main`
- **MIT LICENSE**
- **`.env.example`** updated with all required variables including `JWT_ACCESS_TOKEN_LIFETIME_MINUTES`, `JWT_REFRESH_TOKEN_LIFETIME_DAYS`, `DATABASE_URL`

### Fixed

- `users/views.py`: Bare `pass` replaced with explanatory comment
- `docker-compose.yml`: Fixed `CMD` format in both Dockerfiles (array form required)
- `next.config.mjs`: Added image domain allowlist for Cloudinary and remote job sources; added security headers
- `SavedJob` model: Restored after being dropped during sprint merge conflict resolution
- `Job` model fields: Restored `is_featured`, `view_count`, `application_count` after merge conflict

---

## [0.1.0] — 2024 (Original Fork)

Initial fork of [RemoteJobNG](https://github.com/Rafiu-Olajumoke01/RemoteJobNG).

### State at fork

- Basic Django project with SQLite
- Hardcoded `SECRET_KEY` in `settings.py`
- `DEBUG=True` hardcoded
- Global `AllowAny` permissions
- No search, no pagination, no JWT
- No frontend
- No tests
- No documentation

---

[Unreleased]: https://github.com/sirsahol/RemoteJobNG/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/sirsahol/RemoteJobNG/releases/tag/v1.0.0
[0.1.0]: https://github.com/sirsahol/RemoteJobNG/releases/tag/v0.1.0
