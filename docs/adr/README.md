# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for RemoteWorkNaija. An ADR is a short document capturing a significant technical decision — what was decided, why, and what alternatives were rejected.

ADRs are immutable once accepted. If a decision is reversed, a new ADR is written superseding the old one. This creates a complete, auditable history of why the system is the way it is.

## Index

| ADR | Title | Status | Date |
|---|---|---|---|
| [ADR-001](ADR-001-django-rest-framework-for-api.md) | Use Django REST Framework for the API layer | Accepted | 2025-03-01 |
| [ADR-002](ADR-002-jwt-authentication-over-session-auth.md) | JWT authentication over Django session auth | Accepted | 2025-03-01 |
| [ADR-003](ADR-003-rss-aggregation-over-scraping.md) | RSS feed aggregation over HTML scraping | Accepted | 2025-03-10 |
| [ADR-004](ADR-004-nextjs-app-router-for-frontend.md) | Next.js App Router for the frontend | Accepted | 2025-03-01 |
| [ADR-005](ADR-005-paystack-over-stripe-for-payments.md) | Paystack over Stripe for payment processing | Accepted | 2025-03-20 |
| [ADR-006](ADR-006-cloudinary-for-media-storage.md) | Cloudinary for media/file storage | Accepted | 2025-03-20 |
| [ADR-007](ADR-007-sqlite-to-postgresql-migration-path.md) | SQLite for dev, PostgreSQL migration path for production | Accepted | 2025-03-01 |
| [ADR-008](ADR-008-aggregation-source-strategy.md) | Aggregation source strategy — Remotive, WeWorkRemotely, RSS parser design, dry-run architecture | Accepted | 2026-04-08 |

## How to Add an ADR

1. Create a new file: `ADR-NNN-short-title.md` (increment NNN)
2. Use the template below
3. Add it to the index above
4. Reference it in your PR description and the relevant `CHANGELOG.md` entry

## ADR Template

```markdown
# ADR-NNN: Title

**Date**: YYYY-MM-DD  
**Status**: Proposed | Accepted | Deprecated | Superseded by ADR-NNN  
**Deciders**: @sirsahol  

## Context

What is the situation forcing this decision?

## Decision

What did we decide?

## Rationale

Why this option over the alternatives?

## Alternatives Considered

| Option | Reason Rejected |
|---|---|
| Alternative A | ... |
| Alternative B | ... |

## Consequences

### Positive
- ...

### Negative / Trade-offs
- ...

## References
- Link to docs, issues, or external resources
```
