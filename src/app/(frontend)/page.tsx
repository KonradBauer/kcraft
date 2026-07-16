export const dynamic = 'force-dynamic'

import { getPayload } from 'payload'
import config from '@payload-config'
import { HomeContent } from '@/components/kcraft/HomeContent'

export default async function HomePage() {
  const payload = await getPayload({ config })

  const [hero, about, areasResult] = await Promise.all([
    payload.findGlobal({ slug: 'hero-section', depth: 1 }),
    payload.findGlobal({ slug: 'about-section', depth: 1 }),
    payload.find({ collection: 'service-pages', depth: 1, limit: 10 }),
  ])

  return (
    <HomeContent
      hero={hero}
      about={about}
      areas={areasResult.docs}
    />
  )
}
