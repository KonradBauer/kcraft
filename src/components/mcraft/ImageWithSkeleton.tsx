'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ImageWithSkeletonProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
}

export function ImageWithSkeleton({ src, alt, className, style }: ImageWithSkeletonProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <>
      <div
        className={`img-skeleton absolute inset-0 z-[1] transition-opacity duration-500 ${isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        aria-hidden="true"
      />
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        style={style}
        onLoad={() => setIsLoaded(true)}
      />
    </>
  )
}
