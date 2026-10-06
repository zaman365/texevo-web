import Link from 'next/link'
export function Footer({ locale }: { locale: 'de' | 'en' }) {
  const en = locale === 'en'
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <Link className="wordmark" href="/de">
            TEXEVO
          </Link>
          <p>
            {en ? (
              'From the first question to a clear next step.'
            ) : (
              <>
                Vom ersten Gedanken
                <br />
                zum nächsten klaren Schritt.
              </>
            )}
          </p>
        </div>
        <div>
          <span className="eyebrow">{en ? 'Your project' : 'Ihr Vorhaben'}</span>
          <Link href="/de/teamkleidung">Teamkleidung</Link>
          <Link href={`/${locale}/private-label`}>Private Label</Link>
          <Link href={`/${locale}/sourcing-office`}>Sourcing Office</Link>
          <Link href={en ? '/en/contact' : '/de/partner'}>{en ? 'Contact' : 'Für Partner'}</Link>
        </div>
        <div>
          <span className="eyebrow">{en ? 'Useful information (DE)' : 'Gut vorbereitet'}</span>
          <Link href="/de/wissen">Wissen</Link>
          <Link href="/de/materialien">Material & Verfahren</Link>
          <Link href="/de/downloads">Arbeitsblätter</Link>
          <Link href="/de/journal">Journal</Link>
        </div>
        <div>
          <span className="eyebrow">{en ? 'Get in touch' : 'Im Gespräch bleiben'}</span>
          <Link href={en ? '/en/contact' : '/de/kontakt'}>
            {en ? 'Contact options' : 'Kontakt'}
          </Link>
          <Link href="/de/muster">Muster besprechen</Link>
          <Link href="/de/nachbestellen">Nachbestellung</Link>
          <Link href="/de/newsletter">Newsletter</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} TEXEVO · {en ? 'B2B textiles' : 'Textilien für Unternehmen'}
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
