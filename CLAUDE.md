# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

---

## Project

Strona firmowa **KCRAFT / Kamil Kemuś** (spawanie i ślusarstwo dla przemysłu i rolnictwa) na **Next.js 16 + Payload CMS 3.x** z MongoDB.

Produkcja: `https://kcraft.com.pl`

**Uwaga po rebrandzie (MCRAFT → KCRAFT, 2026-07):** wszystkie dane marki (nazwa, kontakt, domena) pochodzą z `src/lib/siteConfig.ts` - NIGDY nie hardcoduj nazwy firmy, telefonu czy adresu w komponentach. Historyczne dokumenty w `docs/` mogą odwoływać się do starej nazwy `mcraft` i starych slugów podstron.

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
For `git` (fetch/push) with the same certificate problem:
```bash
git -c http.sslBackend=schannel <command>
```

## Architecture

### Route groups

```
src/app/
  (frontend)/     ← public marketing site (KCRAFT brand)
  (payload)/      ← Payload admin panel, auto-handled by withPayload()
  api/seed/       ← GET endpoint seeding the four ServicePage docs (idempotent)
  robots.ts       ← /robots.txt
  sitemap.ts      ← /sitemap.xml
```

`(payload)` is managed entirely by Payload — don't add custom code there.

### Frontend pages (`src/app/(frontend)/`)

All pages use `export const dynamic = 'force-dynamic'` — Docker build has no access to Payload/MongoDB, so static pre-rendering is disabled. Do NOT switch to `revalidate` without ensuring the build environment has CMS access.

- `layout.tsx` — metadata (OG, Twitter Card, JSON-LD schema via `<Script>`), Google Fonts, `styles.css`, `<PageLoader>`
- `page.tsx` → `<HomeContent />` server component
- `doposazenie-linii-produkcyjnej/`, `maszyny-rolnicze/`, `uslugi-slusarsko-spawalnicze/`, `wyposazenie-loftowe/` — service subpages (shared `SubpageLayout`, data via `src/lib/servicePageData.ts`)
- `[serviceSlug]/realizacje/[slug]/` — portfolio project detail pages (gallery + rich text); `serviceSlug` validated against `SERVICE_SLUGS` from `src/lib/serviceLinks.ts`, unknown → `notFound()`
- `polityka-prywatnosci/` — privacy policy (static, no CMS)

OG image is a static file: `public/og-image.png` (no dynamic `opengraph-image.tsx`).

### Components (`src/components/kcraft/`)

**Server components (SSR, crawlable):**
- `HomeContent.tsx` — full homepage HTML: Hero → About → Areas → Footer. Wraps everything in `<ModalProvider>`. Contains no hooks.
- `SubpageLayout.tsx` — layout for all four service subpages, incl. realizacje (portfolio) grid.
- `ImageSlot.tsx` — dark placeholder div for missing CMS images.
- `Logo.tsx` — brand logo.

**Client components (interactive islands):**
- `ModalProvider.tsx` — `'use client'`; modal context + state + zoom-from-origin animation + modal panel (Dowiedz się więcej, Bio, Tiles). Provides `useModal()` hook. Receives `cvModal`, `bioModal`, `tiles` as serializable props from server.
- `ModalTrigger.tsx` — button/div that calls `openModal` from context.
- `TilesMarquee.tsx` — interactive scrolling tiles container (opens Tiles modal on click).
- `MobileNav.tsx` — hamburger + fullscreen overlay menu. iOS-safe scroll lock (position:fixed + top:-scrollY pattern).
- `NavRealizacjeDropdown.tsx` — desktop nav dropdown for the realizacje subpages (from `SERVICE_LINKS`).
- `RealizacjaGaleria.tsx` — portfolio project image gallery with lightbox.
- `PageLoader.tsx` — initial page load overlay.
- `ImageWithSkeleton.tsx` — `fill` image with ink shimmer skeleton during load. Accepts `sizes` prop (default `"100vw"`).

**Admin components (`src/components/admin/`):**
- `Logo.tsx`, `Icon.tsx` — Payload admin branding (registered in `payload.config.ts`)
- `BulkImageUpload.tsx` — UI field in Portfolio for uploading many gallery images at once
- `IconPickerField.tsx` — icon picker for StatTile (icons defined in `src/lib/tileIcons.tsx`)
- `ScopeItemRowLabel.tsx` — row labels in ServicePage scope items array (title-only items)

