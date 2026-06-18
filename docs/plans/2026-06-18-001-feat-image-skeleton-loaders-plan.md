---
title: "feat: Skeleton loadery dla obrazów"
type: feat
status: completed
date: 2026-06-18
origin: docs/dev-brainstorms/2026-06-18-image-skeleton-loaders-requirements.md
---

# feat: Skeleton loadery dla obrazów

## Przegląd

Dodanie animowanego skeleton loadera wyświetlanego podczas ładowania obrazów CMS. Nowy komponent `ImageWithSkeleton` zastąpi gołe `<Image>` w 4 miejscach (portret About, miniatury obszarów, główne zdjęcie podstrony, galeria podstrony). Hero images (`priority`) pozostają bez zmian.

## Ujęcie problemu

Obrazy "wskakują" do layoutu bez feedbacku wizualnego. Next.js `Image` już obsługuje lazy loading — brakuje tylko warstwy UX informującej użytkownika że obraz jest w drodze. (zob. źródło: `docs/dev-brainstorms/2026-06-18-image-skeleton-loaders-requirements.md`)

## Śledzenie wymagań

- R1. Każdy obraz poza hero pokazuje skeleton podczas ładowania
- R2. Skeleton: tło `#1b2925`, subtelna fala shimmer `rgba(255,255,255,0.06)`
- R3. Po załadowaniu skeleton zanika płynnie (opacity transition)
- R4. Brak layout shift — skeleton wypełnia dokładnie ten sam obszar co obraz
- R5. `ImageSlot` (placeholder "brak zdjęcia") pozostaje bez zmian

## Granice scope'u

- Nie zmieniamy lazy loading (Next.js defaults wystarczają)
- Nie dodajemy `blurDataURL` — wymaga Sharp pipeline per image
- Hero images (`priority`) bez skelotonu
- `ImageSlot` bez zmian

## Kontekst i research

### Relevantny kod i wzorce

- `src/components/mcraft/ImageSlot.tsx` — istniejący placeholder `#1b2925`; skeleton nawiązuje do tej palety
- `src/components/mcraft/HomeContent.tsx:456-462` — portret: `<div className="relative z-10 h-full"><Image fill ...>`
- `src/components/mcraft/HomeContent.tsx:538-542` — area thumbnail: `<div className="relative w-full h-[120px]"><Image fill ...>`
- `src/components/mcraft/SubpageLayout.tsx:79-82` — main image: `<div className="relative w-full h-[340px]"><Image fill ...>`
- `src/components/mcraft/SubpageLayout.tsx:94-97` — gallery: `<div className="relative w-full h-[220px]"><Image fill ...>`
- `src/app/(frontend)/styles.css:58-61` — wzorzec `@keyframes marquee` do naśladowania dla shimmer keyframe

### Kluczowa obserwacja

Wszystkie 4 miejsca użycia to obrazy z `fill` wewnątrz `relative` rodzica z jawnym `height`. `ImageWithSkeleton` może renderować jako React fragment (`<>`): skeleton `absolute inset-0` + `<Image fill>`. Żaden wrapper div, zero CLS.

### Wiedza instytucjonalna

Brak wpisów w `docs/solutions/`.

## Kluczowe decyzje techniczne

- **Fragment zamiast wrappera**: `ImageWithSkeleton` renderuje `<>skeleton + Image</>`. Rodzic już ma `relative` i wymiary. Gdybyśmy dodali wrapper div, musielibyśmy powielać klasy wymiarowe z każdego call site.
- **CSS pseudoelement `::after` dla shimmer wave**: Shimmer to `::after` na skeleton div z `translateX(-100% → 100%)`. Czysta CSS bez JS, nie potrzeba `motion-safe` wrappera dla tak subtelnej animacji.
- **`pointer-events-none` na zanikającym skelotonie**: Zapobiega blokowaniu kliknięć na obraz w trakcie fade-out transition (500ms).
- **`useState(false)` + `onLoad`**: Najprostszy mechanizm wykrywania załadowania obrazu w Next.js. `onLoadingComplete` jest deprecated od Next.js 14.
- **Klasa `.img-skeleton` w `@layer components`**: Spójne z wzorcem `.blueprint-bg` i `.dots-pattern` w styles.css.

## Otwarte pytania

### Rozwiązane podczas planowania

- **Czy `SubpageLayout` (server component) może używać client `ImageWithSkeleton`?**: Tak — Next.js App Router pozwala na zagnieżdżanie komponentów client wewnątrz server components. Client boundary jest na `ImageWithSkeleton`.
- **Jak obsłużyć `fill` vs fixed size?**: Wszystkie 4 miejsca używają `fill` — komponent nie musi obsługiwać `width/height` props na tym etapie.

