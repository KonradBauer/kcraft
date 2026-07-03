export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SubpageLayout } from '@/components/mcraft/SubpageLayout'
import { toSubpageLayoutProps, toRealizacjeProps } from '@/lib/servicePageData'
import { SITE_URL } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Maszyny rolnicze - naprawa i budowa',
  description: 'Naprawa, budowa i wzmacnianie konstrukcji maszyn rolniczych, serwis lemieszy, ram i osprzętu - KCRAFT Kamil Kemuś.',
  alternates: { canonical: `${SITE_URL}/maszyny-rolnicze` },
  openGraph: {
    title: 'Maszyny rolnicze - naprawa i budowa',
    description: 'Naprawa, budowa i wzmacnianie konstrukcji maszyn rolniczych, serwis lemieszy, ram i osprzętu.',
    url: `${SITE_URL}/maszyny-rolnicze`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
}

const FALLBACK = {
  eyebrow: 'Obszar działalności',
  title: 'Maszyny rolnicze',
  description: 'Naprawa, budowa i wzmacnianie konstrukcji maszyn rolniczych - serwis lemieszy, ram i osprzętu dla gospodarstw i firm rolniczych.',
  items: [
    { text: 'Naprawa maszyn rolniczych' },
    { text: 'Budowa maszyn i osprzętu rolniczego' },
    { text: 'Wzmacnianie konstrukcji' },
    { text: 'Serwis lemieszy, ram i osprzętu' },
    { text: 'Spawanie i regeneracja elementów zużytych' },
  ],
}

export default async function MaszynyRolniczePage() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'service-pages',
    where: { slug: { equals: 'maszyny-rolnicze' } },
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
      realizacje={toRealizacjeProps(portfolioDocs, 'maszyny-rolnicze')}
    />
  )
}
