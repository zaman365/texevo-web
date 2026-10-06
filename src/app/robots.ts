import type { MetadataRoute } from 'next'
import { isPreview, siteURL } from '@/lib/env'
export default function robots(): MetadataRoute.Robots {
  return {
    rules: isPreview
      ? { userAgent: '*', disallow: '/' }
      : {
          userAgent: '*',
          allow: '/',
          disallow: [
            '/admin',
            '/cms-api',
            '/api',
            '/de/suche',
            '/de/eingang',
            '/en/receipt',
            '/konto',
          ],
        },
    ...(isPreview ? {} : { sitemap: `${siteURL}/sitemap.xml` }),
  }
}
