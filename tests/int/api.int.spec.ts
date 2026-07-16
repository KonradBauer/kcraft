import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, afterAll, expect } from 'vitest'

let payload: Payload

describe('API', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })
})

describe('CMS Globals', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches hero-section global', async () => {
    const hero = await payload.findGlobal({ slug: 'hero-section' })
    expect(hero).toBeDefined()
    expect(typeof hero).toBe('object')
  })

  it('fetches about-section global', async () => {
    const about = await payload.findGlobal({ slug: 'about-section' })
    expect(about).toBeDefined()
    expect(typeof about).toBe('object')
  })

})

describe('ServicePage collection', () => {
  let createdId: string

  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    const created = await payload.create({
      collection: 'service-pages',
      data: {
        slug: '__int-test-service',
        title: 'Integration Test Page',
        eyebrow: 'Test',
        description: 'Test description',
        scopeItems: [{ text: 'Test scope item' }],
      },
    })
    createdId = created.id
  })

  afterAll(async () => {
    if (createdId) {
      await payload.delete({ collection: 'service-pages', id: createdId }).catch(() => {})
    }
  })

  it('finds ServicePage by slug', async () => {
    const { docs } = await payload.find({
      collection: 'service-pages',
      where: { slug: { equals: '__int-test-service' } },
    })
    expect(docs).toHaveLength(1)
    expect(docs[0].title).toBe('Integration Test Page')
  })

  it('returns scopeItems array', async () => {
    const { docs } = await payload.find({
      collection: 'service-pages',
      where: { slug: { equals: '__int-test-service' } },
    })
    expect(docs[0].scopeItems).toHaveLength(1)
    expect(docs[0].scopeItems![0].text).toBe('Test scope item')
  })

  it('returns empty when slug not found', async () => {
    const { docs } = await payload.find({
      collection: 'service-pages',
      where: { slug: { equals: '__non-existent-xyz' } },
    })
    expect(docs).toHaveLength(0)
  })
})
