export interface ServiceLink {
  href: string
  slug: string
  label: string
}

/** Jedno źródło prawdy dla listy podstron usługowych (nav, sitemap, walidacja slugów). */
export const SERVICE_LINKS: ServiceLink[] = [
  { href: '/doposazenie-linii-produkcyjnej', slug: 'doposazenie-linii-produkcyjnej', label: 'Doposażenie linii produkcyjnej' },
  { href: '/maszyny-rolnicze', slug: 'maszyny-rolnicze', label: 'Maszyny rolnicze' },
  { href: '/uslugi-slusarsko-spawalnicze', slug: 'uslugi-slusarsko-spawalnicze', label: 'Usługi ślusarsko-spawalnicze' },
  { href: '/wyposazenie-loftowe', slug: 'wyposazenie-loftowe', label: 'Wyposażenie loftowe' },
]

export const SERVICE_SLUGS = SERVICE_LINKS.map((link) => link.slug)
