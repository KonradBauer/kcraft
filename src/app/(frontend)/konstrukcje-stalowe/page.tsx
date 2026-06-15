import { SubpageLayout } from '@/components/mcraft/SubpageLayout'

export const metadata = {
  title: 'MCRAFT — Konstrukcje stalowe',
  description: 'Projektowanie i realizacja konstrukcji stalowych dla przemysłu, budownictwa i infrastruktury.',
}

export default function KonstrukcjeStalowePage() {
  return (
    <SubpageLayout
      eyebrow="Obszar działalności"
      title="Konstrukcje stalowe"
      description="Projektowanie i realizacja konstrukcji stalowych dla przemysłu, budownictwa i infrastruktury — z dbałością o jakość i terminowość."
      items={[
        { text: 'Konstrukcje przemysłowe i hale' },
        { text: 'Elementy infrastruktury' },
        { text: 'Prefabrykacja w warsztacie' },
        { text: 'Montaż na obiekcie' },
      ]}
      mainImagePlaceholder="Zdjęcie — Konstrukcje stalowe"
      galleryPlaceholders={['Realizacja 1', 'Realizacja 2', 'Realizacja 3']}
    />
  )
}
