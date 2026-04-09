# Aggregation System

The aggregation pipeline is how RemoteWorkNaija stays stocked with live remote jobs without manual data entry. It fetches, normalizes, deduplicates, and ingests jobs from external RSS feeds and APIs.

---

## Architecture

```
Management Command (fetch_jobs)
        │
        ▼
  ┌─────────────┐
  │ ParserClass │  ← one per source
  │  .fetch()   │  → returns List[Dict]
  └──────┬──────┘
         │ normalized job dicts
         ▼
  ┌──────────────┐
  │ ingest_jobs  │  ← deduplication + DB write
  │  (ingestor)  │
  └──────┬───────┘
         │
    ┌────┴────┐
    │         │
  FetchLog  jobs table + Notifications
```

### Key principle: `source_url` is the deduplication key
Every job from an external source has a `source_url`. If a job with that URL already exists in the database, it is skipped — not duplicated, not overwritten. This ensures the same job appearing in multiple RSS category feeds (e.g. a WeWorkRemotely job in both "programming" and "general" feeds) is only stored once.

---

## Base Parser

`backend/aggregation/parsers/base.py`

All parsers extend `BaseJobParser`:

```python
class BaseJobParser:
    source_name: str = ""        # Set in subclass e.g. "Remotive"

    def fetch(self) -> List[Dict[str, Any]]:
        raise NotImplementedError

    def normalize(self, raw: dict) -> dict:
        # Strips whitespace, ensures required keys present
        # Returns standardized job dict
```

The `normalize()` method ensures every returned dict has the same shape regardless of source.

**Normalized job dict shape:**
```python
{
    "title": str,
    "company_name": str,
    "description": str,
    "source_url": str,          # REQUIRED for deduplication
    "application_url": str,
    "location": str,            # default "Remote"
    "job_type": str,            # default "full_time"
    "remote_type": str,         # default "fully_remote"
    "category_hint": str|None,  # matched to Category.name
    "tags": List[str],          # matched to SkillTag.name
}
```

---

## Remotive RSS Parser

`backend/aggregation/parsers/remotive.py`

**Feed URL:** `https://remotive.com/remote-jobs/feed`  
**Live jobs per run:** ~22 (varies with posting frequency)

### How it works

1. `feedparser.parse(REMOTIVE_RSS_URL)` — fetches and parses the RSS feed
2. For each entry:
   - Extracts `source_url` from `entry.link`
   - Parses title: Remotive uses "Job Title at Company Name" format — splits on ` at ` (last occurrence)
   - Extracts category from RSS tags using `CATEGORY_MAP`
   - Non-category tags under 50 chars become skill tag candidates

### Category mapping

```python
CATEGORY_MAP = {
    "Software Dev":       "Technology",
    "Design":             "Design & Creative",
    "Marketing":          "Marketing & Sales",
    "Writing":            "Writing & Content",
    "Finance / Legal":    "Finance & Accounting",
    "Customer Service":   "Customer Support",
    "Data":               "Data & Analytics",
    "Product":            "Product Management",
    "HR":                 "Operations & HR",
    "DevOps / Sysadmin":  "Technology",
    "QA":                 "Technology",
    "Management":         "Operations & HR",
    "Business":           "Operations & HR",
    "Sales":              "Marketing & Sales",
}
```

---

## WeWorkRemotely RSS Parser

`backend/aggregation/parsers/weworkremotely.py`

**Feeds (5 category feeds):**

| Feed URL | Category hint |
|---|---|
| `.../remote-programming-jobs.rss` | Technology |
| `.../remote-design-jobs.rss` | Design & Creative |
| `.../remote-devops-sysadmin-jobs.rss` | Technology |
| `.../remote-marketing-jobs.rss` | Marketing & Sales |
| `.../remote-jobs.rss` | None (general) |

**Live jobs per run:** ~217 (across all feeds, deduplicated)

### How it works

1. Iterates through all 5 feeds
2. Maintains a `seen_urls` set across all feeds — jobs appearing in multiple feeds are only included once
3. For each entry:
   - Parses title: WWR uses "Company: Job Title" format — splits on `: ` (first occurrence)
   - Category assigned from the feed's `category_hint`
   - Location parsed from entry content (often "Worldwide", "USA Only", etc.)

---

## Ingestor

`backend/aggregation/ingestor.py`

`ingest_jobs(jobs: List[Dict], log: FetchLog) -> Dict`

The ingestor takes the list of normalized job dicts from a parser and writes them to the database.

```python
counts = {"created": 0, "skipped": 0, "updated": 0, "errors": 0}

for job_data in jobs:
    if not job_data.get("source_url"):
        counts["errors"] += 1
        continue

    # Resolve category by name hint
    category = None
    if category_hint := job_data.pop("category_hint", None):
        category = Category.objects.filter(name=category_hint).first()

    # Resolve skill tags by name
    tags = job_data.pop("tags", [])
    skill_tag_objects = [SkillTag.objects.get_or_create(name=t)[0] for t in tags[:10]]

    # Deduplication: get existing or create new
    job, created = Job.objects.get_or_create(
        source_url=job_data["source_url"],
        defaults={**job_data, "is_aggregated": True, "category": category}
    )

    if created:
        job.skill_tags.set(skill_tag_objects)
        counts["created"] += 1
        # Check active JobAlerts for matches → create Notifications
        check_job_alerts(job)
    else:
        counts["skipped"] += 1
```

