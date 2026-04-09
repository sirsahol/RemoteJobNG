# ADR-002: JWT Authentication Over Django Session Auth

**Date**: 2025-03-01  
**Status**: Accepted  
**Deciders**: @sirsahol  

---

## Context

The platform has two separately deployed processes: a Django API backend and a Next.js frontend. They run on different origins in production (`api.remoteworknaija.com` and `remoteworknaija.com`). Authentication state must work across both.

The original fork used Django's built-in session authentication, which is tied to a server-side session store (database) and requires cookies to be sent cross-origin — which has significant CORS complexity and doesn't work cleanly with Next.js App Router server components and edge middleware.

---

## Decision

Use **JSON Web Tokens (JWT)** via `djangorestframework-simplejwt` for all API authentication.

- **Access token**: Short-lived (60 minutes), stored in `localStorage` on the client
- **Refresh token**: Long-lived (7 days), used to obtain new access tokens when expired
- **Token delivery**: `/api/auth/token/` (obtain pair), `/api/auth/token/refresh/` (refresh)
- **Client storage**: `localStorage` for access token (JavaScript-readable), cookie for SSR middleware access
- **Interceptor**: `axiosInstance` intercepts 401 responses and auto-refreshes the access token transparently

---

## Rationale

1. **Stateless**: No server-side session store required. The Django backend doesn't need a database lookup on every authenticated request — the JWT is self-validating.
2. **Cross-origin native**: JWTs are passed in the `Authorization: Bearer <token>` header, which works naturally with CORS. No cross-origin cookie complexity.
3. **Next.js SSR compatibility**: The access token is stored in a cookie alongside `localStorage`, making it available to Next.js edge middleware for SSR-time route protection without an API round-trip.
4. **Auto-refresh UX**: The `axiosInstance` 401 interceptor refreshes tokens transparently — users never see an unexpected logged-out state mid-session.
5. **Mobile-ready**: If a React Native mobile app is added later, JWT works identically — no session cookie management needed.
6. **`djangorestframework-simplejwt` maturity**: Actively maintained, configurable lifetimes, token rotation, token blacklisting (planned for Phase 2).

---

## Alternatives Considered

| Option | Reason Rejected |
|---|---|
| **Django session auth** | Requires cross-origin cookie management (`SESSION_COOKIE_SAMESITE=None`, `SESSION_COOKIE_SECURE=True`). Complex CSRF setup. Session store is a DB bottleneck. Doesn't work with Next.js edge middleware. |
| **Django REST Knox** | Token-per-device model is good, but adds server-side token storage (DB lookup on every request). Less ecosystem support than simplejwt. No built-in refresh token mechanism. |
| **OAuth2 / social auth only** | Requires a third-party identity provider (Google, LinkedIn). Many Nigerian users may not have or want to use social accounts for a jobs platform. Not a replacement for email/password auth. |
| **Djoser + simplejwt** | Djoser adds useful endpoints (password reset, email verification) but is heavier than needed for Phase 1. Can be added in Phase 2 when email verification is implemented. |

---

## Consequences

### Positive
- No server-side session state — backend is horizontally scalable from day one
- Smooth UX: 401 auto-refresh means users stay logged in across tab refreshes
- SSR route protection works via cookie read in `middleware.js` at the CDN edge
- Token rotation on refresh (simplejwt default) — refresh token reuse detection for security
- Clear separation: frontend owns token lifecycle, backend validates on every request

### Negative / Trade-offs
- **Token revocation**: JWTs can't be invalidated before expiry without a blocklist. If a user is compromised, the 60-minute access token window exists. Mitigated by short lifetime. Token blacklisting can be added in Phase 2 via simplejwt's blacklist app.
- **`localStorage` XSS risk**: Access tokens in `localStorage` are readable by JavaScript — XSS vulnerability could expose tokens. Mitigated by strict Content-Security-Policy headers (added in `next.config.mjs`) and no dynamic `innerHTML` in the frontend.
- **Token size**: JWTs are larger than session cookies (~200 bytes per request header vs ~32 bytes for a session ID). Negligible at current scale.
- **SSR cookie duplication**: Maintaining two storages (localStorage + cookie) adds complexity in AuthContext. Documented in `docs/authentication.md`.

---

## Implementation Notes

Token lifetimes are configured via environment variables:
```
JWT_ACCESS_TOKEN_LIFETIME_MINUTES=60
JWT_REFRESH_TOKEN_LIFETIME_DAYS=7
```

Auth context dual-storage pattern:
```js
// On login: store in both localStorage (API calls) and cookie (SSR middleware)
localStorage.setItem('access_token', access);
document.cookie = `access_token=${access}; path=/; max-age=3600`;
```

---

## References
- [djangorestframework-simplejwt docs](https://django-rest-framework-simplejwt.readthedocs.io/)
- [Next.js middleware docs](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [docs/authentication.md](../authentication.md)
