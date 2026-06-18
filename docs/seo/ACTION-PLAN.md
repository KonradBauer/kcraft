# MCRAFT — Plan Działań SEO
**Data:** 2026-06-18  
**SEO Health Score:** 32/100  
**Cel 90-dniowy:** 60/100  

---

## KRYTYCZNE — Napraw natychmiast

### K1. Dodaj robots.txt
**Plik:** `src/app/robots.ts`  
**Wysiłek:** 30 min  
**Wpływ:** Blokuje indeksowanie /api/ i /admin/, oszczędza crawl budget

```typescript
import type { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/(payload)/', '/my-route'] },
    ],
    sitemap: 'https://mcraft.pl/sitemap.xml',
  }
}
```

### K2. Dodaj sitemap.xml
**Plik:** `src/app/sitemap.ts`  
**Wysiłek:** 30 min  
**Wpływ:** Google odkrywa i indeksuje wszystkie strony

```typescript
import type { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://mcraft.pl', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://mcraft.pl/nadzor-spawalniczy', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://mcraft.pl/konstrukcje-stalowe', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://mcraft.pl/meble-premium', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]
}
```

### K3. Dodaj JSON-LD LocalBusiness + Person
**Plik:** `src/app/(frontend)/layout.tsx` lub nowy komponent  
**Wysiłek:** 2h  
**Wpływ:** Kluczowy dla local SEO, rich results w Google, E-E-A-T

Wstrzyknąć przez `<Script type="application/ld+json">` lub Next.js metadata.

### K4. Open Graph + Twitter Card
**Plik:** `src/app/(frontend)/layout.tsx`  
**Wysiłek:** 1h  
**Wpływ:** Każdy udostępniony link w social media bez podglądu = utrata ruchu

Dodać do `export const metadata`:
```typescript
openGraph: {
  title: 'MCRAFT - Dr inż. Michał Macherzyński | Inżynier spawalnik',
  description: 'Nadzór spawalniczy, konstrukcje stalowe, meble premium. IWE/IWI/VT2/PT2. Wilkowiecko, woj. śląskie.',
  url: 'https://mcraft.pl',
  siteName: 'MCRAFT',
  locale: 'pl_PL',
  type: 'website',
  images: [{ url: 'https://mcraft.pl/og-image.jpg', width: 1200, height: 630 }],
},
twitter: { card: 'summary_large_image' },
```

### K5. Canonical URL na każdej stronie
**Wysiłek:** 30 min  
**Wpływ:** Zapobiega duplikatom treści (HTTP vs HTTPS, www vs non-www)

```typescript
// layout.tsx
metadataBase: new URL('https://mcraft.pl'),
alternates: { canonical: '/' },

// Podstrony — dodać alternates: { canonical: '/nadzor-spawalniczy' }
```

---

## WYSOKIE — Napraw w ciągu 1 tygodnia

### W1. Zmień force-dynamic na revalidate
**Wysiłek:** 1h  
**Wpływ:** TTFB 500ms → 50ms, poprawa LCP, mniej obciążenia serwera

```typescript
// Podstrony (treść rzadko się zmienia):
export const revalidate = 3600

// Homepage:
export const revalidate = 300
```

Usunąć `export const dynamic = 'force-dynamic'` z każdej strony.

### W2. Popraw tytuły z lokalizacją
**Wysiłek:** 30 min  
**Wpływ:** Rankowanie na frazy lokalne

```
Obecne:  "MCRAFT - Nadzór spawalniczy"
Zmienić: "Nadzór spawalniczy - spawalnik IWE/IWI | MCRAFT Wilkowiecko/Śląsk"

Obecne:  "MCRAFT - Dr inż. Michał Macherzyński"  
Zmienić: "Inżynier spawalnik Dr inż. Michał Macherzyński | MCRAFT Śląsk"
```

### W3. Dodaj sizes prop do hero Image
**Plik:** `src/components/mcraft/HomeContent.tsx`  
**Wysiłek:** 5 min  
**Wpływ:** Przeglądarka pobiera właściwy rozmiar obrazu

```tsx
<Image fill sizes="100vw" ... />
```

### W4. Security headers w next.config.ts
**Wysiłek:** 1h  
**Wpływ:** Bezpieczeństwo + sygnał zaufania dla Google

```typescript
headers: async () => [
  {
    source: '/(.*)',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ],
  },
],
```

### W5. Sekcja Obszary — dodaj H2
**Plik:** `src/components/mcraft/HomeContent.tsx`  
**Wysiłek:** 5 min  

