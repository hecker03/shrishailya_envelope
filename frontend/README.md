# Frontend

React + Vite client for shrishailya_envelope. The public site is fully static; tools run in the browser.

## Commands

- `npm ci` installs from the lockfile.
- `npm run dev` starts the dev server.
- `npm run lint` runs oxlint.
- `npm test` runs the Vitest suite in jsdom.
- `npm run build` writes the production build to `dist/`.

## Design system

- Tokens live in `src/styles/tokens.css` and follow `docs/PORTFOLIO_SPEC.md` section 4.
- Fonts are self-hosted from `public/fonts` (OFL 1.1, license files included). There is no external font host.
- Base styles live in `src/styles/base.css`; keyboard focus uses a 2px accent ring.
- Components live in `src/components`: Layout, Panel, Rule, Tag, Kbd, Button, Link, StatusBar.
- With the dev server running, `/__styleguide` previews the tokens and components. It is loaded by dynamic import and is excluded from the production build.

## Routing and keyboard

- Every route from `docs/PORTFOLIO_SPEC.md` is wired in `src/lib/routes.js`. Page bodies are placeholders until the later content tasks.
- `Ctrl+K` opens the command palette. It lists public routes only; `/ops*` is deliberately excluded and not linked anywhere.
- `g` then `h`, `a`, `w` or `t` jumps to home, about, work or tools. Shortcuts are ignored while typing in a field.
- After client-side navigation, focus moves to `#main` so keyboard users continue from the new page.
- `/ops*` sets a `noindex, nofollow` meta tag and `public/robots.txt` disallows `/ops`.

Font sources: [Inter](https://github.com/rsms/inter) and [JetBrains Mono](https://github.com/JetBrains/JetBrainsMono).
