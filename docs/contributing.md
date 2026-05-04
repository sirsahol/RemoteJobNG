# Contributing

---

## Development Setup

See the [Deployment guide](deployment.md) for full local setup instructions. The short version:

```bash
git clone https://github.com/sirsahol/RemoteJobNG
cd RemoteJobNG
docker compose up --build
```

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code. All PRs merge here. |
| `sprint-N` | Sprint feature branches, opened as PRs against main |
| `fix/description` | Bug fixes e.g. `fix/savedjob-model` |
| `feat/description` | New features e.g. `feat/remoteok-parser` |

**Never commit directly to `main`.** Always open a PR.

---

## Commit Convention

Follow conventional commits:

```
feat(scope): short description
fix(scope): short description
refactor(scope): short description
docs(scope): short description
chore(scope): short description
```

Examples:
```
feat(aggregation): add RemoteOK RSS parser
fix(jobs): restore SavedJob model and missing fields
docs(api): add payment endpoints to reference
refactor(users): extract profile serializer
chore(deps): bump django to 5.2.1
```

---

## Backend Conventions

### Django Apps
- Each app owns its models, serializers, views, admin, migrations, tests
- No cross-app imports except through FK relationships
- Use `related_name` on all ForeignKey and M2M fields

### ViewSets
- Use DRF ViewSets and routers — no function-based views
- Use `@action` decorator for custom endpoints within a ViewSet
- Permission: override `get_permissions()` for per-action control

### Serializers
- Separate list serializer (compact) and detail serializer (full) where appropriate
- Use `SerializerMethodField` for computed values

### Migrations
- Always run `python manage.py makemigrations <app>` after model changes
- Never edit generated migration files manually
- Name migrations descriptively if auto-name is confusing

### Settings
- Never hardcode any value that differs between environments
- Use `python-decouple` `config()` for all env vars
- Document all new env vars in `.env.example`

---

## Frontend Conventions

### Hook-Driven Architecture
- **Mandatory**: All business logic, data fetching, and state management must be extracted into **custom hooks** in `my-app/hooks/`.
- UI components should be "thin" and only responsible for layout and rendering.
- Hooks should return `{ data, loading, error, ...actions }` for consistency.

### API Calls
- **Always** use `axiosInstance` from `utils/axiosInstance.js`.
- Set `withCredentials: true` (default in `axiosInstance`) to allow cookie transmission.
- Handle loading and error states within the custom hook.

### Authentication
- Use `useAuth()` from `context/AuthContext.jsx` for all auth state.
- Authentication is handled via **HttpOnly Cookies**. Access tokens and refresh tokens are managed by the browser.
- Do NOT store tokens in `localStorage` or `sessionStorage`.
- Check `loading` before acting on `isAuthenticated` (prevents hydration flashes).
  ```javascript
  useEffect(() => {
    if (!loading && !isAuthenticated) router.push("/login");
  }, [loading, isAuthenticated]);
  ```

### Client vs Server Components
- Default to Server Components (no `"use client"`)
- Use `"use client"` only when you need: `useState`, `useEffect`, `useAuth`, event handlers
- Do not use `localStorage` or `document` in Server Components

### Styling
- Tailwind CSS only — no CSS modules, no inline styles
- Follow existing patterns for spacing, colors, and rounded corners

---

## Adding a New Job Source

See [aggregation.md](aggregation.md#adding-a-new-job-source) for the step-by-step guide.

---

## Running Tests

```bash
# Backend
cd backend
python manage.py test

# Or with pytest
pytest

# Frontend Unit Tests
cd my-app
npm test

# Frontend E2E Tests (Playwright)
cd my-app
npx playwright test
```

Test coverage is mandatory for all new features. Ensure backend views have integration tests and frontend hooks have corresponding E2E or unit tests.

---

## PR Checklist

Before opening a PR:

- [ ] `python manage.py check` passes with 0 issues
- [ ] All new models have migrations (`makemigrations` run)
- [ ] New env vars documented in `.env.example`
- [ ] No `localhost:8000`, `127.0.0.1`, or hardcoded secrets in code
- [ ] Frontend: no raw `fetch()` or direct `axios` calls — use `axiosInstance`
- [ ] `npm run build` passes without errors
- [ ] PR description explains what changed and why

---

## Django Admin

Every model should be registered in its app's `admin.py`. This gives you a full management UI at `/admin/`.

Pattern:
```python
from django.contrib import admin
from .models import MyModel

@admin.register(MyModel)
class MyModelAdmin(admin.ModelAdmin):
    list_display = ['field1', 'field2', 'created_at']
    list_filter = ['status', 'type']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']
```

---

## Environment Variable Reference

See [deployment.md](deployment.md) for the full env var table.

Quick rule: if a value is different between your laptop and production, it belongs in `.env`. Secret? In `.env`. URL? In `.env`. Feature flag? In `.env`.
