import type { CollectionConfig } from 'payload'

export const NadzorRealizacje: CollectionConfig = {
  slug: 'nadzor-realizacje',
  labels: {
    singular: 'Realizacja nadzoru',
    plural: 'Realizacje (Nadzór spawalniczy)',
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order'],
  },
  fields: [
    {
      name: 'title',
      label: 'Tytuł realizacji',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      label: 'Slug URL',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Używany w adresie URL. Małe litery, myślniki zamiast spacji. Nie zmieniaj po opublikowaniu.',
      },
    },
    {
      name: 'description',
      label: 'Opis realizacji',
      type: 'textarea',
    },
    {
      name: 'thumbnail',
      label: 'Zdjęcie okładki (kafelek)',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'images',
      label: 'Zdjęcia galerii',
      type: 'array',
      fields: [
        {
          name: 'image',
          label: 'Zdjęcie',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          label: 'Opis zdjęcia (dostępność)',
          type: 'text',
        },
      ],
    },
    {
      name: 'order',
      label: 'Kolejność wyświetlania (mniejsza = wyżej)',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
