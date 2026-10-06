import { cache } from 'react'
import { seedContent } from '@/content/seed'
import type { ContentRecord } from '@/content/types'
import { isPreview } from './env'
import { hasRole, publicWhere } from '@/cms/access'

export const getContent = cache(async (): Promise<ContentRecord[]> => {
  if (isPreview) return seedContent
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'content',
    where: publicWhere(),
    overrideAccess: false,
    limit: 500,
    depth: 0,
    draft: false,
  })
  return docs.map(toRecord)
})

// CMS preview is authenticated; anonymous visitors cannot opt into unpublished content.
export async function getEditorPreview(
  id: string,
  headers: Headers,
): Promise<ContentRecord | null> {
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })
  if (!hasRole(user, ['admin', 'editor', 'reviewer'])) return null
  const doc = await payload.findByID({
    collection: 'content',
    id,
    draft: true,
    depth: 0,
    overrideAccess: false,
    user,
  })
  return toRecord(doc)
}

function toRecord(doc: unknown): ContentRecord {
  const raw = doc as Omit<ContentRecord, 'sections' | 'related'> & {
    evidenceStatus?: string
    sections: { heading: string; text: string; items?: { text: string }[] }[]
    related?: { slug: string }[]
    imageURL?: string
    imageAlt?: string
    imageCaption?: string
  }
  return {
    ...raw,
    status: raw.evidenceStatus === 'verified' ? 'approved' : 'illustrative',
    sections: (raw.sections || []).map((s) => ({
      heading: s.heading,
      text: s.text,
      items: s.items?.map((i) => (typeof i === 'string' ? i : i.text)),
    })),
    related: raw.related?.map((i) => (typeof i === 'string' ? i : i.slug)),
    image: raw.imageURL
      ? { url: raw.imageURL, alt: raw.imageAlt || '', caption: raw.imageCaption }
      : undefined,
  }
}

export function normalizeSearch(value: string) {
  return value
    .toLocaleLowerCase('de')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}
const synonyms: Record<string, string> = {
  logo: 'artwork veredelung',
  polo: 'poloshirts pique',
  tshirt: 'shirt jersey',
  größen: 'groessen passform',
  stick: 'veredelung',
  hoodie: 'sweat kapuze',
  muster: 'freigabe',
}
export function searchContent(records: ContentRecord[], query: string, locale = 'de') {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean).slice(0, 8)
  if (!terms.length) return []
  return records
    .filter((r) => r.locale === locale)
    .map((record) => {
      const title = normalizeSearch(record.title + ' ' + record.slug)
      const body = normalizeSearch(
        record.description + ' ' + record.sections.map((s) => s.heading + ' ' + s.text).join(' '),
      )
      const score = terms.reduce(
        (sum, term) =>
          sum +
          (title.startsWith(term)
            ? 16
            : title.includes(term)
              ? 8
              : body.includes(term)
                ? 2
                : Object.entries(synonyms).some(
                      ([k, v]) =>
                        normalizeSearch(k) === term &&
                        normalizeSearch(v)
                          .split(' ')
                          .some((t) => title.includes(t)),
                    )
                  ? 1
                  : 0),
        0,
      )
      return { record, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.record)
}
