# API Reference

Base URL: `/api/v1/`  
Authentication: **HttpOnly Cookies** (recommended) or `Authorization: Bearer <access_token>`  
Pagination: `?page=N` (20 results per page)  
Interactive docs: `/api/docs/` (Swagger UI)  
Schema download: `/api/schema/`

---

## Authentication

### Obtain Token Pair
```
POST /api/token/
```
**Body:**
```json
{
  "username": "johndoe",
  "password": "yourpassword"
}
```
**Response 200:**
Sets `access_token` and `refresh_token` in **HttpOnly Cookies**.
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
Access tokens expire after 60 minutes. Refresh tokens expire after 7 days.

### Refresh Access Token
```
POST /api/token/refresh/
```
**Body:** `{}` (Reads `refresh_token` from cookies)
**Response 200:**
Sets new `access_token` and `refresh_token` in **HttpOnly Cookies**.
```json
{
  "access": "<new_access_token>",
  "refresh": "<new_refresh_token>"
}
```
Each refresh issues a new refresh token (rotation enabled). Old refresh token is blacklisted.

### Verify Token
```
POST /api/token/verify/
```
**Body:** `{ "token": "<access_token>" }`  
**Response 200:** `{}` (empty = valid)  
**Response 401:** token is invalid or expired

---

## Users

### Register
```
POST /api/v1/users/
```
Creates a new user account.

**Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "role": "job_seeker"
}
```
`role` must be `"job_seeker"` or `"employer"`. Defaults to `"job_seeker"`.

**Response 201:**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "role": "job_seeker",
  "slug": "johndoe",
  "headline": "",
  "bio": null,
  "location": "",
  ...
}
```

### Get Own Profile
```
GET /api/v1/users/me/
Authorization: Bearer <token>
```
Returns the authenticated user's full profile including skills.

**Response 200:**
```json
{
  "id": 1,
  "username": "johndoe",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "role": "job_seeker",
  "headline": "Senior React Developer",
  "bio": "5 years building web products...",
  "location": "Lagos, Nigeria",
  "availability": "available",
  "is_profile_public": true,
  "website": "https://johndoe.dev",
  "github_url": "https://github.com/johndoe",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "skills": [
    { "id": 1, "skill_tag": { "id": 5, "name": "React" }, "proficiency": "expert" }
  ],
  "slug": "johndoe",
  "profile_picture": null
}
```

### Update Own Profile
```
PATCH /api/v1/users/me/
Authorization: Bearer <token>
```
Partial update. Send only the fields you want to change.

**Body (example):**
```json
{
  "headline": "Senior React Developer",
  "location": "Lagos, Nigeria",
  "bio": "I build fast, accessible web apps.",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "is_profile_public": true
}
```

### Get Public Profile
```
GET /api/v1/users/{username}/
```
Returns public profile. Returns 404 if `is_profile_public=False`.

### List Users (Admin only)
```
GET /api/v1/users/
Authorization: Bearer <admin_token>
```

---

## Jobs

### List Jobs
```
GET /api/v1/jobs/
```
Public endpoint. Returns paginated job listings ordered by newest first.

**Query parameters:**

| Parameter | Type | Description |
|---|---|---|
| `search` | string | Full-text search across title, description, company, location |
| `title` | string | Partial match on title |
| `company` | string | Partial match on company_name |
| `location` | string | Partial match on location |
| `job_type` | string | `full_time`, `part_time`, `contract`, `freelance`, `internship` |
| `remote_type` | string | `fully_remote`, `hybrid`, `on_site` |
| `experience_level` | string | `entry`, `mid`, `senior`, `lead`, `executive` |
| `category` | integer | Category ID |
| `category_slug` | string | Category slug e.g. `technology` |
| `skill` | string | Partial match on skill tag name |
| `salary_min` | number | Minimum salary_min value |
| `salary_max` | number | Maximum salary_max value |
| `salary_currency` | string | `USD`, `NGN`, `EUR`, `GBP` |
| `is_featured` | boolean | `true` for featured listings only |
| `is_aggregated` | boolean | `true` for RSS-sourced jobs |
| `posted_after` | datetime | ISO 8601 e.g. `2026-01-01T00:00:00Z` |
| `posted_before` | datetime | ISO 8601 |
| `ordering` | string | `created_at`, `-created_at`, `salary_min`, `-salary_min` |
| `page` | integer | Page number (20 per page) |

