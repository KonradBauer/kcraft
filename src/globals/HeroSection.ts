import type { GlobalConfig } from 'payload'

export const HeroSection: GlobalConfig = {
  slug: 'hero-section',
  label: 'Sekcja Hero',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'backgroundImage',
      label: 'Zdjęcie tła',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'title',
      label: 'Główny tekst (nagłówek H1)',
      type: 'textarea',
    },
    {
      name: 'subtitle',
      label: 'Podtytuł (np. Inżynier spawalnik / IWE / IWI)',
      type: 'text',
    },
    {
      name: 'description',
      label: 'Opis (paragraf pod podtytułem)',
      type: 'textarea',
    },
  ],
}
