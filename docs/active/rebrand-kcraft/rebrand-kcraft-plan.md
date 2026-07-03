# Rebrand kcraft — Plan

**Branch:** `feature/rebrand-kcraft`
**Ostatnia aktualizacja:** 2026-07-03

## Cele i zakres

Przerobienie strony z marki MCRAFT (Dr inż. Michał Macherzyński - nadzór spawalniczy/konstrukcje stalowe/meble premium) na **kcraft - Kamil Kemuś** (spawanie i ślusarstwo dla przemysłu i rolnictwa), przy zachowaniu struktury kodu (Hero → O firmie → Obszary działalności → Stopka, 3 podstrony usług z portfolio realizacji). Zmienia się marka, dane kontaktowe, teksty hardcoded w kodzie, oraz same 3 usługi (nowe nazwy/slugi, wszystkie z sekcją realizacji).

Granice scope'u:
- Nie zmieniamy layoutu/struktury sekcji ani liczby podstron usług.
- Nie zmieniamy palety kolorów / designu wizualnego.
- Docelowe treści i zdjęcia dla obszarów działalności user dodaje sam przez CMS - poza scope.
- Bez pełnej ekstrakcji list nawigacyjnych (NAV_LINKS/AREAS) do wspólnego modułu - tylko dane kontaktowe/domena.
- Bez zmiany nazwy bazy Mongo w `docker-compose.yml` (odroczone do implementacji).

## Fazy

### Faza 1 — Wspólny moduł konfiguracji marki (Unit 1)
Jedno źródło prawdy (`src/lib/siteConfig.ts`) dla nazwy marki, danych kontaktowych i domeny - fundament dla wszystkich kolejnych faz.

### Faza 2 — Ujednolicenie trzech usług (Unit 5)
Nowe slugi usług (`maszyny-produkcyjne`, `maszyny-rolnicze`, `uslugi-slusarsko-spawalnicze`), wspólny layout (`SubpageLayout`) dla wszystkich trzech z sekcją realizacji, wycofanie `NadzorLayout`.

### Faza 3 — Rebrand hardcoded UI (Unit 2)
Wszystkie hardcoded miejsca z marką/danymi Michała w komponentach frontendowych i panelu admina → kcraft/Kamil Kemuś.

### Faza 4 — Reset danych w CMS/Mongo (Unit 3)
Usunięcie realnych danych Michała (CV, bio, kwalifikacje) z bazy dev - kopiowana baza już je zawiera, sama zmiana kodu ich nie usuwa.

### Faza 5 — SEO / metadata / schema.org (Unit 4)
Meta tagi, JSON-LD, sitemap, robots.txt, llms.txt pod nową markę i domenę kcraft.com.pl.

### Faza 6 — Migracja danych Mongo (Unit 6)
Reseed `service-pages` nowymi slugami i usunięcie starych rekordów - runbook z krytyczną kolejnością kroków.

### Faza 7 — Higiena projektu i testy (Unit 7)
`package.json`, aktualizacja `tests/e2e/frontend.e2e.spec.ts` pod nową markę/trasy.

## Kryteria akceptacji całości

- Żadne user-facing miejsce na stronie (treść, meta tagi, schema.org, panel admina) nie zawiera już "MCRAFT" ani "Michał Macherzyński".
- Strona buduje się i działa (dev/build) bez błędów.
- Trzy nowe podstrony usług działają pod nowymi adresami URL i są dostępne z nawigacji, każda z sekcją realizacji.
- Stopka pokazuje poprawny adres i telefon kcraft/Kamila Kemusia.
- `pnpm test:e2e`, `pnpm lint` i typecheck przechodzą.

## Źródła
- Requirements doc: [docs/dev-brainstorms/2026-07-03-rebrand-kcraft-requirements.md](../../dev-brainstorms/2026-07-03-rebrand-kcraft-requirements.md)
- Plan techniczny: [docs/plans/2026-07-03-004-feat-rebrand-kcraft-plan.md](../../plans/2026-07-03-004-feat-rebrand-kcraft-plan.md)
