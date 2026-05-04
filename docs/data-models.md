# Data Models

All 12 database models across 7 Django apps. Every field documented with type, constraints, and purpose.

---

## users.User

Extends `django.contrib.auth.models.AbstractUser`. Adds professional profile fields and platform role.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `role` | CharField(20) | choices: job_seeker, employer; default: job_seeker | Determines dashboard access and employer-specific functionality |
| `phone` | CharField(20) | null, blank | Contact phone number |
| `profile_picture` | ImageField | upload_to='profile_pics/', null, blank | Avatar image (local or Cloudinary) |
| `company_name` | CharField(100) | null, blank | For employer accounts |
| `bio` | TextField | null, blank | Free-text professional bio |
| `headline` | CharField(200) | blank, default='' | Short professional tagline e.g. "Senior React Developer" |
| `location` | CharField(100) | blank, default='' | City/country e.g. "Lagos, Nigeria" |
| `slug` | SlugField(150) | unique, null, blank | URL-safe identifier, auto-generated from username |
| `availability` | CharField(20) | choices: available, open, not_available; default: available | Job search status shown on profile |
| `is_profile_public` | BooleanField | default=True | Controls public profile visibility |
| `website` | URLField | blank, default='' | Personal or portfolio website |
| `github_url` | URLField | blank, default='' | GitHub profile URL |
| `linkedin_url` | URLField | blank, default='' | LinkedIn profile URL |
| `twitter_url` | URLField | blank, default='' | Twitter/X profile URL |
| `created_at` | DateTimeField | auto_now_add, null | Account creation timestamp |
| `updated_at` | DateTimeField | auto_now | Last profile update timestamp |

**Inherited from AbstractUser:** `username`, `email`, `first_name`, `last_name`, `password`, `is_staff`, `is_active`, `date_joined`, `last_login`, `groups`, `user_permissions`

**`save()` override:** auto-generates `slug` from `username` on first save if not set.

**Related names:**
- `user.jobs` — jobs posted by employer
- `user.applications` — applications submitted by seeker
- `user.saved_jobs` — SavedJob records
- `user.skills` — UserSkill records
- `user.notifications` — Notification records
- `user.job_alerts` — JobAlert records
- `user.payments` — JobPayment records

---

## users.UserSkill

Links a user to a SkillTag from the taxonomy, optionally with a proficiency level.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `user` | ForeignKey(User) | CASCADE, related_name='skills' | The skill owner |
| `skill_tag` | ForeignKey(SkillTag) | CASCADE, null, blank | Linked taxonomy tag |
| `name` | CharField(100) | blank, default='' | Free-text fallback for custom skills not in taxonomy |
| `proficiency` | CharField(20) | blank, default='' | e.g. 'beginner', 'intermediate', 'expert' |

**Meta:** `unique_together = ['user', 'skill_tag']` — prevents duplicate skill entries.

---

## jobs.Job

Core job listing model. Covers both employer-posted jobs (`is_aggregated=False`) and RSS-aggregated jobs (`is_aggregated=True`).

| Field | Type | Constraints | Description |
|---|---|---|---|
| `employer` | ForeignKey(User) | CASCADE, null, blank, related_name='jobs' | Null for aggregated jobs |
| `company_name` | CharField(200) | required | Company display name |
| `company_logo_url` | URLField | null, blank | Remote logo URL (e.g. Clearbit CDN) |
| `title` | CharField(200) | required | Job title |
| `slug` | SlugField(250) | blank, auto-generated | URL-safe: `{title}-{company_name}` |
| `description` | TextField | required | Full job description (HTML or plain text) |
| `location` | CharField(100) | blank, default='Remote' | Location string |
| `job_type` | CharField(50) | choices: full_time, part_time, contract, freelance, internship; default: full_time | Employment type |
| `remote_type` | CharField(20) | choices: fully_remote, hybrid, on_site; default: fully_remote | Work arrangement |
| `experience_level` | CharField(20) | choices: entry, mid, senior, lead, executive; null, blank | Seniority |
| `salary` | DecimalField(10,2) | null, blank | Legacy single salary field |
| `salary_min` | DecimalField(12,2) | null, blank | Minimum salary |
| `salary_max` | DecimalField(12,2) | null, blank | Maximum salary |
| `salary_currency` | CharField(3) | blank, default='USD' | ISO currency code |
| `category` | ForeignKey(Category) | SET_NULL, null, blank, related_name='jobs' | Job category |
| `skill_tags` | ManyToManyField(SkillTag) | blank, related_name='jobs' | Required skills |
| `source_url` | URLField(500) | unique, null, blank | Original listing URL — **primary deduplication key** |
| `application_url` | URLField(500) | null, blank | Direct application link |
| `source_name` | CharField(100) | blank, default='' | e.g. 'Remotive', 'WeWorkRemotely' |
| `is_aggregated` | BooleanField | default=False | True for RSS-fetched jobs |
| `is_active` | BooleanField | default=True | Soft delete / visibility toggle |
| `status` | CharField(20) | choices: active, expired, closed, draft; default: active | Lifecycle status |
| `deadline` | DateTimeField | null, blank | Application deadline |
| `published_at` | DateTimeField | null, blank | When job went live |
| `created_at` | DateTimeField | auto_now_add | Record creation time |
| `is_featured` | BooleanField | default=False | Set True when Featured/Bundle plan purchased |
| `view_count` | PositiveIntegerField | default=0 | Incremented on detail page load |
| `application_count` | PositiveIntegerField | default=0 | Incremented on application submission |

