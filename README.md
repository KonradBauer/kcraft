# KCRAFT

Strona firmowa **KCRAFT / Kamil Kemuś** (spawanie i ślusarstwo dla przemysłu i rolnictwa), zbudowana na **Next.js 16 + Payload CMS 3.x** z MongoDB.

Produkcja: `https://kcraft.com.pl`

## Wymagania

- Node.js `^18.20.2 || >=20.9.0`
- pnpm `^9 || ^10`
- MongoDB (lokalnie lub przez Docker)

## Szybki start

```bash
cp .env.example .env      # uzupełnij DATABASE_URL, PAYLOAD_SECRET
pnpm install
pnpm dev                  # http://localhost:3000
```

Przy pierwszym uruchomieniu panel admina (`/admin`) poprosi o utworzenie konta użytkownika.

### Docker (opcjonalnie)

```bash
docker-compose up
```

`docker-compose.yml` odpala MongoDB + aplikację; wymaga `.env` z `PAYLOAD_SECRET`.

### Windows - problem z certyfikatem SSL (sieć korporacyjna)

Wszystkie komendy `pnpm` w PowerShell wymagają:

```powershell
$env:NODE_OPTIONS="--use-system-ca"; pnpm <komenda>
```

Dla samego `git` (fetch/push) przy tym samym problemie z certyfikatem:

```bash
git -c http.sslBackend=schannel <komenda>
```

## Komendy

```bash
pnpm dev               # serwer dev na http://localhost:3000
pnpm build             # build produkcyjny
pnpm lint              # ESLint
pnpm generate:types    # regeneracja src/payload-types.ts po zmianie schematu
pnpm generate:importmap

pnpm test:int          # testy integracyjne Vitest (wymaga uruchomionego MongoDB)
pnpm test:e2e          # testy E2E Playwright (sam odpala dev server)
pnpm test              # oba zestawy testów
```

Pojedynczy test:

```bash
pnpm exec vitest run tests/int/api.int.spec.ts
pnpm exec playwright test tests/e2e/admin.e2e.spec.ts
```

## Architektura

```
src/app/
  (frontend)/     ← publiczna strona marketingowa (marka KCRAFT)
  (payload)/      ← panel admina Payload, obsługiwany automatycznie przez withPayload()
  robots.ts       ← /robots.txt
  sitemap.ts      ← /sitemap.xml
```

Strony `(frontend)` używają `export const dynamic = 'force-dynamic'` - build w Dockerze nie ma dostępu do Payload/MongoDB, więc statyczny pre-render jest wyłączony.

### Podstrony usług

- `/doposazenie-linii-produkcyjnej`
- `/maszyny-rolnicze`
- `/uslugi-slusarsko-spawalnicze`
- `/wyposazenie-loftowe`

Każda z sekcją realizacji (portfolio), wspólny layout `SubpageLayout`.

### Kluczowe moduły

- `src/lib/siteConfig.ts` - jedno źródło prawdy dla nazwy marki, danych kontaktowych i domeny
- `src/components/kcraft/HomeContent.tsx` - strona główna (server component)
- `src/components/kcraft/ModalProvider.tsx` - modale Dowiedz się więcej/Bio/kafelki (client component)
- `src/collections/`, `src/globals/` - kolekcje i globale Payload

Pełny opis architektury, konwencji i wzorców Payload: [CLAUDE.md](./CLAUDE.md).

## Testy

- `tests/int/` - Vitest + jsdom, Payload Local API na realnym MongoDB
- `tests/e2e/` - Playwright na Chromium

## Dokumentacja

- [CLAUDE.md](./CLAUDE.md) - konwencje projektu, architektura, wzorce Payload
- `.claude/skills/payload/` - skill z dokumentacją Payload CMS używaną w tym repo
- `docs/plans/`, `docs/active/` - plany i śledzenie bieżących zadań deweloperskich
