# RemoteWorkNaija — Frontend

Next.js 16 + React 19 frontend for [RemoteWorkNaija.com](https://remoteworknaija.com).

## Tech Stack

- **Next.js 16** — App Router, SSR/SSG, Edge Middleware
- **React 19** — UI framework
- **Tailwind CSS v4** — utility-first styling
- **axios 1.11** — HTTP client with JWT interceptors

## Quick Start

```bash
npm install
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Backend must be running at `NEXT_PUBLIC_API_URL`. See the [root README](../README.md) for backend setup.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Backend URL e.g. `http://127.0.0.1:8000` |
| `NEXT_PUBLIC_SITE_URL` | No | Frontend domain for SEO |
| `NEXT_PUBLIC_SITE_NAME` | No | Site display name |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | No | Paystack public key |

## Pages

| Route | Description |
|---|---|
| `/jobs` | Browse all jobs with search + filters |
| `/jobs/[id]` | Job detail + Save/Apply buttons |
| `/jobs/[id]/apply` | Application form (auth required) |
| `/login` | JWT login |
| `/signup` | New account registration |
| `/dashboard/seeker` | Saved jobs, applications, alerts (auth) |
| `/dashboard/employer` | Manage posted jobs (auth) |
| `/post_job` | Post a new job (auth) |
| `/notifications` | In-app notifications + alert settings (auth) |
| `/pricing` | Paystack plan selection |
| `/payment/verify` | Paystack callback handler |
| `/profile/[username]` | Public user profile |
| `/profile/edit` | Edit own profile (auth) |
| `/about` | About RemoteWorkNaija |

## Key Files

| File | Purpose |
|---|---|
| `context/AuthContext.js` | Auth state: user, tokens, isEmployer, isSeeker, login, logout, refresh |
| `utils/axiosInstance.js` | Preconfigured axios: auto-attaches JWT, auto-refreshes on 401 |
| `middleware.js` | Edge route protection: redirects unauthenticated users to /login |
| `app/layout.js` | Root layout: wraps app with AuthProvider, mounts Navbar |
| `app/components/Navbar/Navbar.jsx` | Nav with notification bell, role-based dashboard link |

## Making API Calls

Always use `axiosInstance` — never use `fetch` or raw `axios`:

```javascript
import api from "@/utils/axiosInstance";

// GET jobs
const { data } = await api.get("/jobs/", { params: { job_type: "full_time" } });

// POST application
const { data } = await api.post("/applications/", formData, {
  headers: { "Content-Type": "multipart/form-data" }
});

// PATCH profile
await api.patch("/users/me/", { headline: "Senior Developer" });
```

The instance automatically attaches your JWT and handles token refresh on 401 responses.

## Auth in Components

```javascript
"use client";
import { useAuth } from "@/context/AuthContext";

export default function MyPage() {
  const { user, isAuthenticated, isEmployer, loading, logout } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return null; // middleware handles redirect

  return <div>Hello {user.username}</div>;
}
```

## Scripts

```bash
npm run dev      # development server (http://localhost:3000)
npm run build    # production build
npm start        # serve production build
npm run lint     # ESLint
```
