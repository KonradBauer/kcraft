'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

export type ModalKey = 'scope'

export interface ScopeModalContent {
  title: string
  description: string
}

interface ModalContextValue {
  openModal: (key: ModalKey, el: HTMLElement, content?: ScopeModalContent) => void
}

const ModalContext = createContext<ModalContextValue | null>(null)

export function useModal() {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal outside ModalProvider')
  return ctx
}

/* ─── modal sub-components ─── */

function ModalHead({ eyebrowText, title, sub }: { eyebrowText?: string; title: string; sub?: string }) {
  return (
    <div className="bg-ink text-light px-12 pt-7 pb-6 relative overflow-hidden flex-none max-[980px]:px-7">
      <div className="absolute inset-0 opacity-50 blueprint-bg pointer-events-none" />
      <div className="relative">
        {eyebrowText && <span className="font-montserrat text-[11px] font-semibold tracking-[0.26em] uppercase text-accent-bright">{eyebrowText}</span>}
        <h2 className={`font-light text-[34px] uppercase tracking-[0.02em] text-white max-[980px]:text-[27px] ${eyebrowText ? 'mt-[14px]' : ''}`}>{title}</h2>
        {sub && <div className="font-montserrat font-light text-[14px] tracking-[0.14em] uppercase text-light-muted mt-2.5">{sub}</div>}
      </div>
    </div>
  )
}

function ModalScopeContent({ title, description }: ScopeModalContent) {
  return (
    <>
      <ModalHead eyebrowText="Zakres usług" title={title} />
      <div className="px-12 pt-4 pb-8 max-[980px]:px-7">
        <p className="text-[13.5px] leading-[1.65] text-[#56544e]">{description}</p>
      </div>
    </>
  )
}

/* ─── provider ─── */

interface ModalProviderProps {
  children: React.ReactNode
}

export function ModalProvider({ children }: ModalProviderProps) {
  const [modalKey, setModalKey] = useState<ModalKey | null>(null)
  const [scopeContent, setScopeContent] = useState<ScopeModalContent | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [transform, setTransform] = useState('translate(-50%, -50%) scale(0.12)')
  const [opacity, setOpacity] = useState(0)
  const [isClosing, setIsClosing] = useState(false)
  const lastOrigin = useRef({ dx: 0, dy: 0 })

  const openModal = useCallback((key: ModalKey, el: HTMLElement, content?: ScopeModalContent) => {
    const r = el.getBoundingClientRect()
    const dx = r.left + r.width / 2 - window.innerWidth / 2
    const dy = r.top + r.height / 2 - window.innerHeight / 2
    lastOrigin.current = { dx, dy }
    setModalKey(key)
    setScopeContent(content ?? null)
    setTransform(`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.12)`)
    setOpacity(0)
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setTransform('translate(-50%, -50%) scale(1)')
      setOpacity(1)
    }))
  }, [])

  const closeModal = useCallback(() => {
    const { dx, dy } = lastOrigin.current
    setIsClosing(true)
    setTransform(`translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.12)`)
    setOpacity(0)
    document.body.style.overflow = ''
    setTimeout(() => { setIsOpen(false); setModalKey(null); setIsClosing(false) }, 250)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) closeModal() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, closeModal])

  return (
    <ModalContext.Provider value={{ openModal }}>
      {children}

      <div
        className={`fixed inset-0 z-[90] bg-[rgba(8,16,14,0.5)] [backdrop-filter:blur(9px)] ${isClosing ? 'transition-[opacity,visibility] duration-[200ms]' : 'transition-[opacity,visibility] duration-[420ms]'} ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={closeModal}
      />
      <div
        className={`fixed top-1/2 left-1/2 z-[95] w-[min(880px,66vw)] max-h-[88vh] bg-cream shadow-[0_40px_120px_rgba(0,0,0,0.55)] overflow-hidden flex flex-col max-[980px]:w-[92vw] ${isOpen ? 'visible' : 'invisible'}`}
        role="dialog"
        aria-modal="true"
        style={{ transform, opacity, transition: isClosing ? 'transform 0.22s ease-in, opacity 0.18s ease-in' : 'transform 0.55s cubic-bezier(.16,1,.3,1), opacity 0.4s ease' }}
      >
        <button
          className="absolute top-4 right-4 z-[5] w-[42px] h-[42px] border border-white/35 bg-black/[0.18] text-white rounded-full text-xl leading-none cursor-pointer flex items-center justify-center transition-all duration-200 hover:bg-accent hover:border-accent"
          onClick={closeModal}
          aria-label="Zamknij"
        >
          &times;
        </button>
        <div className="overflow-y-auto h-full flex flex-col modal-scroll">
          {modalKey === 'scope' && scopeContent && <ModalScopeContent {...scopeContent} />}
        </div>
      </div>
    </ModalContext.Provider>
  )
}
