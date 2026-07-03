# Rebrand kcraft — Checklist zadań

**Branch:** `feature/rebrand-kcraft`
**Ostatnia aktualizacja:** 2026-07-03

---

## Faza 1 — Wspólny moduł konfiguracji marki (Unit 1)

- [ ] Stworzyć `src/lib/siteConfig.ts` z eksportowanymi stałymi: `SITE_URL` (`https://kcraft.com.pl`), `BRAND_NAME` ("kcraft"), `OWNER_NAME` ("Kamil Kemuś"), `LEGAL_NAME`, `CONTACT` (phone, email placeholder `kontakt@kcraft.com.pl`, address, mapQuery) — bez logiki, tylko stałe
- [ ] Test: `tests/int/siteConfig.int.spec.ts` — eksportowane wartości nie zawierają podciągów "mcraft"/"Macherzyński"
- [ ] Test: `tests/int/siteConfig.int.spec.ts` — `SITE_URL === 'https://kcraft.com.pl'`
- [ ] Weryfikacja: moduł się kompiluje, typechecker czysty

---

## Faza 2 — Ujednolicenie trzech usług (Unit 5)

- [ ] Stworzyć `src/app/(frontend)/maszyny-produkcyjne/page.tsx` (wzorem `konstrukcje-stalowe/page.tsx`, render przez `SubpageLayout`)
- [ ] Stworzyć `src/app/(frontend)/maszyny-rolnicze/page.tsx` (jw.)
- [ ] Stworzyć `src/app/(frontend)/uslugi-slusarsko-spawalnicze/page.tsx` (jw.)
- [ ] Usunąć `src/app/(frontend)/nadzor-spawalniczy/page.tsx`, `konstrukcje-stalowe/page.tsx`, `meble-premium/page.tsx`
- [ ] Usunąć `src/components/mcraft/NadzorLayout.tsx`
- [ ] Zaktualizować `AREA_DEFAULTS` i `AREA_ICONS` w `HomeContent.tsx` — 3 nowe SVG ikony (maszyna/tryby, ciągnik/pole, spawanie/iskry) i nazwy
- [ ] Zaktualizować `HOME_NAV_LINKS` w `HomeContent.tsx` na nowe slugi
- [ ] Zaktualizować `SUBPAGE_NAV_LINKS` w `SubpageLayout.tsx`
- [ ] Zaktualizować `AREAS` w `NavRealizacjeDropdown.tsx`
- [ ] Zaktualizować `NAV_LINKS` i allowlistę `PORTFOLIO_PAGES` w `[serviceSlug]/realizacje/[slug]/page.tsx` — wszystkie 3 nowe slugi
- [ ] Usunąć warunek `scopeItems.icon` (`data?.slug === 'nadzor-spawalniczy'`) w `src/collections/ServicePage.ts`
- [ ] Zaktualizować `filterOptions.slug.in` w `src/collections/Portfolio.ts` — wszystkie 3 nowe slugi; zmienić label kolekcji z "Realizacje (Meble i Konstrukcje)" na neutralną nazwę
- [ ] Zaktualizować stałą `PAGES` w `src/app/api/seed/route.ts` — 3 nowe wpisy (slug/title/eyebrow/scopeItems)
- [ ] Test: `tests/int/service-pages.int.spec.ts` — `Portfolio.filterOptions` akceptuje relationship do wszystkich 3 nowych `service-pages`
- [ ] Test: `tests/int/service-pages.int.spec.ts` — `GET /api/seed` tworzy dokładnie 3 `service-pages` z nowymi slugami
- [ ] Test [E2E]: otwórz `/`, kliknij kafelek "Maszyny produkcyjne", sprawdź przekierowanie na `/maszyny-produkcyjne` z poprawnym nagłówkiem
- [ ] Test [E2E]: na każdej z 3 nowych podstron sprawdź obecność sekcji "Realizacje" (może być pusta)
- [ ] Weryfikacja: 3 nowe trasy działają; stare 3 trasy zwracają 404

---

## Faza 3 — Rebrand hardcoded UI (Unit 2)

