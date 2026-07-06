import Image from 'next/image'
import Link from 'next/link'
import type {
  AboutSection,
  BioModal,
  CvModal,
  HeroSection,
  Media,
  ServicePage,
  StatTile,
} from '@/payload-types'
import { mediaUrl } from '@/lib/mediaUrl'
import { BRAND_NAME, CONTACT, LEGAL_NAME, OWNER_NAME } from '@/lib/siteConfig'
import { ImageSlot } from './ImageSlot'
import { ImageWithSkeleton } from './ImageWithSkeleton'
import { MobileNav } from './MobileNav'
import { NavRealizacjeDropdown } from './NavRealizacjeDropdown'
import { ModalProvider } from './ModalProvider'
import { ModalTrigger } from './ModalTrigger'
import { TilesMarquee } from './TilesMarquee'

export interface HomeContentProps {
  hero: HeroSection
  about: AboutSection
  cvModal: CvModal
  bioModal: BioModal
  tiles: StatTile[]
  areas: Pick<ServicePage, 'slug' | 'thumbnailTitle' | 'thumbnailImage'>[]
}

/* ─── reusable class strings ─── */
const eyebrow = 'block font-montserrat text-[12px] font-semibold tracking-[0.28em] uppercase text-[#008A58]'
const wrap = 'max-w-[1920px] mx-auto px-[56px] max-[980px]:px-[30px] max-[560px]:px-5'
const navLink = 'font-montserrat text-[14px] font-semibold tracking-[0.18em] uppercase pb-1.5 relative transition-colors duration-200'

const HOME_NAV_LINKS = [
  { href: '#about', label: 'O mnie' },
  { href: '#areas', label: 'Obszary' },
  {
    label: 'Realizacje',
    sub: [
      { href: '/maszyny-produkcyjne', label: 'Maszyny produkcyjne' },
      { href: '/maszyny-rolnicze', label: 'Maszyny rolnicze' },
      { href: '/uslugi-slusarsko-spawalnicze', label: 'Usługi ślusarsko-spawalnicze' },
    ],
  },
  { href: '#contact', label: 'Kontakt' },
]

/* ─── icon helpers ─── */
function ArrowRight({ className = 'w-5 h-3 flex-none' }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.4" className={className}>
      <path d="M0 6h28M23 1l5 5-5 5" />
    </svg>
  )
}

/* ─── SVG icons per area slug ─── */
const AREA_ICONS: Record<string, React.ReactNode> = {
  'maszyny-produkcyjne': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" className="w-[62px] h-[62px]">
      <path d="M32 20a12 12 0 1 0 0 24 12 12 0 0 0 0-24z" />
      <path d="M32 12v6M32 46v6M12 32h6M46 32h6M17.5 17.5l4.2 4.2M42.3 42.3l4.2 4.2M46.5 17.5l-4.2 4.2M21.7 42.3l-4.2 4.2" />
      <circle cx="32" cy="32" r="4" />
    </svg>
  ),
  'maszyny-rolnicze': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" className="w-[62px] h-[62px]">
      <circle cx="18" cy="46" r="8" />
      <circle cx="46" cy="46" r="6" />
      <path d="M18 38V22h10l8 12h6l6 6v6" />
      <path d="M28 22V14h-8" />
    </svg>
  ),
  'uslugi-slusarsko-spawalnicze': (
    <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" className="w-[62px] h-[62px]">
      <path d="M14 50 38 26" />
      <path d="M32 20l12 12-6 6-12-12z" />
      <path d="M40 36l10 10M46 12l2 6-6-2M52 20l4 4-4 4M12 40l-4 2 2 4" />
    </svg>
  ),
}

const AREA_DEFAULTS = [
  { href: '/maszyny-produkcyjne', slug: 'maszyny-produkcyjne', name: 'Maszyny\nprodukcyjne' },
  { href: '/maszyny-rolnicze', slug: 'maszyny-rolnicze', name: 'Maszyny\nrolnicze' },
  { href: '/uslugi-slusarsko-spawalnicze', slug: 'uslugi-slusarsko-spawalnicze', name: 'Usługi ślusarsko-\nspawalnicze' },
]

