# Roadmap

RemoteWorkNaija is designed as a 12-month build from MVP scaffold to full AI-powered career platform. The 4 sprints completed so far deliver a production-ready foundation. What follows is the plan for the remaining phases.

**Current status:** Foundation complete (Sprints 1–4). Deployable today.

---

## What's Built (Sprint 1–4)

| Feature | Status |
|---|---|
| Security: SECRET_KEY, permissions, JWT | ✅ Done |
| User model (15+ fields, role-based) | ✅ Done |
| Job model (30+ fields, aggregation support) | ✅ Done |
| ATS: Application model (8-status pipeline) | ✅ Done |
| Category + SkillTag taxonomy (10 cats, 94 tags) | ✅ Done |
| DRF ViewSets + router (9 endpoints) | ✅ Done |
| Search + 14 filter fields + pagination | ✅ Done |
| RSS aggregation: Remotive + WeWorkRemotely | ✅ Done |
| Job deduplication by source_url | ✅ Done |
| FetchLog audit trail | ✅ Done |
| JobAlert model with matches_job() | ✅ Done |
| In-app Notifications | ✅ Done |
| Paystack payment scaffold (mock-safe) | ✅ Done |
| Cloudinary media storage (conditional) | ✅ Done |
| Docker + docker-compose | ✅ Done |
| All 19 frontend pages | ✅ Done |
| AuthContext (dual-token, refresh, roles) | ✅ Done |
| axiosInstance (401 auto-refresh) | ✅ Done |
| Edge middleware (SSR route protection) | ✅ Done |
| OpenAPI 3 schema + Swagger UI | ✅ Done |

---

## Phase 2 — Infrastructure & Search (Months 2–3)

The current SQLite + manual aggregation setup works for development but won't scale. Phase 2 hardens the infrastructure.

### PostgreSQL

**What:** Replace SQLite with PostgreSQL 16.  
**Why:** Concurrent connections, production reliability, full-text search (pg_trgm), JSON querying.  
**How:**
1. Add `psycopg2-binary` + `dj-database-url` to requirements
2. Update settings to parse `DATABASE_URL`
3. Add `db` service to docker-compose
4. Run existing migrations against Postgres (all ORM code is DB-agnostic)

**Effort:** 1 day

### Redis + Celery

**What:** Async task queue for background job processing.  
**Why:** `fetch_jobs` currently must be run manually. Email sending is not yet implemented. With Celery, these run automatically on a schedule.  
**How:**
1. Add `celery`, `redis`, `django-celery-beat` to requirements
2. Add Redis service to docker-compose
3. Create `backend/celery.py` with app configuration
4. Convert `fetch_jobs` management command to a Celery periodic task (every 6 hours)
5. Create email dispatch task: `dispatch_job_alert_notifications()`
6. Create `expire_jobs` Celery task (daily at midnight)

**Effort:** 3–4 days

### Meilisearch

**What:** Self-hosted full-text search engine.  
**Why:** Current `?search=` uses Django ORM `icontains` — works but not typo-tolerant and slow at scale. Meilisearch delivers sub-50ms search with typo tolerance, faceted filtering, and relevance ranking.  
**How:**
1. Add `meilisearch` (Python client) to requirements
2. Add Meilisearch service to docker-compose
3. Create `jobs/search.py` with index management
4. Index fields: title, description, company_name, tags, category, location
5. Replace `?search=` in JobViewSet with Meilisearch query
6. Keep django-filter for faceted filters (job_type, remote_type, etc.)
7. Add `python manage.py rebuild_search_index` command

**Effort:** 3–4 days

### Email Notifications (SendGrid / Mailgun)

**What:** Transactional emails for application status changes and job alert matches.  
**Why:** Currently notifications are in-app only. Email dramatically improves engagement.  
**How:**
1. Add `django-anymail` to requirements
2. Set `ANYMAIL_SENDGRID_API_KEY` in settings
3. Create `notifications/emails.py` with templated email functions
4. Create Celery tasks: `send_application_update_email()`, `send_job_alert_digest()`
5. HTML email templates with RemoteWorkNaija branding

**Effort:** 2–3 days

### Rate Limiting

**What:** DRF throttling on sensitive endpoints.  
**Why:** Prevents abuse of auth endpoints and API scraping.  
**Implementation:**
```python
REST_FRAMEWORK = {
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "100/day",
        "user": "1000/day",
        "token_obtain": "5/min",
    }
}
```

