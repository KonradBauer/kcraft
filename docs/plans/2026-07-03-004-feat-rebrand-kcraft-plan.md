---
title: "feat: Rebrand strony z MCRAFT na kcraft"
type: feat
status: active
date: 2026-07-03
origin: docs/dev-brainstorms/2026-07-03-rebrand-kcraft-requirements.md
---

# feat: Rebrand strony z MCRAFT na kcraft

## Przegląd

Repo jest kopią strony MCRAFT (Dr inż. Michał Macherzyński - nadzór spawalniczy/konstrukcje stalowe/meble premium). Zadanie: przerobić na stronę **kcraft - Kamil Kemuś** (spawanie i ślusarstwo dla przemysłu i rolnictwa), zachowując strukturę kodu (Hero → O firmie → Obszary działalności → Stopka, 3 podstrony usług z portfolio realizacji). Zmienia się marka, dane kontaktowe, teksty hardcoded w kodzie oraz 3 usługi (nowe nazwy, nowe slugi, wszystkie z sekcją realizacji zamiast dotychczasowego podziału 2+1).

Docelowe treści CMS (opisy usług, portfolio, zdjęcia) user wpisze samodzielnie po zakończeniu tego zadania - ten plan dotyczy wyłącznie tego, co dziś jest zaszyte na sztywno w kodzie i danych już zapisanych w bazie.

## Ujęcie problemu

Zob. [docs/dev-brainstorms/2026-07-03-rebrand-kcraft-requirements.md](../dev-brainstorms/2026-07-03-rebrand-kcraft-requirements.md) - sekcja Problem.

Dodatkowo ustalone podczas planowania: lokalna baza Mongo używana do developmentu jest kopią zawierającą **realne dane Michała Macherzyńskiego** (CV, bio, kwalifikacje IWE/IWI/VT2/PT2 w kafelkach statystyk) wpisane przez wcześniejszy seed/panel admina - sama zmiana kodu i fallbacków nie usunie tych danych z renderowanej strony, bo pola CMS są już wypełnione.

## Śledzenie wymagań

- R1. Cała widoczna dla użytkownika i systemowa marka (nawigacja, wyniki wyszukiwania, dane strukturalne, panel admina) odnosi się do kcraft / Kamila Kemusia.
- R2. Hero: eyebrow = "Kamil Kemuś", H1 = slogan "Profesjonalne Spawanie i Ślusarstwo dla Przemysłu oraz Rolnictwa", podtytuł = opis usług.
- R3. Sekcja "Kim jestem" → przedstawienie firmy/właściciela, fallback tekst zawiera wplecione "Dlaczego my" (Indywidualne projekty, Materiały najwyższej jakości, Terminowość i bezpieczeństwo).
- R4. Trzy kafelki obszarów działalności = nowe usługi (Maszyny produkcyjne, Maszyny rolnicze, Usługi ślusarsko-spawalnicze), każda z osobną podstroną.
- R5. Modale CV/Bio zachowane strukturalnie, treść user uzupełni później.
- R6. Stopka: nowy adres (42-151 Waleńczów, ul. Zakrzewska 13), telefon (662050419), nazwa firmy/właściciela.
- R7. Schema.org, meta tagi SEO, sitemap, robots.txt, llms.txt odzwierciedlają nową markę.
- R8. Logo/wordmark w nawigacji i adminie = "kcraft".
- R9. Miejsca na zdjęcia (hero, portret) zostają strukturalnie - tylko podmiana źródła (user dostarczy zdjęcia).

## Granice scope'u

- Nie zmieniamy layoutu/struktury sekcji ani liczby podstron usług (zob. źródło).
- Nie zmieniamy palety kolorów/designu wizualnego (zob. źródło - założenie).
- Docelowe treści i zdjęcia dla obszarów działalności user dodaje sam przez CMS (zob. źródło).
- Nie tworzymy nowego typu treści/komponentu dla "Dlaczego my" - wplatamy w istniejący tekst (zob. źródło).
- Pełna ekstrakcja list nawigacyjnych (NAV_LINKS/AREAS) do wspólnego modułu jest POZA scope tego planu (patrz Rozważane alternatywy) - wyekstrahowany jest tylko moduł danych kontaktowych/domeny, bo bez tego bezpieczne wykonanie rebrandu w 4-5 zduplikowanych miejscach nie jest możliwe.
- Zmiana nazwy bazy danych Mongo w `docker-compose.yml` jest odroczona do implementacji (wymaga koordynacji z faktyczną migracją danych, nie tylko edycji configu).

