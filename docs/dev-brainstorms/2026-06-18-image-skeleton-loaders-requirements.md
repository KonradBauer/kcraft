---
date: 2026-06-18
topic: image-skeleton-loaders
---

# Skeleton loadery i lazy loading obrazów

## Problem

Obrazy ładują się bez żadnego feedbacku wizualnego — "wskakują" do layoutu po załadowaniu. Next.js `Image` już obsługuje lazy loading przez Intersection Observer, więc główna praca to skeleton loadery zapewniające ciągłość UX podczas oczekiwania na obraz.

## Wymagania

- R1. Każdy obraz poza hero (`priority`) pokazuje skeleton podczas ładowania.
- R2. Skeleton to ciemny (#1b2925) kontener z subtelną falą shimmer `rgba(255,255,255,0.06)`.
- R3. Po załadowaniu obrazu skeleton zanika (opacity transition), obraz pojawia się płynnie.
- R4. Skeleton ma dokładnie te same wymiary co docelowy obraz (brak layout shift).
- R5. `ImageSlot` (placeholder gdy brak zdjęcia w CMS) pozostaje bez zmian — nie jest skeletonem.

## Zakres obrazów

| Miejsce | Komponent | Priorytet |
|---------|-----------|-----------|
| Portret "Kim jestem" | `HomeContent` (about section) | tak |
| Miniatury kart obszarów (3 szt.) | `HomeContent` (areas section) | tak |
| Główne zdjęcie podstrony | `SubpageLayout` | tak |
| Galeria podstrony (n zdjęć) | `SubpageLayout` | tak |
| Hero background + osoba | `HomeContent` | nie (priority) |

## Kryteria sukcesu

- Żaden obraz nie "wskakuje" — zawsze widać skeleton lub obraz, nigdy pusty kontener.
- Brak layout shift (CLS = 0) dla szkieletowanych obrazów.
- Shimmer jest subtelny, nie odrywa uwagi od treści.

## Granice scope'u

- Nie zmieniamy mechanizmu lazy loading (Next.js defaults są wystarczające).
- Nie dodajemy blur placeholder (`blurDataURL`) — wymaga Sharp pipeline per image.
- Nie skeleton dla hero images (mają `priority`, i tak ładują się pierwsze).
- Nie zmieniamy `ImageSlot` — to placeholder dla "brak zdjęcia", nie stan ładowania.

## Kluczowe decyzje

- **Nowy komponent `ImageWithSkeleton`**: wrapper client component z `onLoad` state, renderuje skeleton + `<Image>` nakładką. Unika duplikacji logiki w `HomeContent` i `SubpageLayout`.
- **Ink shimmer**: `#1b2925` bg + `rgba(255,255,255,0.06)` wave — spójny z dark klimatem strony i istniejącym `ImageSlot`.
- **CSS keyframes w styles.css**: animacja shimmer jako globalna klasa (np. `.skeleton-shimmer`), nie inline styles.

## Następne kroki

→ `/dev-plan` do planowania technicznego implementacji