**Effort:** 1 day

### More Job Sources (Phase 2)

Add parsers for:
- **RemoteOK RSS** (`https://remoteok.com/remote-jobs.rss`) — ~150 jobs, no auth
- **Jobspresso RSS** — ~50 curated jobs, no auth
- **Working Nomads RSS** — ~100 jobs, no auth
- **Adzuna API** — free API key, ~500 Nigerian-relevant jobs
- **JSearch (RapidAPI)** — paid, ~1000 jobs with rich metadata

Each adds ~1 day of work using the existing `BaseJobParser` pattern.

**Nigerian relevance scoring:** Add a `relevance_score` field to `Job`. Score 0–100 based on: mentions "worldwide" (+30), timezone overlap with GMT+1 (+20), skills in-demand in Nigerian market (+20), salary in USD (+10), etc.

---

## Phase 3 — Professional Profiles & ATS (Months 4–6)

### Enhanced User Profiles

Current `User` model has the right fields but no supporting sections. Phase 3 adds structured data:

**New models:**
- `WorkExperience` — company, title, start_date, end_date, description, is_current
- `Education` — institution, degree, field, start_year, end_year
- `Certification` — name, issuer, issued_date, url, credential_id
- `Portfolio` — title, description, project_url, repo_url, screenshot, tech_stack (M2M to SkillTag)

All linked to User via FK. Managed via `/api/v1/users/me/work-experience/`, etc.

Frontend: new tabs on `/profile/edit` and sections on `/profile/[username]`.

**Effort:** 1 week

### Skills Verification

**How:**
1. Multiple-choice + coding challenge assessments per skill category
2. `SkillAssessment` model: user, skill_tag, score, passed, taken_at
3. Badge on profile: "Verified: Python" with score
4. Shown in job applications

**Effort:** 1–2 weeks (depending on assessment content creation)

### LinkedIn + GitHub Import

**LinkedIn OAuth:**
1. Register LinkedIn app for OAuth 2.0
2. OAuth flow: user grants permission → fetch profile + work history
3. Pre-populate User fields and create WorkExperience records

**GitHub API:**
1. Users connect via GitHub OAuth
2. Pull repos, languages, contribution stats
3. Auto-suggest SkillTags based on repo languages

**Effort:** 3–4 days each

### Company Profiles

**New models:**
- `CompanyProfile` — linked to employer User, name, logo, website, size_range, description, culture, founded_year, headquarters
- `CompanyReview` — user, company, rating, title, body, is_verified_employee, created_at

Frontend: `/companies/[slug]` public page, `/companies/[slug]/reviews`, employer dashboard shows company profile editor.

**Effort:** 1 week

### ATS Upgrades (Employer)

Current ATS supports status updates. Phase 3 adds:
- **Kanban view:** drag-and-drop pipeline stages in employer dashboard
- **Bulk actions:** select multiple applications, update status, export CSV
- **Candidate search:** query across all applicants by skill, experience, availability
- **Analytics:** per-job stats (views, applications, conversion rate, time-to-hire)
- **Interview scheduling:** calendar link generation, reminder emails

**Effort:** 1–2 weeks

---

## Phase 4 — AI Features (Months 7–9)

All AI features use OpenAI GPT-4o-mini via the OpenAI Python SDK. Requires `OPENAI_API_KEY` in settings.

### AI Job-Resume Matching

**What:** Score how well a seeker's profile matches a specific job.  
**Endpoint:** `POST /api/v1/jobs/{id}/match-score/`  
**How:**
1. Prepare prompt: job description + required skills + seeker's headline, bio, skills, work history
2. GPT-4o-mini returns JSON: `{ "score": 87, "strengths": [...], "gaps": [...] }`
3. Display on job detail page: "87% match" badge for logged-in seekers
4. Cache match scores in Redis (TTL: 24 hours)

**Effort:** 3–4 days

### CV/Resume Enhancement

**What:** AI suggests improvements to a seeker's CV.  
**Endpoint:** `POST /api/v1/users/enhance-cv/`  
**How:** User uploads or pastes CV text. GPT returns structured feedback: better bullet points, missing keywords, ATS optimization tips, format suggestions.

