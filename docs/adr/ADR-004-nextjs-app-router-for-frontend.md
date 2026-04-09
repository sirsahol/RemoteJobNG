# ADR-004: Next.js App Router for the Frontend

**Date**: 2025-03-01  
**Status**: Accepted  
**Deciders**: @sirsahol  

---

## Context

The original RemoteJobNG had no frontend — only Django HTML templates. The rebuild needed a modern, performant frontend framework that could:
- Render public pages (job listings, home) with good SEO
- Handle authenticated dashboard pages with client-side interactivity
- Support SSR route protection (redirect unauthenticated users before page renders)
- Integrate cleanly with a separate Django REST API backend
- Scale to a production job platform without re-architecting

The chosen frontend framework will set the development experience for all frontend contributors and is difficult to change later.

---

## Decision

Use **Next.js 16** with the **App Router** (introduced in Next.js 13, stable from 14+) and **React 19**. Frontend lives in `my-app/` as a separate deployable unit from the Django backend.

Key technology decisions bundled with this:
- **Tailwind CSS v4** for styling
- **axiosInstance** (`utils/axiosInstance.js`) for all authenticated API calls
- **Next.js middleware** (`middleware.js`) for edge-level SSR route protection
- **`'use client'`** directive on interactive components only — server components by default

---

## Rationale

### Why Next.js

1. **SSR + CSR hybrid**: Job listing pages (`/jobs`, `/jobs/[id]`) benefit from SSR for SEO — Googlebot sees the full job content without executing JavaScript. Dashboard pages (`/dashboard/*`) benefit from CSR interactivity. Next.js handles both in the same framework.

2. **App Router server components**: Server components fetch data on the server, reducing client-side JavaScript bundle size. For a job board where most pages are read-heavy, this is a performance win — HTML is delivered pre-rendered.

3. **Dynamic routes**: `app/jobs/[id]/page.js` and `app/profile/[username]/page.js` map directly to the URL structure without configuration. The App Router's file-system routing is explicit and scales to many pages cleanly.

4. **Edge middleware**: `middleware.js` runs at the CDN edge (Vercel/Cloudflare) before the page renders — unauthenticated users are redirected to `/login` without loading the page. This is not possible with pure client-side route guards.

5. **`next/image`**: Automatic image optimization (WebP conversion, lazy loading, size hints) for job company logos, user avatars — important for mobile users on lower-bandwidth Nigerian connections.

6. **Vercel deployment**: Next.js on Vercel is zero-config for production — CI/CD, edge functions, and SSR all work out of the box.

### Why App Router (not Pages Router)

- App Router is the future of Next.js — Pages Router is in maintenance mode
- React Server Components (RSC) are only available in the App Router
- Nested layouts (shared Navbar without re-rendering) are cleaner in App Router
- `loading.js`, `error.js`, `not-found.js` conventions reduce boilerplate

---

## Alternatives Considered

| Option | Reason Rejected |
|---|---|
| **Create React App (CRA)** | No SSR, no file-system routing, deprecated by the React team. Pure CSR — poor SEO for job listings that need to be indexed by search engines. |
| **Vite + React (SPA)** | No SSR, no SSR route protection, no `next/image` optimization. Good for dashboard-only apps, not appropriate for a public job board needing SEO. |
| **Nuxt.js / Vue.js** | Django + Vue has smaller community than Django + React. Team familiarity with React ecosystem is an advantage. |
| **Django templates (no separate frontend)** | Returns to the original fork's architecture. Doesn't scale — AJAX for job filters, real-time notifications, and dynamic dashboards require significant JavaScript glue code inside Django templates. A clean SPA separation is more maintainable. |
| **Remix** | Excellent SSR framework but smaller ecosystem than Next.js. Fewer Next.js-specific packages (e.g. `next-auth`, `next/image`) available. Vercel's Next.js optimizations don't apply. |
| **Next.js Pages Router** | Deprecated path — App Router is the recommended approach for new projects since Next.js 14. Migrating from Pages to App Router later is a significant effort. |

---

## Consequences

### Positive
- SEO-ready: job listing pages render server-side, fully indexable by search engines
- Edge-level auth protection: `middleware.js` redirects are instant — no flash of unauthenticated content
- 19 pages implemented cleanly via file-system routing with no configuration
- `'use client'` boundary is explicit — contributors know which components are server-rendered vs interactive
- Tailwind CSS v4's JIT compiler eliminates unused CSS — production bundle is minimal
- Shared `AuthContext` and `axiosInstance` give a consistent auth pattern across all 19 pages

### Negative / Trade-offs
- **App Router learning curve**: The distinction between server components (default) and client components (`'use client'`) is non-obvious. `useEffect`, `useState`, `useContext` only work in client components. This has caused bugs (e.g. `AuthContext` accessed in server component without `'use client'`).
- **`axiosInstance` SSR guard**: Axios uses `localStorage` which is browser-only. The `typeof window !== 'undefined'` guard in `axiosInstance.js` must be maintained whenever the instance is modified.
- **Separate deployment**: Frontend and backend are separate deployables — requires CORS configuration and environment variable management in two places. Documented in `docs/deployment.md`.
- **Hydration mismatches**: If server-rendered HTML doesn't match client-rendered HTML (e.g. auth state), React logs hydration errors. Careful use of `loading` states and `useEffect` mitigates this.

---

## Page Inventory

All 19 pages implemented:

| Route | Type | Auth Required |
|---|---|---|
| `/` | Server Component | No |
| `/jobs` | Client Component | No |
| `/jobs/[id]` | Client Component | No |
| `/jobs/[id]/apply` | Client Component | Yes (seeker) |
| `/login` | Client Component | No |
| `/signup` | Client Component | No |
| `/dashboard/seeker` | Client Component | Yes (seeker) |
| `/dashboard/employer` | Client Component | Yes (employer) |
| `/post_job` | Client Component | Yes (employer) |
| `/notifications` | Client Component | Yes |
| `/pricing` | Client Component | No |
| `/payment/verify` | Client Component | Yes |
| `/about` | Server Component | No |
| `/profile/[username]` | Client Component | No |
| `/profile/edit` | Client Component | Yes |

---

## References
- [Next.js App Router documentation](https://nextjs.org/docs/app)
- [React Server Components RFC](https://github.com/reactjs/rfcs/pull/188)
- [Tailwind CSS v4 docs](https://tailwindcss.com/docs)
- [Next.js middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