**Shared utilities (`src/lib/`):**
- `siteConfig.ts` — **single source of truth** for brand name, owner, contact data, and domain (`SITE_URL`, `BRAND_NAME`, `OWNER_NAME`, `LEGAL_NAME`, `CONTACT`)
- `mediaUrl.ts` — extracts `.url` from Payload `Media | string | null` fields
- `serviceLinks.ts` — **single source of truth** for the list of service subpages (`SERVICE_LINKS`, `SERVICE_SLUGS`): nav, sitemap, slug validation, Portfolio filterOptions
- `servicePageData.ts` — maps ServicePage / Portfolio docs to `SubpageLayout` props with static fallbacks
- `tileIcons.tsx` — icon registry for scope items

### Modal architecture

`HomeContent` (server) → `ModalProvider` (client, context) → `ModalTrigger` / `TilesMarquee` (client, consume context).

Server-rendered children are passed as React fragments into `ModalProvider`, so all page text is in the initial HTML (SSR-crawlable). The client bundle only includes the interactive islands.

### Payload (`src/`)

- `payload.config.ts` — collections: `Users`, `Media`, `StatTile`, `ServicePage`, `Portfolio` (slug `portfolio-projects`); globals: `HeroSection`, `AboutSection`, `CvModal`, `BioModal`; admin: dark theme + custom Logo/Icon
- `payload-types.ts` — **auto-generated**, never edit manually; regenerate with `pnpm generate:types`
- `collections/` — collections; `globals/` — globals; register new ones in `payload.config.ts`
- `Portfolio` docs relate to `ServicePage` via `servicePage` relationship (filtered to `SERVICE_SLUGS`); URL: `/{serviceSlug}/realizacje/{slug}`

### Testing

- `tests/int/` — Vitest with jsdom, tests hit real MongoDB via Payload Local API; fixtures in `tests/helpers/`
- `tests/e2e/` — Playwright on Chromium; `tests/helpers/seedUser.ts` seeds/cleans test user (`dev@payloadcms.com` / `test`)
- Integration tests load `.env` via `vitest.setup.ts`; E2E reads `test.env`

### Path aliases

```
@/*             →  ./src/*
@payload-config →  ./src/payload.config.ts
```

### Docs workflow

- `docs/plans/`, `docs/dev-brainstorms/` — implementation plans and requirements
- `docs/active/<task>/` — context/plan/tasks for in-progress work
- `docs/seo/`, `docs/audits/` — SEO and CWV audit reports

## Design system

Styling uses **Tailwind v4** (`@import "tailwindcss"` in `styles.css`) with arbitrary-value utilities (`max-[980px]:hidden`, `[background:...]`). No `tailwind.config.js` — tokens are defined in `@theme {}` inside `src/app/(frontend)/styles.css`.

Key tokens (usable as Tailwind color utilities, e.g. `bg-ink`, `text-accent`):

| Variable | Value |
|----------|-------|
| `--color-ink` | `#0e1a17` (dark green-black; variants `ink-2`, `ink-3`) |
| `--color-cream` | `#f3ece0` (warm off-white; variant `cream-2`) |
| `--color-accent` | `#4f9a8c` (teal; variant `accent-bright`) |
| `--color-light` | `#eceae4` (light warm; variants `light-muted`, `light-faint`) |

Fonts: Montserrat (headings + UI labels), Barlow (body), Great Vibes (decorative).

Breakpoints used: `max-[980px]` (tablet/mobile), `max-[700px]`, `max-[560px]` (small mobile), `max-[768px]` (footer grid).

The hero on `≤980px` shows a mobile layout: `min-h-[100svh]`, photo at full opacity, subtitle hidden, button pinned to `absolute bottom-[36px]`.

## Payload key patterns

- Always pass `req` to nested Local API operations in hooks (transaction atomicity)
- Use `overrideAccess: false` when operating on behalf of a user
- Use `req.context` flags to prevent infinite hook loops
- Run `pnpm generate:types` after any schema change

## SEO

- `src/app/robots.ts` — allows AI crawlers (GPTBot, ClaudeBot, PerplexityBot) explicitly
- `src/app/sitemap.ts` — homepage + 3 service subpages, URLs built from `SITE_URL`
- `public/llms.txt` — structured facts for LLM crawlers
- JSON-LD schema (LocalBusiness/ProfessionalService + Person) built from `siteConfig` and injected via `<Script id="schema-org">` in `layout.tsx`
- Static OG image at `public/og-image.png`

## Konwencje treści

- **Em dashe zabronione** — używaj zwykłego myślnika `-` zamiast `—` we wszystkich tekstach widocznych dla użytkownika (JSX, metadata, stringi)
- **Zawsze polskie znaki** - wszystkie teksty pisz z pełnymi polskimi znakami diakrytycznymi (ą, ć, ę, ł, ń, ó, ś, ź, ż); nigdy nie zastępuj ich odpowiednikami ASCII
- Dane marki/kontaktu zawsze z `src/lib/siteConfig.ts`, nigdy hardcode