### Odroczone do implementacji

- **`prefers-reduced-motion`**: Animacja shimmer jest bardzo subtelna; implementator oceni czy warto dodać `@media (prefers-reduced-motion)` wyłączający animację. Nie jest blokerem.

## Implementation Units

- [x] **Unit 1: CSS keyframe i klasa skeleton**

**Cel:** Definicja animacji shimmer dostępnej globalnie przez klasę `.img-skeleton`

**Wymagania:** R2 (kolor i efekt shimmer)

**Zależności:** Brak

**Pliki:**
- Modyfikuj: `src/app/(frontend)/styles.css`

**Podejście:**
- Dodaj `@keyframes skeleton-shimmer` z `translateX(-100% → 100%)` — analogia do istniejącego `@keyframes marquee`
- Dodaj `.img-skeleton` w `@layer components`:
  - `background-color: #1b2925`
  - `overflow: hidden` (żeby `::after` nie wychodził poza bounds)
  - `::after`: `position: absolute`, gradient `rgba(255,255,255,0.06)`, `animation: skeleton-shimmer 1.8s ease-in-out infinite`

**Wzorce do naśladowania:**
- `src/app/(frontend)/styles.css:42-55` — `.blueprint-bg` i `.dots-pattern` w `@layer components`
- `src/app/(frontend)/styles.css:58-61` — `@keyframes marquee` jako wzorzec składni

**Scenariusze testowe:**
- [E2E] Na `/nadzor-spawalniczy` (subpage bez obrazów CMS) skeleton `#1b2925` widoczny na miejscu obrazu; shimmer wave przesuwa się od lewej do prawej
- [E2E] Klasa `.img-skeleton` z opacity 1 obecna w DOM zanim obraz się załaduje

**Weryfikacja:**
- Klasa `.img-skeleton` zastosowana do dowolnego div renderuje ciemny pojemnik z animowaną falą shimmer

---

- [x] **Unit 2: Komponent `ImageWithSkeleton`**

**Cel:** Wielokrotnego użytku client component łączący skeleton + Next.js Image z płynnym fade-out po załadowaniu

**Wymagania:** R1, R2, R3, R4

**Zależności:** Unit 1 (klasa `.img-skeleton` musi istnieć)

**Pliki:**
- Stwórz: `src/components/mcraft/ImageWithSkeleton.tsx`

**Podejście:**
- `'use client'`, `useState<boolean>(false)` dla `isLoaded`
- Renderuje React fragment: `<> <div className="img-skeleton absolute inset-0 ..."> <Image fill onLoad={() => setIsLoaded(true)} ...> </>`
- Skeleton: `transition-opacity duration-500`, klasy `opacity-0 pointer-events-none` gdy `isLoaded`, `opacity-100` gdy nie
- Props interface: `src: string`, `alt: string`, `className?: string`, `style?: React.CSSProperties`
- `fill` zawsze `true` (jedyny use case w projekcie); nie eksponujemy jako prop żeby nie komplikować interfejsu

**Wzorce do naśladowania:**
- `src/components/mcraft/ImageSlot.tsx` — styl eksportu named function i props interface

**Scenariusze testowe:**
- [E2E] Skeleton widoczny zanim przeglądarka załaduje obraz (test z wolnym połączeniem lub throttled network)
- [E2E] Po załadowaniu obrazu skeleton ma `opacity: 0`; obraz widoczny
- [E2E] Brak layout shift podczas ładowania — `<div class="relative">` ma stały rozmiar przez cały czas

**Weryfikacja:**
- Komponent eksportuje `ImageWithSkeleton` i renderuje bez TypeScript errors
- Inspekcja DOM po załadowaniu: skeleton div istnieje ale ma `opacity: 0`

---

- [x] **Unit 3: Integracja w `HomeContent.tsx`**

**Cel:** Zastąpienie gołego `<Image>` przez `<ImageWithSkeleton>` dla portretu About i miniatur obszarów

**Wymagania:** R1, R3, R4, R5

**Zależności:** Unit 2

**Pliki:**
- Modyfikuj: `src/components/mcraft/HomeContent.tsx`

