import type { CollectionConfig } from 'payload'

export const StatTile: CollectionConfig = {
  slug: 'stat-tiles',
  labels: {
    singular: 'Kafelek',
    plural: 'Kafelki statystyk',
  },
  access: {
    read: () => true,
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'number',
      label: 'Liczba / wartość (np. 18+, IWE)',
      type: 'text',
      required: true,
    },
    {
      name: 'label',
      label: 'Etykieta (np. Lat doświadczenia)',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Opis szczegółowy (widoczny w popupie)',
      type: 'textarea',
      required: true,
    },
    {
      name: 'order',
      label: 'Kolejność wyświetlania',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Mniejsza liczba = wyświetla się wcześniej',
      },
    },
  ],
}
