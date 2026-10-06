import Link from 'next/link'
import { audiences, services, businessHref } from '@/content/business'
export function Footer({ locale }: { locale: 'de' | 'en' }) {
  const en = locale === 'en'
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <Link className="wordmark" href={en ? '/en/services' : '/de'}>
            TEXEVO
          </Link>
          <p>
            {en
              ? 'Garments for brands and the apparel trade. From development to repeat supply.'
              : 'Bekleidung für Marken und Handel. Von der Entwicklung bis zur wiederkehrenden Belieferung.'}
          </p>
          <Link className="text-link" href={en ? '/en/contact' : '/de/anfrage'}>
            {en ? 'Discuss your project' : 'Projekt besprechen'} →
          </Link>
        </div>
        <div>
          <Link className="eyebrow" href={`/${locale}/${en ? 'customers' : 'kunden'}`}>
            {en ? 'Who we serve' : 'Für wen'}
          </Link>
          {audiences.map((a) => (
            <Link key={a.id} href={businessHref(a, locale)}>
              {a[locale].label}
            </Link>
          ))}
          {!en && <Link href="/de/teamkleidung">Teamkleidung & Produktprofile</Link>}
        </div>
        <div>
          <Link className="eyebrow" href={`/${locale}/${en ? 'services' : 'leistungen'}`}>
            {en ? 'Services' : 'Leistungen'}
          </Link>
          {services.map((s) => (
            <Link key={s.id} href={businessHref(s, locale)}>
              {s[locale].label}
            </Link>
          ))}
          <Link href={`/${locale}/private-label`}>Private Label</Link>
        </div>
        <div>
          <span className="eyebrow">{en ? 'Useful information (DE)' : 'Gut vorbereitet'}</span>
          <Link href="/de/so-arbeiten-wir">So arbeiten wir</Link>
          <Link href="/de/wissen">Wissen & Einkaufsratgeber</Link>
          <Link href="/de/materialien">Material & Verfahren</Link>
          <Link href="/de/downloads">Arbeitsblätter</Link>
          <Link href="/de/journal">Journal</Link>
          <Link href="/de/ueber-uns">Über TEXEVO</Link>
          <Link href="/de/partner">Für Partner</Link>
          <Link href="/de/muster">Muster besprechen</Link>
          <Link href="/de/nachbestellen">Nachbestellung</Link>
          <Link href={en ? '/en/contact' : '/de/kontakt'}>{en ? 'Contact' : 'Kontakt'}</Link>
          <Link href="/de/newsletter">Newsletter</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} TEXEVO · {en ? 'B2B apparel' : 'B2B-Bekleidung'}
        </span>
        <div>
          <Link href={`/${locale}/${en ? 'legal' : 'impressum'}`}>
            {en ? 'Legal notice' : 'Impressum'}
          </Link>
          <Link href={`/${locale}/${en ? 'privacy' : 'datenschutz'}`}>
            {en ? 'Privacy' : 'Datenschutz'}
          </Link>
          <Link href="/de/cookie-einstellungen">Cookies</Link>
        </div>
      </div>
    </footer>
  )
}
