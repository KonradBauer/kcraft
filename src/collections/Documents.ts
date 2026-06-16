import type { CollectionConfig } from 'payload'

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'Dokument', plural: 'Dokumenty' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Tytuł',
      type: 'text',
    },
  ],
  upload: {
    mimeTypes: ['application/pdf'],
  },
}
