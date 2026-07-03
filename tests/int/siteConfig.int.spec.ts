import { describe, expect, it } from 'vitest'
import { BRAND_NAME, CONTACT, LEGAL_NAME, OWNER_NAME, SITE_URL } from '@/lib/siteConfig'

describe('siteConfig', () => {
  it('SITE_URL points to the kcraft domain', () => {
    expect(SITE_URL).toBe('https://kcraft.com.pl')
  })

  it('does not contain old brand references', () => {
    const values = [SITE_URL, BRAND_NAME, OWNER_NAME, LEGAL_NAME, CONTACT.email, JSON.stringify(CONTACT.address)]
    for (const value of values) {
      expect(value.toLowerCase()).not.toContain('mcraft')
      expect(value).not.toContain('Macherzyński')
    }
  })
})
