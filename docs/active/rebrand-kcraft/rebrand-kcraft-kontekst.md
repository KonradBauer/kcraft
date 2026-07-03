# Rebrand kcraft — Kontekst

**Branch:** `feature/rebrand-kcraft`
**Ostatnia aktualizacja:** 2026-07-03

## Powiązane pliki

- `src/lib/siteConfig.ts` — NOWY: pojedyncze źródło prawdy dla marki/kontaktu/domeny (Faza 1)
- `src/components/mcraft/HomeContent.tsx` — nav wordmark, hero, sekcja "o firmie", `AREA_DEFAULTS`/`AREA_ICONS`, stopka, `HOME_NAV_LINKS`
- `src/components/mcraft/SubpageLayout.tsx` — współdzielony layout podstron usług (topbar, stopka, `SUBPAGE_NAV_LINKS`) — docelowo używany przez wszystkie 3 usługi
- `src/components/mcraft/NadzorLayout.tsx` — USUWANY (Faza 2) — zastąpiony przez `SubpageLayout` dla wszystkich 3 usług
- `src/app/(frontend)/[serviceSlug]/realizacje/[slug]/page.tsx` — dynamic route portfolio, `NAV_LINKS`, allowlista `PORTFOLIO_PAGES`
- `src/components/mcraft/NavRealizacjeDropdown.tsx` — lista `AREAS` w dropdownie nawigacji
- `src/components/mcraft/ModalProvider.tsx` — nagłówki modali CV/Bio
- `src/components/mcraft/Logo.tsx`, `src/components/admin/Logo.tsx` — wordmarki tekstowe
- `src/app/not-found.tsx`, `src/app/(frontend)/polityka-prywatnosci/page.tsx` — dodatkowe hardcoded miejsca
- `src/app/(frontend)/layout.tsx` — `metadata` + `schemaOrg` JSON-LD
- `src/app/sitemap.ts`, `src/app/robots.ts`, `public/llms.txt` — SEO na poziomie site
- `src/collections/ServicePage.ts` — pole `slug`, warunkowe `scopeItems.icon` (do usunięcia)
- `src/collections/Portfolio.ts` — `filterOptions.slug.in`, label kolekcji
- `src/app/api/seed/route.ts` — stała `PAGES`, `GET`/`DELETE` handlery
- `scripts/seed-cv.ts`, `scripts/seed-tiles.ts` — jednorazowe skrypty z danymi Michała
- `scripts/reset-brand-globals.ts` — NOWY: skrypt czyszczący globale CMS (Faza 4)
- `src/globals/{HeroSection,AboutSection,CvModal,BioModal}.ts` — globale CMS
- `tests/e2e/frontend.e2e.spec.ts` — asercje E2E do aktualizacji
- `package.json` — `name` pola
- `src/app/(frontend)/maszyny-produkcyjne/page.tsx`, `maszyny-rolnicze/page.tsx`, `uslugi-slusarsko-spawalnicze/page.tsx` — NOWE trasy (Faza 2)
- `src/app/(frontend)/nadzor-spawalniczy/page.tsx`, `konstrukcje-stalowe/page.tsx`, `meble-premium/page.tsx` — USUWANE (Faza 2)

## Decyzje techniczne

- Hero H1 = slogan firmowy, imię "Kamil Kemuś" jako eyebrow (zob. plan techniczny).
- Modale CV/Bio zachowane strukturalnie, treść user uzupełni później (zob. plan techniczny).
- Domena: **kcraft.com.pl** (zob. plan techniczny).
- "Dlaczego my" (3 punkty) wpleciony w tekst sekcji "O firmie" - bez nowego typu treści/komponentu (zob. plan techniczny).
- Logo: tekstowy wordmark "KCRAFT", bez nowej grafiki (zob. plan techniczny).
- Wszystkie 3 nowe usługi używają wspólnego `SubpageLayout` z sekcją realizacji - `NadzorLayout` wycofany (decyzja usera podczas planowania: w przeciwieństwie do starego "nadzoru", wszystkie nowe usługi to namacalna praca warta pokazania w portfolio).
- Nowe slugi: `maszyny-produkcyjne`, `maszyny-rolnicze`, `uslugi-slusarsko-spawalnicze` (ASCII, bez polskich znaków, spójne z istniejącym wzorcem).
- Brak przekierowań ze starych URL-i - założenie: kcraft nie było jeszcze publicznie live pod tą domeną.
- `src/lib/siteConfig.ts` jako jedyne źródło prawdy dla marki/kontaktu - uzasadnione realnym ryzykiem rozjazdu (dane kontaktowe zduplikowane w 4 plikach, wordmark w 5).
- NIP/REGON i link LinkedIn USUNIĘTE z UI/schema.org (brak realnych danych - nie fabrykować). E-mail placeholder: `kontakt@kcraft.com.pl`.
- Folder `src/components/mcraft/` NIE jest przenoszony na `kcraft/` (kosmetyczne, wysoki koszt/ryzyko, zero wpływu na użytkownika).
- Reset danych w Mongo to osobna migracja danych (Faza 4, Faza 6), nie efekt uboczny zmiany kodu - baza dev już zawiera realne dane Michała.
- Remote git tego repo zmieniony z `github.com/KonradBauer/mcraft.git` na `github.com/KonradBauer/kcraft.git` (osobne repo, już zawiera pełną historię projektu) - **zweryfikowane przed startem prac, żeby nie nadpisać oryginalnego projektu MCRAFT**.

## Zależności

- Faza 2 (nowe usługi) musi poprzedzać Fazę 5 (SEO - `hasOfferCatalog` potrzebuje nowych slugów) i Fazę 6 (migracja danych).
- Faza 4 (reset globali) musi poprzedzać Fazę 6 (migracja danych - weryfikacja braku danych Michała).
- Faza 6 (migracja Mongo) wymaga wdrożonego kodu z Fazy 2 PRZED wywołaniem seed route - kolejność produkcyjna, nie tylko w repo.
- Faza 7 (testy) zależy od Faz 3, 5, 2 - testy odwołują się do zmienionych treści/tras.

## Źródła
- Requirements doc: [docs/dev-brainstorms/2026-07-03-rebrand-kcraft-requirements.md](../../dev-brainstorms/2026-07-03-rebrand-kcraft-requirements.md)
- Plan techniczny: [docs/plans/2026-07-03-004-feat-rebrand-kcraft-plan.md](../../plans/2026-07-03-004-feat-rebrand-kcraft-plan.md)
