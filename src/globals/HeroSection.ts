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
      name: 'personPhoto',
      label: 'Zdjęcie Michała (wycięte)',
      type: 'upload',
      relationTo: 'media',
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
