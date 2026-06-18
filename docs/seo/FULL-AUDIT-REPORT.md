# MCRAFT — Pełny Audyt SEO
**Data:** 2026-06-18  
**Audytowana strona:** mcraft.pl (analiza kodu źródłowego)  
**Typ biznesu:** Lokalna usługa profesjonalna (SAB — Service Area Business)  
**Branża:** Inżynieria spawalnicza / Usługi przemysłowe / Meble premium  

---

## Wynik ogólny: SEO Health Score

| Kategoria | Waga | Wynik | Wkład |
|-----------|------|-------|-------|
| Technical SEO | 22% | 25/100 | 5.5 |
| Content Quality | 23% | 35/100 | 8.1 |
| On-Page SEO | 20% | 40/100 | 8.0 |
| Schema / Structured Data | 10% | 5/100 | 0.5 |
| Performance (CWV) | 10% | 50/100 | 5.0 |
| AI Search Readiness | 10% | 15/100 | 1.5 |
| Images | 5% | 70/100 | 3.5 |
| **RAZEM** | **100%** | | **32 / 100** |

> Strona jest na wczesnym etapie SEO. Brak fundamentów (robots, sitemap, schema, OG tags) powoduje że Google indeksuje ją "na oślep", bez żadnych sygnałów pomagających w rankingach.

---

## Top 5 Krytycznych Problemów

1. **Brak robots.txt i sitemap.xml** — Google nie wie co indeksować
2. **Brak schematu LocalBusiness JSON-LD** — zerowe sygnały dla local SEO
3. **`force-dynamic` na każdej stronie** — wysoki TTFB, słabe Core Web Vitals
4. **Brak Open Graph / Twitter Card** — linki w social media bez podglądu
5. **Cała treść homepage w `'use client'`** — Googlebot widzi puste `<body>` przy pierwszym renderze JS-disabled

---

## Top 5 Szybkich Wygranych

1. Dodać `robots.txt` i `sitemap.xml` (30 min)
2. Dodać OG meta tags w layout.tsx (1h)
3. Dodać JSON-LD `LocalBusiness + Person` (2h)
4. Zmienić `force-dynamic` na `force-static` lub revalidate na podstronach (1h)
5. Dodać `<link rel="canonical">` (30 min)

---

## 1. Technical SEO

### Crawlability

| Kontrola | Status | Szczegóły |
|----------|--------|-----------|
| robots.txt | ❌ BRAK | Żaden plik w `public/` ani `src/app/robots.ts` |
| sitemap.xml | ❌ BRAK | Żaden plik w `public/` ani `src/app/sitemap.ts` |
| Canonical tags | ❌ BRAK | Żadna strona nie deklaruje canonical URL |
| HTML lang | ✅ OK | `lang="pl"` w `<html>` |
| Redirects | ✅ OK | Next.js obsługuje standardowo |
| Hreflang | N/A | Strona jednojęzykowa |

**Wpływ robots.txt:** Bez niego Google crawluje wszystkie ścieżki łącznie z `/api/*`, `/admin/*`, co marnuje crawl budget i może indeksować niepożądane URL-e (Payload API endpoints).

### Indexability

```
/                              ✅ strona główna
/nadzor-spawalniczy            ✅ podstrona
/konstrukcje-stalowe           ✅ podstrona
/meble-premium                 ✅ podstrona
/api/*                         ⚠️  Payload API — powinno być w robots.txt Disallow
/(payload)/*                   ⚠️  Admin panel — powinno być Disallow
/my-route                      ⚠️  Testowy endpoint widoczny w kodzie
```

### Rendering

```
export const dynamic = 'force-dynamic'  ← na KAŻDEJ stronie
```

- **Problem:** Każde żądanie trafia do serwera → Payload → MongoDB. Brak cachowania.
- **Skutek:** TTFB 500ms-2000ms zamiast 50-100ms ze static generation
- **Podstrony** (`/nadzor-spawalniczy`, etc.) mogą używać `revalidate: 3600` bo content rzadko się zmienia
- **Homepage** może używać `revalidate: 300` (5 min)

### Security Headers

Brak konfiguracji w `next.config.ts`:
- ❌ `X-Frame-Options` (clickjacking)
- ❌ `X-Content-Type-Options`
- ❌ `Referrer-Policy`
- ❌ `Content-Security-Policy`
- ❌ `Permissions-Policy`

### JavaScript & SEO

`HomeContent.tsx` ma `'use client'` — cała treść homepage renderuje się po stronie klienta. Google renderuje JS, ale:
- First Crawl może nie mieć JS (Googlebot renderuje asynchronicznie)
- Googlebot może nie widzieć treści przy pierwszym fetch
- **Rozwiązanie:** Wynieść sekcje statyczne (nav, hero tekst, about, footer) do server component

---

## 2. Content Quality / E-E-A-T

