---
date: 2026-07-03
topic: rebrand-kcraft
---

# Rebranding strony z MCRAFT na kcraft (Kamil Kemuś)

## Problem
Projekt jest kopią strony MCRAFT (Dr inż. Michał Macherzyński, nadzór spawalniczy/konstrukcje stalowe/meble premium). Ma zostać przerobiony na stronę dla **kcraft - Kamil Kemuś**, firmy zajmującej się spawaniem i ślusarstwem dla przemysłu oraz rolnictwa. Struktura strony (Hero → O firmie → Obszary działalności → Stopka, 3 podstrony usług, portfolio realizacji) zostaje bez zmian - zmienia się marka, dane kontaktowe, teksty i obrazy.

Rzeczywiste treści dla obszarów działalności (opisy usług, portfolio) użytkownik uzupełni samodzielnie w CMS po zakończeniu tego zadania - poza tym zadaniem jest podmiana wszystkiego, co dziś jest zaszyte na sztywno w kodzie (nazwa marki, dane osoby/firmy, SEO, schema.org, logo, stopka).

## Wymagania

- R1. Cała widoczna dla użytkownika i systemowa marka na stronie (nawigacja, tytuł/opis strony w wynikach wyszukiwania, dane strukturalne dla wyszukiwarek, panel admina) odnosi się do kcraft / Kamila Kemusia, nie do MCRAFT / Michała Macherzyńskiego.
- R2. Hero: eyebrow = "Kamil Kemuś", nagłówek główny (H1) = slogan "Profesjonalne Spawanie i Ślusarstwo dla Przemysłu oraz Rolnictwa", podtytuł = opis usług (maszyny doposażające, sprzęt rolniczy, gwarancja trwałości, transport do klienta / zlecenia specyficzne).
- R3. Sekcja "Kim jestem" zmienia charakter z osobistej biografii inżyniera na przedstawienie firmy/właściciela (Kamil Kemuś) - domyślne (fallback) teksty i nagłówki dopasowane do nowej branży, do czasu aż użytkownik wpisze docelową treść w CMS. Fallback tekst zawiera wplecione 3 punkty "Dlaczego my" (Indywidualne projekty, Materiały najwyższej jakości, Terminowość i bezpieczeństwo) jako fragment paragrafu - bez zmian strukturalnych w komponencie.
- R4. Trzy kafelki obszarów działalności odpowiadają nowym usługom, każdy z osobną podstroną:
  - Maszyny produkcyjne (budowa, doposażanie, modernizacja linii i stanowisk pracy)
  - Maszyny rolnicze (naprawa, budowa, wzmacnianie konstrukcji, serwis lemieszy/ram/osprzętu)
  - Usługi ślusarsko-spawalnicze (cięcie, gięcie, spawanie TIG/MIG/MAG)
- R5. Modale "CV" (uprawnienia/certyfikaty) i "Bio" (historia zawodowa) zostają zachowane strukturalnie - docelową treść (uprawnienia spawalnicze Kamila, historia firmy) użytkownik uzupełni później w CMS.
- R6. Stopka zawiera nowe dane kontaktowe: adres 42-151 Waleńczów, ul. Zakrzewska 13; telefon 662050419; nazwa firmy/właściciela kcraft/Kamil Kemuś. Mapka dojazdu (Google Maps) wskazuje nowy adres.
- R7. Dane strukturalne (schema.org JSON-LD), meta tagi SEO, sitemap, robots.txt i llms.txt odzwierciedlają nową markę i branżę (spawanie/ślusarstwo dla przemysłu i rolnictwa zamiast nadzoru spawalniczego).
- R8. Logo/wordmark w nawigacji i panelu admina prezentuje "kcraft" zamiast "MCRAFT".
- R9. Miejsca na zdjęcia (tło hero, portret w sekcji "o firmie") zostają strukturalnie bez zmian - tylko podmiana źródła obrazu na nowe (dostarczy użytkownik).

## Kryteria sukcesu
- Żadne user-facing miejsce na stronie (treść, meta tagi, schema.org) nie zawiera już "MCRAFT" ani "Michał Macherzyński".
- Strona buduje się i działa (dev/build) bez błędów po zmianach.
- Trzy podstrony usług istnieją pod adresami URL dopasowanymi do nowych nazw usług i są dostępne z nawigacji.
- Stopka pokazuje poprawny adres i telefon kcraft/Kamila Kemusia, mapka wskazuje właściwą lokalizację.

## Granice scope'u
- Nie zmieniamy layoutu/struktury sekcji (Hero → O firmie → Obszary → Stopka) ani liczby/typu podstron usług (nadal 3).
- Nie zmieniamy palety kolorów / designu wizualnego strony w ramach tego zadania (założenie - do potwierdzenia, jeśli user zechce inny kolorystyczny kierunek).
- Docelowe treści i zdjęcia dla obszarów działalności (opisy usług na podstronach, portfolio realizacji) użytkownik dodaje samodzielnie przez CMS - poza scope tego zadania.
- Nie tworzymy nowego typu sekcji/treści w CMS w ramach tego zadania (patrz otwarte pytanie o "Dlaczego my").

## Kluczowe decyzje
- Hero H1 = slogan firmowy (nie imię i nazwisko); imię "Kamil Kemuś" jako mniejszy tekst (eyebrow) nad sloganem - zamiast dotychczasowego wzoru "imię i nazwisko jako H1".
- Modale CV/Bio zostają zachowane strukturalnie mimo zmiany branży - user uzupełni treść później.
- Docelowa domena: **kcraft.com.pl**.
- "Dlaczego my" (3 punkty) wpleciony jako fragment tekstu w sekcji "O firmie" - bez nowego typu treści/komponentu.
- Logo: tekstowy wordmark "KCRAFT" w tym samym stylu co obecny "MCRAFT" - bez nowej grafiki.
- E-mail, NIP/REGON, social media - brak danych na razie; w kodzie zostają placeholdery (widoczne jako do uzupełnienia), user wpisze docelowe dane samodzielnie później.

## Otwarte pytania

### Odroczone do planowania
- [Dotyczy R6][Techniczne] Format placeholderów dla brakujących danych (e-mail, NIP/REGON, social media) - jak oznaczyć w kodzie/CMS, żeby user łatwo znalazł co uzupełnić.
- [Dotyczy R4][Techniczne] Nowe adresy URL (slugi) dla 3 podstron usług - propozycja do ustalenia podczas planowania.
- [Dotyczy R1][Techniczne] Czy przenosić nazwy folderów/komponentów (`src/components/mcraft/*`) na `kcraft`, czy zostawić wewnętrzne nazewnictwo bez zmian (nie wpływa na użytkownika strony).
- [Dotyczy R9][Wymaga researchu] Docelowy format/wymiary nowych zdjęć (hero, portret) zgodne z obecnym layoutem.

## Następne kroki
→ Wznów /dev-brainstorm, żeby rozstrzygnąć otwarte pytania blokujące, albo przekaż znane odpowiedzi teraz.
