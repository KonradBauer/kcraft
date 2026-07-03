# Rebrand kcraft — Checklist zadań

**Branch:** `feature/rebrand-kcraft`
**Ostatnia aktualizacja:** 2026-07-03

---

## Faza 1 — Wspólny moduł konfiguracji marki (Unit 1) ✅

- [x] Stworzyć `src/lib/siteConfig.ts` z eksportowanymi stałymi: `SITE_URL` (`https://kcraft.com.pl`), `BRAND_NAME` ("KCRAFT"), `OWNER_NAME` ("Kamil Kemuś"), `LEGAL_NAME`, `CONTACT` (phone, email placeholder `kontakt@kcraft.com.pl`, address, mapQuery) — bez logiki, tylko stałe
- [x] Test: `tests/int/siteConfig.int.spec.ts` — eksportowane wartości nie zawierają podciągów "mcraft"/"Macherzyński"
- [x] Test: `tests/int/siteConfig.int.spec.ts` — `SITE_URL === 'https://kcraft.com.pl'`
- [x] Weryfikacja: moduł się kompiluje, typechecker czysty

---

## Faza 2 — Ujednolicenie trzech usług (Unit 5) ✅

- [x] Stworzyć `src/app/(frontend)/maszyny-produkcyjne/page.tsx` (wzorem `konstrukcje-stalowe/page.tsx`, render przez `SubpageLayout`)
- [x] Stworzyć `src/app/(frontend)/maszyny-rolnicze/page.tsx` (jw.)
- [x] Stworzyć `src/app/(frontend)/uslugi-slusarsko-spawalnicze/page.tsx` (jw.)
- [x] Usunąć `src/app/(frontend)/nadzor-spawalniczy/page.tsx`, `konstrukcje-stalowe/page.tsx`, `meble-premium/page.tsx`
- [x] Usunąć `src/components/mcraft/NadzorLayout.tsx`
- [x] Zaktualizować `AREA_DEFAULTS` i `AREA_ICONS` w `HomeContent.tsx` — 3 nowe SVG ikony (tryby, ciągnik, spawanie/iskry) i nazwy
- [x] Zaktualizować `HOME_NAV_LINKS` w `HomeContent.tsx` na nowe slugi
- [x] Zaktualizować `SUBPAGE_NAV_LINKS` w `SubpageLayout.tsx`
- [x] Zaktualizować `AREAS` w `NavRealizacjeDropdown.tsx`
- [x] Zaktualizować `NAV_LINKS` i allowlistę `PORTFOLIO_PAGES` w `[serviceSlug]/realizacje/[slug]/page.tsx` — wszystkie 3 nowe slugi
- [x] Usunąć warunek `scopeItems.icon` (`data?.slug === 'nadzor-spawalniczy'`) w `src/collections/ServicePage.ts`
- [x] Zaktualizować `filterOptions.slug.in` w `src/collections/Portfolio.ts` — wszystkie 3 nowe slugi; zmienić label kolekcji z "Realizacje (Meble i Konstrukcje)" na neutralną nazwę
- [x] Zaktualizować stałą `PAGES` w `src/app/api/seed/route.ts` — 3 nowe wpisy (slug/title/eyebrow/scopeItems)
- [x] Test: `tests/int/service-pages.int.spec.ts` — `Portfolio.filterOptions` akceptuje relationship do wszystkich 3 nowych `service-pages`
- [x] Test: `tests/int/service-pages.int.spec.ts` — `GET /api/seed` tworzy dokładnie 3 `service-pages` z nowymi slugami
- [x] (odkryte podczas Fazy 2) Test [E2E]: 3 nowe podstrony (`/maszyny-produkcyjne`, `/maszyny-rolnicze`, `/uslugi-slusarsko-spawalnicze`) ładują się z poprawnym title/heading — pokryte przez `tests/e2e/frontend.e2e.spec.ts`, `pnpm test:e2e` zielone (5/5)
- [x] Weryfikacja: 3 nowe trasy działają (potwierdzone `pnpm build` + ręczny smoke test przez `next start`); stare 3 trasy usunięte z routingu (404 przez brak pliku strony)

---

## Faza 3 — Rebrand hardcoded UI (Unit 2) ✅

- [x] `HomeContent.tsx` — nav wordmark, hero eyebrow ("Kamil Kemuś") + H1 (slogan "Profesjonalne Spawanie i Ślusarstwo dla Przemysłu oraz Rolnictwa") + subtitle, alt teksty zdjęć, nagłówek "o firmie" + fallback bioText z wplecionym "Dlaczego my", stopka (dane z `siteConfig`)
- [x] `SubpageLayout.tsx` — topbar + stopka (dane z `siteConfig`)
- [x] `ModalProvider.tsx` — nagłówki modali CV/Bio; dodatkowo zastąpiono zahardkodowaną treść fallback CV/Bio (prawdziwe dane Michała: ZUGIL, IWE/IWI, historia zawodowa) neutralnym placeholderem — nie było wprost w scope Fazy 3, ale konieczne dla R1/R5 (fallback renderuje się gdy CMS puste, czyli właśnie po reset z Fazy 4)
- [x] `Logo.tsx`, `src/components/admin/Logo.tsx` — tekst wordmark → "KCRAFT"
- [x] `not-found.tsx` — title + stopka
- [x] `polityka-prywatnosci/page.tsx` — meta description, wordmark, klauzula administratora danych, copyright
- [x] Usunąć z widoku NIP/REGON i link LinkedIn (brak danych)
- [x] (odkryte podczas Fazy 3) `MobileNav.tsx`, `PageLoader.tsx` — wordmark "MCRAFT"/"Dr inż. Michał Macherzyński" nie było na liście plików w planie technicznym, ale znalezione grepem — naprawione
- [x] Test [E2E]: otwórz `/`, sprawdź że H1 zawiera "Profesjonalne Spawanie i Ślusarstwo" — pokryte przez `tests/e2e/frontend.e2e.spec.ts` (`pnpm test:e2e` zielone); adres/telefon potwierdzone ręcznym smoke testem (patrz kontekst.md)
- [x] Weryfikacja: grep po całym `src/`+`public/` nie zwraca już "MCRAFT"/"Michał Macherzyński"/starych slugów/adresu/NIP w kodzie; strona renderuje się bez błędów (`pnpm build` czyste, ręczny smoke test)