Sekcja "Obszary działalności" nie ma nagłówka H2 — naprawić strukturę nagłówków.

---

## ŚREDNIE — Napraw w ciągu miesiąca

### S1. OG Image — utwórz grafikę 1200×630
**Wysiłek:** 2h (design)  
**Wpływ:** Profesjonalny podgląd na social media

Można użyć `next/og` do generowania dynamicznego OG image.

### S2. FAQ section na homepage i podstronach
**Wysiłek:** 3h  
**Wpływ:** Featured snippets, E-E-A-T, AI citability

Przykładowe pytania:
- "Czym jest nadzór spawalniczy?"
- "Jakie certyfikaty ma inżynier spawalnik IWE?"
- "Ile kosztuje nadzór spawalniczy?"
- "Jakie normy obowiązują przy spawaniu konstrukcji stalowych?"

Dodać `FAQPage` schema JSON-LD.

### S3. Rozbuduj treść podstron (min. 300 słów)
**Wysiłek:** 4h per podstrona  
**Wpływ:** Google traktuje thin content jako niskiej jakości

Każda podstrona powinna zawierać:
- Opis procesu usługi (co, jak, kiedy)
- Normy i standardy (PN-EN, ISO)
- Korzyści dla klienta
- Przykłady realizacji (case studies)

### S4. Dodaj politykę prywatności / RODO
**Wysiłek:** 2h  
**Wpływ:** Wymóg prawny + sygnał zaufania

### S5. Dodaj llms.txt
**Plik:** `public/llms.txt`  
**Wysiłek:** 30 min  
**Wpływ:** AI crawlers (ChatGPT, Perplexity) lepiej rozumieją stronę

```
# MCRAFT
> Dr inż. Michał Macherzyński - Inżynier spawalnik IWE/IWI/VT2/PT2

## Usługi
- Nadzór spawalniczy: /nadzor-spawalniczy
- Konstrukcje stalowe: /konstrukcje-stalowe
- Meble premium: /meble-premium

## Kontakt
- Tel: +48 601-488-318
- Email: kontakt@poczta-mcraft.pl
- Adres: ul. Żołnierzy Września 36, 42-152 Wilkowiecko
```

### S6. BreadcrumbList schema na podstronach
**Wysiłek:** 1h  
**Wpływ:** Breadcrumbs w wynikach Google

### S7. Alt text galerii — opisowy
**Wysiłek:** Zależy od CMS (edycja treści)  
**Wpływ:** Dostępność + Google Images

Zmienić fallback z `"Realizacja 1"` na opisowe alty: `"Spawanie konstrukcji stalowej - MCRAFT"`.

---

## NISKIE — Backlog

### N1. Google Business Profile
Założyć/zoptymalizować GBP dla MCRAFT — bezpłatne, kluczowe dla local SEO.

### N2. Recenzje klientów
Dodać sekcję z opiniami (Google Reviews widget lub własna implementacja).

### N3. Strona z referencjami / portfolio
Osobna strona `/realizacje` z opisanymi projektami — backlink magnet.

### N4. Blog branżowy
Artykuły o spawalnictwie = długi ogon zapytań + E-E-A-T + AI citability.

### N5. Prefetch/preconnect dla zewnętrznych zasobów
Mapę Google i LinkedIn można opóźnić lub preconnect.

---

## Harmonogram

| Tydzień | Działania |
|---------|-----------|
| 1 | K1 robots.txt, K2 sitemap, K4 OG tags, K5 canonical |
| 2 | K3 JSON-LD schema, W1 revalidate, W2 tytuły |
| 3 | W3 sizes, W4 security headers, W5 H2 sekcja Obszary |
| 4 | S1 OG image, S4 polityka prywatności, S5 llms.txt |
| 5-8 | S2 FAQ, S3 treść podstron, S6 breadcrumbs |
| 9-12 | N1 GBP, N2 recenzje, N3 portfolio |

---

## Spodziewane efekty po 90 dniach

| Metryka | Teraz | Po 90 dniach |
|---------|-------|--------------|
| SEO Health Score | 32/100 | 60-65/100 |
| Indeksacja wszystkich stron | ? | 100% |
| Local Pack widoczność | 0 | Możliwa |
| TTFB | ~500-2000ms | ~50-150ms |
| Rich Results (schema) | 0 | LocalBusiness, FAQ |
| AI Search visibility | Brak | Podstawowa |