## Kontekst i research

### Relevantny kod i wzorce

- `src/components/mcraft/HomeContent.tsx` - strona główna: nav wordmark (l.143), hero eyebrow/H1 (l.155-158), alt tekst zdjęć (l.122, 215), sekcja "o firmie" nagłówek (l.225), `AREA_DEFAULTS`/`AREA_ICONS` (l.59-87), stopka z danymi kontaktowymi (l.301-362), `HOME_NAV_LINKS` (l.35-47).
- `src/components/mcraft/SubpageLayout.tsx` - współdzielony layout podstron usług (bullet list `items` + grid realizacji), własny duplikat topbar/stopki, `SUBPAGE_NAV_LINKS`.
- `src/components/mcraft/NadzorLayout.tsx` - alternatywny layout (karty ikon, opcjonalna sekcja realizacji) używany dziś tylko przez `nadzor-spawalniczy` - **wycofywany w tym planie** (wszystkie 3 nowe usługi używają `SubpageLayout`).
- `src/app/(frontend)/[serviceSlug]/realizacje/[slug]/page.tsx` - dynamic route dla portfolio, własny duplikat topbar/stopki, `NAV_LINKS`, allowlista `PORTFOLIO_PAGES`.
- `src/components/mcraft/NavRealizacjeDropdown.tsx` - dropdown nawigacji z listą `AREAS` (3 usługi).
- `src/components/mcraft/ModalProvider.tsx` - nagłówki modali CV (l.92, 149) i Bio (l.203).
- `src/components/mcraft/Logo.tsx`, `src/components/admin/Logo.tsx` - wordmarki tekstowe.
- `src/app/not-found.tsx`, `src/app/(frontend)/polityka-prywatnosci/page.tsx` - dodatkowe miejsca z hardcoded marką.
- `src/app/(frontend)/layout.tsx` - `siteUrl`, `metadata`, `schemaOrg` JSON-LD (LocalBusiness + Person).
- `src/app/sitemap.ts`, `src/app/robots.ts`, `public/llms.txt` - SEO na poziomie site.
- `src/collections/ServicePage.ts` - pole `slug` (readOnly, zarządzane przez seed route), `scopeItems.icon` warunkowo widoczne tylko dla `slug === 'nadzor-spawalniczy'` (do usunięcia po ujednoliceniu layoutu).
- `src/collections/Portfolio.ts` - `filterOptions.slug: { in: ['meble-premium', 'konstrukcje-stalowe'] }`, label kolekcji "Realizacje (Meble i Konstrukcje)".
- `src/app/api/seed/route.ts` - stała `PAGES`, `GET` tworzy/aktualizuje `service-pages`, `DELETE` usuwa rekordy spoza allowlisty.
- `scripts/seed-cv.ts`, `scripts/seed-tiles.ts` - jednorazowe skrypty seedujące realne dane Michała (CV, 26 kafelków kwalifikacji).
- `src/globals/{HeroSection,AboutSection,CvModal,BioModal}.ts` - pola CMS; `hero.subtitle`/`about.bioText` mają fallback w kodzie, reszta (CV/Bio) jest w pełni zależna od zawartości bazy.
- `tests/e2e/frontend.e2e.spec.ts` - 5 asercji na dosłowny stary tekst ("MCRAFT" w title, "Macherzyński" w h1, nazwy starych usług).

### Wiedza instytucjonalna

`docs/solutions/` nie istnieje jeszcze w tym repo - brak wcześniejszych wpisów do wykorzystania.

### Referencje zewnętrzne

Brak - repo ma silny lokalny wzorzec dla tego zadania, external research pominięty.

## Kluczowe decyzje techniczne

