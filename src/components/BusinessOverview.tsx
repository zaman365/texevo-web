import Link from 'next/link'
import { TextileIcon } from './TextileIcon'
import { audiences, services, businessHref, type BusinessLocale } from '@/content/business'

export function AudienceGrid({ locale = 'de' }: { locale?: BusinessLocale }) {
  const en = locale === 'en'
  return (
    <div className="audience-groups">
      {(['trade', 'teams'] as const).map((group) => (
        <div key={group}>
          <p className="eyebrow audience-group-label">
            {group === 'trade'
              ? en
                ? 'Brands & apparel trade'
                : 'Marken & Textilhandel'
              : en
                ? 'Teams & community'
                : 'Teams & Community'}
          </p>
          <div className={`audience-grid audience-grid-${group}`}>
            {audiences
              .filter((a) => a.group === group)
              .map((audience) => (
                <Link
                  className={`audience-card${audience.core ? ' audience-core' : ''}`}
                  href={businessHref(audience, locale)}
                  key={audience.id}
                >
                  <span className="audience-label">
                    {audience.core
                      ? en
                        ? 'Our focus'
                        : 'Unser Schwerpunkt'
                      : audience.id === 'retail'
                        ? en
                          ? 'Selected programmes'
                          : 'Ausgewählte Programme'
                        : audience.id === 'online'
                          ? en
                            ? 'Growing brands'
                            : 'Wachsende Marken'
                          : en
                            ? 'Apparel for your people'
                            : 'Bekleidung, die verbindet'}
                  </span>
                  <div className="audience-card-title">
                    <h3>{audience[locale].label}</h3>
                    <span aria-hidden="true">↗</span>
                  </div>
                  <p>{audience[locale].description}</p>
                  <span className="card-link">
                    {en ? 'Explore your options' : 'Möglichkeiten entdecken'}{' '}
                    <span aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export function ServiceGrid({ locale = 'de' }: { locale?: BusinessLocale }) {
  const en = locale === 'en'
  const supply = services[0]
  return (
    <div className="service-overview">
      <Link href={businessHref(supply, locale)} className="supply-card">
        <div>
          <p className="eyebrow">
            <TextileIcon kind="supply" /> 01 / {en ? 'Our core business' : 'Unser Hauptgeschäft'}
          </p>
          <h3>{supply[locale].label}</h3>
          <p>{supply[locale].description}</p>
        </div>
        <div className="supply-terms">
          <span>{supply[locale].basis}</span>
          <span className="card-link">
            {en ? 'Explore garment supply' : 'Bekleidungslieferung entdecken'}{' '}
            <span aria-hidden="true">↗</span>
          </span>
        </div>
      </Link>
      <p className="eyebrow service-group-label">
        {en
          ? 'To support your programme · Separately agreed'
          : 'Für Ihr Vorhaben ergänzbar · Separat vereinbart'}
      </p>
      <div className="service-grid">
        {services.slice(1).map((service, i) => (
          <Link className="service-card" href={businessHref(service, locale)} key={service.id}>
            <span className="service-number">
              <TextileIcon kind={service.id} />
              <span>
                0{i + 2} <span aria-hidden="true">↗</span>
              </span>
            </span>
            <h3>{service[locale].label}</h3>
            <p>{service[locale].description}</p>
            <p className="service-basis">{service[locale].basis}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
