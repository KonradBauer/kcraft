import type { MetadataRoute } from 'next'
import { SERVICE_LINKS } from '@/lib/serviceLinks'
import { SITE_URL } from '@/lib/siteConfig'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...SERVICE_LINKS.map(({ href }) => ({
      url: `${SITE_URL}${href}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