**Response 200:**
```json
{
  "count": 239,
  "next": "http://localhost:8000/api/v1/jobs/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Senior Frontend Developer",
      "company_name": "Acme Corp",
      "company_logo_url": null,
      "slug": "senior-frontend-developer-acme-corp",
      "location": "Remote",
      "job_type": "full_time",
      "remote_type": "fully_remote",
      "experience_level": "senior",
      "salary_min": 80000,
      "salary_max": 120000,
      "salary_currency": "USD",
      "category": { "id": 1, "name": "Technology", "slug": "technology" },
      "skill_tags": [{"id": 1, "name": "React"}, {"id": 2, "name": "TypeScript"}],
      "is_featured": false,
      "is_aggregated": true,
      "source_name": "Remotive",
      "published_at": "2026-04-08T10:00:00Z",
      "created_at": "2026-04-08T10:00:00Z"
    }
  ]
}
```

### Get Job Detail
```
GET /api/v1/jobs/{id}/
```
Returns full job detail including description. Increments `view_count`.

### Create Job
```
POST /api/v1/jobs/
Authorization: Bearer <employer_token>
```
**Body:**
```json
{
  "title": "Senior React Developer",
  "company_name": "My Company",
  "description": "We are looking for...",
  "location": "Remote - Worldwide",
  "job_type": "full_time",
  "remote_type": "fully_remote",
  "experience_level": "senior",
  "salary_min": 80000,
  "salary_max": 120000,
  "salary_currency": "USD",
  "category": 1,
  "application_url": "https://mycompany.com/apply"
}
```

### Update Job
```
PATCH /api/v1/jobs/{id}/
Authorization: Bearer <owner_token>
```
Partial update. Owner or staff only.

### Delete Job
```
DELETE /api/v1/jobs/{id}/
Authorization: Bearer <owner_token>
```

---

## Saved Jobs

### List Saved Jobs
```
GET /api/v1/saved-jobs/
Authorization: Bearer <token>
```
Returns jobs saved by the authenticated user.

### Save a Job
```
POST /api/v1/saved-jobs/
Authorization: Bearer <token>
```
**Body:** `{ "job": 42 }`  
**Response 201:** SavedJob record.  
**Response 400:** if already saved (unique_together constraint).

### Unsave a Job
```
DELETE /api/v1/saved-jobs/{id}/
Authorization: Bearer <token>
```

---

## Applications

### List Applications
```
GET /api/v1/applications/
Authorization: Bearer <token>
```
- Seekers see their own applications
- Employers see applications for their jobs
- Optional filter: `?job={id}`

### Submit Application
```
POST /api/v1/applications/
Authorization: Bearer <token>
Content-Type: multipart/form-data
```
**Fields:**
| Field | Required | Description |
|---|---|---|
| `job` | Yes | Job ID |
| `cover_letter` | Yes | Cover letter text |
| `resume` | No | Resume file (PDF/DOC/DOCX) |
| `resume_url` | No | External resume URL |

**Response 201:** Application record with `status: "pending"`.

### Get Application
```
GET /api/v1/applications/{id}/
Authorization: Bearer <token>
```

### Update Application Status (Employer)
```
PATCH /api/v1/applications/{id}/
Authorization: Bearer <employer_token>
```
**Body:** `{ "status": "shortlisted" }` or `{ "interview_date": "2026-05-01T10:00:00Z" }`

Valid status transitions: `pending → reviewing → shortlisted → interview_scheduled → offer_made → accepted / rejected / withdrawn`

---

## Categories

### List Categories
```
GET /api/v1/categories/
```
Public. Returns all 10 job categories.

**Response 200:**
```json
[
  { "id": 1, "name": "Technology", "slug": "technology", "description": "..." },
  { "id": 2, "name": "Design & Creative", "slug": "design-creative", "description": "..." },
  ...
]
```

### List Skill Tags
```
GET /api/v1/skill-tags/
```
Public. Returns all 94 skill tags. Supports `?search=python`.

---

## Notifications

### List Notifications
```
GET /api/v1/notifications/
Authorization: Bearer <token>
```
Returns notifications for the authenticated user, newest first. Filter: `?is_read=false`

**Response 200:**
```json
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "notification_type": "application_update",
      "title": "Application shortlisted",
      "message": "Your application for Senior React Developer at Acme Corp has been shortlisted.",
      "link": "/jobs/42",
      "is_read": false,
      "created_at": "2026-04-08T12:00:00Z"
    }
  ]
}
```

### Mark Notification as Read
```
PATCH /api/v1/notifications/{id}/
Authorization: Bearer <token>
```
**Body:** `{ "is_read": true }`

---

## Job Alerts

### List Job Alerts
```
GET /api/v1/job-alerts/
Authorization: Bearer <token>
```

