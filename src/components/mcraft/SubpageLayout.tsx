import Link from 'next/link'
import React from 'react'
import { ImageSlot } from './ImageSlot'
import { Logo } from './Logo'

interface SubpageItem {
  text: string
}

interface SubpageLayoutProps {
  eyebrow: string
  title: string
  description: string
  items: SubpageItem[]
  mainImagePlaceholder: string
  galleryPlaceholders: [string, string, string]
  ctaLabel?: string
}

const wrap = 'max-w-[1180px] mx-auto px-12 max-[980px]:px-[26px] max-[560px]:px-5'

export function SubpageLayout({
  eyebrow,
  title,
  description,
  items,
  mainImagePlaceholder,
  galleryPlaceholders,
  ctaLabel = 'Zainteresowany współpracą?',
}: SubpageLayoutProps) {
  return (
    <>
      {/* Topbar */}
      <div className="bg-ink text-light">
        <div className={wrap}>
          <nav className="flex items-center justify-between py-[26px]">
            <Logo size={34} />
            <Link
              href="/"
              className="inline-flex items-center gap-3 font-montserrat text-xs font-medium tracking-[0.16em] uppercase text-light-muted transition-colors duration-200 hover:text-white"
            >
              <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-[22px] h-[10px]">
                <path d="M30 6H2M7 1 2 6l5 5" />
              </svg>
              Strona główna
            </Link>
          </nav>
        </div>
      </div>

      {/* Page header */}
      <header className="bg-ink text-light relative overflow-hidden pt-16 pb-[72px]">
        <div className="absolute inset-0 opacity-50 blueprint-bg pointer-events-none" />
        <div className={`${wrap} relative`}>
          <span className="block font-montserrat text-xs font-semibold tracking-[0.28em] uppercase text-accent mb-[18px]">{eyebrow}</span>
          <h1 className="font-light text-[52px] tracking-[0.01em] uppercase text-white max-[980px]:text-[38px]">{title}</h1>
          <div className="w-16 h-0.5 bg-accent my-[26px]" />
          <p className="max-w-[560px] text-base leading-[1.75] text-light-muted font-light">{description}</p>
        </div>
      </header>

      {/* Body */}
      <section className="py-20">
        <div className={wrap}>
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-[60px] items-start max-[980px]:grid-cols-1 max-[980px]:gap-10">
            <div>
              <h2 className="font-semibold text-[26px] uppercase tracking-[0.03em] mb-6">Zakres</h2>
              <ul className="flex flex-col gap-4">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-[15.5px] leading-[1.6] text-[#56544e]">
                    <span className="w-[9px] h-[9px] bg-accent mt-[7px] flex-none rotate-45" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-9 inline-flex items-center gap-2.5 bg-[rgba(79,154,140,0.12)] border border-[rgba(79,154,140,0.4)] text-[#3c7a6e] text-[13px] px-[18px] py-3 font-medium">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-none">
                  <circle cx="12" cy="12" r="10" /><path d="M12 16v-5M12 8h.01" />
                </svg>
                Treść i zdjęcia zostaną uzupełnione z zasobów — strona w rozbudowie.
              </div>
            </div>
            <div>
              <ImageSlot placeholder={mainImagePlaceholder} className="w-full h-[340px]" />
            </div>
          </div>

          {/* Gallery */}
          <div className="mt-[18px]">
            <h2 className="font-semibold text-[26px] uppercase tracking-[0.03em] mb-6">Realizacje</h2>
            <div className="grid grid-cols-3 gap-[18px] max-[980px]:grid-cols-2 max-[560px]:grid-cols-1">
              {galleryPlaceholders.map((ph, i) => (
                <ImageSlot key={i} placeholder={ph} className="w-full h-[220px]" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream-2 py-16 text-center">
        <div className={wrap}>
          <h2 className="font-semibold text-2xl uppercase tracking-[0.03em] mb-[22px]">{ctaLabel}</h2>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-6 bg-ink text-light font-montserrat text-xs font-semibold tracking-[0.2em] uppercase px-[28px] py-[17px] transition-all duration-[220ms] hover:bg-accent hover:text-ink"
          >
            Skontaktuj się
            <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-5 h-3">
              <path d="M0 6h28M23 1l5 5-5 5" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Simple footer */}
      <footer className="bg-ink-3 text-light py-10 text-center">
        <div className={wrap}>
          <div className="font-montserrat font-semibold text-[20px] tracking-[0.34em] text-white">MCRAFT</div>
          <div className="text-xs text-[rgba(236,234,228,0.4)] mt-[14px]">© 2025 MCRAFT Michał Macherzyński. Wszystkie prawa zastrzeżone.</div>
        </div>
      </footer>
    </>
  )
}
