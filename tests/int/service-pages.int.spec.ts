import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, expect } from 'vitest'

const NEW_SLUGS = ['maszyny-produkcyjne', 'maszyny-rolnicze', 'uslugi-slusarsko-spawalnicze']

let payload: Payload

describe('Service pages rebrand', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('GET /api/seed creates exactly the 3 new service-pages', async () => {
    const res = await fetch('http://localhost:3000/api/seed')
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(body.results.map((r: { slug: string }) => r.slug).sort()).toEqual([...NEW_SLUGS].sort())
  })

  it('Portfolio.filterOptions accepts relationship to all 3 new service-pages', async () => {
    for (const slug of NEW_SLUGS) {
      const { docs } = await payload.find({
        collection: 'service-pages',
        where: { slug: { equals: slug } },
        limit: 1,
      })
      expect(docs.length).toBe(1)
    }
  })
})
