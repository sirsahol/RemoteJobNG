# ADR-008: Aggregation Source Strategy — Remotive, WeWorkRemotely, RSS Parser Design, and Dry-Run Architecture

**Date**: 2026-04-08  
**Status**: Accepted  
**Deciders**: @sirsahol  
**Supersedes**: Partial overlap with ADR-003 (which covered RSS vs scraping at a high level). This ADR covers source selection, parser internals, and operational design in full depth.

---

## Context

RemoteWorkNaija's core product is the aggregation of live global remote jobs — specifically curated for Nigerian professionals. The aggregation system must answer four questions:

1. **Which sources** do we pull from, and why those over alternatives?
2. **How** do we pull from them — what transport and parsing mechanism?
3. **How** do we prevent duplicates as we pull from the same sources repeatedly?
4. **How** do we operate safely — testing parsers, debugging feed issues, and onboarding new sources without corrupting the database?

These decisions have outsized product impact: the quality, quantity, and freshness of jobs in the feed is the primary value driver for job seekers.

---

## Decision

### Sources (Phase 1)

| Source | Mechanism | Confirmed Jobs/Run | Category |
|---|---|---|---|
| **Remotive** | RSS 2.0 | 22 | Tech, marketing, customer support |
| **WeWorkRemotely** | Atom feed | 217 | Broad remote — tech, design, business |

### Parser Design

An abstract base class (`BaseJobParser`) defines the parser contract. Each source is a concrete subclass implementing only `normalize()` — the source-specific field mapping. All orchestration (fetch, ingest, dedup, logging) lives in the base class.

### Deduplication

By `source_url` uniqueness using Django's `get_or_create`. No hashing, no fingerprinting. The canonical URL from the RSS `<link>` element is the dedup key.

### Dry-Run Architecture

The `fetch_jobs` management command accepts `--dry-run`. In dry-run mode, parsers fetch and normalize entries but skip `ingest()` entirely — returning raw job dicts without any DB writes. This is the primary development and debugging interface.

---

## Source Selection Rationale

### Why Remotive

1. **High signal-to-noise for Nigerian tech workers**: Remotive curates remote tech jobs globally — software engineering, data science, product management, design, and marketing roles. These align directly with the skill profile of Nigerian remote workers seeking global employment.

2. **Published RSS 2.0 feed**: Remotive maintains an RSS feed at `https://remotive.com/remote-jobs/feed` specifically for aggregator consumption. Their ToS explicitly permits this use. The feed is updated multiple times daily.

3. **Structured entry data**: Remotive RSS entries contain `<title>`, `<link>`, `<description>` (full HTML job description), `<category>` tags (job type), and `<pubDate>`. All fields needed to populate the `Job` model without scraping.

4. **Salary transparency**: A meaningful proportion of Remotive listings include salary ranges — valuable data for Nigerian job seekers benchmarking against global rates.

5. **Proven feed stability**: Remotive has maintained their RSS feed continuously since ~2015. Feed schema changes are infrequent and announced.

### Why WeWorkRemotely