### Job alert matching

When a new job is created, `check_job_alerts(job)` iterates all active `JobAlert` records and calls `alert.matches_job(job)`. For each match, a `Notification` of type `new_job_match` is created for that user. This is synchronous at the moment — in Phase 2 it will move to a Celery task.

---

## Management Commands

### `fetch_jobs`

```bash
python manage.py fetch_jobs
# Fetches from all sources, saves to DB

python manage.py fetch_jobs --source remotive
python manage.py fetch_jobs --source weworkremotely
# Fetch single source

python manage.py fetch_jobs --dry-run
# Parse RSS, print samples, do NOT write to DB
```

The command:
1. Creates a `FetchLog` entry with `status='running'`
2. Runs each parser
3. Calls `ingest_jobs()` (or just prints in dry-run mode)
4. Updates the FetchLog with counts and `status='success'/'partial'/'failed'`

Sample dry-run output:
```
→ Fetching from remotive...
  Fetched 22 jobs from remotive
  [DRY RUN] Not saving to database.
    Sample: Senior Frontend Developer @ Acme Corp
    Sample: Product Designer @ Remote First Co
    Sample: Backend Engineer @ TechCorp

→ Fetching from weworkremotely...
  Fetched 217 jobs from weworkremotely
  [DRY RUN] Not saving to database.
    Sample: Senior Full-Stack Developer @ Creatunity
    Sample: Senior Software Engineer @ Stellar AI
    Sample: Senior Software Engineer - Backend/Python @ Close

Aggregation complete.
```

### `expire_jobs`

```bash
python manage.py expire_jobs
```
Marks all `Job` records where `deadline < now` and `status='active'` as `status='expired'`. Safe to run on a cron.

---

## Adding a New Job Source

To add a new parser (e.g. RemoteOK RSS):

**Step 1:** Create `backend/aggregation/parsers/remoteok.py`:

```python
import feedparser
from .base import BaseJobParser

REMOTEOK_RSS = "https://remoteok.com/remote-jobs.rss"

class RemoteOKParser(BaseJobParser):
    source_name = "RemoteOK"

    def fetch(self):
        jobs = []
        feed = feedparser.parse(REMOTEOK_RSS)
        for entry in feed.entries:
            jobs.append(self.normalize({
                "title": entry.title,
                "company_name": entry.get("company", "Unknown"),
                "description": entry.get("summary", ""),
                "source_url": entry.link,
                "application_url": entry.link,
                "location": "Remote",
                "job_type": "full_time",
                "remote_type": "fully_remote",
                "category_hint": "Technology",
                "tags": [],
            }))
        return jobs
```

**Step 2:** Register in `fetch_jobs` command:

```python
# backend/aggregation/management/commands/fetch_jobs.py
from aggregation.parsers.remoteok import RemoteOKParser

PARSERS = {
    "remotive": RemotiveRSSParser,
    "weworkremotely": WeWorkRemotelyParser,
    "remoteok": RemoteOKParser,      # ← add this
}
```

**Step 3:** Add to FetchLog source choices:

```python
# backend/aggregation/models.py
SOURCE_CHOICES = [
    ("remotive_rss", "Remotive RSS"),
    ("weworkremotely_rss", "WeWorkRemotely RSS"),
    ("remoteok_rss", "RemoteOK RSS"),    # ← add this
    ...
]
```

**Step 4:** Add to log_source_map in fetch_jobs command:

```python
log_source_map = {
    "remotive": "remotive_rss",
    "weworkremotely": "weworkremotely_rss",
    "remoteok": "remoteok_rss",    # ← add this
}
```

**Step 5:** Run and verify:

```bash
python manage.py fetch_jobs --source remoteok --dry-run
python manage.py fetch_jobs --source remoteok
```

---

## Planned Sources (Phase 2)

| Source | Type | Auth Required | Est. Jobs/Run |
|---|---|---|---|
| RemoteOK | RSS | No | ~150 |
| Jobspresso | RSS | No | ~50 |
| Working Nomads | RSS | No | ~100 |
| Adzuna | API | Free API key | ~500 |
| JSearch (RapidAPI) | API | Paid API key | ~1000 |

---

## Monitoring

Every aggregation run is logged to `FetchLog`. View in Django admin at `/admin/aggregation/fetchlog/`.

The admin list view shows:
- Source name
- Status (running/success/partial/failed)
- jobs_fetched / jobs_created / jobs_skipped
- Duration in seconds
- Timestamp

For programmatic access: `GET /api/v1/aggregation/stats/` (staff only).