/* ─── main component (server) ─── */
export function HomeContent({ hero, about, cvModal, bioModal, tiles, areas }: HomeContentProps) {
  const areaBySlug = Object.fromEntries(areas.map((a) => [a.slug, a]))

  const heroBackground = mediaUrl(hero.backgroundImage) ?? '/hero.png'
  const heroSubtitle = hero.subtitle ?? 'Spawanie i ślusarstwo\ndla przemysłu i rolnictwa'
  const portraitUrl = mediaUrl(about.portraitPhoto) ?? '/kim-jestem.jpg'
  const bioText = about.bioText ?? 'KCRAFT to spawanie i ślusarstwo dla przemysłu oraz rolnictwa - budowa i naprawa maszyn, konstrukcje na zamówienie i serwis osprzętu. Dlaczego my? Indywidualne projekty dopasowane do potrzeb klienta, materiały najwyższej jakości oraz terminowość i bezpieczeństwo na każdym etapie realizacji.'

  const cvBtnClass = 'inline-flex items-center gap-[30px] mt-[90px] max-[980px]:hidden border border-[#3A3A3A] px-[26px] py-[17px] font-montserrat text-xs font-semibold tracking-[0.2em] uppercase text-light transition-all duration-[250ms] bg-transparent cursor-pointer hover:bg-accent hover:border-accent hover:text-ink'
  const cvBtnMobileClass = 'inline-flex items-center gap-[30px] border border-[#3A3A3A] px-[26px] py-[17px] font-montserrat text-xs font-semibold tracking-[0.2em] uppercase text-light transition-all duration-[250ms] bg-transparent cursor-pointer hover:bg-accent hover:border-accent hover:text-ink'

  return (
    <ModalProvider cvModal={cvModal} bioModal={bioModal} tiles={tiles}>
      {/* ====== HERO ====== */}
      <header className="relative bg-ink text-light min-h-[680px] max-[980px]:min-h-[100svh] overflow-hidden" id="top">
        <Image
          src={heroBackground}
          fill
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          alt=""
          priority
          className="z-0"
        />

        <div className="absolute inset-0 z-[1] pointer-events-none max-[980px]:hidden [background:linear-gradient(to_right,rgba(14,26,23,0.95)_0%,rgba(14,26,23,0.55)_32%,rgba(14,26,23,0)_55%)]" />
        <div className="hidden max-[980px]:block absolute inset-0 z-[1] pointer-events-none [background:linear-gradient(to_right,rgba(14,26,23,0.98)_0%,rgba(14,26,23,0.85)_55%,rgba(14,26,23,0.5)_100%)]" />

        <div className="absolute left-0 top-[120px] bottom-[60px] z-[3] flex flex-col items-center max-[980px]:hidden">
          <span className="w-px flex-1 bg-gradient-to-b from-accent to-transparent" />
          <span className="mt-[14px] text-light-muted">
            <svg width="14" height="30" viewBox="0 0 14 30" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M7 0v27M1 21l6 7 6-7" />
            </svg>
          </span>
        </div>

        <div className="relative z-[5]">
          <div className={wrap}>
            <nav className="flex items-center justify-between py-[30px]">
              <span className="font-montserrat font-light text-[18px] tracking-[0.45em] text-white uppercase">{BRAND_NAME}</span>
              <div className="flex gap-[38px] max-[980px]:hidden">
                <a href="#about" className={`${navLink} text-black after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-[22px] after:h-0.5 after:bg-accent`}>O mnie</a>
                <a href="#areas" className={`${navLink} text-black/70 hover:text-black`}>Obszary</a>
                <NavRealizacjeDropdown triggerClass={`${navLink} text-black/70 hover:text-black`} />
                <a href="#contact" className={`${navLink} text-black/70 hover:text-black`}>Kontakt</a>
              </div>
              <MobileNav links={HOME_NAV_LINKS} />
            </nav>

            <div className="flex items-start justify-between pt-[56px] pb-[90px] max-[980px]:pt-[24px] max-[980px]:pb-[16px] max-[980px]:block">
              <div className="max-w-[460px] flex-shrink-0">
                <span className={`${eyebrow} mb-[22px]`}>{OWNER_NAME}</span>
                <h1 className="font-light text-[42px] leading-[1.1] tracking-[0.01em] text-white uppercase max-[980px]:text-[28px]">
                  Profesjonalne Spawanie i Ślusarstwo<br />dla Przemysłu oraz Rolnictwa
                </h1>
                <div className="w-16 h-0.5 bg-accent mt-[34px] mb-[26px] max-[980px]:mt-[18px] max-[980px]:mb-[14px]" />
                <div className="font-montserrat font-light text-[22px] tracking-[0.22em] uppercase text-light leading-[1.5] whitespace-pre-line max-[980px]:hidden">
                  {heroSubtitle}
                </div>
                <ModalTrigger modalKey="cv" className={cvBtnClass}>
                  Dowiedz się więcej <ArrowRight />
                </ModalTrigger>
              </div>

              <div className="flex flex-col justify-start mr-[8%] max-[980px]:hidden">
                <div>
                  <div className="font-montserrat font-semibold text-[40px] leading-[1.15] text-black">Teoria</div>
                  <div className="font-montserrat font-semibold text-[40px] leading-[1.15] text-[#069364]">Doświadczenie</div>
                  <div className="font-montserrat font-semibold text-[40px] leading-[1.15] text-black">Praktyka</div>
                </div>
                <div className="mt-4">
                  <hr className="border-[#ccc] mb-4" />
                  <p className="relative text-lg font-bold leading-[1.75] text-[#56544e] pl-5">
                    <span className="absolute left-0 top-0 text-3xl font-bold text-[#00A887]">{'"'}</span>
                    Doświadczeniem buduję
                    <br />
                    most pomiędzy teorią
                    <br />
                    a praktyką.
                    <span className="ml-1 text-3xl font-bold text-[#00A887]">{'"'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile/tablet bottom CTA */}
        <div className="hidden max-[980px]:flex absolute bottom-[36px] left-0 right-0 z-[4] flex-col items-start px-5 gap-[14px]">
          <p className="font-montserrat font-light text-[11px] tracking-[0.22em] uppercase text-white whitespace-pre-line leading-[1.9]">
            {heroSubtitle}
          </p>
          <ModalTrigger modalKey="cv" className={cvBtnMobileClass}>
            Dowiedz się więcej <ArrowRight />
          </ModalTrigger>
        </div>
      </header>

      {/* ====== ABOUT ====== */}
      <section className="bg-cream relative pt-24 pb-[78px]" id="about">
        <div className="absolute top-[46px] left-[34px] w-[120px] h-[90px] opacity-50 dots-pattern z-[2]" />
        <div className={wrap}>
          <div className="grid [grid-template-columns:minmax(250px,0.7fr)_1.3fr] gap-[36px] items-stretch max-[700px]:grid-cols-1 max-[700px]:gap-8">

            <div className="relative p-[18px] h-full max-[700px]:aspect-[4/3]">
              <span className="absolute top-0 left-0 w-[28px] h-[28px] max-[980px]:w-[20px] max-[980px]:h-[20px] border-t border-l border-accent pointer-events-none" />
              <span className="absolute top-0 right-0 w-[28px] h-[28px] max-[980px]:w-[20px] max-[980px]:h-[20px] border-t border-r border-accent pointer-events-none" />
              <span className="absolute bottom-0 left-0 w-[28px] h-[28px] max-[980px]:w-[20px] max-[980px]:h-[20px] border-b border-l border-accent pointer-events-none" />
              <span className="absolute bottom-0 right-0 w-[28px] h-[28px] max-[980px]:w-[20px] max-[980px]:h-[20px] border-b border-r border-accent pointer-events-none" />
              <div className="relative h-full">
                {portraitUrl ? (
                  <ImageWithSkeleton src={portraitUrl} alt={OWNER_NAME} className="object-cover object-top" sizes="(max-width: 700px) 100vw, 35vw" />
                ) : (
                  <ImageSlot placeholder="Zdjęcie - Kim jestem" className="w-full h-full" />
                )}
              </div>
            </div>

            <div className="min-w-0">
              <span className={`${eyebrow} mb-[14px]`}>Kim jestem?</span>
              <h2 className="font-medium text-[27px] tracking-[0.02em] text-dark-text mt-[14px] mb-[22px] uppercase">
                {LEGAL_NAME}
              </h2>
              <p className="text-[15px] leading-[1.85] text-[#56544e]">
                {bioText}
              </p>

              <div className="flex justify-end mt-[26px] mb-1.5">
                <ModalTrigger
                  modalKey="bio"
                  className="inline-flex items-center gap-3 bg-transparent border border-[#3A3A3A] text-accent font-montserrat text-xs font-semibold tracking-[0.14em] uppercase px-[18px] py-[11px] cursor-pointer transition-all duration-[220ms] hover:bg-accent hover:border-accent hover:text-white"
                >
                  ...więcej o mnie
                  <svg viewBox="0 0 30 12" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-4 h-2.5">
                    <path d="M0 6h28M23 1l5 5-5 5" />
                  </svg>
                </ModalTrigger>
              </div>

              <TilesMarquee tiles={tiles} />
            </div>

          </div>
        </div>
      </section>

      {/* ====== OBSZARY ====== */}
      <section className="bg-cream-2 py-[74px]" id="areas">
        <div className={wrap}>
          <div>
            <span className={`${eyebrow} mb-[14px]`}>Co oferuję?</span>
            <h2 className="font-montserrat font-semibold text-[30px] tracking-[0.04em] uppercase text-dark-text">Obszary działalności</h2>
          </div>
          <div className="grid grid-cols-3 gap-[26px] mt-[42px] max-[980px]:grid-cols-1">
            {AREA_DEFAULTS.map(({ href, slug, name }) => {
              const cmsArea = areaBySlug[slug]
              const displayName = cmsArea?.thumbnailTitle ?? name
              const thumbUrl = mediaUrl(cmsArea?.thumbnailImage as Media | string | null | undefined)
              return (
                <Link
                  key={href}
                  href={href}
                  className="group relative overflow-hidden min-h-[280px] flex items-end"
                >
                  {/* Background */}
                  {thumbUrl ? (
                    <div className="absolute inset-0">
                      <ImageWithSkeleton
                        src={thumbUrl}
                        alt={displayName}
                        className="object-cover group-hover:scale-[1.06] transition-transform duration-500"
                        sizes="(max-width: 980px) 100vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-ink-2 flex items-center justify-center">
                      <span className="text-accent/60">{AREA_ICONS[slug]}</span>
                    </div>
                  )}
                  {/* Gradient scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                  {/* Text frame */}
                  <div className="relative w-full px-[22px] py-[20px]">
                    <span className="block font-montserrat font-semibold text-[15px] tracking-[0.1em] uppercase text-white leading-[1.5] whitespace-pre-line">
                      {displayName}
                    </span>
                    <span className="inline-flex items-center gap-[9px] font-montserrat text-[10.5px] font-semibold tracking-[0.16em] uppercase text-accent mt-[10px] opacity-0 translate-y-1.5 transition-all duration-[250ms] group-hover:opacity-100 group-hover:translate-y-0">
                      Zobacz <ArrowRight className="w-5 h-[9px]" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="bg-ink-3 text-light pt-16 pb-[26px] relative" id="contact">
        <div className={wrap}>
          <div className="grid grid-cols-[1fr_1.2fr] gap-12 items-start max-[768px]:grid-cols-1">

            <div>
              <span className={`${eyebrow} mb-[18px]`}>Porozmawiajmy o Twoim projekcie</span>
              <h2 className="font-semibold text-[30px] tracking-[0.04em] uppercase text-white mb-[22px]">Skontaktuj się</h2>
              <div className="mb-[22px]">
                <div className="font-montserrat font-semibold text-[13px] tracking-[0.08em] text-white mb-[8px]">{LEGAL_NAME}</div>
              </div>
              {[
                {
                  href: `tel:${CONTACT.phone}`,
                  label: CONTACT.phoneDisplay,
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-accent flex-none"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" /></svg>,
                },
                {
                  href: `mailto:${CONTACT.email}`,
                  label: CONTACT.email,
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-accent flex-none"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 6 10-6" /></svg>,
                },
              ].map(({ href, label, icon }) => (
                <div key={href} className="flex items-center gap-4 mb-4 text-[14.5px] text-light-muted">
                  {icon}
                  <a href={href} className="hover:text-light transition-colors duration-200">{label}</a>
                </div>
              ))}
              <div className="flex items-center gap-4 text-[14.5px] text-light-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-[17px] h-[17px] text-accent flex-none"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span>{CONTACT.address.street}, {CONTACT.address.postalCode} {CONTACT.address.city}</span>
              </div>
            </div>

            <div className="border-l border-hairline-dark pl-[46px] max-[768px]:border-l-0 max-[768px]:pl-0 max-[768px]:border-t max-[768px]:border-hairline-dark max-[768px]:pt-[34px] overflow-hidden">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(CONTACT.mapQuery)}&output=embed`}
                width="100%"
                height="300"
                style={{ border: 0, filter: 'grayscale(1) invert(0.85) contrast(0.9)' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Lokalizacja ${BRAND_NAME}`}
              />
            </div>
          </div>

          <div className="border-t border-hairline-dark mt-[46px] pt-[22px] flex flex-row items-center justify-between gap-4 text-xs tracking-[0.04em] text-[rgba(236,234,228,0.4)] max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-2">
            <span>© 2026 {LEGAL_NAME}. Wszystkie prawa zastrzeżone.</span>
            <Link href="/polityka-prywatnosci" className="hover:text-light/60 transition-colors duration-200">Polityka prywatności</Link>
            <span>Wykonanie: <a href="https://studiocodeart.pl" target="_blank" rel="noopener noreferrer" className="hover:text-light/60 transition-colors duration-200">studiocodeart.pl</a></span>
          </div>
        </div>
      </footer>
    </ModalProvider>
  )
}