- [ ] `HomeContent.tsx` — nav wordmark, hero eyebrow ("Kamil Kemuś") + H1 (slogan "Profesjonalne Spawanie i Ślusarstwo dla Przemysłu oraz Rolnictwa") + subtitle, alt teksty zdjęć, nagłówek "o firmie" + fallback bioText z wplecionym "Dlaczego my", stopka (dane z `siteConfig`)
- [ ] `SubpageLayout.tsx` — topbar + stopka (dane z `siteConfig`)
- [ ] `ModalProvider.tsx` — nagłówki modali CV/Bio
- [ ] `Logo.tsx`, `src/components/admin/Logo.tsx` — tekst wordmark → "KCRAFT"
- [ ] `not-found.tsx` — title + stopka
- [ ] `polityka-prywatnosci/page.tsx` — meta description, wordmark, klauzula administratora danych, copyright
- [ ] Usunąć z widoku NIP/REGON i link LinkedIn (brak danych)
- [ ] Test [E2E]: otwórz `/`, sprawdź że H1 zawiera "Profesjonalne Spawanie i Ślusarstwo", eyebrow zawiera "Kamil Kemuś", stopka zawiera adres "Waleńczów" i telefon "662050419", strona nigdzie nie zawiera tekstu "Macherzyński"
- [ ] Weryfikacja: grep po zmienionych plikach nie zwraca już "MCRAFT"/"Michał Macherzyński"; strona renderuje się bez błędów

---

## Faza 4 — Reset danych w CMS/Mongo (Unit 3)

- [ ] Zdecydować: `scripts/seed-cv.ts` / `scripts/seed-tiles.ts` — usunąć, zastąpić neutralnym seedem, czy oznaczyć jako deprecated
- [ ] Stworzyć `scripts/reset-brand-globals.ts` — czyści/nadpisuje `cv-modal`, `bio-modal`, `hero-section.subtitle`, `about-section.bioText` neutralnymi placeholderami; opróżnia kolekcję `stat-tiles`
- [ ] (ręczne) Wykonać dump/backup bazy dev przed uruchomieniem skryptu — dane Michała nieodwracalnie tracone po skasowaniu
- [ ] (ręczne) Uruchomić `scripts/reset-brand-globals.ts`
- [ ] Weryfikacja (ręczna): panel `/admin` — globale CV/Bio/Hero/About i kolekcja "Kafelki statystyk" nie zawierają już tekstu o Michale/ZUGIL/IWE/IWI/VT2/PT2

---

## Faza 5 — SEO / metadata / schema.org (Unit 4)

- [ ] `src/app/(frontend)/layout.tsx` — blok `metadata` + `schemaOrg` JSON-LD (dane z `siteConfig`, `hasOfferCatalog` z 3 nowymi usługami)
- [ ] Usunąć `taxID` (NIP) z `schemaOrg` — brak realnych danych, nie fabrykować
- [ ] Zaktualizować `geo` coords na przybliżone dla Waleńczów (do doprecyzowania później)
- [ ] `src/app/sitemap.ts`, `src/app/robots.ts`, `public/llms.txt` — nowa domena/marka
- [ ] Blok `metadata` w `maszyny-produkcyjne/page.tsx`, `maszyny-rolnicze/page.tsx`, `uslugi-slusarsko-spawalnicze/page.tsx`
- [ ] Weryfikacja: JSON-LD jest poprawnym JSON-em; źródło strony nie zawiera "mcraft"/"Macherzyński"

---

## Faza 6 — Migracja danych Mongo (Unit 6)

- [ ] (ręczne) Wdrożyć/uruchomić kod z Fazy 2 (nowy `PAGES` w seed route)
- [ ] (ręczne) Wywołać `GET /api/seed` → tworzy 3 nowe `service-pages`
- [ ] (ręczne) Sprawdzić w panelu admina, czy istnieją `portfolio-projects` wskazujące na stare `service-pages` — jeśli tak, ręcznie przypisać do nowych rekordów lub usunąć
- [ ] (ręczne) Wywołać `DELETE /api/seed` z zaktualizowaną allowlistą (tylko nowe 3 slugi) → usuwa stare rekordy
- [ ] Weryfikacja (ręczna): kolekcja `service-pages` ma dokładnie 3 rekordy z nowymi slugami; brak `portfolio-projects` z martwym relationship

---

## Faza 7 — Higiena projektu i testy (Unit 7)

- [ ] `package.json` — `name`: `"mcraft"` → `"kcraft"`
- [ ] `tests/e2e/frontend.e2e.spec.ts` — zaktualizować asercje title/h1/per-subpage na nowe teksty i nowe slugi
- [ ] Test [E2E]: strona główna — `<title>` zawiera "kcraft", `h1` zawiera "Profesjonalne Spawanie i Ślusarstwo"
- [ ] Test [E2E]: każda z 3 nowych podstron ma poprawny title/heading dla swojego sluga
- [ ] Weryfikacja: `pnpm test:e2e` przechodzi w całości; `pnpm lint` i typecheck czyste

