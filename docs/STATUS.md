# Status checkpoint

As of 2026-11-18, `main` at `b801fac` (T03 merged). Work paused for owner review; T04 not started.

## Tasks done

| Task | PR | State | Summary |
|---|---|---|---|
| T01 | [#1](https://github.com/hecker03/shrishailya_envelope/pull/1) | merged | Tagged `v0-legacy`, added `docs/`, `content/`, `scripts/`, CI (lint/build/pytest), removed the legacy task-board UI and endpoints |
| T02 | [#2](https://github.com/hecker03/shrishailya_envelope/pull/2) | merged | Design tokens, self-hosted Inter + JetBrains Mono, Layout/Panel/Rule/Tag/Kbd/Button/Link/StatusBar, dev-only `/__styleguide` |
| T03 | [#3](https://github.com/hecker03/shrishailya_envelope/pull/3) | merged | Router shell for every spec route, public 404, Ctrl/Cmd+K palette, `g`-key shortcuts, per-route titles, `noindex` on `/ops*`, `robots.txt`, frontend test suite in CI |

## Next 3 steps

1. **T04 — content layer.** `content/profile.json`, `content/platforms.json`, `content/projects/*.md` with front matter (title, slug, status, stack, role, links); loader/types; production build check that fails with a clear list when a `TODO(owner)` exists in published content.
2. **T05 — home page.** Short intro, "now" section, platform strip, activity strip placeholder. Facts only from `docs/inputs/FACTS.md` and `docs/inputs/links.md`.
3. **T06 — work list and case-study template.** Seed Vanguard, ForensIQ, Prompt Scrubber, Daily Tracker, Site Visit Tracker, using `TODO(owner)` where facts (especially role in team projects) are unknown; status shown honestly.

## Decisions made and why

- **React Router 8.5.1, pinned, `BrowserRouter`.** The spec requires real URLs (`/work/:slug`, `/tools/*`). A static host must rewrite unknown paths to `index.html`; this is a T18 deployment item.
- **One route registry (`frontend/src/lib/routes.js`).** Router, nav and palette read the same list, so routes cannot drift between them.
- **Palette lists fixed public routes only.** `/ops*` is private and `/work/:slug` has no concrete slugs until T06, so it is omitted until real content exists.
- **`noindex` on `/ops*` is injected client-side; `robots.txt` is the server-side guard.** A static per-route build cannot vary meta without JS, so `robots.txt` disallows `/ops` for crawlers that do not execute scripts. Response headers can be added at T18.
- **Focus moves to `#main` after client-side navigation.** Gives keyboard and screen-reader users a reliable landmark after route changes.
- **Native `<dialog>` for the palette, no new dependency.** The one gap — jsdom lacks `showModal` — is covered by a test-only polyfill in `frontend/src/test/setup.js`.
- **Vitest + Testing Library (jsdom), run in CI.** The definition of done requires tests for new logic; the suite covers every public route, palette behavior, shortcuts, 404 and the ops `noindex`.
- **`Layout` accepts a `linkComponent`, defaulting to `<a>`.** The dev-only `/__styleguide` renders outside the Router and must keep working.
- **CI job name restored to `frontend (lint, build)` while keeping the new `npm test` step.** T03 had renamed it to `frontend (lint, test, build)`, which would stop a required check named `frontend (lint, build)` from reporting. See open question 1.
- **Pre-existing npm audit findings left for T16.** Four high-severity findings in the Vite 8.1.x/transitive tree predate T03 and are scheduled for the security hardening task.

## Open questions for the owner

1. **Required check name.** This branch restores `frontend (lint, build)` (the check still runs tests). Do you want that name kept, or should it be `frontend (lint, test, build)` and you update the required checks?
2. **T04 build gate vs T06 seeds.** T04 says the production build must fail on any `TODO(owner)` in published content, but T06 seeds projects with `TODO(owner)` where facts are unknown. Should unfinished projects be marked draft/unpublished until you fill the facts, or should the build intentionally fail until every fact exists?
3. **Palette scope.** Keep the palette limited to fixed routes, or add `/work/:slug` entries once T06 creates real slugs?
4. **T18 host.** Cloudflare Pages or Netlify? Needed later for the SPA rewrite and security headers; not blocking T04.

## TODO(owner) items

None in code or content for T01–T03. Owner actions are the four questions above; none block T04 except question 2, which shapes the content schema.

## Commands

Frontend (from `frontend/`):

```bash
npm ci
npm run lint
npm test
npm run build
```

Backend (from `backend/`; CI uses Python 3.15):

```bash
python -m venv venv
venv/Scripts/pip install -r requirements-dev.txt   # Windows; venv/bin/pip on Linux
venv/Scripts/python -m pytest -q                   # venv/bin/python on Linux
```

## Last verified

On `main` @ `b801fac`, 2026-11-18:

- `npm test`: 28 passed (4 files).
- `npm run lint`: 0 warnings, 0 errors (27 files).
- `npm run build`: success; `dist/index.html` 0.48 kB, CSS 8.52 kB, JS 244.26 kB.
- Backend pytest: 5 passed, 1 warning (Starlette `httpx`/`httpx2` deprecation).
- Working tree clean; `main` matches `origin/main`.
