import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/siteConfig'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/maszyny-produkcyjne`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/maszyny-rolnicze`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/uslugi-slusarsko-spawalnicze`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },

  ]
}
