---
title: "feat: Mobile menu (drawer) i hero foto na mobile"
type: feat
status: completed
date: 2026-06-18
origin: docs/dev-brainstorms/2026-06-18-mobile-nav-hero-requirements.md
---

# feat: Mobile menu (drawer) i hero foto na mobile

## Przegląd

Dwa powiązane problemy UX na mobile: brak nawigacji (`≤980px` — hamburger bez menu) oraz ukryte zdjęcie Michała (`≤560px`). Rozwiązanie: współdzielony komponent `MobileNav` (drawer z prawej) używany na stronie głównej i podstronach, plus fix gradientu/widoczności zdjęcia hero.

## Ujęcie problemu

Na telefonie użytkownik widzi logo "MCRAFT" bez żadnego menu — nie może przejść do żadnej sekcji ani podstrony. Sekcja hero wygląda pusto bez zdjęcia Michała, tracąc kluczowy element osobowy brandu. (zob. źródło: `docs/dev-brainstorms/2026-06-18-mobile-nav-hero-requirements.md`)

## Śledzenie wymagań

- R1. Na `≤980px` w nav pojawia się ikona hamburgera po prawej stronie
- R2. Hamburger otwiera drawer z prawej z linkami nawigacji
- R3. Drawer: tło ink, Montserrat, uppercase, teal accent
- R4. Drawer zamyka: X, backdrop, kliknięcie linku, ESC
- R5. Otwarty drawer blokuje scroll body
- R6. Drawer działa identycznie na homepage i 3 podstronach
- R7. Zdjęcie Michała widoczne na `≤560px` (nigdy hidden)
- R8. Silniejszy gradient ink na mobile chroni czytelność tekstu

## Granice scope'u

- Nie zmieniamy nav na `>980px`
- Nie zmieniamy treści linków
- Nie animujemy entrance zdjęcia — tylko gradient i widoczność
- Nie dotykamy sekcji About, footer, modali

## Kontekst i research

### Relevantny kod i wzorce

- `src/components/mcraft/HomeContent.tsx` — wzorzec modal: `useState`, `body.style.overflow`, ESC `useEffect`, backdrop `onClick` → identyczny pattern dla drawer
- `src/components/mcraft/HomeContent.tsx:339-343` — ESC handler: `document.addEventListener('keydown', ...)` z cleanup
- `src/components/mcraft/HomeContent.tsx:367` — hero foto: `absolute bottom-0 z-[2] ... max-[980px]:opacity-50 max-[560px]:hidden`
- `src/components/mcraft/HomeContent.tsx:365` — gradient overlay: `[background:linear-gradient(to_right,rgba(14,26,23,0.95)_0%,...)]`
- `src/components/mcraft/SubpageLayout.tsx` — server component, nav z `max-[980px]:hidden`; przyjmie `<MobileNav>` bez konwersji na client
- `src/components/mcraft/ImageWithSkeleton.tsx` — wzorzec nowego client component w tym samym katalogu

### Nav linki — różnica home vs subpage

```
Home links:    #about, #areas, /nadzor-spawalniczy, #workshop, #contact
Subpage links: /#about, /#areas, /nadzor-spawalniczy, /#workshop, /#contact
```

`MobileNav` przyjmuje `links: {href: string; label: string}[]` jako prop — każde call site dostarcza własną tablicę.

### z-index landscape

- Hero photo: `z-[2]`
- Nav: `z-[3]`
- Modal backdrop: `z-[90]`, modal panel: `z-[95]`
- → MobileNav drawer: `z-[80]` (nad treścią, pod modaLem)

## Kluczowe decyzje techniczne

- **`MobileNav` jako self-contained client component**: Własny `useState(isOpen)`, własny ESC useEffect, własne `body.overflow`. Nie propaguje stanu do rodziców. `SubpageLayout` (server) może go użyć bez konwersji na client.
- **CSS transform transition dla drawera**: `translateX(100%)` → `translateX(0)` z `transition-transform duration-300 ease-in-out`. Bez zewnętrznych bibliotek animacji.
- **Hero foto na mobile**: Zmiana `max-[560px]:hidden` → `max-[560px]:opacity-[0.25]`. Dodanie drugiej warstwy gradient-overlay widocznej tylko na `≤560px` z silniejszym kryciem (0.98 na lewej → 0.5 na prawej).
- **Linki jako prop**: Zamiast hardkodować linki w MobileNav, call sites (HomeContent, SubpageLayout) przekazują listę — brak duplikacji logiki przy jednocześnie różnych `href` dla home vs subpage.

## Otwarte pytania

### Rozwiązane podczas planowania

- **Kolizja ESC + overflow z modałem w HomeContent**: Brak kolizji — modal używa `isOpen` ze swojego `useState`, drawer używa swojego. Oba mogą być jednocześnie otwarte, choć UX tego nie promuje. Modal ma wyższy z-index (90+) więc wizualnie góruje.
- **Czy SubpageLayout musi być client?**: Nie. Next.js App Router pozwala na client component wewnątrz server component bez konwersji rodzica.
- **Hero foto `width/height`**: Zdjęcie ma `width={390} height={620}` — Next.js nie wymaga `fill` dla tej konfiguracji. `opacity-[0.25]` na mobile nie zmienia wymiarów.

