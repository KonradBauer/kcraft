export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SubpageLayout } from '@/components/kcraft/SubpageLayout'
import { toSubpageLayoutProps, toRealizacjeProps } from '@/lib/servicePageData'
import { SITE_URL } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Wyposażenie loftowe - meble i konstrukcje ze stali',
  description: 'Meble loftowe i wyposażenie industrialne na wymiar - stoły, regały, balustrady i konstrukcje stalowe - KCRAFT Kamil Kemuś.',
  alternates: { canonical: `${SITE_URL}/wyposazenie-loftowe` },
  openGraph: {
    title: 'Wyposażenie loftowe - meble i konstrukcje ze stali',
    description: 'Meble loftowe i wyposażenie industrialne na wymiar - stoły, regały, balustrady i konstrukcje stalowe.',
    url: `${SITE_URL}/wyposazenie-loftowe`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
}

const FALLBACK = {
  eyebrow: 'Obszar działalności',
  title: 'Wyposażenie loftowe',
  description: 'Meble i wyposażenie w stylu industrialnym na wymiar - solidne konstrukcje stalowe łączone z drewnem, dopasowane do wnętrza.',
  items: [
    { text: 'Meble loftowe na wymiar - stoły, stoliki, regały' },
    { text: 'Balustrady i schody w stylu industrialnym' },
    { text: 'Zabudowy i konstrukcje stalowe do wnętrz' },
    { text: 'Elementy dekoracyjne ze stali' },
    { text: 'Łączenie stali z drewnem' },
  ],
}

export default async function WyposazenieLoftowePage() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'service-pages',
    where: { slug: { equals: 'wyposazenie-loftowe' } },
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
      realizacje={toRealizacjeProps(portfolioDocs, 'wyposazenie-loftowe')}
    />
  )
}