- Hero H1 = slogan firmowy, imię jako eyebrow (zob. źródło).
- Modale CV/Bio zachowane strukturalnie (zob. źródło).
- Domena: **kcraft.com.pl** (zob. źródło).
- "Dlaczego my" wpleciony w tekst sekcji "O firmie" (zob. źródło).
- Logo: tekstowy wordmark "KCRAFT" (zob. źródło).
- **Wszystkie 3 nowe usługi używają wspólnego `SubpageLayout` z sekcją realizacji** - `NadzorLayout` wycofany. Ustalone z userem podczas planowania: w przeciwieństwie do starego "nadzoru spawalniczego" (dokumentacja/nadzór, brak fizycznego produktu), wszystkie 3 nowe usługi to namacalna praca warta pokazania w portfolio.
- **Nowe slugi usług** (ASCII, bez polskich znaków - spójne z istniejącym wzorcem `nadzor-spawalniczy`): `maszyny-produkcyjne`, `maszyny-rolnicze`, `uslugi-slusarsko-spawalnicze`.
- **Brak przekierowań ze starych URL-i** (`/nadzor-spawalniczy` itd.) - to repo/marka nie było jeszcze publicznie live pod kcraft.com.pl, więc stare trasy nigdy nie miały ruchu/indeksacji pod tą domeną. Założenie - do rewizji, jeśli site był jednak już publicznie dostępny.
- **Dedykowany moduł `src/lib/siteConfig.ts`** jako pojedyncze źródło prawdy dla nazwy marki/danych kontaktowych/domeny - uzasadnione przez `coding-rules.md` (2+ użycia = uzasadniona abstrakcja) i realne ryzyko rozjazdu: dane kontaktowe są dziś zduplikowane w 4 plikach, wordmark w 5.
- **NIP/REGON i link LinkedIn usunięte** z UI i schema.org (brak realnych danych - nie fabrykować fałszywych numerów/linków). E-mail placeholder: `kontakt@kcraft.com.pl` (spójny z domeną, do potwierdzenia przez usera).
- **Folder `src/components/mcraft/` NIE jest przenoszony** na `kcraft/` - czysto kosmetyczna zmiana wewnętrzna (13+ plików + importy), zero wpływu na użytkownika, wysoki koszt/ryzyko względem wartości.
- **Reset danych w Mongo traktowany jako osobna migracja danych** (Unit 3, Unit 6), nie efekt uboczny zmiany kodu - baza dev już zawiera realne dane Michała.

## Otwarte pytania

### Rozwiązane podczas planowania

- Czy stare URL-e usług potrzebują przekierowań? → Nie (założenie: pre-launch pod marką kcraft).
- Format placeholderów dla brakujących danych kontaktowych → NIP/REGON/LinkedIn usunięte z widoku; e-mail = `kontakt@kcraft.com.pl`.
- Nowe slugi usług → `maszyny-produkcyjne` / `maszyny-rolnicze` / `uslugi-slusarsko-spawalnicze`.
- Przenoszenie folderu `src/components/mcraft/` → Nie.
- Które usługi dostają sekcję realizacji → wszystkie 3 (decyzja usera).
- Stan bazy danych → zawiera realne dane Michała, wymaga jawnego kroku czyszczenia.

### Odroczone do implementacji

- Nazwa bazy Mongo w `docker-compose.yml` (obecnie `mcraft`) - zmiana wymaga koordynacji z faktyczną migracją/rename danych, nie tylko edycji configu.
- Dokładne współrzędne geo (schema.org) dla adresu Waleńczów - przybliżone na start, do doprecyzowania.
- Dokładny kształt SVG ikon dla 3 nowych usług - kierunek: maszyna/tryby, ciągnik/pole, spawanie/iskry; detale podczas implementacji.
- Czy `scripts/seed-cv.ts` / `scripts/seed-tiles.ts` zostają usunięte, zastąpione neutralnym seedem, czy oznaczone jako deprecated - decyzja podczas Unit 3.
- Czy kolekcja `stat-tiles` dostaje jakiekolwiek nowe wpisy startowe, czy zostaje pusta do wypełnienia przez usera w CMS.

## Implementation Units

- [x] **Unit 1: Wspólny moduł konfiguracji marki**

**Cel:** Jedno źródło prawdy dla nazwy marki, danych kontaktowych i domeny - eliminuje ryzyko rozjazdu między zduplikowanymi miejscami.

**Wymagania:** R1, R6, R7

**Zależności:** Brak

**Pliki:**
- Stwórz: `src/lib/siteConfig.ts`
- Test (unit): `tests/int/siteConfig.int.spec.ts`

