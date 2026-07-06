import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

const PAGES = [
  {
    slug: 'maszyny-produkcyjne',
    title: 'Maszyny produkcyjne',
    eyebrow: 'Obszar działalności',
    thumbnailTitle: 'Maszyny\nprodukcyjne',
    scopeItems: [
      { text: 'Budowa maszyn produkcyjnych' },
      { text: 'Doposażanie i modernizacja linii produkcyjnych' },
      { text: 'Modernizacja stanowisk pracy' },
      { text: 'Automatyzacja procesów produkcyjnych' },
      { text: 'Prefabrykacja i montaż na miejscu' },
    ],
  },
  {
    slug: 'maszyny-rolnicze',
    title: 'Maszyny rolnicze',
    eyebrow: 'Obszar działalności',
    thumbnailTitle: 'Maszyny\nrolnicze',
    scopeItems: [
      { text: 'Naprawa maszyn rolniczych' },
      { text: 'Budowa maszyn i osprzętu rolniczego' },
      { text: 'Wzmacnianie konstrukcji' },
      { text: 'Serwis lemieszy, ram i osprzętu' },
      { text: 'Spawanie i regeneracja elementów zużytych' },
    ],
  },
  {
    slug: 'uslugi-slusarsko-spawalnicze',
    title: 'Usługi ślusarsko-spawalnicze',
    eyebrow: 'Obszar działalności',
    thumbnailTitle: 'Usługi ślusarsko-\nspawalnicze',
    scopeItems: [
      { text: 'Cięcie i gięcie blach oraz profili' },
      { text: 'Spawanie TIG / MIG / MAG' },
      { text: 'Wykonanie konstrukcji na zamówienie' },
      { text: 'Naprawy i regeneracja elementów stalowych' },
      { text: 'Transport do klienta' },
    ],
  },
  {
    slug: 'wyposazenie-loftowe',
    title: 'Wyposażenie loftowe',
    eyebrow: 'Obszar działalności',
    thumbnailTitle: 'Wyposażenie\nloftowe',
    scopeItems: [
      { text: 'Meble loftowe na wymiar - stoły, stoliki, regały' },
      { text: 'Balustrady i schody w stylu industrialnym' },
      { text: 'Zabudowy i konstrukcje stalowe do wnętrz' },
      { text: 'Elementy dekoracyjne ze stali' },
      { text: 'Łączenie stali z drewnem' },
    ],
  },
]

export async function GET() {
  const payload = await getPayload({ config })
  const results: { slug: string; status: string }[] = []

  for (const page of PAGES) {
    const existing = await payload.find({
      collection: 'service-pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'service-pages',
        data: page,
        overrideAccess: true,
      })
      results.push({ slug: page.slug, status: 'created' })
    } else {
      await payload.update({
        collection: 'service-pages',
        id: existing.docs[0].id,
        data: page,
        overrideAccess: true,
      })
      results.push({ slug: page.slug, status: 'updated' })
    }
  }

  return NextResponse.json({ ok: true, results })
}

export async function DELETE() {
  const payload = await getPayload({ config })
  const allowed = new Set(PAGES.map((p) => p.slug))

  const all = await payload.find({
    collection: 'service-pages',
    limit: 100,
    overrideAccess: true,
  })

  const deleted: string[] = []
  for (const doc of all.docs) {
    if (!allowed.has(doc.slug)) {
      await payload.delete({ collection: 'service-pages', id: doc.id, overrideAccess: true })
      deleted.push(doc.slug)
    }
  }

  return NextResponse.json({ ok: true, deleted })
}