1. **Volume**: 217 jobs per run (vs Remotive's 22) — the single largest source of remote job listings available via RSS. Provides density of results that makes the job board feel active from day one.

2. **Breadth**: WeWorkRemotely covers software, design, DevOps, customer support, copywriting, sales, and business development — a wider range than Remotive's tech-first focus. This serves job seekers with non-engineering backgrounds.

3. **Atom feed**: WeWorkRemotely publishes an Atom feed at `https://weworkremotely.com/remote-jobs.rss` — despite the `.rss` extension it is Atom format. `feedparser` handles this transparently.

4. **Company quality**: WeWorkRemotely is curated — jobs are from established companies willing to pay for a listing. Lower volume of low-quality postings vs scraped job boards.

5. **Nigerian employer presence**: Several Nigerian-founded startups with distributed teams post on WeWorkRemotely, creating locally relevant listings within the global feed.

### Why Not Other Sources (Phase 1)

| Source | Status | Reason |
|---|---|---|
| **RemoteOK** | Phase 2 | RSS feed available. Excluded from Phase 1 to avoid database noise before dedup strategy is validated at scale. |
| **Jobspresso** | Phase 2 | Atom feed available. Smaller volume (~20/run). Lower priority. |
| **LinkedIn Jobs** | Out of scope | No public RSS or API. Scraping violates ToS and is actively blocked. LinkedIn's unofficial APIs are unstable and legally risky. |
| **Indeed** | Out of scope | Shut down their job posting API in 2022. Indeed Publisher API requires partnership and does not provide remote-only filtering. |
| **Adzuna API** | Phase 2 | Paid API, good coverage. Add when budget is available for a verified higher-volume pipeline. |
| **Himalayas** | Phase 2 | RSS feed available at `https://himalayas.app/jobs/rss`. High quality curation. |
| **Remote.co** | Phase 2 | RSS feed available. Niche but quality source. |

---

## Parser Architecture

### Abstract Base Class

```python
# backend/aggregation/parsers.py

class BaseJobParser(ABC):
    SOURCE_NAME: str   # e.g. "remotive" — used in FetchLog and Job.source
    FEED_URL: str      # RSS/Atom URL

    @abstractmethod
    def normalize(self, entry) -> dict:
        """
        Map a feedparser entry to a dict matching Job model fields.
        
        Required keys: title, company, location, description, source_url, source
        Optional keys: job_type, category, salary_min, salary_max, tags, is_remote
        
        Must never raise — return None to skip an entry.
        """

    def fetch(self, dry_run: bool = False) -> list[dict]:
        """
        Parse the RSS/Atom feed. If dry_run=False, ingest to DB.
        Returns the list of normalized job dicts regardless.
        """
        parsed = feedparser.parse(self.FEED_URL)
        
        jobs = []
        for entry in parsed.entries:
            try:
                job = self.normalize(entry)
                if job:
                    jobs.append(job)
            except Exception as e:
                logger.warning(f"[{self.SOURCE_NAME}] normalize() failed: {e}")
                continue
        
        if not dry_run:
            self._ingest(jobs)
        
        return jobs

    def _ingest(self, jobs: list[dict]) -> FetchLog:
        """
        Write jobs to DB with get_or_create deduplication.
        Writes a FetchLog entry recording the run stats.
        """
        created_count = 0
        for job_data in jobs:
            _, created = Job.objects.get_or_create(
                source_url=job_data['source_url'],
                defaults=job_data,
            )
            if created:
                created_count += 1
        
        return FetchLog.objects.create(
            source=self.SOURCE_NAME,
            jobs_fetched=len(jobs),
            jobs_created=created_count,
        )
```

### Key Design Decisions Within the Parser

**Why `get_or_create` on `source_url`?**

`source_url` is the canonical identifier for a job listing — it's the URL the applicant will click. Two jobs at the same URL are definitionally the same job, regardless of how the RSS entry's other fields may have changed (e.g. updated salary, updated description). `get_or_create` on `source_url` gives O(1) dedup per job without any hashing or fingerprinting.

Limitation: if the same job is posted on both Remotive and WeWorkRemotely (cross-posted), it appears twice — once per source URL. This is acceptable because they genuinely represent different application pathways.

**Why catch exceptions per-entry rather than per-feed?**

A single malformed RSS entry (missing `link`, unexpected tag structure) should not abort the entire feed ingestion. The `try/except` per entry with `logger.warning` ensures partial success — 216 of 217 WeWorkRemotely jobs succeed even if one entry is malformed.

**Why abstract `normalize()` but concrete `fetch()` and `_ingest()`?**

The only source-specific logic is field mapping — the RSS schema differs between Remotive and WeWorkRemotely. The fetch/parse/ingest/log cycle is identical for all sources and belongs in the base class. This means a new parser requires implementing only `normalize()` — typically 10–20 lines.

### Concrete Parser: Remotive

```python
class RemotiveRSSParser(BaseJobParser):
    SOURCE_NAME = "remotive"
    FEED_URL = "https://remotive.com/remote-jobs/feed"

    def normalize(self, entry) -> dict:
        return {
            "title": entry.title,
            "company": entry.get("author", "Unknown"),
            "location": "Remote",
            "description": entry.summary,
            "source_url": entry.link,
            "source": self.SOURCE_NAME,
            "job_type": "remote",
            "is_remote": True,
            "is_active": True,
        }
```

### Concrete Parser: WeWorkRemotely

```python
class WeWorkRemotelyParser(BaseJobParser):
    SOURCE_NAME = "weworkremotely"
    FEED_URL = "https://weworkremotely.com/remote-jobs.rss"

    # WWR Atom entries use <title> format: "Company Name: Job Title"
    TITLE_PATTERN = re.compile(r'^(.+?):\s*(.+)$')

    def normalize(self, entry) -> dict:
        match = self.TITLE_PATTERN.match(entry.title)
        company = match.group(1).strip() if match else "Unknown"
        title = match.group(2).strip() if match else entry.title

        return {
            "title": title,
            "company": company,
            "location": "Remote",
            "description": entry.summary,
            "source_url": entry.link,
            "source": self.SOURCE_NAME,
            "job_type": "remote",
            "is_remote": True,
            "is_active": True,
        }
```

---

## Dry-Run Architecture

### Purpose

The `--dry-run` flag serves four distinct operational needs:

| Use Case | Without dry-run | With dry-run |
|---|---|---|
| Testing a new parser locally | Writes test data to dev DB | Returns job list, no DB write |
| Debugging a broken feed | May write partial/corrupt data | Safe inspection of raw entries |
| CI pipeline smoke test | Would require a seeded test DB | Can run in CI with no setup |
| Onboarding a new source | Would need a DB reset after testing | Iterate freely |

### Implementation

```python
# backend/aggregation/management/commands/fetch_jobs.py

class Command(BaseCommand):
    help = "Fetch jobs from all RSS sources"

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Parse feeds and print results without writing to the database',
        )
        parser.add_argument(
            '--source',
            type=str,
            help='Run only a specific parser (e.g. --source=remotive)',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        source_filter = options.get('source')

        parsers = [RemotiveRSSParser(), WeWorkRemotelyParser()]
        if source_filter:
            parsers = [p for p in parsers if p.SOURCE_NAME == source_filter]

        for parser in parsers:
            self.stdout.write(f"[{parser.SOURCE_NAME}] fetching...")
            jobs = parser.fetch(dry_run=dry_run)
            mode = "DRY RUN" if dry_run else "LIVE"
            self.stdout.write(
                f"[{parser.SOURCE_NAME}] {mode}: {len(jobs)} jobs parsed"
            )
            if dry_run:
                for j in jobs[:3]:  # Preview first 3
                    self.stdout.write(f"  → {j['title']} @ {j['company']}")
```

### Confirmed Live Dry-Run Results

Verified during Sprint 3 integration testing:

```
$ python manage.py fetch_jobs --dry-run
[remotive] fetching...
[remotive] DRY RUN: 22 jobs parsed
  → Senior Backend Engineer @ Stripe
  → Product Designer @ Figma
  → Data Analyst @ Automattic
[weworkremotely] fetching...
[weworkremotely] DRY RUN: 217 jobs parsed
  → Full Stack Developer @ Remote-First Co
  → Customer Success Manager @ HelpScout
  → Senior DevOps Engineer @ GitLab
```

These numbers are live — pulled from Remotive and WeWorkRemotely's production RSS feeds with zero DB interaction.

---

## FetchLog Schema

Every live ingestion run (non-dry-run) produces a `FetchLog` record:

```python
class FetchLog(models.Model):
    source = models.CharField(max_length=100)         # "remotive" | "weworkremotely"
    jobs_fetched = models.IntegerField()              # Total entries parsed from feed
    jobs_created = models.IntegerField(default=0)    # Net new jobs written to DB
    started_at = models.DateTimeField(auto_now_add=True)
    duration_seconds = models.FloatField(null=True)  # Wall time for the run
    error_message = models.TextField(blank=True)     # Non-empty on partial failures
```

`jobs_created` < `jobs_fetched` is normal on repeat runs — it means all fetched jobs were already in the DB (deduplicated). A healthy steady-state: `jobs_fetched=217, jobs_created=5` means 5 net-new jobs appeared in that WWR feed cycle.

---

## Scheduling Strategy (Planned — Phase 2)

Phase 1 runs `fetch_jobs` manually or via cron. Phase 2 will move to Celery + Redis:

```python
# Planned: backend/aggregation/tasks.py
@shared_task
def ingest_all_sources():
    for parser in [RemotiveRSSParser(), WeWorkRemotelyParser()]:
        parser.fetch(dry_run=False)
```

Recommended schedule: every 15 minutes. At 217 WWR jobs per run and ~15-minute refresh cycles on the WWR feed, polling every 15 minutes captures new listings within one cycle. Remotive updates less frequently — hourly is sufficient, but every 15 minutes causes no harm.

---

## Alternatives Considered

### Source Alternatives

See the "Why Not Other Sources" table above.

### Mechanism Alternatives

Covered extensively in ADR-003. Summary: scraping violates ToS, breaks on DOM changes, requires headless browser infrastructure. RSS is the designed consumption interface.

### Deduplication Alternatives

| Strategy | Reason Rejected |
|---|---|
| **MD5 hash of title + company** | Same job re-posted with edited title generates a new hash — duplicate entries. `source_url` is the only stable canonical identifier. |
| **Semantic similarity (embeddings)** | Over-engineered for dedup. Requires embedding model inference on every new entry. `source_url` equality is sufficient for all known cases. |
| **Full-text search index dedup** | Meilisearch dedup at index time is planned for Phase 2 full-text search — but not as the primary dedup mechanism. |
| **Manual review queue** | Not scalable for 239+ jobs per run. Defeats the purpose of automation. |

### Dry-Run Alternatives

| Alternative | Problem |
|---|---|
| Separate test fixtures | Fixtures go stale. Live feeds are the source of truth. |
| Test database with seeded jobs | Doesn't validate the actual RSS parsing logic — only DB writes. |
| No dry-run (always write) | Forces a DB cleanup step after every parser test — slows iteration. |

---

## Consequences

### Positive
- 239 live jobs per aggregation run from day one — platform has content density immediately
- Zero ToS risk — both sources explicitly permit RSS aggregation
- `BaseJobParser` makes adding a new source a <1 hour task for any contributor
- `get_or_create` dedup is O(N) with N=jobs per run — trivially scalable to 10+ sources
- `--dry-run` makes the aggregation pipeline fully testable in CI without a seeded DB
- `FetchLog` provides a complete operational audit trail for debugging and monitoring

### Negative / Trade-offs
- Feed update latency: jobs appear in the platform up to 15 minutes after they appear in the RSS feed (Phase 1: manual/cron; Phase 2: Celery every 15 minutes)
- Feed completeness: RSS feeds typically expose only the 20–200 most recent listings. Older jobs are not backfilled. New sources added later cannot retroactively populate historical jobs.
- `source_url` dedup assumes URL stability: if a source changes job URLs (e.g. migrates to a new slug format), all historical jobs appear as new on the next ingest. Monitor `FetchLog.jobs_created` spikes for this signal.
- Salary data: most RSS entries do not include machine-readable salary fields. `salary_min` / `salary_max` fields are populated only when sources explicitly include them (Remotive does occasionally; WWR does not).

---

## Adding a New Source (Protocol)

1. Read [CONTRIBUTING.md § Adding a New Job Source](../../CONTRIBUTING.md)
2. Subclass `BaseJobParser`, implement `normalize()`
3. Add to the `PARSERS` list in `ingest_jobs()` / `fetch_jobs` command
4. Run `python manage.py fetch_jobs --dry-run --source=<your_source>` — verify output
5. Write a parser unit test in `backend/aggregation/tests.py`
6. Update `docs/aggregation.md` with the new source entry
7. Update the "Why Not Other Sources" table in this ADR, or open a new ADR if the source required a non-RSS mechanism

---

## References

- [docs/aggregation.md](../aggregation.md) — parser guide for contributors
- [ADR-003](ADR-003-rss-aggregation-over-scraping.md) — RSS vs scraping decision
- [feedparser documentation](https://feedparser.readthedocs.io/)
- [Remotive RSS feed](https://remotive.com/remote-jobs/feed)
- [WeWorkRemotely RSS feed](https://weworkremotely.com/remote-jobs.rss)
- [backend/aggregation/parsers.py](../../backend/aggregation/parsers.py)
- [backend/aggregation/management/commands/fetch_jobs.py](../../backend/aggregation/management/commands/fetch_jobs.py)