**Podejście:**
- Eksportowane stałe (bez logiki): `SITE_URL` (`https://kcraft.com.pl`), `BRAND_NAME` ("kcraft"), `OWNER_NAME` ("Kamil Kemuś"), `CONTACT` (phone, email placeholder, address, mapQuery), `LEGAL_NAME`.
- Wszystkie kolejne unity importują stąd zamiast wpisywać literały ponownie.

**Wzorce do naśladowania:**
- `src/lib/mediaUrl.ts` - istniejący prosty moduł util w tym repo.

**Scenariusze testowe:**
- [Unit] Eksportowane wartości nie zawierają podciągów "mcraft"/"Macherzyński" (regresja przy przyszłych zmianach).
- [Unit] `SITE_URL === 'https://kcraft.com.pl'`.

**Weryfikacja:**
- Moduł się kompiluje i typechecker jest czysty; brak jeszcze użyć (importy dodają kolejne unity).

---

- [x] **Unit 2: Rebrand hardcoded UI**

**Cel:** Wszystkie hardcoded miejsca z marką/danymi Michała w komponentach frontendowych i panelu admina pokazują kcraft/Kamila Kemusia.

**Wymagania:** R1, R2, R3, R5, R6, R8

**Zależności:** Unit 1

**Pliki:**
- Modyfikuj: `src/components/mcraft/HomeContent.tsx` (nav wordmark, hero eyebrow/H1/subtitle, alt teksty, nagłówek "o firmie" + fallback bioText z wplecionym "Dlaczego my", stopka - dane z `siteConfig`)
- Modyfikuj: `src/components/mcraft/SubpageLayout.tsx` (topbar + stopka - dane z `siteConfig`)
- Modyfikuj: `src/components/mcraft/ModalProvider.tsx` (nagłówki modali CV/Bio)
- Modyfikuj: `src/components/mcraft/Logo.tsx`, `src/components/admin/Logo.tsx` (tekst wordmark)
- Modyfikuj: `src/app/not-found.tsx`, `src/app/(frontend)/polityka-prywatnosci/page.tsx` (title, wordmark, klauzula, copyright)

**Podejście:**
- Literały nazwy/kontaktu zastąp odwołaniami do `siteConfig`. Treści opisowe (H1 slogan, eyebrow, fallback "o firmie") wpisz wprost jako nowe stringi zgodnie z Kluczowymi decyzjami.
- Usuń z widoku NIP/REGON i link LinkedIn (brak danych - nie fabrykować).
- `NadzorLayout.tsx` NIE jest tu aktualizowany - zostaje usunięty w Unit 5, nie duplikuj pracy.

**Wzorce do naśladowania:**
- Istniejąca struktura JSX w `HomeContent.tsx`.

**Scenariusze testowe:**
- [E2E] Otwórz `/`, sprawdź że H1 zawiera "Profesjonalne Spawanie i Ślusarstwo", eyebrow zawiera "Kamil Kemuś", stopka zawiera adres "Waleńczów" i telefon "662050419", strona nigdzie nie zawiera tekstu "Macherzyński".

**Weryfikacja:**
- Grep po zmienionych plikach nie zwraca już "MCRAFT"/"Michał Macherzyński"; strona renderuje się bez błędów.

---

- [ ] **Unit 3: Reset danych w CMS (Mongo) - globale i stat-tiles**

**Cel:** Usunąć realne dane osobowe/zawodowe Michała obecne w bazie, żeby odwiedzający kcraft.com.pl nie widzieli cudzych danych zanim user wpisze własne.

**Wymagania:** R3, R5

**Zależności:** Unit 1

**Pliki:**
- Stwórz: `scripts/reset-brand-globals.ts` (jednorazowy skrypt, Payload Local API)
- Modyfikuj: `scripts/seed-cv.ts`, `scripts/seed-tiles.ts` (decyzja podczas implementacji: neutralny seed / deprecated - patrz Odroczone do implementacji)

**Podejście:**
- Skrypt czyści/nadpisuje pola globali `cv-modal`, `bio-modal`, `hero-section.subtitle`, `about-section.bioText` neutralnymi placeholderami (nie danymi Michała), opróżnia kolekcję `stat-tiles` (26 kafelków kwalifikacji IWE/IWI/VT2/PT2 - niezwiązanych z kcraft).
- Idempotentny - bezpieczny do wielokrotnego uruchomienia.

