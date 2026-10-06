export type ContentKind =
  | 'offer'
  | 'product'
  | 'knowledge'
  | 'journal'
  | 'material'
  | 'page'
  | 'resource'
  | 'project'
  | 'evidence'
  | 'campaign'
export type ContentSection = { heading: string; text: string; items?: string[] }
export type ContentRecord = {
  id?: number
  slug: string
  locale: 'de' | 'en'
  kind: ContentKind
  title: string
  eyebrow: string
  description: string
  sections: ContentSection[]
  related?: string[]
  facts?: { label: string; value: string }[]
  status?: 'illustrative' | 'approved'
  reviewedAt?: string | null
  author?: string
  reviewer?: string
  readingMinutes?: number
  ctaLabel?: string
  ctaHref?: string
  translation?: string
  image?: { url: string; alt: string; caption?: string }
}
export function contentPath(record: Pick<ContentRecord, 'locale' | 'slug'>) {
  return `/${record.locale}/${record.slug}`
}