### Ekspertyza (Expertise)

| Sygnał | Status |
|--------|--------|
| Tytuł zawodowy (Dr inż.) | ✅ widoczny |
| Certyfikaty (IWE, IWI, VT2, PT2) | ✅ widoczne |
| Rok doświadczenia (18 lat) | ✅ w kafelkach |
| Afiliacja (ZUGIL S.A., Politechnika Częstochowska) | ✅ w CV |
| Publikacje / badania B+R | ⚠️ tylko wzmianka, bez linków |

### Autorytet (Authority)

| Sygnał | Status |
|--------|--------|
| Linki zewnętrzne do strony (backlinks) | ❌ nie mierzalne bez crawla |
| Wzmianki o marce | ❌ nie sprawdzalne bez zewnętrznych danych |
| LinkedIn | ✅ dodany w footerze |
| Artykuły branżowe | ❌ brak |
| Referencje klientów | ❌ brak |

### Zaufanie (Trust)

| Sygnał | Status |
|--------|--------|
| NIP / REGON | ✅ w footerze |
| Adres fizyczny | ✅ ul. Żołnierzy Września 36, Wilkowiecko |
| Telefon | ✅ +48 601-488-318 |
| Email | ✅ kontakt@poczta-mcraft.pl |
| Opinie klientów | ❌ brak |
| Polityka prywatności | ❌ brak |
| Regulamin | ❌ brak |

### Thin Content

Podstrony mają każda tylko:
- Nagłówek + 1 zdanie opisu
- Lista 4 punktów (services scope)
- Galeria zdjęć (placeholder jeśli brak CMS)

To **thin content** — za mało treści by Google traktował je jako wartościowe zasoby. Minimalne kryterium: 300-500 słów unikatowej treści per strona.

---

## 3. On-Page SEO

### Tytuły i Opisy

| Strona | Title | Meta Description | Ocena |
|--------|-------|-----------------|-------|
| / | "MCRAFT - Dr inż. Michał Macherzyński" (38 znaków) | "Dr inż. Michał Macherzyński - Inżynier spawalnik, IWE / IWI / VT2 / PT2" (74 znaki) | ⚠️ Brak słów kluczowych lokalizacji |
| /nadzor-spawalniczy | "MCRAFT - Nadzór spawalniczy" (27 znaków) | "Kompleksowy nadzór..." (76 znaków) | ⚠️ Brak lokalizacji, za krótki tytuł |
| /konstrukcje-stalowe | "MCRAFT - Konstrukcje stalowe" (29 znaków) | "Projektowanie i realizacja..." (80 znaków) | ⚠️ Brak lokalizacji |
| /meble-premium | "MCRAFT - Meble premium" (23 znaki) | "Unikalne meble stalowe..." (73 znaki) | ⚠️ Brak lokalizacji |

**Problemy:**
- Brak słowa kluczowego lokalizacji (Częstochowa/Śląsk/Wilkowiecko) w żadnym tytule
- Brak `og:title`, `og:description`, `og:image` — linki na social bez preview
- Brak `og:url` i `og:type`
- Brak Twitter Card

### Struktura Nagłówków

**Homepage (`HomeContent.tsx`):**
```
<h1> Michał Macherzyński               ← OK, 1 H1
<h2> Dr inż. Michał Macherzyński       ← About section (zduplikowana treść)
<h2> Skontaktuj się                    ← Footer
(brak H2 dla sekcji Obszary)
```

**Podstrony:**
```
<h1> [tytuł podstrony]                 ← OK
<h2> Zakres                            ← OK
<h2> Realizacje                        ← OK
```

**Problemy:**
- Sekcja "Obszary działalności" na homepage nie ma H2
- H1 na homepage zawiera samo imię bez słów kluczowych

### Open Graph (brak)

Brakuje w `layout.tsx`:
```typescript
// Brakuje:
openGraph: {
  title: '...',
  description: '...',
  url: 'https://mcraft.pl',
  siteName: 'MCRAFT',
  images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  locale: 'pl_PL',
  type: 'website',
},
twitter: {
  card: 'summary_large_image',
  title: '...',
  description: '...',
  images: ['...'],
},
```

---

## 4. Schema / Structured Data

### Aktualny stan

❌ **Brak jakiegokolwiek JSON-LD** na stronie.

### Brakujące schematy (priorytet)

**1. LocalBusiness + ProfessionalService** (KRYTYCZNY dla local SEO)
```json
{
  "@type": ["LocalBusiness", "ProfessionalService"],
  "name": "MCRAFT Michał Macherzyński",
  "description": "Inżynier spawalnik, nadzór spawalniczy, konstrukcje stalowe",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "ul. Żołnierzy Września 36",
    "addressLocality": "Wilkowiecko",
    "postalCode": "42-152",
    "addressCountry": "PL"
  },
  "telephone": "+48601488318",
  "email": "kontakt@poczta-mcraft.pl",
  "url": "https://mcraft.pl",
  "taxID": "5742046939",
  "sameAs": ["https://www.linkedin.com/in/..."]
}
```

