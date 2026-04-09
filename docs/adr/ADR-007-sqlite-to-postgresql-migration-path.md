# ADR-007: SQLite for Development, PostgreSQL Migration Path for Production

**Date**: 2025-03-01  
**Status**: Accepted  
**Deciders**: @sirsahol  

---

## Context

The original RemoteJobNG fork used SQLite with the database file (`db.sqlite3`) committed to the repository — a critical security and scalability issue. The rebuild needs a database strategy that:
- Works for local development with zero infrastructure
- Supports production scale (thousands of jobs, concurrent users)
- Doesn't expose data in the Git repository
- Allows the CI pipeline to run tests without a production database

---

## Decision

- **Development**: SQLite via Django's default `DATABASES` config — zero setup, works out of the box
- **CI**: SQLite (same as dev) — GitHub Actions CI runs Django tests against SQLite
- **Production**: PostgreSQL 15 — configured via `DATABASE_URL` environment variable
- **Transition**: `db.sqlite3` added to `.gitignore` immediately; PostgreSQL migration documented in `docs/deployment.md`

Database configuration in `settings.py`:

```python
import dj_database_url

DATABASES = {
    'default': dj_database_url.config(
        default='sqlite:///db.sqlite3',
        conn_max_age=600,
    )
}
```

Setting `DATABASE_URL=postgres://user:pass@host:5432/dbname` in production automatically switches to PostgreSQL. No code change required.

---

## Rationale

### Why SQLite for Dev/CI

1. **Zero infrastructure**: No Docker container, no service, no credentials needed to run `python manage.py migrate` and `python manage.py test`. New contributors clone and run immediately.

2. **CI simplicity**: GitHub Actions CI doesn't need a PostgreSQL service container for running tests — SQLite works in the runner's filesystem. Reduces CI YAML complexity and removes a potential point of failure. (Note: the CI yml does include a PostgreSQL service — this is available for future integration tests, but unit tests use SQLite by default.)

3. **Django ORM compatibility**: All 21 migrations and all 35 tests are written using Django ORM — no raw SQL. The ORM generates correct SQL for both SQLite and PostgreSQL. Tests that pass on SQLite will pass on PostgreSQL for all ORM operations.

4. **Speed**: SQLite tests run ~3–5x faster than PostgreSQL tests (no network round-trips, in-memory option available). Developer feedback loop is faster.

### Why PostgreSQL for Production

1. **Concurrent writes**: SQLite uses table-level locking — concurrent job ingestion (aggregation pipeline) + user writes would deadlock. PostgreSQL uses row-level locking and MVCC — essential for production traffic.

2. **Full-text search**: Phase 2 plans include Meilisearch for search, but PostgreSQL's `pg_trgm` extension provides a usable fallback full-text search with `SearchVector` — not available in SQLite.

3. **JSON field support**: `JSONField` works in both Django's SQLite and PostgreSQL backends from Django 3.1+, but PostgreSQL's native `jsonb` type enables indexing and query operators (`@>`, `?`) that SQLite's JSON emulation does not.

4. **Production reliability**: PostgreSQL's WAL (Write-Ahead Logging), PITR (Point-in-Time Recovery), and replication are essential for a production database. SQLite has no network replication support.

5. **Heroku/Railway/Render compatibility**: All major PaaS providers provision PostgreSQL — `DATABASE_URL` is the universal connection string format.

### Why `dj_database_url`

`dj_database_url.config(default='sqlite:///db.sqlite3')` is the idiomatic approach:
- Single environment variable controls the entire database config
- Works with Heroku, Railway, Render, Docker Compose, and Kubernetes without code changes
- Falls back to SQLite when `DATABASE_URL` is not set (development)
- `conn_max_age=600` enables persistent connection pooling in production

---

## Alternatives Considered

| Option | Reason Rejected |
|---|---|
| **PostgreSQL for all environments** | Requires Docker or a local PostgreSQL installation for every developer. Adds 5–10 minutes to contributor onboarding. CI becomes more complex. The performance and feature differences are not needed for development or unit testing. |
| **MySQL/MariaDB** | Django supports MySQL but the ecosystem is smaller. PostgreSQL's feature set (JSONB, full-text search, extensions) is superior. Most Django production deployments use PostgreSQL. |
| **PlanetScale (MySQL-compatible)** | Serverless database with no schema migrations in the traditional sense — conflicts with Django's migration system. Not appropriate for a Django-native project. |
| **Supabase (PostgreSQL-compatible)** | Excellent managed PostgreSQL. Can be used as the production PostgreSQL provider. Not a different database choice — same decision. Supabase is a valid option for the Phase 2 PostgreSQL migration. |
| **MongoDB** | Django ORM is relational — using MongoDB with `djongo` or `MongoEngine` loses most of Django's ORM benefits (migrations, admin, forms). The data model is fundamentally relational (jobs have categories, applications have jobs, etc.). |

---

## Migration Path to Production PostgreSQL

When the platform is ready for production deployment:

1. Provision a PostgreSQL 15 database (Supabase, Railway, or a VPS with `docker compose`)
2. Set `DATABASE_URL=postgres://user:pass@host:5432/remoteworknaija` in production environment
3. Run `python manage.py migrate` — all 21 migrations apply identically to PostgreSQL
4. Run `python manage.py seed_categories && python manage.py seed_plans` — seed data is re-created
5. If migrating existing SQLite data: use `python manage.py dumpdata > backup.json` then `loaddata backup.json` on the PostgreSQL instance

See [docs/deployment.md](../deployment.md) for the full production checklist.

---

## Consequences

### Positive
- Zero-friction local development — clone and run
- `DATABASE_URL` environment variable is the only change needed to switch from dev to production database
- All 35 tests run in SQLite — fast CI without PostgreSQL service complexity
- Committed `db.sqlite3` removal eliminates security risk from the original fork
- Django ORM ensures all migrations are database-agnostic

### Negative / Trade-offs
- SQLite-to-PostgreSQL differences can mask bugs in edge cases (e.g. case sensitivity in string comparisons differs between SQLite and PostgreSQL). Tests should be run against PostgreSQL as part of the pre-production deployment checklist.
- `conn_max_age=600` persistent connections require a connection pooler (PgBouncer) at very high concurrency. Not relevant for Phase 1 scale.
- Data migration from existing SQLite to PostgreSQL is a manual step — `dumpdata/loaddata` works but requires a maintenance window.

---

## References
- [dj-database-url](https://github.com/jazzband/dj-database-url)
- [Django database backends](https://docs.djangoproject.com/en/5.2/ref/databases/)
- [PostgreSQL vs SQLite differences relevant to Django](https://docs.djangoproject.com/en/5.2/ref/databases/#sqlite-notes)
- [docs/deployment.md](../deployment.md)
