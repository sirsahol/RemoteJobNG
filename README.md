# RemoteWorkNaija

> Africa's premier remote job aggregation platform — connecting Nigerian professionals with global remote opportunities.

[![Django](https://img.shields.io/badge/Django-5.2-green)](https://djangoproject.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

**Live at:** [remoteworknaija.com](https://remoteworknaija.com)  
**API Docs:** `/api/docs/` (Swagger UI, auto-generated from OpenAPI 3 schema)

---

## What Is This?

RemoteWorkNaija aggregates live remote jobs from Remotive, WeWorkRemotely, and other global sources — filtered and presented for Nigerian professionals. It combines a full-featured job board with an employer ATS, job alerts, Paystack payments, and rich seeker profiles.

**Key numbers (from live verification):**
- 22 live Remotive jobs fetched per run
- 217 live WeWorkRemotely jobs fetched per run
- 10 job categories, 94 skill tags seeded
- 19 frontend pages, all spec-compliant
- 12 database models across 7 Django apps

---

## Repository Structure

```
RemoteJobNG/
├── backend/                          # Django 5.2 REST API
│   ├── remotejobs_backend/           # Project config (settings, urls, wsgi, asgi)
│   ├── users/                        # Custom User model + UserSkill
│   ├── jobs/                         # Job + SavedJob models, filters, ViewSets
│   ├── applications/                 # Application ATS (8-status pipeline)
│   ├── categories/                   # Category + SkillTag taxonomy
│   ├── aggregation/                  # RSS parsers, ingestor, FetchLog, management cmds
│   ├── notifications/                # Notification + JobAlert models
│   ├── payments/                     # PaymentPlan + JobPayment + Paystack service
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── my-app/                           # Next.js 16 / React 19 frontend
│   ├── app/                          # App Router pages (19 routes)
│   │   ├── jobs/                     # /jobs + /jobs/[id] + /jobs/[id]/apply
│   │   ├── dashboard/                # /dashboard/seeker + /dashboard/employer
│   │   ├── profile/                  # /profile/[username] + /profile/edit
│   │   ├── payment/                  # /payment/verify
│   │   ├── login/, signup/
│   │   ├── notifications/
│   │   ├── pricing/
│   │   ├── post_job/
│   │   ├── about/
│   │   └── components/Navbar/
│   ├── context/AuthContext.js        # Auth state (tokens, user obj, refresh)
│   ├── utils/axiosInstance.js        # Axios with JWT + 401 auto-refresh
│   ├── middleware.js                 # Edge route protection (SSR)
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml                # Local dev orchestration
└── docs/                             # Full technical documentation
    ├── architecture.md
    ├── api-reference.md
    ├── data-models.md
    ├── aggregation.md
    ├── authentication.md
    ├── payments.md
    ├── deployment.md
    ├── roadmap.md
    └── contributing.md
```

---

## Quick Start

### Option A — Docker (recommended)

```bash
git clone https://github.com/sirsahol/RemoteJobNG
cd RemoteJobNG
docker compose up --build
```

- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/api/docs/
- Admin: http://localhost:8000/admin/

Docker automatically runs migrations, seeds categories/plans, and starts both servers.

### Option B — Manual

**Backend:**
```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env    # Set SECRET_KEY at minimum
python manage.py migrate
python manage.py seed_categories
python manage.py seed_plans
python manage.py runserver
```

**Frontend:**
```bash
cd my-app
npm install
cp .env.example .env.local   # Set NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
npm run dev
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `SECRET_KEY` | Yes | — | Django secret key (generate a strong random value) |
| `DEBUG` | No | `False` | Enable debug mode |
| `ALLOWED_HOSTS` | No | `localhost,127.0.0.1` | Comma-separated allowed hosts |
| `CORS_ALLOWED_ORIGINS` | No | `http://localhost:3000` | Frontend origins for CORS |
| `DATABASE_URL` | No | SQLite | PostgreSQL URL for production |
| `JWT_ACCESS_TOKEN_LIFETIME_MINUTES` | No | `60` | Access token TTL |
| `JWT_REFRESH_TOKEN_LIFETIME_DAYS` | No | `7` | Refresh token TTL |
| `PAYSTACK_SECRET_KEY` | No | — | Paystack secret (mock mode if empty) |
| `PAYSTACK_PUBLIC_KEY` | No | — | Paystack public key |
| `FRONTEND_URL` | No | `http://localhost:3000` | For Paystack callback URL |
| `USE_CLOUDINARY` | No | `False` | Enable Cloudinary media storage |
| `CLOUDINARY_CLOUD_NAME` | No | — | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | No | — | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | No | — | Cloudinary API secret |

### Frontend (`my-app/.env.local`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Backend URL e.g. `http://127.0.0.1:8000` |
| `NEXT_PUBLIC_SITE_URL` | No | Frontend URL for SEO metadata |
| `NEXT_PUBLIC_SITE_NAME` | No | Site display name |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | No | Paystack public key for frontend |

---

## Management Commands

```bash
# Seed job categories and skill tags (idempotent)
python manage.py seed_categories

# Seed payment plans (idempotent)
python manage.py seed_plans

# Fetch live jobs from all sources
python manage.py fetch_jobs

# Fetch from a specific source
python manage.py fetch_jobs --source remotive
python manage.py fetch_jobs --source weworkremotely

# Dry run — parse without saving to DB
python manage.py fetch_jobs --dry-run

# Expire overdue job listings
python manage.py expire_jobs
```

---

## API Overview

Base URL: `/api/v1/`  
Authentication: Bearer JWT (obtain via `POST /api/token/`)  
Pagination: 20 results per page (`?page=2`)  
Docs: `/api/docs/` (Swagger UI)

| Resource | Endpoint | Auth |
|---|---|---|
| Users | `/api/v1/users/` | Public (read), Auth (write) |
| Jobs | `/api/v1/jobs/` | Public (read), Auth (create) |
| Saved Jobs | `/api/v1/saved-jobs/` | Auth |
| Applications | `/api/v1/applications/` | Auth |
| Categories | `/api/v1/categories/` | Public |
| Skill Tags | `/api/v1/skill-tags/` | Public |
| Notifications | `/api/v1/notifications/` | Auth |
| Job Alerts | `/api/v1/job-alerts/` | Auth |
| My Payments | `/api/v1/my-payments/` | Auth |
| Payment Plans | `/api/v1/payment/plans/` | Public |

See [docs/api-reference.md](docs/api-reference.md) for the full reference.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Django 5.2 + Django REST Framework 3.16 |
| Auth | SimpleJWT (refresh rotation + blacklisting) |
| API Docs | drf-spectacular (OpenAPI 3 + Swagger UI) |
| Search/Filter | django-filter + DRF SearchFilter |
| Frontend | Next.js 16 + React 19 |
| Styling | Tailwind CSS v4 |
| HTTP Client | axios 1.11 with interceptors |
| Job Feeds | feedparser (Remotive + WeWorkRemotely RSS) |
| Payments | Paystack (mock-safe when key not set) |
| Media | Cloudinary (optional) or local filesystem |
| Static Files | WhiteNoise |
| Containers | Docker + docker-compose |

---

## Documentation

| Document | Description |
|---|---|
| [docs/architecture.md](docs/architecture.md) | System architecture, app structure, request flow |
| [docs/api-reference.md](docs/api-reference.md) | Every endpoint documented with params and responses |
| [docs/data-models.md](docs/data-models.md) | All 12 database models with field reference |
| [docs/aggregation.md](docs/aggregation.md) | RSS parser system, dedup strategy, adding new sources |
| [docs/authentication.md](docs/authentication.md) | JWT flow, AuthContext, interceptors, middleware |
| [docs/payments.md](docs/payments.md) | Paystack integration, payment flow, webhook |
| [docs/deployment.md](docs/deployment.md) | Docker, env vars, PostgreSQL, production checklist |
| [docs/roadmap.md](docs/roadmap.md) | Planned phases: search, AI, profiles, community |
| [docs/contributing.md](docs/contributing.md) | Dev workflow, conventions, PR process |

---

## Project Status

| Sprint | Focus | Status |
|---|---|---|
| Sprint 1 | Security hardening, model upgrades, repo hygiene | ✅ Merged |
| Sprint 2 | ViewSets, search/filter, auth upgrade, dashboards | ✅ Merged |
| Sprint 3 | Aggregation pipeline, RSS parsers, alerts, notifications | ✅ Merged |
| Sprint 4 | Payments scaffold, Cloudinary, Docker, homepage | ✅ Merged |
| Phase 2 | PostgreSQL, Redis, Celery, Meilisearch, email | 🔜 Planned |
| Phase 3 | AI matching, professional profiles, ATS upgrades | 🔜 Planned |
| Phase 4 | Community, blog, salary transparency | 🔜 Planned |

See [docs/roadmap.md](docs/roadmap.md) for detailed phase plans.
