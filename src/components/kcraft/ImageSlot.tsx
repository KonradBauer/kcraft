import React from 'react'

interface ImageSlotProps {
  placeholder?: string
  style?: React.CSSProperties
  className?: string
}

export function ImageSlot({ placeholder, style, className }: ImageSlotProps) {
  return (
    <div
      className={`flex items-center justify-center bg-[#1b2925] text-[rgba(236,234,228,0.25)] font-montserrat text-[11px] tracking-[0.1em] uppercase text-center p-4${className ? ` ${className}` : ''}`}
      style={style}
      aria-hidden="true"
    >
      <span>{placeholder}</span>
    </div>
  )
}