### Odroczone do implementacji

- **Dokładna wartość opacity zdjęcia na mobile**: `0.25` to punkt startowy. Implementator weryfikuje czytelność w przeglądarce i dostosowuje (0.2–0.35).
- **Szerokość drawera**: Plan wskazuje `w-[280px]`. Implementator może dostosować jeśli na bardzo wąskich (320px) ekranach wygląda nieproporcjonalnie.

## Implementation Units

- [x] **Unit 1: Komponent `MobileNav`**

**Cel:** Wielokrotnego użytku client component z hamburgerem i drawerem — docelowy artefakt używany przez obie lokalizacje

**Wymagania:** R1, R2, R3, R4, R5

**Zależności:** Brak

**Pliki:**
- Stwórz: `src/components/mcraft/MobileNav.tsx`

**Podejście:**
- `'use client'`, props: `links: { href: string; label: string }[]`
- State: `isOpen: boolean` (useState false)
- Renderuje dwa elementy: **1)** hamburger button `☰` widoczny `max-[980px]:flex hidden` w inline `<nav>`-compatible fragment, **2)** drawer panel + backdrop
- Drawer: `fixed top-0 right-0 h-full w-[280px] bg-ink z-[80] flex flex-col`, CSS transition `translateX(100%)` → `translateX(0)` gdy `isOpen`
- Backdrop: `fixed inset-0 z-[79] bg-black/50` widoczny tylko gdy `isOpen`, `onClick` → close
- Linki: `<Link href={href}>` każdy `onClick={() => setIsOpen(false)}`; styl: Montserrat, uppercase, tracking, text-light, hover:text-accent
- Przycisk X: w prawym górnym rogu drawera
- `useEffect`: ESC handler, `body.style.overflow` przy zmianie `isOpen`
- Cleanup: `return () => { body.style.overflow = ''; removeEventListener(...) }`

**Wzorce do naśladowania:**
- `src/components/mcraft/HomeContent.tsx:330-343` — pattern closeModal + ESC useEffect
- `src/components/mcraft/HomeContent.tsx:614-616` — backdrop div z `onClick={close}`
- `src/components/mcraft/ImageWithSkeleton.tsx` — styl eksportu named function

**Scenariusze testowe:**
- [E2E] `http://localhost:3000` przy `viewport 375px`: ikona ☰ widoczna w nav, desktop linki niewidoczne
- [E2E] Kliknięcie ☰ → drawer wysuwa się z prawej, tło przyciemnione
- [E2E] Kliknięcie X → drawer chowa się
- [E2E] Kliknięcie poza drawer (backdrop) → drawer chowa się
- [E2E] Kliknięcie linku "Obszary" → drawer chowa się, strona scrolluje do sekcji
- [E2E] Klawisz ESC gdy drawer otwarty → drawer chowa się

**Weryfikacja:**
- Komponent kompiluje bez TypeScript errors
- Drawer widoczny/ukryty przy toggle `isOpen`
- `body.overflow` cleanup poprawny (brak scroll-lock po zamknięciu)

---

- [x] **Unit 2: Integracja `MobileNav` w `HomeContent.tsx`**

**Cel:** Zastąpienie pustego miejsca po prawej stronie nava hamburgerem i drawerem

**Wymagania:** R1, R2, R3, R4, R5

**Zależności:** Unit 1

**Pliki:**
- Modyfikuj: `src/components/mcraft/HomeContent.tsx`

**Podejście:**
- Import `MobileNav` z `'./MobileNav'`
- W `<nav>` po div z `max-[980px]:hidden` dodaj `<MobileNav links={HOME_NAV_LINKS} />` gdzie `HOME_NAV_LINKS` to stała z linkami `#about`, `#areas`, `/nadzor-spawalniczy`, `#workshop`, `#contact`
- `HOME_NAV_LINKS` jako `const` poza komponentem (nie inline) — stable reference
- Zachować istniejący `<div className="flex gap-[38px] max-[980px]:hidden">` bez zmian

**Wzorce do naśladowania:**
- Import `ImageSlot`, `ImageWithSkeleton` w tym samym pliku — styl importu

**Scenariusze testowe:**
- [E2E] `http://localhost:3000` desktop (1280px): hamburger niewidoczny, desktop links widoczne
- [E2E] `http://localhost:3000` mobile (375px): hamburger widoczny, drawer działa

**Weryfikacja:**
- Brak TypeScript errors
- Desktop nav bez zmian wizualnych

---

- [x] **Unit 3: Integracja `MobileNav` w `SubpageLayout.tsx`**

**Cel:** Mobile menu na podstronach (identyczne jak homepage)

**Wymagania:** R6

**Zależności:** Unit 1

**Pliki:**
- Modyfikuj: `src/components/mcraft/SubpageLayout.tsx`

