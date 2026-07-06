import type { Media } from '@/payload-types'

export function mediaUrl(field: string | Media | null | undefined): string | null {
  if (!field || typeof field === 'string') return null
  return field.url ?? null
}
