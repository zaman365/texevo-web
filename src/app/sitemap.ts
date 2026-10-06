import type { MetadataRoute } from 'next'
import { getContent } from '@/lib/content'
import { contentPath } from '@/content/types'
import { isPreview, siteURL } from '@/lib/env'
export const dynamic = 'force-dynamic'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (isPreview) return []
  return [
    '/de',
    '/en',
    '/de/anfrage',
    '/de/wissen',
    '/de/journal',
    '/de/materialien',
    '/de/downloads',
    '/de/kontakt',
    '/en/contact',
    ...(await getContent()).map(contentPath),
  ].map((path) => ({ url: `${siteURL}${path}` }))
}