**2. Person** (WYSOKI — E-E-A-T)
```json
{
  "@type": "Person",
  "name": "Michał Macherzyński",
  "jobTitle": "Inżynier spawalnik",
  "honorificPrefix": "Dr inż.",
  "hasCredential": ["IWE", "IWI", "VT2", "PT2"],
  "affiliation": "ZUGIL S.A."
}
```

**3. BreadcrumbList** na podstronach  
**4. Service** per każda usługa (nadzor, konstrukcje, meble)

---

## 5. Performance (Core Web Vitals — szacunki)

### Bottlenecks

| Problem | Wpływ na CWV | Szacunkowy koszt |
|---------|-------------|-----------------|
| `force-dynamic` — brak cachowania | TTFB +500-2000ms | LCP degradacja |
| 3 Google Fonts (Montserrat, Barlow, Great Vibes) | Blokowanie renderowania | LCP +100-300ms |
| `HomeContent` w `'use client'` — hydration | TBT wzrost | INP degradacja |
| Google Maps iframe w footerze | Heavy resource | CLS/LCP potencjalnie |
| Hero `<Image fill>` bez `sizes` prop | 100vw na każdym breakpoincie | Nadmiarowy payload |

### Rekomendacje Performance

1. **`sizes` prop na hero background:**
   ```tsx
   <Image fill sizes="100vw" ... />
   ```

2. **Revalidation zamiast force-dynamic:**
   ```typescript
   export const revalidate = 3600 // 1h dla podstron
   export const revalidate = 300  // 5min dla homepage
   ```

3. **Lazy-load Google Maps:** Opóźnić ładowanie iframe do momentu gdy użytkownik scrolluje do footera (Intersection Observer lub `loading="lazy"` — już jest ✓, ale iframe dalej ładuje się automatycznie)

4. **Preconnect do Google Fonts** (Next.js robi to automatycznie, ale warto potwierdzić)

---

## 6. Obrazy

| Kontrola | Status |
|----------|--------|
| Alt text — hero bg | ✅ `alt=""` (dekoracyjny — poprawnie) |
| Alt text — foto Michała | ✅ `alt="Dr inż. Michał Macherzyński"` |
| Alt text — portret | ✅ `alt="Dr inż. Michał Macherzyński"` |
| Alt text — galeria | ⚠️ Fallback: `"Realizacja 1"` — zbyt generyczny |
| Alt text — area thumbnails | ✅ Używa displayName z CMS |
| `next/image` | ✅ Wszystkie obrazy przez next/image |
| `priority` na hero | ✅ Poprawnie |
| `sizes` prop | ❌ Brak na hero bg fill image |
| Skeleton loadery | ✅ Dodane |
| Format (WebP) | ✅ next/image automatycznie konwertuje |

---

## 7. Local SEO

**Typ biznesu:** SAB (Service Area Business) — firma usługowa świadcząca usługi w terenie

| Sygnał | Status |
|--------|--------|
| NAP w footerze | ✅ Pełne (Nazwa, Adres, Telefon) |
| NAP spójność | ✅ Jednolite w obu footerach |
| Google Maps embed | ✅ Osadzony w footerze |
| LocalBusiness schema | ❌ BRAK |
| Google Business Profile | ❌ Brak wzmianki / integracji |
| Recenzje klientów | ❌ Brak |
| Obszar obsługi (geo) | ❌ Nie zdefiniowany w treści ani schema |
| Słowa kluczowe lokalne w tytułach | ❌ Brak ("spawalnik Częstochowa", etc.) |

---

## 8. AI Search Readiness (GEO)

| Kontrola | Status |
|----------|--------|
| llms.txt | ❌ BRAK |
| Robots.txt dostęp dla AI crawlerów | ❌ Brak robots.txt |
| Strukturalne fakty (FAQ) | ❌ Brak |
| Cytowalna treść | ⚠️ Treść w `'use client'` — słaba dla LLM scrapera |
| Brand mentions | ⚠️ LinkedIn obecny |
| Atrybucja autorska | ⚠️ Imię + tytuł widoczne ale nie w dedykowanej sekcji |
| Dane referencyjne (wiek firmy, branża) | ❌ Brak usystematyzowania |

---

## Podsumowanie Techniczne

```
Strony:          4 (/ + 3 podstrony)
Robots.txt:      BRAK
Sitemap:         BRAK
Schema:          BRAK
OG Tags:         BRAK
Canonical:       BRAK
force-dynamic:   WSZYSTKIE strony
Security headers: BRAK
lang="pl":       OK
next/image:      OK
Skeleton loaders: OK (dodane)
LinkedIn:         OK (dodane)
Mobile menu:      OK (dodane)
```