---

## Faza 4 — Reset danych w CMS/Mongo (Unit 3)

- [ ] Zdecydować: `scripts/seed-cv.ts` / `scripts/seed-tiles.ts` — usunąć, zastąpić neutralnym seedem, czy oznaczyć jako deprecated
- [ ] Stworzyć `scripts/reset-brand-globals.ts` — czyści/nadpisuje `cv-modal`, `bio-modal`, `hero-section.subtitle`, `about-section.bioText` neutralnymi placeholderami; opróżnia kolekcję `stat-tiles`
- [ ] (ręczne) Wykonać dump/backup bazy dev przed uruchomieniem skryptu — dane Michała nieodwracalnie tracone po skasowaniu
- [ ] (ręczne) Uruchomić `scripts/reset-brand-globals.ts`
- [ ] Weryfikacja (ręczna): panel `/admin` — globale CV/Bio/Hero/About i kolekcja "Kafelki statystyk" nie zawierają już tekstu o Michale/ZUGIL/IWE/IWI/VT2/PT2

---

## Faza 5 — SEO / metadata / schema.org (Unit 4) ✅

- [x] `src/app/(frontend)/layout.tsx` — blok `metadata` + `schemaOrg` JSON-LD (dane z `siteConfig`, `hasOfferCatalog` z 3 nowymi usługami)
- [x] Usunąć `taxID` (NIP) z `schemaOrg` — brak realnych danych, nie fabrykować
- [x] Zaktualizować `geo` coords na przybliżone dla Waleńczów (50.85, 18.93 — do doprecyzowania później)
- [x] `src/app/sitemap.ts`, `src/app/robots.ts`, `public/llms.txt` — nowa domena/marka
- [x] Blok `metadata` w `maszyny-produkcyjne/page.tsx`, `maszyny-rolnicze/page.tsx`, `uslugi-slusarsko-spawalnicze/page.tsx`
- [x] Weryfikacja: JSON-LD poprawny JSON (renderuje się bez błędu w `pnpm build`/smoke teście); źródło strony nie zawiera "mcraft"/"Macherzyński" poza jednym miejscem — nazwą uploadowanego pliku CV w bazie danych (dane CMS, nie kod — patrz Faza 4)

---

## Faza 6 — Migracja danych Mongo (Unit 6) ✅

- [x] (ręczne) Wdrożyć/uruchomić kod z Fazy 2 (nowy `PAGES` w seed route)
- [x] (ręczne) Wywołać `GET /api/seed` → tworzy 3 nowe `service-pages`
- [x] (ręczne) Sprawdzić w panelu admina, czy istnieją `portfolio-projects` wskazujące na stare `service-pages` — sprawdzone przez `GET /api/portfolio-projects`, `totalDocs: 0`, brak ryzyka osieroconych rekordów
- [x] (ręczne) Wywołać `DELETE /api/seed` z zaktualizowaną allowlistą (tylko nowe 3 slugi) → usunięto stare rekordy: `nadzor-spawalniczy` ("Nadzor spawalniczy i szkolenia"), `konstrukcje-stalowe`, `meble-premium`
- [x] Weryfikacja: kolekcja `service-pages` ma dokładnie 3 rekordy z nowymi slugami (`maszyny-produkcyjne`, `maszyny-rolnicze`, `uslugi-slusarsko-spawalnicze`); brak `portfolio-projects` z martwym relationship

---

## Faza 7 — Higiena projektu i testy (Unit 7) ✅

- [x] `package.json` — `name`: `"mcraft"` → `"kcraft"`
- [x] `tests/e2e/frontend.e2e.spec.ts` — zaktualizować asercje title/h1/per-subpage na nowe teksty i nowe slugi
- [x] Test [E2E]: strona główna — `<title>` zawiera "KCRAFT", `h1` zawiera "Profesjonalne Spawanie i Ślusarstwo"
- [x] Test [E2E]: każda z 3 nowych podstron ma poprawny title/heading dla swojego sluga
- [x] Weryfikacja: `pnpm lint` czyste (0 błędów, 2 pre-existing warningi niezwiązane z rebrandem), typecheck czysty (`pnpm build`), `pnpm test:int` 14/14 zielone, `pnpm test:e2e` 5/5 zielone (wymagało doinstalowania binarki Chromium dla Playwright - `playwright install chromium`, nie nowa zależność w package.json)