**Meta:** `ordering = ['-created_at']`  
**`save()` override:** auto-generates `slug = slugify(f"{title}-{company_name}")[:250]`

---

## jobs.SavedJob

Bookmark table — user saves a job to their "favourites".

| Field | Type | Constraints | Description |
|---|---|---|---|
| `user` | ForeignKey(User) | CASCADE, related_name='saved_jobs' | The seeker |
| `job` | ForeignKey(Job) | CASCADE, related_name='saved_by' | The saved job |
| `saved_at` | DateTimeField | auto_now_add | When it was saved |

**Meta:** `unique_together = ('user', 'job')` · `ordering = ['-saved_at']`

---

## applications.Application

Full ATS record for a job application. Supports both authenticated and anonymous applicants.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `job` | ForeignKey(Job) | CASCADE, related_name='applications' | The applied-to job |
| `applicant` | ForeignKey(User) | CASCADE, null, blank, related_name='applications' | Null for unauthenticated |
| `resume` | FileField | upload_to='resumes/', null, blank | Uploaded resume file |
| `resume_url` | URLField | blank, default='' | External resume link |
| `cover_letter` | TextField | null, blank | Cover letter text |
| `applicant_name` | CharField(200) | blank, default='' | Denormalized fallback |
| `applicant_email` | EmailField | blank, default='' | Denormalized fallback |
| `status` | CharField(30) | choices (8): pending, reviewing, shortlisted, interview_scheduled, offer_made, accepted, rejected, withdrawn; default: pending | ATS pipeline stage |
| `is_withdrawn` | BooleanField | default=False | Withdrawal flag |
| `withdrawn_at` | DateTimeField | null, blank | Withdrawal timestamp |
| `interview_date` | DateTimeField | null, blank | Scheduled interview time |
| `interview_notes` | TextField | blank, default='' | Internal interview notes |
| `employer_notes` | TextField | blank, default='' | Employer-only private notes |
| `applied_at` | DateTimeField | auto_now_add | Submission timestamp |
| `updated_at` | DateTimeField | auto_now | Last status change |

**Meta:** `ordering = ['-applied_at']`

**Status flow:**
```
pending → reviewing → shortlisted → interview_scheduled → offer_made → accepted
                  ↘                                                  ↘
                   rejected                                          withdrawn
```

---

## categories.Category

Top-level job classification. Read-only in production — seeded via `seed_categories`.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `name` | CharField(100) | unique | Display name e.g. "Technology" |
| `slug` | SlugField(100) | unique | URL key e.g. "technology" |
| `description` | TextField | blank | Short description |
| `created_at` | DateTimeField | auto_now_add | — |

**Seeded categories (10):** Technology, Design & Creative, Marketing & Sales, Writing & Content, Finance & Accounting, Customer Support, Data & Analytics, Product Management, Operations & HR, Education & Training

---

## categories.SkillTag

Flat skill taxonomy. Tags belong to no parent category — they are associated with categories via jobs that use both. Seeded with 94 tags.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `name` | CharField(100) | unique | Tag name e.g. "Python", "React", "Figma" |

**Meta:** `ordering = ['name']`