**Podejście:**
- Import `MobileNav` (client component w server component — dozwolone przez Next.js)
- W `<nav>` po `<div className="flex gap-[38px] max-[980px]:hidden">` dodaj `<MobileNav links={SUBPAGE_NAV_LINKS} />`
- `SUBPAGE_NAV_LINKS`: `/#about`, `/#areas`, `/nadzor-spawalniczy`, `/#workshop`, `/#contact`
- Stała poza komponentem

**Scenariusze testowe:**
- [E2E] `http://localhost:3000/nadzor-spawalniczy` mobile (375px): hamburger widoczny, "O mnie" prowadzi do `/#about`
- [E2E] Wszystkie 3 podstrony mają działający drawer

**Weryfikacja:**
- Brak TypeScript errors w SubpageLayout.tsx
- `pnpm lint` bez nowych błędów

---

- [x] **Unit 4: Hero foto i gradient na mobile**

**Cel:** Zdjęcie Michała widoczne na `≤560px` jako tło hero z czytelnym gradientem

**Wymagania:** R7, R8

**Zależności:** Brak (niezależne od Units 1-3)

**Pliki:**
- Modyfikuj: `src/components/mcraft/HomeContent.tsx`

**Podejście:**
- **Foto container** (linia ~367): zamień `max-[560px]:hidden` na `max-[560px]:opacity-[0.25]`. Rozważ też dostosowanie pozycji: dodaj `max-[560px]:right-0 max-[560px]:left-auto max-[560px]:translate-x-0` żeby foto siedzało po prawej stronie hero, nie przycinało się na środku
- **Nowy gradient-overlay dla mobile** (po istniejącym gradient div, linia ~365): dodaj drugi div `hidden max-[560px]:block absolute inset-0 z-[1] pointer-events-none` z silniejszym gradientem: `rgba(14,26,23,0.98) 0% → rgba(14,26,23,0.6) 70% → rgba(14,26,23,0.3) 100%` — chroni tekst po całej szerokości mobile
- Obraz hero (`h-[620px] max-[980px]:h-[460px]`) nie wymaga zmian, ale implementator może dodać `max-[560px]:h-auto max-[560px]:h-full` jeśli potrzebna lepsza proporcja

**Wzorce do naśladowania:**
- Istniejący gradient div (`linia ~365`) — styl `[background:...]` Tailwind arbitrary value

**Scenariusze testowe:**
- [E2E] `http://localhost:3000` mobile 375px: zdjęcie Michała widoczne za tekstem hero (jako tło)
- [E2E] Tekst "Dr inż.", "Michał Macherzyński", przycisk "Dowiedz się więcej" w pełni czytelny na tle zdjęcia
- [E2E] Desktop (1280px): brak zmian wizualnych w hero

**Weryfikacja:**
- Brak `max-[560px]:hidden` na foto container — zdjęcie zawsze renderowane w DOM
- Tekst hero czytelny na urządzeniu 375px (kontrast wystarczający)

## Wpływ systemowy

- **`body.style.overflow` — potencjalna kolizja**: `HomeContent` ustawia `body.overflow = 'hidden'` dla modali, `MobileNav` robi to samo dla drawera. Jeśli użytkownik otworzy modal, a potem drawer — oba ustawiają i czyzczą `overflow`. Cleanup każdego jest niezależny. Ryzyko: zamknięcie modalu przy otwartym drawerze odblokowuje scroll mimo otwartego drawera. Implementator testuje ten edge case i rozważa czy to realne UX ryzyko.
- **Server component boundary**: `SubpageLayout` (server) → `MobileNav` (client). Next.js tworzy client boundary automatycznie. Brak przekazywania server data do MobileNav (przyjmuje tylko statyczne `links`).
- **Hydration**: `MobileNav` ma `isOpen = false` przy SSR — hamburger widoczny, drawer ukryty. Poprawne.

## Ryzyka i zależności

- **Drawer vs modal collision** (linia 323, 335 w HomeContent): gdy modal otwarty i drawer otwarty jednocześnie — modal ma z-95 więc wizualnie góruje nad drawer (z-80). Oba blokują scroll niezależnie. Implementator weryfikuje że zamknięcie modalu nie odblokowuje scroll drawera.
- **Units 1 → 2 i 3 sekwencyjnie**: Unit 1 musi istnieć przed integracją. Units 2 i 3 są niezależne od siebie.
- **Unit 4 niezależny**: Może być implementowany równolegle z Units 1-3.

## Źródła i referencje

- **Dokument źródłowy:** [docs/dev-brainstorms/2026-06-18-mobile-nav-hero-requirements.md](../dev-brainstorms/2026-06-18-mobile-nav-hero-requirements.md)
- Wzorzec modal state: `src/components/mcraft/HomeContent.tsx:304-343`
- Nav do modyfikacji: `HomeContent.tsx:389-398`, `SubpageLayout.tsx:33-45`
- Hero foto + gradient: `HomeContent.tsx:365-376`
- E2E testy: `tests/e2e/frontend.e2e.spec.ts`
