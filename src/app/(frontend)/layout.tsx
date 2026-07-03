import type { Metadata } from 'next'
import { Barlow, Great_Vibes, Montserrat } from 'next/font/google'
import Script from 'next/script'
import React from 'react'
import { PageLoader } from '@/components/mcraft/PageLoader'
import { BRAND_NAME, CONTACT, LEGAL_NAME, OWNER_NAME, SITE_URL } from '@/lib/siteConfig'
import './styles.css'

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700'],
})

const barlow = Barlow({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  variable: '--font-great-vibes',
  display: 'swap',
  weight: ['400'],
})

const siteUrl = SITE_URL
const ogImage = `${siteUrl}/og-image.png`

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `Spawanie i ślusarstwo dla przemysłu i rolnictwa | ${BRAND_NAME}`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: `${OWNER_NAME} - profesjonalne spawanie i ślusarstwo dla przemysłu oraz rolnictwa. Maszyny produkcyjne, maszyny rolnicze, usługi ślusarsko-spawalnicze. ${CONTACT.address.city}, woj. ${CONTACT.address.region}.`,
  keywords: ['spawanie', 'ślusarstwo', 'maszyny produkcyjne', 'maszyny rolnicze', 'spawanie TIG', 'spawanie MIG', 'spawanie MAG', BRAND_NAME],
  authors: [{ name: OWNER_NAME, url: siteUrl }],
  creator: OWNER_NAME,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  alternates: { canonical: siteUrl },
  icons: { icon: '/favicon.png' },
  openGraph: {
    title: `Spawanie i ślusarstwo dla przemysłu i rolnictwa | ${BRAND_NAME}`,
    description: `Maszyny produkcyjne, maszyny rolnicze, usługi ślusarsko-spawalnicze. ${CONTACT.address.city}, woj. ${CONTACT.address.region}.`,
    url: siteUrl,
    siteName: BRAND_NAME,
    locale: 'pl_PL',
    type: 'website',
    images: [{ url: ogImage, width: 1200, height: 630, alt: `${BRAND_NAME} - ${OWNER_NAME}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `Spawanie i ślusarstwo dla przemysłu i rolnictwa | ${BRAND_NAME}`,
    description: 'Maszyny produkcyjne, maszyny rolnicze, usługi ślusarsko-spawalnicze.',
    images: [ogImage],
  },
}

const schemaOrg = JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['LocalBusiness', 'ProfessionalService'],
      '@id': `${siteUrl}/#business`,
      name: LEGAL_NAME,
      legalName: LEGAL_NAME,
      description: `Spawanie i ślusarstwo dla przemysłu oraz rolnictwa - maszyny produkcyjne, maszyny rolnicze, usługi ślusarsko-spawalnicze. ${OWNER_NAME}.`,
      url: siteUrl,
      telephone: CONTACT.phone,
      email: CONTACT.email,
      address: {
        '@type': 'PostalAddress',
        streetAddress: CONTACT.address.street,
        addressLocality: CONTACT.address.city,
        postalCode: CONTACT.address.postalCode,
        addressCountry: CONTACT.address.country,
        addressRegion: CONTACT.address.region,
      },
      geo: { '@type': 'GeoCoordinates', latitude: 50.85, longitude: 18.93 },
      areaServed: { '@type': 'Country', name: 'PL' },
      founder: { '@id': `${siteUrl}/#person` },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Usługi spawalnicze i ślusarskie',
        itemListElement: [
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Maszyny produkcyjne', url: `${siteUrl}/maszyny-produkcyjne` } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Maszyny rolnicze', url: `${siteUrl}/maszyny-rolnicze` } },
          { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Usługi ślusarsko-spawalnicze', url: `${siteUrl}/uslugi-slusarsko-spawalnicze` } },
        ],
      },
    },
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: OWNER_NAME,
      jobTitle: 'Spawacz i ślusarz',
      description: `Właściciel firmy ${BRAND_NAME} - spawanie i ślusarstwo dla przemysłu oraz rolnictwa.`,
      worksFor: { '@id': `${siteUrl}/#business` },
      url: siteUrl,
    },
  ],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${montserrat.variable} ${barlow.variable} ${greatVibes.variable}`}>
      <body>
        <PageLoader />
        {children}
        <Script id="schema-org" type="application/ld+json">
          {schemaOrg}
        </Script>
      </body>
    </html>
  )
}
