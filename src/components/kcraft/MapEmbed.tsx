'use client'

import { useState } from 'react'

interface MapEmbedProps {
  mapQuery: string
  title: string
}

export function MapEmbed({ mapQuery, title }: MapEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  if (isLoaded) {
    return (
      <iframe
        src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
        width="100%"
        height="300"
        style={{ border: 0, filter: 'grayscale(1) invert(0.85) contrast(0.9)' }}
        referrerPolicy="no-referrer-when-downgrade"
        title={title}
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setIsLoaded(true)}
      className="flex items-center justify-center w-full h-[300px] bg-[#1b2925] text-[rgba(236,234,228,0.5)] font-montserrat text-[11px] tracking-[0.15em] uppercase hover:text-white transition-colors duration-200"
    >
      Pokaż mapę
    </button>
  )
}
