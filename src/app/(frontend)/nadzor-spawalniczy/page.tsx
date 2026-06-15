import { SubpageLayout } from '@/components/mcraft/SubpageLayout'

export const metadata = {
  title: 'MCRAFT — Nadzór spawalniczy',
  description: 'Kompleksowy nadzór nad procesami spawalniczymi zgodnie z normami i wymaganiami jakości.',
}

export default function NadzorSpawalniczyPage() {
  return (
    <SubpageLayout
      eyebrow="Obszar działalności"
      title="Nadzór spawalniczy"
      description="Kompleksowy nadzór nad procesami spawalniczymi zgodnie z normami i wymaganiami jakości — od kwalifikowania technologii po dokumentację odbiorową."
      items={[
        { text: 'Kwalifikowanie technologii spawania (WPS / WPQR)' },
        { text: 'Nadzór nad jakością złączy spawanych' },
        { text: 'Badania nieniszczące VT / PT' },
        { text: 'Dokumentacja jakościowa i odbiorowa' },
      ]}
      mainImagePlaceholder="Zdjęcie — Nadzór spawalniczy"
      galleryPlaceholders={['Realizacja 1', 'Realizacja 2', 'Realizacja 3']}
    />
  )
}