**Sample tags by domain:**
- Technology (25): Python, Django, React, Node.js, TypeScript, PostgreSQL, Docker, Kubernetes, AWS, GCP, Machine Learning, FastAPI, Redis, GraphQL, REST APIs...
- Design (11): Figma, Adobe XD, Photoshop, Illustrator, UI/UX Design, Sketch, Prototyping, User Research...
- Marketing (12): SEO, Content Marketing, Google Analytics, Email Marketing, Copywriting, HubSpot, Social Media...

---

## aggregation.FetchLog

Immutable audit record for every aggregation run.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `source` | CharField(50) | choices: remotive_rss, weworkremotely_rss, adzuna_api, jsearch_api, manual | Data source identifier |
| `status` | CharField(20) | choices: running, success, partial, failed; default: running | Run outcome |
| `jobs_fetched` | PositiveIntegerField | default=0 | Raw count from RSS/API |
| `jobs_created` | PositiveIntegerField | default=0 | New records inserted |
| `jobs_skipped` | PositiveIntegerField | default=0 | Duplicates (source_url existed) |
| `jobs_updated` | PositiveIntegerField | default=0 | Existing records updated |
| `error_message` | TextField | null, blank | Exception detail on failure |
| `started_at` | DateTimeField | auto_now_add | Run start time |
| `completed_at` | DateTimeField | null, blank | Run end time |

**`duration_seconds` property:** `(completed_at - started_at).seconds` — computed, not stored.

**Meta:** `ordering = ['-started_at']`

---

## notifications.Notification

In-app notification for a specific user. Designed to support application updates, job alert matches, and system messages.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `user` | ForeignKey(User) | CASCADE, related_name='notifications' | Recipient |
| `notification_type` | CharField(30) | choices: application_update, new_job_match, job_alert, system | Display and filtering |
| `title` | CharField(200) | required | Short notification title |
| `message` | TextField | required | Full notification text |
| `link` | URLField | null, blank | Relative URL e.g. `/jobs/123` |
| `is_read` | BooleanField | default=False | Read state |
| `related_job` | ForeignKey(Job) | SET_NULL, null, blank | Associated job if applicable |
| `created_at` | DateTimeField | auto_now_add | — |

**Meta:** `ordering = ['-created_at']` · `Index on ['user', 'is_read']` (fast unread count queries)

---

## notifications.JobAlert

User-configured alert that fires when newly-fetched jobs match set criteria.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `user` | ForeignKey(User) | CASCADE, related_name='job_alerts' | Alert owner |
| `name` | CharField(100) | blank | User label e.g. "Senior Python Remote" |
| `keywords` | CharField(300) | blank | Comma-separated keywords checked against title + company + description |
| `job_type` | CharField(50) | null, blank | Filter: full_time, contract, etc. |
| `remote_type` | CharField(20) | null, blank | Filter: fully_remote, hybrid |
| `experience_level` | CharField(20) | null, blank | Filter: entry, mid, senior |
| `category` | ForeignKey(Category) | SET_NULL, null, blank | Filter by category |
| `min_salary` | DecimalField(12,2) | null, blank | Minimum salary_min filter |
| `salary_currency` | CharField(3) | blank, default='USD' | — |
| `frequency` | CharField(10) | choices: instant, daily, weekly; default: daily | Delivery cadence |
| `is_active` | BooleanField | default=True | Enable/disable without deleting |
| `last_sent_at` | DateTimeField | null, blank | Last notification dispatch time |
| `created_at` | DateTimeField | auto_now_add | — |

**`matches_job(job)` method:** evaluates all non-null criteria against a `Job` instance. Used by `ingest_jobs()` to create notifications on new job ingestion.

---

## payments.PaymentPlan

Defines the 3 purchasable job posting tiers. Seeded via `seed_plans`, managed via Django admin.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `tier` | CharField(20) | choices: basic, featured, premium; unique | Tier identifier |
| `name` | CharField(100) | — | Display name |
| `description` | TextField | blank | Plan description for UI |
| `price_ngn` | DecimalField(12,2) | — | Naira price |
| `price_usd` | DecimalField(10,2) | — | USD price |
| `duration_days` | PositiveSmallIntegerField | default=30 | Listing duration |
| `max_job_posts` | PositiveSmallIntegerField | default=1 | Job posts included |
| `is_featured` | BooleanField | — | Sets Job.is_featured=True on purchase |
| `is_active` | BooleanField | — | Show/hide from pricing page |
| `features` | JSONField | default=list | List of feature strings for UI bullets |

