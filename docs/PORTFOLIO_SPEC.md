# shrishailya_envelope: product and architecture spec (v1)

Owner: Shrishailya Keskar. This file is the source of truth. If something here is unclear, ask the owner; do not guess or invent.

## 1. Purpose
A professional portfolio that shows real work and lets visitors **use** small tools I built. A private console, reachable only by me at a hidden route, shows my own working habits (study blocks, commits, daily log).

**Audience:** interviewers, collaborators, other students.
**Tone:** understated, specific, honest. No buzzwords, no "enthusiast", no fake metrics.

## 2. Principles
1. **Public side is static and always up.** It must work with the backend turned off.
2. **Private side is small, single-user, and hardened.**
3. **Honest content.** Every claim comes from `content/`. Unknown facts are marked `TODO(owner)` and never invented. The production build fails if any `TODO(owner)` remains in published content.
4. **Interactive, not brochure.** Tools run in the browser; nothing a visitor types leaves their machine.
5. **Few dependencies,** pinned, with no analytics, trackers or third-party CDNs.

## 3. Site map
| Route | Access | Purpose |
|---|---|---|
| `/` | public | who I am, what I'm working on, platform links, live activity strip |
| `/work` | public | project list with status (shipped, prototype, in progress) |
| `/work/:slug` | public | case study: problem, architecture, stack, **my role**, status, links, lessons |
| `/tools` | public | index of interactive tools |
| `/tools/prompt-scrubber` | public | redacts sensitive text in the browser (shared rules with my extension) |
| `/tools/cvss` | public | CVSS v3.1 base-score calculator |
| `/about` | public | background, education, contact, resume link |
| `/ops/login` | hidden | login (not linked anywhere, `noindex`, disallowed in `robots.txt`) |
| `/ops` | private | consistency dashboard |
| `/ops/log` | private | daily log (what I learned, 5 lines/day) |
| `*` | public | 404 |

No task board. The old tasks and categories feature is removed.

## 4. Visual design (no images)
**Feel:** a terminal-meets-security-console. Dense, calm, precise. Not playful, not neon, no emojis, no stock illustrations, no rounded "cards".

**Tokens (dark only for v1)**
| Token | Value |
|---|---|
| `--bg` | `#0a0c0f` |
| `--surface` | `#10141a` |
| `--border` | `#1f2630` |
| `--text` | `#d7dee7` |
| `--muted` | `#7d8896` |
| `--accent` | `#4ade80` (used sparingly: links, focus, status) |
| `--warn` / `--danger` | `#f5b83d` / `#f87171` |

**Type:** self-hosted fonts. UI chrome, headings and code in **JetBrains Mono**; body copy in **Inter**. Base 16px, line-height 1.6.
**Shape:** 1px borders, 2px radius, no shadows, no gradients. 8px spacing grid, max content width 960px.
**Layout:** left rail on desktop with numbered modules (`01 about`, `02 work`, `03 tools`), top bar on mobile. Section headings read like `02 / work`.
**Signature details**
- Command palette on `Ctrl+K` (navigate, open tools, jump to a project). `g` then `w` style shortcuts.
- Status bar at the bottom: `main@<short-sha> | built <date> | last commit <relative time>` from build-time GitHub data.
- One short boot-style intro line on first visit per session, skippable, and off when `prefers-reduced-motion` is set.
- Tool output shown as diffs (removed text struck, replacements highlighted).

**Quality bar:** responsive from 360px; keyboard-only usable; visible focus rings; contrast AA or better; Lighthouse 90+ on mobile; no layout shift.

## 5. Architecture
```
Public (static)                         Private (small API)
React + Vite + React Router             FastAPI + SQLite (stdlib sqlite3)
content/*.json|md  (edited by commits)  /api/auth/*   /api/ops/*
content/generated/github.json           reads my Google Sheet (tracker)
tools run 100% client-side
        |                                        ^
        +---- /ops pages call the API -----------+  (cookie session)
```
- **Public build** needs no backend. `content/generated/github.json` is refreshed daily by a GitHub Action.
- **Backend** serves only `/ops`. If it is down, `/ops` shows an offline state and the public site is unaffected.
- **Deployment:** frontend on a static host (Cloudflare Pages or Netlify). Backend either (A) on my own machine behind a Cloudflare Tunnel, or (B) on a host with a persistent disk. Decide at T19.

## 6. Platform connections
| Platform | How | Notes |
|---|---|---|
| GitHub | build-time snapshot via public REST API into `content/generated/github.json` | repo list, stars, last push, recent public activity. No token needed. |
| LeetCode | link plus manually updated numbers in `content/platforms.json` with an "as of" date | no official API; do not scrape |
| TryHackMe, HackTheBox, CyberDefenders | link plus manual numbers with an "as of" date | do not scrape; do not publish machine or challenge solutions |
| LinkedIn | link | |

## 7. Tools
- **Prompt Scrubber playground:** loads `rules.json` copied from the `Prompt_scrubber` repo. Preview as a diff, per-rule toggles, custom terms, copy result. Shows "nothing leaves your browser". Tests run the shared `cases.json`.
- **CVSS v3.1 calculator:** pure TypeScript module with vector string import/export and severity rating. Tests use the FIRST specification examples.
- **Out of scope:** any tool that makes the server fetch user-supplied URLs (SSRF risk).

## 8. Private console (`/ops`)
- **Today:** minutes per block against targets, from my Daily Tracker Google Sheet.
- **Last 14 days:** a strip of minutes per day, per block.
- **Commits:** recent public GitHub activity.
- **Daily log:** add, edit, tag, search and export entries as Markdown.
- Read-only on the Sheet; the log is the only data the API owns.

## 9. Security requirements
- **Auth:** single admin. Password stored as a **scrypt** hash (stdlib, no native wheels). Generated by `scripts/hash_password.py`, stored in env.
- **Session:** random 32-byte token, stored hashed in SQLite, delivered in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie. Expires after 12 h idle. Logout deletes it.
- **Brute force:** per-IP limit, plus a global lockout after repeated failures. Constant-time comparisons. Generic error messages.
- **CSRF:** state-changing routes require `SameSite=Strict` cookie plus a custom header (`X-Requested-With`).
- **Headers:** strict CSP (`default-src 'self'`, no inline scripts), `frame-ancestors 'none'`, `Referrer-Policy: no-referrer`, `X-Content-Type-Options: nosniff`, HSTS when served over HTTPS.
- **CORS:** only the site origin; credentials allowed only for it.
- **Secrets:** only in env. `.env` ignored. Sheet access via a read-only token held by the backend. A secrets scan runs in CI.
- **CI:** lint, tests, build, `pip-audit`, `npm audit`, secrets scan.
- **Docs:** `SECURITY.md` with a short threat model, and honest limits (single user, no MFA in v1).

## 10. Repo layout
```
frontend/    React app (src/components, src/pages, src/tools, src/lib)
backend/     FastAPI app (app/, tests/)
content/     profile.json, platforms.json, projects/*.md, generated/
scripts/     hash_password.py, build helpers
docs/        this spec, backlog, decisions
.github/     workflows (ci, github-snapshot)
```

## 11. Definition of done (every task)
- Lint, tests and build pass; new logic has tests.
- Checked at 375, 768 and 1280px with screenshots in the PR.
- No secrets, no `TODO(owner)` in published content, no new third-party hosts.
- README or docs updated if behaviour changed.

## 12. Out of scope for v1
Comments, analytics, a CMS, user accounts, a blog (maybe later), light theme, images.
