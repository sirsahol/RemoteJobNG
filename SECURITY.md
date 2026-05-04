# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 1.x (current) | ![Active](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square) Active security support |
| 0.x (original fork) | ![Deprecated](https://img.shields.io/badge/Status-Deprecated-red?style=flat-square) Not supported — please upgrade |

---

## Reporting a Vulnerability

**Do NOT open a public GitHub issue for security vulnerabilities.**

Security issues disclosed publicly before a fix is available put all users at risk. Please use the responsible disclosure process below.

### How to Report

Email **cooperhumbertoykdd@gmail.com** with the subject line:

```
[SECURITY] RemoteWorkNaija — <brief description>
```

Include as much of the following as possible:

- **Type of vulnerability** — e.g. SQL injection, XSS, authentication bypass, IDOR, SSRF, RCE
- **Affected component** — backend app name, frontend page, API endpoint, Docker config
- **Steps to reproduce** — minimal working proof of concept
- **Impact assessment** — what data or functionality is at risk
- **Suggested fix** — if you have one
- **Your contact info** — for follow-up questions

### What to Expect

| Timeline | Action |
|---|---|
| Within 48 hours | Acknowledgement of your report |
| Within 7 days | Initial assessment and severity classification |
| Within 30 days | Fix shipped for critical/high severity issues |
| Within 90 days | Fix shipped for medium/low severity issues |
| After fix is live | Public disclosure with credit to reporter (if desired) |

We will not take legal action against researchers who follow this responsible disclosure process.

---

## Scope

### In Scope

- Authentication and authorisation flaws (JWT bypass, privilege escalation, IDOR)
- Injection vulnerabilities (SQL, command, template injection)
- Server-side request forgery (SSRF)
- Data exposure (PII leaks, API responses containing sensitive fields)
- Business logic flaws (accessing other users' data, bypassing payment, manipulating job status)
- Cross-site scripting (XSS) in the Next.js frontend
- Insecure direct object references on any API endpoint
- Django `SECRET_KEY` exposure vectors
- Paystack webhook signature bypass
- Docker configuration issues exposing internal services

### Out of Scope

- Denial of service attacks (rate limiting is a planned feature — see roadmap)
- Attacks requiring physical access to infrastructure
- Social engineering of maintainers
- Issues in third-party services (Remotive, WeWorkRemotely, Paystack) themselves
- Self-XSS requiring the attacker to be logged in as the victim
- Theoretical vulnerabilities with no demonstrated impact
- Issues in `DEBUG=True` mode only (not a production configuration)

---

## Security Architecture Notes

For context when evaluating the attack surface:

- **Authentication**: JWT via `djangorestframework-simplejwt`. Access tokens (60 min), refresh tokens (7 days). Refresh tokens are rotated on use.
- **Permissions**: Default `IsAuthenticated` on all write endpoints. Explicit `AllowAny` on public read endpoints only.
- **Secrets**: All secrets via environment variables. No secrets committed to the repo.
- **Paystack webhooks**: Signature verified using HMAC-SHA512 with `PAYSTACK_SECRET_KEY`.
- **File uploads**: Routed through Cloudinary — not stored on Django server.
- **CORS**: Restricted to `FRONTEND_URL` environment variable (localhost in dev, domain in prod).
- **SQL**: Django ORM used throughout — no raw SQL queries. Parameterised queries only.
- **Aggregation**: RSS parsers use `feedparser` — external URLs are fetched server-side only. No user-controlled URLs fetched.

---

## Known Limitations (Current Version)

The following are known limitations that are tracked as planned improvements, not active vulnerabilities:

- **Rate limiting**: Not yet implemented on API endpoints. Targeted for Phase 2.
- **Email verification**: User registration does not require email verification. Planned for Phase 2.
- **CSRF**: DRF's `SessionAuthentication` CSRF enforcement is not active (JWT only). This is intentional for the stateless API architecture but should be reviewed if session auth is ever re-enabled.
- **SQLite in development**: Default dev setup uses SQLite. Production deployments must use PostgreSQL (see `docs/deployment.md`).

---

## Hall of Fame

Security researchers who have responsibly disclosed vulnerabilities will be credited here (with their permission).

*No vulnerabilities reported yet.*

---

## Contact

- **Security email**: cooperhumbertoykdd@gmail.com
- **General issues**: [GitHub Issues](https://github.com/sirsahol/RemoteJobNG/issues)
- **Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)
