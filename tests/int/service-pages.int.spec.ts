import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { SERVICE_SLUGS } from '@/lib/serviceLinks'

import { describe, it, beforeAll, expect } from 'vitest'

let payload: Payload

describe('Service pages', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('GET /api/seed creates exactly the service-pages from SERVICE_SLUGS', async () => {
    const res = await fetch('http://localhost:3000/api/seed')
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(body.results.map((r: { slug: string }) => r.slug).sort()).toEqual([...SERVICE_SLUGS].sort())
  })

  it('Portfolio.filterOptions accepts relationship to all service-pages', async () => {
    for (const slug of SERVICE_SLUGS) {
      const { docs } = await payload.find({
        collection: 'service-pages',
        where: { slug: { equals: slug } },
        limit: 1,
      })
      expect(docs.length).toBe(1)
    }
  })
})
