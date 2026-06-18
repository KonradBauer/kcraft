---
date: 2026-06-18
topic: mobile-nav-hero
---

# Mobile menu i hero na urządzeniach mobilnych

## Problem

Na urządzeniach mobilnych (`≤980px`) linki nawigacyjne są ukryte bez żadnej alternatywy — użytkownik nie może przemieszczać się po stronie. Dodatkowo zdjęcie Michała (`≤560px`) jest całkowicie ukryte, przez co hero wygląda pusto i traci element osobowy będący kluczowy dla brandu.

## Wymagania

### Mobilne menu

- R1. Na `≤980px` zamiast ukrytych linków widoczna jest ikona hamburgera (☰) po prawej stronie nava.
- R2. Kliknięcie hamburgera otwiera drawer wysuwający się z prawej strony ekranu z linkami nawigacji.
- R3. Drawer ma tło `ink` (#0e1a17), linki w stylu spójnym z designem (Montserrat, uppercase, teal accent).
- R4. Drawer zamyka się: kliknięcie X, kliknięcie tła (backdrop), kliknięcie linku, klawisz ESC.
- R5. Podczas otwartego drawera `body` nie scrolluje (overflow hidden).
- R6. Menu działa identycznie na stronie głównej i na 3 podstronach (Nadzór / Konstrukcje / Meble).

### Zdjęcie Michała na mobile

- R7. Na `≤560px` zdjęcie Michała wyświetla się jako tło sekcji hero (za tekstem), nigdy nie jest ukryte.
- R8. Gradient `ink` z lewej strony jest silniejszy na mobile (np. krycie do 98%) zapewniając czytelność tekstu nagłówka i przycisku.

## Kryteria sukcesu

- Użytkownik na telefonie może dotrzeć do każdej sekcji strony przez menu.
- Tekst hero na telefonie jest w pełni czytelny gdy zdjęcie jest w tle.
- Drawer otwiera/zamyka się płynnie, bez błędów interakcji.
- Podstrony mają ten sam drawer co strona główna.

## Granice scope'u

- Nie zmieniamy layoutu nawigacji na `>980px`.
- Nie zmieniamy treści linków nawigacyjnych.
- Nie dodajemy animacji entrance do zdjęcia (tylko gradient fix).
- Nie dotykamy sekcji About, footer ani modali.

## Kluczowe decyzje

- **Współdzielony komponent `MobileNav`**: Drawer jako osobny komponent client — do użycia zarówno w `HomeContent.tsx` (już client) jak i `SubpageLayout.tsx` (server). Unika duplikacji logiki hamburgera/stanu.
- **Tło hero mobile**: Zmiana `max-[560px]:hidden` → zawsze widoczne; wzmocnienie gradientu lewego na mobile przez dodatkową warstwę lub zmianę stop-value gradientu.

## Następne kroki

→ `/dev-plan` do planowania technicznego implementacji