**Notatka wykonawcza:**
- Migracja danych na współdzielonej bazie dev - wykonawca uruchamia skrypt raz i weryfikuje w panelu admina przed dalszą pracą. Zalecany dump/backup bazy przed uruchomieniem (dane Michała nieodwracalnie tracone po skasowaniu, jeśli nie zarchiwizowane).

**Scenariusze testowe:**
- Brak automatycznych (operacja na danych, nie logika).

**Weryfikacja:**
- Panel `/admin` - globale CV/Bio/Hero/About i kolekcja "Kafelki statystyk" nie zawierają już tekstu o Michale/ZUGIL/IWE/IWI/VT2/PT2.

---

- [x] **Unit 4: SEO / metadata / schema.org**

**Cel:** Dane strukturalne i meta tagi odzwierciedlają kcraft/Kamila Kemusia pod domeną kcraft.com.pl.

**Wymagania:** R1, R6, R7

**Zależności:** Unit 1, Unit 5 (potrzebne nowe slugi usług do `hasOfferCatalog`)

**Pliki:**
- Modyfikuj: `src/app/(frontend)/layout.tsx` (`metadata` + `schemaOrg` JSON-LD)
- Modyfikuj: `src/app/sitemap.ts`, `src/app/robots.ts`, `public/llms.txt`
- Modyfikuj: `src/app/(frontend)/maszyny-produkcyjne/page.tsx`, `maszyny-rolnicze/page.tsx`, `uslugi-slusarsko-spawalnicze/page.tsx` (blok `metadata` per podstrona - pliki tworzone w Unit 5, tu tylko treść metadata)

**Podejście:**
- `SITE_URL`/dane kontaktowe z `siteConfig` (Unit 1).
- `taxID` (NIP) USUŃ z schema.org - brak realnych danych, nie fabrykować.
- `geo` coords - przybliżone dla Waleńczów, oznaczone jako do doprecyzowania (patrz Odroczone do implementacji).
- `hasOfferCatalog` wskazuje na 3 nowe usługi/slugi z Unit 5.

**Scenariusze testowe:**
- Pokryte przez [E2E] w Unit 7 (sprawdzenie `<title>`).

**Weryfikacja:**
- JSON-LD jest poprawnym JSON-em; źródło strony nie zawiera "mcraft"/"Macherzyński".

---

- [x] **Unit 5: Ujednolicenie trzech usług - nowe slugi, wspólny layout, portfolio dla wszystkich**

**Cel:** 3 nowe usługi zastępują stare; wszystkie używają tego samego layoutu z sekcją realizacji.

**Wymagania:** R4

**Zależności:** Unit 1

**Pliki:**
- Stwórz: `src/app/(frontend)/maszyny-produkcyjne/page.tsx`, `src/app/(frontend)/maszyny-rolnicze/page.tsx`, `src/app/(frontend)/uslugi-slusarsko-spawalnicze/page.tsx` (na wzór istniejącego `konstrukcje-stalowe/page.tsx`, wszystkie renderują `SubpageLayout`)
- Usuń: `src/app/(frontend)/nadzor-spawalniczy/page.tsx`, `konstrukcje-stalowe/page.tsx`, `meble-premium/page.tsx`, `src/components/mcraft/NadzorLayout.tsx`
- Modyfikuj: `src/components/mcraft/HomeContent.tsx` (`AREA_DEFAULTS`, `AREA_ICONS` - 3 nowe SVG ikony i nazwy, `HOME_NAV_LINKS`)
- Modyfikuj: `src/components/mcraft/SubpageLayout.tsx` (`SUBPAGE_NAV_LINKS`)
- Modyfikuj: `src/components/mcraft/NavRealizacjeDropdown.tsx` (`AREAS`)
- Modyfikuj: `src/app/(frontend)/[serviceSlug]/realizacje/[slug]/page.tsx` (`NAV_LINKS`, `PORTFOLIO_PAGES` → 3 nowe slugi)
- Modyfikuj: `src/collections/ServicePage.ts` (usuń warunek `scopeItems.icon` powiązany z `slug === 'nadzor-spawalniczy'`)
- Modyfikuj: `src/collections/Portfolio.ts` (`filterOptions.slug.in` → 3 nowe slugi; label kolekcji → neutralna nazwa zamiast "Realizacje (Meble i Konstrukcje)")
- Modyfikuj: `src/app/api/seed/route.ts` (stała `PAGES` → 3 nowe wpisy: slug/title/eyebrow/scopeItems)
- Test (unit): `tests/int/service-pages.int.spec.ts`