**Effort:** 2 days

### Job Description Generator

**What:** Help employers write better job descriptions.  
**Endpoint:** `POST /api/v1/jobs/generate-description/`  
**Input:** `{ "title": "...", "requirements": "...", "company_context": "..." }`  
**Output:** Full structured job description ready to post.

**Effort:** 2 days

### Skills Gap Analysis

**What:** Compare seeker profile to a target job and recommend upskilling.  
**Endpoint:** `POST /api/v1/jobs/{id}/skills-gap/`  
**Output:** `{ "matching": [...], "missing": [...], "resources": [{ "skill": "Docker", "link": "https://..." }] }`

**Effort:** 2–3 days

### Smart Recommendations

**What:** Personalized job feed for each seeker.  
**How:**
1. Collect implicit signals: saved jobs, viewed jobs, applied jobs, alert keywords
2. Content-based filtering: find jobs with matching skill_tags and category
3. Collaborative filtering (longer term): users with similar profiles → what did they apply to?
4. Daily digest email: "5 new jobs matched for you"

**Effort:** 1 week

### Salary Estimation

**What:** Predict fair compensation for a role.  
**Endpoint:** `GET /api/v1/jobs/salary-estimate/?title=Senior+React+Developer&experience=senior&location=Nigeria`  
**Data sources:** AnonymousSalaryReport table (crowdsourced) + GPT interpolation

**Effort:** 3–4 days

---

## Phase 5 — Community & Content (Months 9–12)

### Blog & Resources

- `BlogPost` model: title, slug, content (MDX), author, published_at, tags, featured_image, reading_time
- Pages: `/blog`, `/blog/[slug]`
- Content focus: remote work tax in Nigeria, receiving international payments, interview prep for remote roles

### Salary Transparency Database

- `AnonymousSalaryReport` model: role, experience_level, company_size_range, annual_salary, currency, country, reported_at
- Aggregated public view at `/salary-data`
- No individual records shown — only min/median/max by role + experience bucket

### Company Reviews

- `CompanyReview` model: user, company, rating (1-5), pros, cons, title, is_verified_employee
- Displayed on company profile pages
- Aggregate rating shown in job listings

### Newsletter System

- Integration with SendGrid Marketing (or Mailchimp)
- Opt-in on signup page and notifications page
- Weekly digest: top 10 matching jobs + 1 featured article + 1 community success story
- Celery task: `send_weekly_newsletter()` — every Sunday 9am WAT

### Payment Guides (Static Content)

- MDX pages at `/guides/`:
  - How to receive international payments as a Nigerian (Wise, Grey, Payoneer)
  - USD vs NGN salary negotiation
  - Tax implications of remote work in Nigeria
  - Building a remote work setup on a budget

---

## Phase 6 — Infrastructure Hardening (Ongoing)

### GitHub Actions CI/CD

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  backend:
    - checkout
    - setup python 3.12
    - pip install -r requirements.txt
    - python manage.py check
    - pytest
  frontend:
    - checkout
    - npm ci
    - npm run build
    - npm run lint
  deploy:
    if: github.ref == 'refs/heads/main'
    - build docker images
    - push to registry
    - ssh deploy to server
```

### Sentry

- Backend: `sentry-sdk[django]` — unhandled exceptions + performance
- Frontend: `@sentry/nextjs` — client errors + Web Vitals
- `SENTRY_DSN` in both environments

### UptimeRobot

Monitor these endpoints every 5 minutes:
- `https://remoteworknaija.com` (frontend)
- `https://api.remoteworknaija.com/api/token/verify/` (backend)
- Alert via email + Slack on downtime

---

## Summary Timeline

| Phase | Focus | Duration | Key Unlock |
|---|---|---|---|
| ✅ Sprints 1–4 | Foundation | Complete | Deployable platform |
| Phase 2 | PostgreSQL, Celery, Meilisearch, Email | 6–8 weeks | Scale + automation |
| Phase 3 | Profiles, ATS, Verification | 8–10 weeks | Trust + employer tools |
| Phase 4 | AI matching, CV enhancement, recommendations | 6–8 weeks | Differentiation |
| Phase 5 | Community, blog, salary data | 8–10 weeks | Engagement + retention |
| Phase 6 | CI/CD, Sentry, monitoring | Ongoing | Reliability |
