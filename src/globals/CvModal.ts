import type { GlobalConfig } from 'payload'

export const CvModal: GlobalConfig = {
  slug: 'cv-modal',
  label: 'Modal CV (Dowiedz się więcej)',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'experience',
      label: 'Doświadczenie zawodowe',
      type: 'array',
      fields: [
        {
          name: 'year',
          label: 'Okres / rok',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Opis',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'qualifications',
      label: 'Kwalifikacje i certyfikaty',
      type: 'array',
      fields: [
        {
          name: 'code',
          label: 'Kod / skrót (np. IWE)',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Opis',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'competencies',
      label: 'Kompetencje (tekst)',
      type: 'textarea',
    },
    {
      name: 'cvFile',
      label: 'Plik CV (PDF)',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
