import { SubpageLayout } from '@/components/mcraft/SubpageLayout'

export const metadata = {
  title: 'MCRAFT — Meble premium',
  description: 'Unikalne meble stalowe i loftowe tworzone z dbałością o detal i najwyższą jakość.',
}

export default function MeblePremiumPage() {
  return (
    <SubpageLayout
      eyebrow="Obszar działalności"
      title="Meble premium"
      description="Unikalne meble stalowe i loftowe tworzone z dbałością o detal i najwyższą jakość — projekty autorskie i realizacje na zamówienie."
      items={[
        { text: 'Meble loftowe i industrialne' },
        { text: 'Projekty autorskie na zamówienie' },
        { text: 'Łączenie stali z drewnem i szkłem' },
        { text: 'Wykończenie premium' },
      ]}
      mainImagePlaceholder="Zdjęcie — Meble premium"
      galleryPlaceholders={['Realizacja 1', 'Realizacja 2', 'Realizacja 3']}
    />
  )
}
