## Summary

<!-- What does this PR do? 2-3 sentences. Link to the GitHub issue it closes. -->

Closes #

---

## Type of Change

<!-- Check all that apply -->

- [ ] `feat` — New feature or capability
- [ ] `fix` — Bug fix
- [ ] `refactor` — Code change with no behaviour change
- [ ] `docs` — Documentation only
- [ ] `test` — Adding or fixing tests
- [ ] `chore` — Deps, CI, build tooling
- [ ] `perf` — Performance improvement
- [ ] `BREAKING CHANGE` — Requires migration or client update

---

## What Changed

<!-- List specific files and what was done. Be concrete. -->

- `backend/app/file.py` — 
- `my-app/app/page/page.js` — 

---

## Testing

<!-- How did you verify this works? -->

- [ ] `python manage.py test` passes (N tests, 0 failures)
- [ ] `npm run build` passes in `my-app/`
- [ ] Manually tested in local Docker environment
- [ ] Tested with `fetch_jobs --dry-run` (if aggregation-related)

**Test output:**
```
# Paste python manage.py test --verbosity=2 output here (last 10 lines)
```

---

## Migrations

- [ ] No model changes — no migration needed
- [ ] Model changed — `makemigrations` run, migration file committed
- [ ] Data migration added as management command (not in migration file)

---

## Documentation Updated

- [ ] No docs needed (trivial change)
- [ ] `docs/api-reference.md` updated (if API endpoint changed)
- [ ] `docs/data-models.md` updated (if model changed)
- [ ] `.env.example` updated (if new env var added)
- [ ] `CHANGELOG.md` updated under `[Unreleased]`
- [ ] ADR added at `docs/adr/ADR-NNN-*.md` (if major architectural decision)

---

## Screenshots

<!-- For any UI changes, include before/after screenshots -->

---

## Checklist

- [ ] PR title follows Conventional Commits format (`feat(scope): description`)
- [ ] No hardcoded secrets, URLs, or debug statements
- [ ] No commented-out code blocks
- [ ] Branch is up to date with `main`
- [ ] Self-reviewed the diff before requesting review
