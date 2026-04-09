# ADR-003: RSS Feed Aggregation Over HTML Scraping

**Date**: 2025-03-10  
**Status**: Accepted  
**Deciders**: @sirsahol  

---

## Context

RemoteWorkNaija's core value proposition is aggregating global remote jobs from multiple sources and presenting them to Nigerian professionals. The platform needs a reliable, maintainable, and legal mechanism to pull job listings from external sites like Remotive, WeWorkRemotely, RemoteOK, and others.

Two primary approaches were considered: parsing the site's published RSS/Atom feeds, or writing HTML scrapers that parse the site's rendered DOM.

---

## Decision

Use **RSS/Atom feed parsing** as the primary aggregation mechanism, implemented via `feedparser`. Each source gets a dedicated `BaseJobParser` subclass that wraps a feed URL and normalises entries to the standard `Job` model schema.

Scraping is only considered for sources that publish no feed and have high-value inventory (planned review per source in Phase 2).

---

## Rationale

### Why RSS over Scraping

1. **Terms of Service compliance**: RSS feeds are published specifically for consumption. Scraping violates the ToS of most job platforms (Remotive's ToS explicitly permits RSS usage; scraping is prohibited). Legal risk of scraping is real — platforms issue C&D letters.

2. **Reliability**: RSS feeds are structured data that site owners maintain. DOM structure changes break scrapers regularly — feeds break only when the site owner deprecates the feed (rare, usually announced).

3. **No JavaScript rendering**: Many job sites are fully JS-rendered (React/Vue SPAs). Scraping requires Playwright/Puppeteer with a headless browser — significantly higher infrastructure cost and complexity. RSS feeds are plain XML — zero JS execution needed.

4. **Bandwidth efficiency**: RSS feeds are typically paginated XML responses of 20–200 jobs. Scraping requires loading full HTML pages with all assets. RSS is 10–50x more bandwidth-efficient.

5. **Deduplication simplicity**: RSS entries have canonical `<link>` elements (the job URL). Deduplication by `source_url` is reliable. Scraping produces URLs that vary with query parameters, making deduplication harder.

6. **`feedparser` maturity**: The `feedparser` Python library handles RSS 0.9x, RSS 1.0, RSS 2.0, Atom 0.3, and Atom 1.0 — normalising all to a consistent entry object. Used in production at planet.python.org and thousands of feed readers.

### Confirmed Live Results

RSS parsing confirmed working in dry-run:
- Remotive: **22 jobs per run** (RSS 2.0)
- WeWorkRemotely: **217 jobs per run** (Atom feed)

---

## Alternatives Considered

| Option | Reason Rejected |
|---|---|
| **HTML scraping (BeautifulSoup)** | ToS violations, brittle DOM selectors break on any site redesign, no JS execution, high maintenance burden |
| **HTML scraping (Playwright)** | Full headless browser per source — high infrastructure cost ($$$), slow, overkill when RSS is available |
| **Official APIs** | Remotive has no public API. WeWorkRemotely has no API. Most job boards don't expose APIs without paid partnerships. RSS is the available interface. |
| **Third-party aggregation APIs (Adzuna, Indeed Pub API)** | Paid services with usage limits. Adds external dependency and cost. RSS is free and direct. Adzuna/Indeed can be added as an additional paid tier in Phase 2. |
| **Job board partnerships / data licensing** | Requires business relationships, NDAs, and ongoing maintenance. Not feasible for Phase 1. |

---

## Architecture

The parser system uses an abstract base class pattern:

```python
class BaseJobParser(ABC):
    SOURCE_NAME: str          # e.g. "remotive"
    FEED_URL: str             # RSS/Atom URL

    @abstractmethod
    def normalize(self, entry) -> dict:
        """Map a feedparser entry to a Job model dict."""
        pass

    def fetch(self, dry_run=False) -> list[dict]:
        """Parse feed, normalize entries, optionally ingest to DB."""
        parsed = feedparser.parse(self.FEED_URL)
        jobs = [self.normalize(e) for e in parsed.entries]
        if not dry_run:
            self.ingest(jobs)
        return jobs

    def ingest(self, jobs: list[dict]) -> FetchLog:
        """Write jobs to DB with get_or_create deduplication."""
        created = 0
        for job_data in jobs:
            _, is_new = Job.objects.get_or_create(
                source_url=job_data['source_url'],
                defaults=job_data
            )
            if is_new:
                created += 1
        return FetchLog.objects.create(
            source=self.SOURCE_NAME,
            jobs_fetched=len(jobs),
            jobs_created=created,
        )
```

Adding a new source requires only:
1. Subclass `BaseJobParser`, set `SOURCE_NAME` and `FEED_URL`, implement `normalize()`
2. Register in `ingest_jobs()`
3. Write one parser test

See [docs/aggregation.md](../aggregation.md) for the full parser guide.

---

## Consequences

### Positive
- Zero ToS violations — RSS is the intended consumption mechanism
- No headless browser infrastructure needed
- Feeds are stable — rarely break without notice
- `--dry-run` mode enables safe testing before any DB writes
- `FetchLog` model gives a complete audit trail of every ingestion run
- New sources can be added in <1 hour (subclass + test)
- `get_or_create` on `source_url` makes deduplication automatic — no complex fingerprinting

### Negative / Trade-offs
- Dependent on sources maintaining their RSS feeds (Remotive and WWR have maintained feeds for 5+ years — low risk)
- Feed update frequency is source-controlled — can't push-subscribe, must poll. Polling every 15 minutes via Celery (Phase 2) is sufficient for a jobs platform where listings don't expire in <15 minutes.
- Feed data quality varies by source — some fields (salary, location detail, company size) may be missing or inconsistently formatted. `normalize()` handles defaults but data completeness is source-limited.
- Only sources with RSS feeds are coverable without scraping. Sources without feeds (e.g. some niche boards) require alternative approaches in Phase 2.

---

## References
- [feedparser documentation](https://feedparser.readthedocs.io/)
- [Remotive RSS feed](https://remotive.com/remote-jobs/feed)
- [WeWorkRemotely RSS feed](https://weworkremotely.com/remote-jobs.rss)
- [docs/aggregation.md](../aggregation.md)