### Create Job Alert
```
POST /api/v1/job-alerts/
Authorization: Bearer <token>
```
**Body:**
```json
{
  "name": "Senior Python Remote",
  "keywords": "Python, Django, FastAPI",
  "job_type": "full_time",
  "remote_type": "fully_remote",
  "experience_level": "senior",
  "frequency": "daily"
}
```
All fields except `name` are optional. The alert fires when newly-ingested jobs match ALL provided criteria.

### Update Job Alert
```
PATCH /api/v1/job-alerts/{id}/
Authorization: Bearer <token>
```

### Delete Job Alert
```
DELETE /api/v1/job-alerts/{id}/
Authorization: Bearer <token>
```

---

## Payments

### List Payment Plans
```
GET /api/v1/payment/plans/
```
Public. Returns the 3 active pricing tiers.

**Response 200:**
```json
[
  {
    "id": 1,
    "tier": "basic",
    "name": "Basic Listing",
    "description": "Post one job for 30 days",
    "price_ngn": "5000.00",
    "price_usd": "5.00",
    "duration_days": 30,
    "max_job_posts": 1,
    "is_featured": false,
    "features": ["1 job post", "30 day listing", "Standard visibility"]
  }
]
```

### Initiate Payment
```
POST /api/v1/payment/initiate/
Authorization: Bearer <employer_token>
```
**Body:** `{ "plan_id": 2, "job_id": 42 }` (job_id optional)

**Response 200:**
```json
{
  "authorization_url": "https://checkout.paystack.com/xxx",
  "reference": "RWN-A1B2C3D4E5F6G7H8",
  "amount": 15000
}
```
Redirect the user to `authorization_url`. In mock mode (no Paystack key set), returns `/payment/mock-verify?reference=xxx`.

### Verify Payment
```
GET /api/v1/payment/verify/?reference=RWN-A1B2C3D4E5F6G7H8
Authorization: Bearer <employer_token>
```
Called by the frontend after Paystack redirects to `/payment/verify?reference=xxx`.

**Response 200 (success):**
```json
{
  "status": "success",
  "message": "Payment verified. Your listing is now active.",
  "reference": "RWN-A1B2C3D4E5F6G7H8"
}
```

### Paystack Webhook
```
POST /api/v1/payment/webhook/
X-Paystack-Signature: <hmac_sha512>
```
Paystack calls this endpoint when a payment event occurs. Signature verified via HMAC-SHA512. Updates `JobPayment.status` and sets `Job.is_featured=True` on successful featured plan purchases.

### My Payments
```
GET /api/v1/my-payments/
Authorization: Bearer <employer_token>
```
Returns payment history for the authenticated employer.

---

## Intelligence

### Job Matches (AI)
```
GET /api/v1/intelligence/jobs/match/
```
Returns jobs matched to the user's profile using semantic similarity (pgvector).
**Response 200:** Paginated list of jobs.

### Semantic Search
```
GET /api/v1/intelligence/jobs/search/?q=python developer
```
Natural language search for jobs.
**Response 200:** List of jobs.

### Candidate Match (Employer Only)
```
GET /api/v1/intelligence/candidates/match/?q=react expert
```
Rank candidates for a specific query, weighting verified trust badges.
**Response 200:** List of users.

---

## Verification

### Submit Verification Request
```
POST /api/v1/verification/requests/
Content-Type: multipart/form-data
```
**Fields:** `request_type` (IDENTITY, SKILL, INFRASTRUCTURE, COMPANY), `evidence` (file), `document_url` (optional).

### List My Requests
```
GET /api/v1/verification/requests/
```

### List All Badges
```
GET /api/v1/verification/badges/
```

### List My Badges
```
GET /api/v1/verification/badges/my_badges/
```

---

## Aggregation Stats (Admin)

```
GET /api/v1/aggregation/stats/
Authorization: Bearer <staff_token>
```
Returns the last 10 FetchLog records with source, status, counts, and duration.

---

## Error Responses

All errors follow DRF standard format:

```json
{ "detail": "Authentication credentials were not provided." }
```

Validation errors return field-level detail:
```json
{
  "title": ["This field is required."],
  "job_type": ["\"invalid\" is not a valid choice."]
}
```

| Status | Meaning |
|---|---|
| 400 | Validation error |
| 401 | Missing or invalid token |
| 403 | Authenticated but not permitted (e.g. editing another user's job) |
| 404 | Object not found |
| 429 | Rate limit exceeded (when rate limiting is added in Phase 2) |
| 500 | Server error |
