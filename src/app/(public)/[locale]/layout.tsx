import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import '@fontsource/source-sans-3/latin-400.css'
import '@fontsource/source-sans-3/latin-600.css'
import '@fontsource/source-serif-4/latin-400.css'
import '@fontsource/source-serif-4/latin-400-italic.css'
import '@/styles/globals.css'
import '@/styles/studio.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { isPreview, siteURL } from '@/lib/env'

export const metadata: Metadata = {
  metadataBase: new URL(siteURL),
  title: { default: 'TEXEVO · Textilien für Unternehmen', template: '%s | TEXEVO' },
  description:
    'B2B-Bekleidung für Marken und Handel. Private Label, Entwicklung, Veredelung, Sourcing und Produktionsbegleitung.',
  icons: { icon: '/favicon.svg' },
  robots: isPreview ? { index: false, follow: false } : { index: true, follow: true },
}
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (locale !== 'de' && locale !== 'en') notFound()
  return (
    <html lang={locale}>
      <body>
        <a className="skip-link" href="#main">
          {locale === 'de' ? 'Zum Inhalt' : 'Skip to content'}
        </a>
        <Header locale={locale} preview={isPreview} />
        <main id="main">{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  )
}
