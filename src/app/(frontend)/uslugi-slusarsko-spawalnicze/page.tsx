export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SubpageLayout } from '@/components/mcraft/SubpageLayout'
import { toSubpageLayoutProps, toRealizacjeProps } from '@/lib/servicePageData'
import { SITE_URL } from '@/lib/siteConfig'

export const metadata: Metadata = {
  title: 'Usługi ślusarsko-spawalnicze - cięcie, gięcie, spawanie',
  description: 'Cięcie, gięcie i spawanie TIG/MIG/MAG - usługi ślusarsko-spawalnicze dla przemysłu i rolnictwa. KCRAFT Kamil Kemuś.',
  alternates: { canonical: `${SITE_URL}/uslugi-slusarsko-spawalnicze` },
  openGraph: {
    title: 'Usługi ślusarsko-spawalnicze - cięcie, gięcie, spawanie',
    description: 'Cięcie, gięcie i spawanie TIG/MIG/MAG, konstrukcje na zamówienie, naprawy i regeneracja elementów stalowych.',
    url: `${SITE_URL}/uslugi-slusarsko-spawalnicze`,
    images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630 }],
  },
}

const FALLBACK = {
  eyebrow: 'Obszar działalności',
  title: 'Usługi ślusarsko-spawalnicze',
  description: 'Cięcie, gięcie i spawanie TIG/MIG/MAG - kompleksowe usługi ślusarsko-spawalnicze dla przemysłu i rolnictwa.',
  items: [
    { text: 'Cięcie i gięcie blach oraz profili' },
    { text: 'Spawanie TIG / MIG / MAG' },
    { text: 'Wykonanie konstrukcji na zamówienie' },
    { text: 'Naprawy i regeneracja elementów stalowych' },
    { text: 'Transport do klienta' },
  ],
}

export default async function UslugiSlusarskoSpawalniczePage() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'service-pages',
    where: { slug: { equals: 'uslugi-slusarsko-spawalnicze' } },
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
      realizacje={toRealizacjeProps(portfolioDocs, 'uslugi-slusarsko-spawalnicze')}
    />
  )
}
