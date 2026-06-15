# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

---

## Project

Marketing website for **MCRAFT / Dr inż. Michał Macherzyński** (welding engineer) built on **Next.js 16 + Payload CMS 3.x** with MongoDB.

## Commands

```bash
pnpm dev               # dev server at http://localhost:3000
pnpm build             # production build
pnpm lint              # ESLint
pnpm generate:types    # regenerate src/payload-types.ts after schema changes
pnpm generate:importmap

pnpm test:int          # Vitest integration tests (requires MongoDB running)
pnpm test:e2e          # Playwright E2E (auto-starts dev server)
pnpm test              # both suites
```

**Single integration test:**
```bash
pnpm exec vitest run tests/int/api.int.spec.ts
```

**Single E2E test:**
```bash
pnpm exec playwright test tests/e2e/admin.e2e.spec.ts
```

**SSL proxy issue (Windows corporate network):** All `pnpm` commands in PowerShell require:
```powershell
$env:NODE_OPTIONS="--use-system-ca"; pnpm <command>
```

## Architecture

### Route groups

```
src/app/
  (frontend)/     ← public marketing site (MCRAFT brand)
  (payload)/      ← Payload admin panel, auto-handled by withPayload()
```

The `(payload)` group is managed entirely by Payload — don't add custom code there.

### Frontend (`src/app/(frontend)/`)

Static marketing site with CSS custom properties design system (no Tailwind utilities used — `@import "tailwindcss"` is present but all styling uses custom CSS classes in `styles.css`).

- `layout.tsx` — loads Google Fonts (Montserrat, Barlow, Great Vibes) and `styles.css`
- `page.tsx` — renders `<HomeContent />` (server component thin wrapper)
- `nadzor-spawalniczy/`, `konstrukcje-stalowe/`, `meble-premium/` — service subpages

### Components (`src/components/mcraft/`)

- `HomeContent.tsx` — `'use client'`, full homepage: Hero → About → Areas → Workshop → Footer + modal engine with zoom-from-origin animation
- `SubpageLayout.tsx` — shared server component for all three service subpages
- `Logo.tsx`, `ImageSlot.tsx` — primitives

`ImageSlot` renders dark placeholder divs. Real images will be served via the Payload Media collection at `/api/media/file/**`.

### Payload (`src/`)

- `payload.config.ts` — collections: `Users` (auth), `Media` (uploads with sharp)
- `payload-types.ts` — **auto-generated**, never edit manually; regenerate with `pnpm generate:types`
- `collections/` — add new Payload collections here and register them in `payload.config.ts`

### Testing

- `tests/int/` — Vitest with jsdom, tests hit real MongoDB via Payload Local API; fixtures in `tests/helpers/`
- `tests/e2e/` — Playwright on Chromium; `tests/helpers/seedUser.ts` seeds/cleans the test user (`dev@payloadcms.com` / `test`)
- Integration tests load `.env` via `vitest.setup.ts`; E2E reads `test.env`

### Path aliases

```
@/*  →  ./src/*
@payload-config  →  ./src/payload.config.ts
```

## Design system

CSS lives entirely in `src/app/(frontend)/styles.css`. Key tokens:

| Variable | Value |
|----------|-------|
| `--ink` | `#0e1a17` (dark green-black) |
| `--cream` | `#f3ece0` (warm off-white) |
| `--accent` | `#4f9a8c` (teal) |
| `--light` | `#eceae4` (light warm) |

Fonts: Montserrat (headings + UI labels), Barlow (body), Great Vibes (signature/quote).

## Payload key patterns

- Always pass `req` to nested Local API operations in hooks (transaction atomicity)
- Use `overrideAccess: false` when operating on behalf of a user
- Use `req.context` flags to prevent infinite hook loops
- Run `pnpm generate:types` after any schema change

## Konwencje treści

- **Em dashe zabronione** — używaj zwykłego myślnika `-` zamiast `—` we wszystkich tekstach widocznych dla użytkownika (JSX, metadata, stringi)
