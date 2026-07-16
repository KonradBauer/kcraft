'use client'

import Link from 'next/link'
import { useState } from 'react'
import { SERVICE_LINKS } from '@/lib/serviceLinks'

export function NavRealizacjeDropdown({ triggerClass }: { triggerClass: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`${triggerClass} flex items-center gap-1.5 cursor-pointer bg-transparent border-none`}
        aria-haspopup="true"
        aria-expanded={open}
      >
        Realizacje
        <svg
          viewBox="0 0 10 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          className={`w-[9px] h-[5px] flex-none transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M1 1l4 4 4-4" />
        </svg>
      </button>

      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 pt-[10px] z-50 transition-all duration-150 ${open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
      >
        <div className="bg-ink-3 border border-white/10 py-1.5 min-w-[230px]">
          {SERVICE_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 px-5 py-[11px] font-montserrat text-[11px] font-semibold tracking-[0.18em] uppercase text-white/65 hover:text-white hover:bg-[#FF9228] transition-colors duration-150"
            >
              <span className="w-[5px] h-[5px] rotate-45 bg-white/50 group-hover:bg-white flex-none" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