**Meta:** `ordering = ['price_ngn']`

**Seeded plans:**

| Tier | Name | NGN | USD | Posts | Featured |
|---|---|---|---|---|---|
| basic | Basic Listing | ₦5,000 | $5 | 1 | No |
| featured | Featured Listing | ₦15,000 | $15 | 3 | Yes |
| premium | Employer Bundle | ₦35,000 | $35 | 10 | Yes |

---

## payments.JobPayment

Records every payment transaction. Stores full Paystack response for audit.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `employer` | ForeignKey(User) | CASCADE, related_name='payments' | Paying employer |
| `job` | ForeignKey(Job) | SET_NULL, null, blank, related_name='payment' | Job being promoted |
| `plan` | ForeignKey(PaymentPlan) | PROTECT, null | Plan purchased |
| `amount` | DecimalField(12,2) | — | Amount charged |
| `currency` | CharField(3) | choices: NGN, USD; default: NGN | Payment currency |
| `reference` | CharField(200) | unique | Paystack reference e.g. `RWN-A1B2C3D4E5F6G7H8` |
| `status` | CharField(20) | choices: pending, success, failed, refunded, abandoned; default: pending | Payment status |
| `paystack_id` | CharField(200) | null, blank | Paystack transaction ID |
| `channel` | CharField(50) | null, blank | Payment channel: card, bank, ussd |
| `ip_address` | GenericIPAddressField | null, blank | Payer's IP |
| `paystack_response` | JSONField | default=dict | Raw webhook payload stored for audit |
| `created_at` | DateTimeField | auto_now_add | — |
| `paid_at` | DateTimeField | null, blank | Timestamp of confirmed payment |

**Meta:** `ordering = ['-created_at']` · Indexes on `['reference']`, `['status']`, `['employer']`

---

## intelligence.JobEmbedding

Stores the semantic vector representation of a job listing for semantic search.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `job` | OneToOneField(Job) | CASCADE, related_name='embedding' | Link to the job |
| `vector` | VectorField(384) | pgvector field | 384-dimension semantic embedding |
| `last_synced_at` | DateTimeField | auto_now | Tracking for embedding freshness |

---

## intelligence.UserEmbedding

Stores the semantic vector representation of a user's professional profile.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `user` | OneToOneField(User) | CASCADE, related_name='embedding' | Link to the user |
| `vector` | VectorField(384) | pgvector field | 384-dimension semantic embedding |

---

## intelligence.ATSMatch

Pre-calculated match score and analysis between a user and a job.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `user` | ForeignKey(User) | CASCADE, related_name='ats_matches' | The job seeker |
| `job` | ForeignKey(Job) | CASCADE, related_name='ats_matches' | The target job |
| `score` | FloatField | 0.0 to 1.0 | Cosine similarity match score |
| `analysis` | JSONField | default=dict | Detailed breakdown of match quality |

---

## verification.VerificationRequest

Manages the lifecycle of a user or company verification attempt.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `user` | ForeignKey(User) | CASCADE, related_name='verification_requests' | The requester |
| `request_type` | CharField(20) | choices: IDENTITY, SKILL, INFRASTRUCTURE, COMPANY | Type of verification |
| `status` | CharField(20) | choices: PENDING, IN_PROGRESS, VERIFIED, REJECTED | Status of request |
| `evidence` | FileField | upload_to='verification/evidence/', blank, null | Uploaded proof document |
| `document_url` | URLField(500) | blank, null | External proof link |
| `metadata` | JSONField | default=dict | Structured verification data |
| `rejection_reason` | TextField | blank | Why the request was denied |

---

## verification.TrustBadge

Global definition of a trust or achievement badge.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `name` | CharField(100) | unique | Display name e.g. "Solar Powered" |
| `slug` | SlugField(100) | unique | URL-safe identifier |
| `icon` | CharField(50) | — | Emoji or SVG identifier |
| `description` | TextField | — | Badge description |

---

## verification.UserBadge

The association between a user and their earned trust badges.

| Field | Type | Constraints | Description |
|---|---|---|---|
| `user` | ForeignKey(User) | CASCADE, related_name='badges' | The badge holder |
| `badge` | ForeignKey(TrustBadge) | CASCADE | The specific badge |
| `verified_at` | DateTimeField | auto_now_add | When the badge was awarded |
| `metadata` | JSONField | default=dict | Specifics of the award |
