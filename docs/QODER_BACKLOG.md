# Backlog for Qoder (shrishailya_envelope)

Read `docs/PORTFOLIO_SPEC.md` first. Work the tasks **in order**. One task = one branch = one pull request = one or more small commits.

## Working agreement
1. Branch per task: `feat/T05-home-page`. Open a PR with a short summary, what you verified, and screenshots (375, 768, 1280px).
2. Commit messages: conventional (`feat:`, `fix:`, `test:`, `docs:`, `chore:`, `security:`), one logical change each.
3. Before every commit run lint, tests and build, and report the real results. Never claim something passed unless you ran it.
4. **Never invent facts about me.** Use `TODO(owner): <what is needed>` in content. List every TODO you added in the PR.
5. Never commit secrets or `.env`. Never add analytics, trackers or third-party CDNs. Keep dependencies minimal and pinned; prefer the standard library. Target Python 3.15 and only use packages with prebuilt wheels.
6. Ask before destructive actions (deleting data, force-push, rewriting history).
7. If a task is ambiguous, ask one specific question and continue with the rest.
8. Commit author: use your own identity for your commits, not mine (`git -c user.name="Qoder" -c user.email="qoder@users.noreply.local" commit ...`). My graph should reflect my own commits, reviews and merges.
9. Do **not** do tasks marked **[OWNER]**. Build the surrounding UI or stubs, and leave the owner's part as a clearly marked stub.

## Backlog

### M0: foundation
| ID | Task | Acceptance |
|---|---|---|
| T01 | Tag the current repo `v0-legacy`. Create `docs/`, `content/`, `scripts/`, `.github/workflows/`. Add CI (lint, build, pytest). Remove the old tasks/categories UI and endpoints. | CI green on the PR; the legacy tag exists; no task-board code remains |
| T02 | Design system: `tokens.css` from the spec, self-hosted JetBrains Mono and Inter, components (Layout with rail nav, Panel, Rule, Tag, Kbd, Button, Link, StatusBar). A dev-only `/__styleguide` route. | Matches the spec tokens; focus rings visible; no external font host |
| T03 | Routing and shell: React Router with every route from the spec as a placeholder, 404, command palette (`Ctrl+K`), `g`-key shortcuts, `noindex` on `/ops*`, `robots.txt`. | Keyboard-only navigation works; palette lists all public routes |

### M1: public content
| ID | Task | Acceptance |
|---|---|---|
| T04 | Content layer: `content/profile.json`, `platforms.json`, `projects/*.md` with front matter (title, slug, status, stack, role, links). Types, loader, and a build check that fails the production build on any `TODO(owner)`. | Build fails with a clear list when a TODO exists in published content |
| T05 | Home page: short intro, "now" section, platform strip, activity strip placeholder. | Reads well at 375px; no layout shift |
| T06 | Work list and case-study template. Seed with Vanguard, ForensIQ, Prompt Scrubber, Daily Tracker, Site Visit Tracker using `TODO(owner)` where facts are unknown (especially my role in team projects). | Each project page renders from its Markdown; status shown honestly |
| T07 | About and contact page, resume link, social links. | No email or phone published unless I add them to content |

### M2: live data
| ID | Task | Acceptance |
|---|---|---|
| T08 | `scripts/github_snapshot.py` plus a daily GitHub Action writing `content/generated/github.json` (repos, stars, last push, recent public activity). Status bar and home strip read it; handle a missing file. | Site builds and renders without the file; Action uses no secrets |

### M3: tools
| ID | Task | Acceptance |
|---|---|---|
| T09 | Prompt Scrubber playground at `/tools/prompt-scrubber`: copy `rules.json` from my repo, diff preview, per-rule toggles, custom terms, copy output, "nothing leaves your browser" note. Unit tests run the shared `cases.json`. | All shared cases pass; no network request while using the tool |
| T10 | **[OWNER] CVSS v3.1 core logic** (pure TypeScript, vector parse/format, base score, severity). Qoder builds only the `/tools/cvss` UI around a stub `computeBaseScore()` and the test file scaffold. | UI works with the stub; owner replaces the core and makes tests pass |

### M4: private console
| ID | Task | Acceptance |
|---|---|---|
| T11 | Backend restructure: app factory, env-based settings, stdlib `sqlite3`, simple migrations. Drop the JSON store. | Tests pass; no tasks endpoints remain |
| T12 | Auth per spec section 9: `scripts/hash_password.py` (scrypt), login/logout/me, hashed session tokens, cookie flags, rate limit and lockout, CSRF header. | Tests cover wrong password, brute force, expiry, logout, cookie flags, missing CSRF header |
| T13 | `/ops/login`, guarded `/ops` routes, dashboard shell, offline state when the API is unreachable. | Logged-out access redirects to login; no private data in the public bundle |
| T14 | Tracker integration: add `doGet` to my Apps Script (read-only, token-protected, last N days; provide the script in `docs/`), backend proxy with caching, dashboard panels (today vs targets, 14-day strip). | Works against a mock Sheet in tests; token never reaches the frontend |
| T15 | Daily log: create, edit, tag, search, export Markdown. | CRUD tests pass; export round-trips |

### M5: harden and ship
| ID | Task | Acceptance |
|---|---|---|
| T16 | Security headers and CSP, CORS lock-down, `pip-audit`, `npm audit` and a secrets scan in CI, `SECURITY.md` with threat model and limits. | CSP has no `unsafe-inline`; CI fails on high-severity findings |
| T17 | Performance and accessibility pass: Lighthouse 90+ mobile, axe with no critical issues, keyboard-only walkthrough, reduced-motion support. | Reports attached to the PR |
| T18 | Deployment docs and config for the static host and for backend options A and B. OG tags, sitemap, robots (disallow `/ops`). | A preview deploy works with the backend off |
| T19 | README with a Mermaid architecture diagram, screenshots, run instructions. | A new reader can run it in 10 minutes |

### Later (do not start)
JWT decoder, encoder/decoder toolbox, notes/writing section, light theme, MFA for `/ops`.

## Kickoff prompt (paste to Qoder)
```
You are the lead developer on shrishailya_envelope. Read docs/PORTFOLIO_SPEC.md and docs/QODER_BACKLOG.md completely, then confirm in 5 bullets what you understood, including the working agreement and which tasks are marked [OWNER].

Then start with T01 only. Work on a branch, run lint/tests/build for real, commit in small steps with conventional messages, and open a PR with screenshots and a list of any TODO(owner) you added. Stop after T01 and wait for my review before T02.

If anything is ambiguous, ask me one specific question instead of guessing. Never invent facts about me or my work.
```
