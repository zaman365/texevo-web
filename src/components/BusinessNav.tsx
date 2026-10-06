import Link from 'next/link'
import { audiences, services, businessHref, type BusinessLocale } from '@/content/business'

export function BusinessNav({ locale }: { locale: BusinessLocale }) {
  const en = locale === 'en'
  return (
    <>
      <details className="nav-disclosure" name="business-navigation">
        <summary>
          {en ? 'Who we serve' : 'Für wen'} <span aria-hidden="true">⌄</span>
        </summary>
        <div className="nav-panel">
          <div className="nav-panel-intro">
            <span className="eyebrow">{en ? 'B2B apparel' : 'B2B-Bekleidung'}</span>
            <p>{en ? 'For your brand. For your business.' : 'Für Ihre Marke. Für Ihr Geschäft.'}</p>
            <Link className="text-link" href={`/${locale}/${en ? 'customers' : 'kunden'}`}>
              {en ? 'All customer groups' : 'Alle Kundengruppen'} →
            </Link>
          </div>
          {(['trade', 'teams'] as const).map((group) => (
            <div className="nav-panel-group" key={group}>
              <span className="eyebrow">
                {group === 'trade'
                  ? en
                    ? 'Brands & trade'
                    : 'Marken & Handel'
                  : en
                    ? 'Teams & community'
                    : 'Teams & Community'}
              </span>
              {audiences
                .filter((a) => a.group === group)
                .map((audience) => (
                  <Link href={businessHref(audience, locale)} key={audience.id}>
                    {audience[locale].label}
                    <span aria-hidden="true">↗</span>
                  </Link>
                ))}
              {group === 'teams' && !en && (
                <Link href="/de/teamkleidung">
                  Teamkleidung & Produktprofile<span aria-hidden="true">↗</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </details>
      <details className="nav-disclosure" name="business-navigation">
        <summary>
          {en ? 'Services' : 'Leistungen'} <span aria-hidden="true">⌄</span>
        </summary>
        <div className="nav-panel">
          <div className="nav-panel-intro">
            <span className="eyebrow">{en ? 'Our main business' : 'Unser Hauptgeschäft'}</span>
            <Link className="nav-supply-link" href={businessHref(services[0], locale)}>
              {services[0][locale].label} ↗
            </Link>
            <p className="nav-intro-small">
              {en
                ? 'Private label, custom production and repeat supply.'
                : 'Private Label, individuelle Produktion und wiederkehrende Belieferung.'}
            </p>
            <Link className="text-link" href={`/${locale}/${en ? 'services' : 'leistungen'}`}>
              {en ? 'All services' : 'Alle Leistungen'} →
            </Link>
          </div>
          <div className="nav-panel-group">
            <span className="eyebrow">
              {en ? 'Develop & customise' : 'Entwickeln & ausstatten'}
            </span>
            {services.slice(1, 3).map((s) => (
              <Link key={s.id} href={businessHref(s, locale)}>
                {s[locale].label}
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
            <Link href={`/${locale}/private-label`}>
              Private Label<span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="nav-panel-group">
            <span className="eyebrow">{en ? 'Coordinate & check' : 'Begleiten & prüfen'}</span>
            {services.slice(3).map((s) => (
              <Link key={s.id} href={businessHref(s, locale)}>
                {s[locale].label}
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </details>
    </>
  )
}