**Podejście:**
- `NAV_LINKS`/`AREAS` pozostają zduplikowane w kilku plikach (pełna ekstrakcja poza scope - patrz Rozważane alternatywy), ale muszą wskazywać na te same 3 nowe slugi.
- Ikony SVG dla nowych usług: proste generyczne kształty spójne stylem z istniejącymi w `AREA_ICONS` (maszyna/tryby dla produkcyjnych, ciągnik/pole dla rolniczych, spawanie/iskry dla ślusarsko-spawalniczych) - dokładny kształt odroczony do implementacji.

**Wzorce do naśladowania:**
- `src/app/(frontend)/konstrukcje-stalowe/page.tsx` + `SubpageLayout.tsx` (wzorzec do powielenia dla wszystkich 3 usług).
- `docs/plans/2026-06-29-003-feat-realizacje-portfolio-subpages-plan.md` (system portfolio).

**Scenariusze testowe:**
- [Unit] `Portfolio.filterOptions` akceptuje relationship do wszystkich 3 nowych `service-pages`.
- [Unit] Seed route (`GET /api/seed`) tworzy dokładnie 3 `service-pages` z nowymi slugami.
- [E2E] Otwórz `/`, kliknij kafelek "Maszyny produkcyjne", sprawdź przekierowanie na `/maszyny-produkcyjne` z poprawnym nagłówkiem.
- [E2E] Na `/maszyny-produkcyjne` (i pozostałych 2 nowych podstronach) sprawdź obecność sekcji "Realizacje" (może być pusta - placeholder).

**Weryfikacja:**
- 3 nowe trasy działają; stare 3 trasy zwracają 404 (świadomie usunięte, bez przekierowań - zob. Kluczowe decyzje).

---

- [ ] **Unit 6: Migracja danych Mongo - reseed i czyszczenie starych rekordów**

**Cel:** Baza po wdrożeniu zawiera tylko 3 nowe `service-pages`, bez osieroconych powiązań portfolio.

**Wymagania:** R4 (spójność danych)

**Zależności:** Unit 5 (zaktualizowany seed route), Unit 3 (reset globali)

**Pliki:**
- Brak nowych plików - operacja wykorzystuje istniejący `src/app/api/seed/route.ts` (`GET` i `DELETE`).

**Podejście (runbook, kolejność krytyczna):**
1. Wdróż kod z Unit 5 (nowy `PAGES` w seed route).
2. Wywołaj `GET /api/seed` → tworzy 3 nowe `service-pages`.
3. Sprawdź w panelu admina, czy istnieją `portfolio-projects` wskazujące na stare `service-pages` (pole `servicePage`) - jeśli tak, ręcznie przypisz do nowych rekordów lub usuń (brak logiki cascade w `Portfolio.ts`).
4. Wywołaj `DELETE /api/seed` z zaktualizowaną allowlistą (tylko nowe 3 slugi) → usuwa stare 3 rekordy.
5. Zweryfikuj w panelu admina: dokładnie 3 `service-pages`, zero osieroconych `portfolio-projects`.

**Notatka wykonawcza:**
- Kolejność kroków jest krytyczna (reseed przed delete) - odwrócenie kolejności ryzykuje utratę danych portfolio bez możliwości cofnięcia.

**Scenariusze testowe:**
- Brak automatycznych - manualny runbook.

**Weryfikacja:**
- Kolekcja `service-pages` ma dokładnie 3 rekordy z nowymi slugami; brak `portfolio-projects` z martwym relationship.

---

- [x] **Unit 7: Higiena projektu i aktualizacja testów**

**Cel:** Konfiguracja projektu i testy automatyczne odzwierciedlają nową markę; testy przechodzą.

**Wymagania:** R1

**Zależności:** Unit 2, Unit 4, Unit 5

**Pliki:**
- Modyfikuj: `package.json` (`name`: `"mcraft"` → `"kcraft"`)
- Modyfikuj: `tests/e2e/frontend.e2e.spec.ts` (asercje title/h1/per-subpage na nowe teksty i nowe slugi)

**Podejście:**
- Zgodnie z `coding-rules.md`: to nie jest osłabianie testu, tylko aktualizacja oczekiwanych wartości, bo specyfikacja (marka) świadomie się zmieniła - cel asercji (poprawny title/heading) zostaje identyczny.

