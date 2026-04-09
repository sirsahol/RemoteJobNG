# ADR-001: Use Django REST Framework for the API Layer

**Date**: 2025-03-01  
**Status**: Accepted  
**Deciders**: @sirsahol  

---

## Context

RemoteWorkNaija needs a backend API that:
- Serves structured JSON to the Next.js frontend
- Handles complex filtering, pagination, and search across job listings
- Provides authentication token management
- Generates API documentation automatically
- Supports file uploads (resumes, avatars)
- Can be extended with custom serializers and permissions cleanly

The original RemoteJobNG fork had no API layer at all — it was a server-rendered Django project with HTML templates. The rebuild required choosing an API architecture from scratch.

---

## Decision

Use **Django REST Framework (DRF)** as the API layer, registered via `DefaultRouter` with `ModelViewSet` / `ReadOnlyModelViewSet` as the primary view pattern. Supplement with `drf-spectacular` for OpenAPI documentation and `django-filter` for query parameter filtering.

---

## Rationale

DRF is the de-facto standard for Django APIs with the largest ecosystem, most Stack Overflow answers, and best-maintained third-party packages. The specific reasons for this project:

1. **`ModelViewSet` + `DefaultRouter`** gives CRUD endpoints on every model in ~10 lines of code. For a 7-app Django project this is a significant velocity advantage.
2. **`django-filter` integration** is native — `filterset_class = JobFilter` on a ViewSet adds 14-field filtering with zero additional code.
3. **`drf-spectacular`** generates OpenAPI 3 schema + Swagger UI automatically from ViewSets and serializers, giving us `/api/docs/` with no manual maintenance.
4. **`djangorestframework-simplejwt`** is the canonical DRF JWT solution — actively maintained, widely deployed, documented for exactly this use case.
5. **Serializer pattern** (separate list/detail/write serializers) gives full control over field exposure without leaking sensitive data.
6. **Permission classes** (`IsAuthenticated`, `AllowAny`, custom `IsEmployerOrAdmin`) integrate directly into ViewSet `permission_classes`.

---

## Alternatives Considered

| Option | Reason Rejected |
|---|---|
| **FastAPI** | No existing Django models to migrate. Would require rewriting all models, signals, and admin in a new framework. The team's existing Django knowledge is a significant asset. FastAPI's async advantages are not needed at current scale. |
| **Django + custom views** (no DRF) | Requires manually writing JSON serialization, pagination, content negotiation, and auth headers for every endpoint. DRF solves all of these generically. |
| **GraphQL (Strawberry/Graphene)** | Next.js frontend doesn't require GraphQL's relationship traversal benefits. Over-engineered for a job board with well-defined REST resources. N+1 query risk without careful optimization. |
| **Django Ninja** | Smaller ecosystem, fewer third-party packages (especially for JWT, filtering, and OpenAPI). DRF's `drf-spectacular` is more mature than Ninja's built-in schema generation. |

---

## Consequences

### Positive
- ~10 lines per app to expose full CRUD API with filtering, pagination, and auth
- OpenAPI 3 schema at `/api/schema/` and Swagger UI at `/api/docs/` — zero maintenance
- Uniform endpoint convention (`/api/<app>/`) across all 7 apps
- `browsable_api` renderer useful during development for manual testing without Postman
- Large community means any DRF problem has existing StackOverflow/GitHub answers

### Negative / Trade-offs
- DRF adds ~1.5ms overhead per request compared to raw Django views (acceptable at current scale)
- `ModelViewSet` can expose too much if permission classes are misconfigured — requires deliberate permission setup per ViewSet (addressed in Sprint 1 security hardening)
- Separate list/detail/write serializers for the same model means more boilerplate when models have many fields

---

## References
- [Django REST Framework docs](https://www.django-rest-framework.org/)
- [drf-spectacular](https://drf-spectacular.readthedocs.io/)
- [django-filter DRF integration](https://django-filter.readthedocs.io/en/stable/guide/rest_framework.html)
