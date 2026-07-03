export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SubpageLayout } from '@/components/mcraft/SubpageLayout'
import { toSubpageLayoutProps, toRealizacjeProps } from '@/lib/servicePageData'
import { SITE_URL } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Maszyny produkcyjne - budowa i modernizacja',
  description: 'Budowa, doposażanie i modernizacja maszyn produkcyjnych oraz stanowisk pracy - KCRAFT Kamil Kemuś.',
  alternates: { canonical: `${SITE_URL}/maszyny-produkcyjne` },
  openGraph: {
    title: 'Maszyny produkcyjne - budowa i modernizacja',
    description: 'Budowa, doposażanie i modernizacja linii oraz stanowisk pracy dla przemysłu.',
    url: `${SITE_URL}/maszyny-produkcyjne`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
}

const FALLBACK = {
  eyebrow: 'Obszar działalności',
  title: 'Maszyny produkcyjne',
  description: 'Budowa, doposażanie i modernizacja maszyn oraz stanowisk pracy dla przemysłu - z dbałością o jakość i terminowość.',
  items: [
    { text: 'Budowa maszyn produkcyjnych' },
    { text: 'Doposażanie i modernizacja linii produkcyjnych' },
    { text: 'Modernizacja stanowisk pracy' },
    { text: 'Automatyzacja procesów produkcyjnych' },
    { text: 'Prefabrykacja i montaż na miejscu' },
  ],
}

export default async function MaszynyProdukcyjnePage() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'service-pages',
    where: { slug: { equals: 'maszyny-produkcyjne' } },
    depth: 1,
    limit: 1,
  })

  const servicePage = docs[0]
  const portfolioDocs = servicePage
    ? (
        await payload.find({
          collection: 'portfolio-projects',
          where: { servicePage: { equals: servicePage.id } },
          sort: 'order',
          depth: 1,
          limit: 100,
        })
      ).docs
    : []

  return (
    <SubpageLayout
      {...toSubpageLayoutProps(servicePage, FALLBACK)}
      realizacje={toRealizacjeProps(portfolioDocs, 'maszyny-produkcyjne')}
    />
  )
}