**Scenariusze testowe:**
- [E2E] Strona główna: `<title>` zawiera "kcraft", `h1` zawiera "Profesjonalne Spawanie i Ślusarstwo".
- [E2E] Każda z 3 nowych podstron ma poprawny title/heading dla swojego sluga.

**Weryfikacja:**
- `pnpm test:e2e` przechodzi w całości; `pnpm lint` i typecheck czyste.

## Wpływ systemowy

- **Graf interakcji:** `HomeContent`/`SubpageLayout`/`[serviceSlug]/realizacje` importują `siteConfig` (Unit 1) oraz dane z CMS (globale + kolekcje). `api/seed/route.ts` jest jedynym miejscem tworzącym/usuwającym `service-pages`. `Portfolio.relationship` zależy od istnienia `service-pages` o odpowiednich slugach.
- **Propagacja błędów:** Strony `force-dynamic` renderują się z `payload.find` w czasie żądania - brakujący/błędny slug w CMS po niepełnej migracji (Unit 6) skutkuje cichą degradacją (puste kafelki/brak ikony), nie crashem - trudne do wykrycia bez manualnej weryfikacji.
- **Ryzyka cyklu życia stanu:** Sekwencja reseed→delete (Unit 6) jest jednokierunkowa i nieodwracalna dla usuniętych rekordów - brak transakcji obejmującej deploy kodu + migrację danych.
- **Parytet API:** Nie dotyczy - brak równoległych API do zsynchronizowania poza opisanym.
- **Pokrycie integracyjne:** E2E w Unit 5/7 pokrywają routing + dane CMS + render, ale NIE pokrywają samego procesu migracji Mongo (Unit 6) - to pozostaje manualną weryfikacją.

## Rozważane alternatywy

- **Pełna ekstrakcja `NAV_LINKS`/`AREAS` do wspólnego modułu:** odrzucone dla tego planu - user określił granice scope'u jako "nie zmieniamy struktury", a pełna refaktoryzacja nawigacji zwiększa powierzchnię zmian ponad wymaganą do rebrandu. Częściowa ekstrakcja (tylko kontakt/domena w `siteConfig`) daje najlepszy stosunek redukcji ryzyka do zakresu zmian; pełna ekstrakcja nawigacji może być osobnym zadaniem porządkowym później.
- **Zachowanie `NadzorLayout` dla jednej z 3 nowych usług (bez portfolio):** odrzucone - user wybrał "wszystkie 3 dostają portfolio", co czyni `NadzorLayout` zbędnym.

## Ryzyka i zależności

- Baza dev jest kopią zawierającą realne dane Michała - błąd w Unit 3/6 może nieodwracalnie skasować dane referencyjne zanim zostaną zarchiwizowane. Zalecany dump/backup przed uruchomieniem skryptów czyszczących.
- Unit 6 musi być wykonany PO wdrożeniu kodu z Unit 5 (kolejność produkcyjna, nie tylko w repo) - przedwczesne wywołanie starego seed route nadpisze nowy stan.
- `NAV_LINKS`/`AREAS` pozostają zduplikowane po tym planie (świadoma decyzja, zob. Rozważane alternatywy) - przy przyszłych zmianach usług trzeba pamiętać o kilku miejscach jednocześnie.

## Dokumentacja / Notatki operacyjne

- `CLAUDE.md` wymaga finalnej weryfikacji Production URL i opisu projektu po zakończeniu rebrandu (URL już częściowo zmieniony zewnętrznie w trakcie tej sesji na `mcraft.com.pl` - do ponownej weryfikacji przy okazji tego zadania).
- `docs/seo/ACTION-PLAN.md` i `docs/seo/FULL-AUDIT-REPORT.md` odnoszą się do starej marki - poza scope tego planu, ale warto oznaczyć jako archiwalne przy najbliższej okazji.

## Źródła i referencje

- **Dokument źródłowy:** [docs/dev-brainstorms/2026-07-03-rebrand-kcraft-requirements.md](../dev-brainstorms/2026-07-03-rebrand-kcraft-requirements.md)
- Powiązany plan: [docs/plans/2026-06-29-003-feat-realizacje-portfolio-subpages-plan.md](2026-06-29-003-feat-realizacje-portfolio-subpages-plan.md) (wzorzec systemu portfolio)