**Podejście:**
- Import: `import { ImageWithSkeleton } from './ImageWithSkeleton'`
- **Portret About** (linia ~457): `<Image src={portraitUrl} alt="..." fill className="object-cover object-top" />` → `<ImageWithSkeleton src={portraitUrl} alt="..." className="object-cover object-top" />`
- **Area thumbnails** (linia ~540): `<Image src={thumbUrl} alt={displayName} fill className="object-cover" />` → `<ImageWithSkeleton src={thumbUrl} alt={displayName} className="object-cover" />`
- Logika warunkowa `{portraitUrl ? ... : <ImageSlot>}` pozostaje bez zmian (R5)
- Logika warunkowa `{thumbUrl ? ... : AREA_ICONS[slug]}` pozostaje bez zmian (R5)

**Wzorce do naśladowania:**
- Istniejący import `ImageSlot` w tym samym pliku

**Scenariusze testowe:**
- [E2E] `http://localhost:3000` — sekcja "Kim jestem": skeleton widoczny przez ~200ms przy pierwszym ładowaniu (lub symulacji wolnej sieci), następnie portret załadowany
- [E2E] Sekcja "Obszary działalności": karty bez obrazów CMS nadal pokazują SVG ikony (nie skeleton)
- [E2E] Brak błędów TypeScript i hydration warnings w konsoli przeglądarki

**Weryfikacja:**
- Strona główna ładuje się bez JS errors
- Portret i miniatury obszarów mają skeleton → obraz transition

---

- [x] **Unit 4: Integracja w `SubpageLayout.tsx`**

**Cel:** Zastąpienie gołego `<Image>` przez `<ImageWithSkeleton>` dla głównego zdjęcia i galerii na podstronach

**Wymagania:** R1, R3, R4, R5

**Zależności:** Unit 2

**Pliki:**
- Modyfikuj: `src/components/mcraft/SubpageLayout.tsx`

**Podejście:**
- Import: `import { ImageWithSkeleton } from './ImageWithSkeleton'`
- **Główne zdjęcie** (linia ~80): `<Image src={mainImageUrl} alt={title} fill className="object-cover" />` → `<ImageWithSkeleton src={mainImageUrl} alt={title} className="object-cover" />`
- **Galeria** (linia ~95): `<Image src={img.url} alt={img.alt ?? ...} fill className="object-cover" />` → `<ImageWithSkeleton src={img.url} alt={img.alt ?? ...} className="object-cover" />`
- Logika warunkowa `{mainImageUrl ? ... : <ImageSlot>}` i `{galleryImages.length > 0 ? ... : <ImageSlot>}` bez zmian (R5)

**Wzorce do naśladowania:**
- Istniejący import `ImageSlot` w tym samym pliku

**Scenariusze testowe:**
- [E2E] `http://localhost:3000/nadzor-spawalniczy` bez obrazów CMS: `ImageSlot` placeholdery widoczne (nie skeleton) — R5
- [E2E] Gdy CMS ma obrazy: skeleton widoczny podczas ładowania, następnie obraz
- [E2E] Brak layout shift — `relative w-full h-[340px]` i `relative w-full h-[220px]` kontenery stabilne

**Weryfikacja:**
- Wszystkie 3 podstrony ładują się bez TypeScript errors
- `pnpm lint` przechodzi bez nowych błędów

## Wpływ systemowy

- **`SubpageLayout` server → client boundary**: Pierwszy raz `SubpageLayout` (server) zawiera client component. Next.js obsługuje to transparentnie — implementator powinien zweryfikować brak hydration warnings.
- **`HomeContent` już `'use client'`**: Bez implikacji granicy client/server.
- **CLS**: Skeleton `absolute inset-0` nie dodaje wysokości — wymiary są zawsze na rodzicu. Ryzyko CLS = 0 przy poprawnej implementacji.

## Ryzyka i zależności

- **SSR + `onLoad`**: `onLoad` nie odpala się podczas SSR. `isLoaded` startuje jako `false`, więc skeleton widoczny przy SSR — to poprawne zachowanie (użytkownik zawsze widzi skeleton lub obraz, nigdy pusty kontener).
- **Kolejność Unit 1 → 2**: Klasa `.img-skeleton` musi być w styles.css zanim komponent zostanie przetestowany wizualnie.

## Źródła i referencje

- **Dokument źródłowy:** [docs/dev-brainstorms/2026-06-18-image-skeleton-loaders-requirements.md](../dev-brainstorms/2026-06-18-image-skeleton-loaders-requirements.md)
- Wzorzec komponentu: `src/components/mcraft/ImageSlot.tsx`
- Wzorzec CSS: `src/app/(frontend)/styles.css` (`@keyframes marquee`, `@layer components`)
- Miejsca integracji: `src/components/mcraft/HomeContent.tsx`, `src/components/mcraft/SubpageLayout.tsx`
- E2E testy: `tests/e2e/frontend.e2e.spec.ts`
