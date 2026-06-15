import type { GlobalConfig } from 'payload'

export const BioModal: GlobalConfig = {
  slug: 'bio-modal',
  label: 'Modal Życiorys (Więcej o mnie)',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'sections',
      label: 'Sekcje życiorysu',
      type: 'array',
      fields: [
        {
          name: 'title',
          label: 'Tytuł sekcji',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          label: 'Treść',
          type: 'textarea',
          required: true,
        },
      ],
    },
    {
      name: 'bioFile',
      label: 'Plik życiorysu (PDF)',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
