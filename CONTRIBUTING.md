# Contributing to RemoteWorkNaija

Thank you for your interest in contributing. RemoteWorkNaija is a global remote job aggregation platform for Nigerian professionals, and every contribution — from a typo fix to a new job source parser — directly impacts thousands of job seekers.

This document covers everything you need to know to contribute effectively.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Project Architecture](#project-architecture)
5. [Branch & Workflow Strategy](#branch--workflow-strategy)
6. [Commit Convention](#commit-convention)
7. [Backend Conventions](#backend-conventions)
8. [Frontend Conventions](#frontend-conventions)
9. [Writing Tests](#writing-tests)
10. [Pull Request Checklist](#pull-request-checklist)
11. [Adding a New Job Source](#adding-a-new-job-source)
12. [Reporting Bugs](#reporting-bugs)
13. [Suggesting Features](#suggesting-features)
14. [Community](#community)

---

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold its standards. Report unacceptable behaviour to **cooperhumbertoykdd@gmail.com**.

---

## Getting Started

Before opening a PR, please:

1. **Search existing issues** — avoid duplicates.
2. **Open an issue first** for significant changes — agree on direction before writing code.
3. **Fork the repo**, work on a branch, open a PR against `main`.

Good first issues are labelled `good first issue` in the GitHub issue tracker.

---

## Development Setup

### Prerequisites

| Tool | Minimum Version |
|---|---|
| Docker | 24+ |
| Docker Compose | 2.20+ |
| Python | 3.11+ (if running without Docker) |
| Node.js | 20+ (if running without Docker) |
| Git | 2.40+ |

### Option A — Docker (recommended)

```bash
git clone https://github.com/sirsahol/RemoteJobNG
cd RemoteJobNG

# Copy and configure environment files
cp backend/.env.example backend/.env
cp my-app/.env.example my-app/.env.local

# Start everything (Django + Next.js + PostgreSQL)
docker compose up --build
```

On first boot, Docker automatically runs:
- `python manage.py migrate`
- `python manage.py seed_categories`
- `python manage.py seed_plans`
- `python manage.py runserver 0.0.0.0:8000`

The API is at `http://localhost:8000/api/` and the frontend at `http://localhost:3000`.

### Option B — Manual Setup

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # Fill in required values
python manage.py migrate
python manage.py seed_categories
python manage.py seed_plans
python manage.py runserver
```

#### Frontend

```bash
cd my-app
npm install
cp .env.example .env.local      # Set NEXT_PUBLIC_API_URL=http://localhost:8000/api
npm run dev
```

### Running Tests

```bash
# Backend — all 35 tests
cd backend
python manage.py test --verbosity=2

# Frontend — build check
cd my-app
npm run build
```

### Dry-running the Job Aggregator

```bash
cd backend
python manage.py fetch_jobs --dry-run
# Output: ~22 Remotive + ~217 WeWorkRemotely live jobs (no DB writes)
```

---

## Project Architecture

```
RemoteJobNG/
├── backend/                    # Django 5.2 REST API
│   ├── remotejobs_backend/     # Settings, URLs, WSGI/ASGI
│   ├── users/                  # Custom User model + UserSkill
│   ├── jobs/                   # Job + SavedJob + JobFilter
│   ├── applications/           # Application ATS (8 statuses)
│   ├── categories/             # Category + SkillTag taxonomy
│   ├── aggregation/            # RSS parsers + ingestor + FetchLog
│   ├── notifications/          # Notification + JobAlert
│   └── payments/               # PaymentPlan + JobPayment + Paystack
├── my-app/                     # Next.js 16 / React 19 frontend
│   ├── app/                    # 19 App Router pages
│   ├── context/AuthContext.js  # JWT auth state
│   ├── utils/axiosInstance.js  # Axios + 401 auto-refresh
│   └── middleware.js           # SSR route protection
├── docs/                       # Technical documentation
│   ├── adr/                    # Architecture Decision Records
│   └── *.md                    # API reference, data models, etc.
├── .github/
│   ├── workflows/ci.yml        # Backend tests + frontend build CI
│   └── ISSUE_TEMPLATE/         # Bug report + feature request templates
└── docker-compose.yml
```

See [docs/architecture.md](docs/architecture.md) for the full system diagram and request flows.

---

## Branch & Workflow Strategy

| Branch pattern | Purpose |
|---|---|
| `main` | Production-ready. All PRs merge here. Direct commits forbidden. |
| `feat/description` | New features — e.g. `feat/remoteok-parser` |
| `fix/description` | Bug fixes — e.g. `fix/savedjob-model` |
| `refactor/description` | Refactors without behaviour change |
| `docs/description` | Documentation only — e.g. `docs/adr-005` |
| `chore/description` | Deps, CI, build config |

### Workflow

```
fork → branch → commit → push → open PR → CI checks → review → merge
```

1. Fork the repo and clone your fork.
2. Create a branch from `main`: `git checkout -b feat/my-feature`
3. Make your changes with atomic commits (see [Commit Convention](#commit-convention)).
4. Push and open a PR against `main` on the upstream repo.
5. CI must pass before review.
6. At least one maintainer review required before merge.
7. Squash merge preferred for features; merge commit for hotfixes.

---

## Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short description>

[optional body]

[optional footer: BREAKING CHANGE, Closes #N]
```

### Types

| Type | When to use |
|---|---|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `refactor` | Code change with no behaviour change |
| `docs` | Documentation only |
| `test` | Adding or fixing tests |
| `chore` | Deps, CI, build tooling |
| `perf` | Performance improvement |
| `style` | Formatting, whitespace (no logic change) |

### Examples

```
feat(aggregation): add RemoteOK RSS parser
fix(jobs): restore SavedJob model after merge conflict
docs(api): document payment webhook endpoint
test(users): add registration and profile endpoint tests
chore(deps): bump django from 5.2.0 to 5.2.1
refactor(notifications): extract alert matching to service layer
BREAKING CHANGE: rename /api/auth/me/ to /api/auth/profile/
```

### Rules

- Subject line: 72 characters max, imperative mood, no full stop
- Body: explain *why*, not *what* (code shows the what)
- Reference issues: `Closes #42`, `Fixes #17`, `Related to #8`

---

## Backend Conventions

### Django Apps

- Each app owns its `models.py`, `serializers.py`, `views.py`, `urls.py`, `admin.py`, `migrations/`, `tests.py`
- No cross-app imports except through FK relationships or service functions
- Use `related_name` on every `ForeignKey` and `ManyToManyField`
- Register all models in `admin.py` with at least `list_display`, `search_fields`, `list_filter`

### ViewSets & URLs

- Use `ModelViewSet` (or `ReadOnlyModelViewSet`) registered via `DefaultRouter`
- Custom actions use `@action(detail=True/False, methods=[...])`
- All URLs namespaced under `/api/<app>/`

### Serializers

- Separate serializers for list (`JobListSerializer`), detail (`JobDetailSerializer`), and write (`JobWriteSerializer`) where field counts differ
- Never expose sensitive fields (password hashes, tokens, internal IDs not needed by client)
- Use `SerializerMethodField` sparingly — prefer model properties for computed values

### Permissions

- Default: `IsAuthenticated` on all write endpoints
- Public read endpoints: explicit `permission_classes = [AllowAny]`
- Employer-only endpoints: `IsEmployerOrAdmin` custom permission
- Never leave `AllowAny` on write endpoints in production

### Settings & Environment

- Never hardcode secrets. All sensitive values via `os.environ.get()` with safe defaults for dev only
- Add every new env var to `.env.example` with a comment explaining it
- Use `python-decouple` or `os.environ` — not `settings.py` literals

### Migrations

- Every model change requires a new migration: `python manage.py makemigrations`
- Never edit existing migrations — add a new one
- Migrations must be committed alongside the model change in the same PR
- Data migrations (seeding) go in `management/commands/`, not in migration files

### API Documentation

The project uses `drf-spectacular`. Add docstrings and `@extend_schema` decorators on any non-obvious endpoint:

```python
from drf_spectacular.utils import extend_schema

@extend_schema(summary="List active jobs", tags=["Jobs"])
def list(self, request, *args, **kwargs):
    ...
```

---

## Frontend Conventions

### Stack

- **Next.js 16** App Router — all pages in `my-app/app/`
- **React 19** — use hooks, no class components
- **Tailwind CSS v4** — utility-first, no custom CSS files unless unavoidable
- **axiosInstance** — always import from `utils/axiosInstance.js`, never use `fetch()` directly for authenticated calls

### Auth Pattern

```js
// Always use axiosInstance for authenticated requests
import axiosInstance from '@/utils/axiosInstance';

const data = await axiosInstance.get('/jobs/');
```

- `AuthContext` (at `context/AuthContext.js`) provides `user`, `login()`, `logout()`, `loading`
- `middleware.js` protects routes at the SSR edge — add new protected paths there
- Never store tokens in component state — they live in `localStorage` (client) and cookies (SSR)

### Page Structure

```
app/
  page.js           → public page
  layout.js         → shared layout (wrap with AuthProvider if needed)
  (route)/
    page.js         → route-specific page
```

- Every page must handle loading and error states
- Use `useRouter` from `next/navigation` (App Router), not `next/router`
- Server components are default — use `'use client'` only when needed (event handlers, hooks)

### Component Conventions

- One component per file, named matching the filename (PascalCase)
- Props validated with JSDoc or TypeScript types (TypeScript migration planned)
- No inline styles — Tailwind classes only

---

## Writing Tests

### Backend

Tests live in each app's `tests.py`. Run with:

```bash
cd backend
python manage.py test --verbosity=2
```

Current coverage: 35 tests across 6 apps. When adding a feature:

1. Write a test for the happy path
2. Write a test for the error/edge case
3. Tests must use `TestCase` (SQLite in CI/local) — no production DB required
4. Use `APIClient` for endpoint tests, not raw HTTP
5. Never test Django internals — test your own logic

Example test structure:

```python
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class MyFeatureTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='u', email='u@test.com', password='p')

    def test_happy_path(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.get('/api/my-endpoint/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_requires_auth(self):
        resp = self.client.get('/api/my-endpoint/')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)
```

### Frontend

Frontend tests (Jest + React Testing Library) are planned for Phase 2. For now, the CI pipeline runs `npm run build` as a smoke test — a successful build means no import errors or type errors.

---

## Pull Request Checklist

Before requesting review, confirm all of the following:

**Code**
- [ ] My changes are limited to the stated scope — no scope creep
- [ ] No hardcoded secrets, URLs, or environment-specific values
- [ ] No `console.log`, `print()`, or debug statements left in
- [ ] No commented-out code blocks (delete dead code, use version control)

**Tests**
- [ ] New behaviour is covered by at least one test
- [ ] `python manage.py test` passes locally (35+ tests, 0 failures)
- [ ] `npm run build` passes in `my-app/`

**Migrations**
- [ ] If I changed a Django model, I ran `makemigrations` and committed the migration file
- [ ] The migration is reversible (or I've documented why it isn't)

**Docs**
- [ ] If I added/changed an API endpoint, I updated `docs/api-reference.md`
- [ ] If I changed a model, I updated `docs/data-models.md`
- [ ] If I added a new env var, I added it to `.env.example` with a comment
- [ ] If this was a significant architectural decision, I added an ADR in `docs/adr/`

**PR Description**
- [ ] PR title follows Conventional Commits format
- [ ] PR description explains *what* and *why*
- [ ] Linked to the relevant GitHub issue (`Closes #N`)
- [ ] Screenshots included for any UI changes

---

## Adding a New Job Source

The aggregation system uses a parser plugin pattern. To add a new source (e.g. RemoteOK):

1. **Create a parser** in `backend/aggregation/parsers.py`:

```python
class RemoteOKParser(BaseJobParser):
    SOURCE_NAME = "remoteok"
    FEED_URL = "https://remoteok.com/remote-jobs.rss"

    def normalize(self, entry) -> dict:
        return {
            "title": entry.title,
            "company": getattr(entry, "company", "Unknown"),
            "location": "Remote",
            "description": entry.summary,
            "source_url": entry.link,
            "source": self.SOURCE_NAME,
            "job_type": "remote",
        }
```

2. **Register it** in `ingest_jobs()` in `backend/aggregation/aggregation.py`:

```python
PARSERS = [RemotiveRSSParser(), WeWorkRemotelyParser(), RemoteOKParser()]
```

3. **Dry-run first**: `python manage.py fetch_jobs --dry-run`

4. **Write a parser test** in `backend/aggregation/tests.py`

5. **Add an ADR** at `docs/adr/ADR-NNN-add-remoteok-source.md`

6. **Update `docs/aggregation.md`** with the new source details

See [docs/aggregation.md](docs/aggregation.md) for the full parser contract and deduplication strategy.

---

## Reporting Bugs

Use the [Bug Report issue template](.github/ISSUE_TEMPLATE/bug_report.md).

Please include:
- **What you expected** vs **what happened**
- **Steps to reproduce** (minimal reproducible case)
- **Environment**: OS, Python version, Node version, browser
- **Logs**: Django traceback or browser console errors
- **Screenshots** for UI bugs

Security vulnerabilities should **not** be reported in public issues. See [SECURITY.md](SECURITY.md).

---

## Suggesting Features

Use the [Feature Request issue template](.github/ISSUE_TEMPLATE/feature_request.md).

Before opening a feature request:
- Check the [Roadmap](docs/roadmap.md) — it may already be planned
- Check open issues — avoid duplicates

A good feature request explains:
- The user problem it solves (not just the solution)
- Which user type it helps (job seeker / employer / admin)
- Rough scope estimate (hours vs days vs weeks)

---

## Community

- **GitHub Discussions** — questions, ideas, show-and-tell
- **Issues** — bugs and concrete feature requests only
- **Email** — cooperhumbertoykdd@gmail.com for security or private matters

We respond to PRs and issues within 3 business days. Community contributors are credited in [CHANGELOG.md](CHANGELOG.md).

---

*RemoteWorkNaija is built with ![Passion](https://img.shields.io/badge/Built%20with-Passion-blue?style=flat-square) for Nigerian professionals navigating the global remote work economy.*
