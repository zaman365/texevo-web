import type { Metadata } from 'next'
import { randomUUID } from 'node:crypto'
import Link from 'next/link'
import Image from 'next/image'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getContent, getEditorPreview, searchContent } from '@/lib/content'
import { contactEmail, contactPhone, isPreview, siteURL } from '@/lib/env'
import { contentPath, type ContentRecord } from '@/content/types'
import { Home } from '@/components/Home'
import { AudienceGrid, ServiceGrid } from '@/components/BusinessOverview'
import { BuyerFAQ } from '@/components/ProductionJourney'
import { ContentCard } from '@/components/ContentCard'
import { BriefForm } from '@/components/BriefForm'
import { UtilityPage } from '@/components/UtilityPage'
import { SizeWorksheet } from '@/components/SizeWorksheet'
import { PrintButton } from '@/components/PrintButton'
import { categories } from '@/lib/brief-schema'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
type Props = {
  params: Promise<{ locale: string; slug?: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}
const titles: Record<string, string> = {
  wissen: 'Wissen für Ihren Textileinkauf.',
  journal: 'Notizen aus dem Aufbau.',
  materialien: 'Material. Verarbeitung. Gute Fragen.',
  downloads: 'Gut vorbereitet. Frei zugänglich.',
  anfrage: 'Ihr Vorhaben beginnt hier.',
  kontakt: 'Sprechen wir über Ihr Vorhaben.',
  nachbestellen: 'Die Referenz steht. Was ändert sich?',
  suche: 'Eine gute Frage verdient eine Antwort.',
  impressum: 'Impressum',
  datenschutz: 'Datenschutz',
  'cookie-einstellungen': 'Cookie-Einstellungen',
  newsletter: 'Wissen im Postfach.',
  'downloads/groessenliste': 'Größen erfassen. Den Überblick behalten.',
  contact: 'Tell us about your project.',
  legal: 'Legal notice',
  privacy: 'Privacy',
  eingang: 'Ihre Anfrage ist gespeichert.',
  receipt: 'Your enquiry has been saved.',
  'newsletter/bestaetigen': 'Newsletter-Anmeldung bestätigen',
  'newsletter/abmelden': 'Newsletter abbestellen',
}
const intro: Record<string, string> = {
  wissen: 'Konkrete Antworten für Auswahl, Veredelung und Freigabe. Ohne Anmeldung, ohne Umwege.',
  journal:
    'Gedanken zu Auswahl und Abläufen. Klar gekennzeichnete Perspektiven und Planungsbeispiele.',
  materialien: 'Was es ist. Wo es sinnvoll sein kann. Was Sie am echten Muster prüfen sollten.',
  downloads:
    'Praktische Vorlagen für Größen, Artwork und Musterfreigabe. Lesen, herunterladen oder ausdrucken.',
  anfrage:
    'Einsatz, grobe Menge und offene Fragen reichen für den Anfang. Ein Kundenkonto ist nicht nötig.',
  kontakt: 'Nutzen Sie das Kurzformular oder die freigegebenen Kontaktwege.',
  nachbestellen:
    'Nennen Sie Ihre frühere Auftrags- oder Musterreferenz und die gewünschten Änderungen. Verfügbarkeit, Preis und Termin werden neu geprüft.',
  contact:
    'A rough quantity, intended use and your open questions are enough to start. No account needed.',
}
const textParam = (v: string | string[] | undefined) =>
  typeof v === 'string' ? v.slice(0, 120) : ''

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const path = slug?.join('/') || ''
  const query = await searchParams
  const record = (await getContent()).find((r) => r.locale === locale && r.slug === path)
  const title =
    record?.title ||
    titles[path] ||
    (locale === 'en' ? 'Apparel for brands & trade' : 'Bekleidung für Marken & Handel')
  const canonical = `/${locale}${path ? `/${path}` : ''}`
  const noindex =
    isPreview ||
    !!query.preview ||
    ['suche', 'eingang', 'receipt', 'newsletter/bestaetigen', 'newsletter/abmelden'].includes(path)
  const description =
    record?.description ||
    intro[path] ||
    (locale === 'en'
      ? 'Private-label collections, custom production and repeat garment supply. Development, sourcing and production support for brands and the apparel trade.'
      : 'B2B-Bekleidung für Marken und Handel. Private Label, Entwicklung, Sourcing und Produktionsbegleitung.')
  return {
    title,
    description,
    alternates: {
      canonical,
      ...(!path ? { languages: { de: '/de', en: '/en' } } : {}),
      ...(record?.translation
        ? {
            languages: { [locale]: canonical, [locale === 'de' ? 'en' : 'de']: record.translation },
          }
        : {}),
    },
    robots: { index: !noindex, follow: !noindex },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: locale === 'de' ? 'de_DE' : 'en_GB',
      type: 'website',
    },
  }
}

export default async function Page({ params, searchParams }: Props) {
  const { locale: rawLocale, slug } = await params
  const query = await searchParams
  if (rawLocale !== 'de' && rawLocale !== 'en') notFound()
  const locale = rawLocale
  const en = locale === 'en'
  const path = slug?.join('/') || ''
  const records = await getContent()
  const local = records.filter((r) => r.locale === locale)
  if (!path) return <Home content={records} locale={locale} />
  let record = local.find((r) => r.slug === path)
  if (typeof query.preview === 'string') {
    const draft = await getEditorPreview(query.preview, await headers())
    if (!draft || draft.slug !== path || draft.locale !== locale) notFound()
    record = draft
  }
  if (en && !record && !['contact', 'legal', 'privacy', 'receipt'].includes(path)) notFound()
  if (!record && !titles[path]) notFound()
  const processPage = !!record && ['so-arbeiten-wir', 'process'].includes(path)
  const overview =
    record &&
    (['kunden', 'customers'].includes(path)
      ? 'audiences'
      : ['leistungen', 'services'].includes(path)
        ? 'services'
        : null)
  const form = ['anfrage', 'kontakt', 'contact', 'nachbestellen'].includes(path)
  const listKind = ({ wissen: 'knowledge', journal: 'journal', materialien: 'material' } as const)[
    path as 'wissen' | 'journal' | 'materialien'
  ]
  const isResource = record?.kind === 'resource'
  const title = record?.title || titles[path]
  const description = record?.description || intro[path]
  return (
    <>
      <section className="page-hero shell">
        <nav className="breadcrumb" aria-label={en ? 'Breadcrumb' : 'Brotkrumennavigation'}>
          <Link href={en ? '/en' : '/de'}>{en ? 'Overview' : 'Start'}</Link>
          <span aria-hidden="true">/</span>
          <span>
            {record?.eyebrow || (form ? (en ? 'Project brief' : 'Projektbriefing') : 'TEXEVO')}
          </span>
        </nav>
        <p className="eyebrow">
          {record?.eyebrow ||
            (form
              ? en
                ? 'One step at a time'
                : 'Ein Schritt nach dem anderen'
              : 'Die TEXEVO Werkmappe')}
        </p>
        <h1>{title}</h1>
        {description && <p className="lead">{description}</p>}
        {record?.ctaHref && (
          <Link className="button" href={record.ctaHref}>
            {record.ctaLabel || (en ? 'Start a brief' : 'Projekt anfragen')}
          </Link>
        )}
        {record && ['knowledge', 'journal', 'material'].includes(record.kind) && (
          <div className="article-meta">
            <span>{record.author}</span>
            {record.readingMinutes && <span>{record.readingMinutes} Min. Lesezeit</span>}
            <span>
              {record.reviewedAt
                ? `Geprüft: ${new Date(record.reviewedAt).toLocaleDateString('de-DE')}`
                : 'Fachliche Prüfung ausstehend'}
            </span>
          </div>
        )}
      </section>
      {form && (
        <div className="shell form-layout">
          <BriefForm
            locale={locale}
            preview={isPreview}
            idempotencyKey={randomUUID()}
            short={['kontakt', 'contact'].includes(path)}
            category={
              path === 'nachbestellen'
                ? 'reorder'
                : categories.includes(textParam(query.category) as (typeof categories)[number])
                  ? textParam(query.category)
                  : 'production'
            }
            product={textParam(query.product)}
            audience={textParam(query.audience)}
            service={textParam(query.service)}
            source={textParam(query.utm_source)}
            medium={textParam(query.utm_medium)}
            campaign={textParam(query.utm_campaign)}
          />
          <aside className="form-aside">
            <p className="eyebrow">{en ? 'What happens next' : 'Danach geht es so weiter'}</p>
            <h2>{en ? 'A clear next step.' : 'Ein klarer nächster Schritt.'}</h2>
            <ol>
              <li>
                {en ? 'Your brief receives a reference.' : 'Ihr Briefing erhält eine Referenz.'}
              </li>
              <li>
                {en
                  ? 'Open questions and feasibility are reviewed.'
                  : 'Offene Fragen und Machbarkeit werden geprüft.'}
              </li>
              <li>
                {en
                  ? 'Samples or a scoped quotation are agreed.'
                  : 'Muster oder ein abgegrenztes Angebot werden abgestimmt.'}
              </li>
            </ol>
            <p>
              {en
                ? 'No automatic order, price or delivery commitment.'
                : 'Keine automatische Bestellung, Preis- oder Lieferzusage.'}
            </p>
            {contactEmail ? (
              <p>
                <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              </p>
            ) : (
              <p className="review-note">
                {en
                  ? 'Direct contact details are pending approval.'
                  : 'Direkte Kontaktangaben werden vor dem Start ergänzt.'}
              </p>
            )}
            {contactPhone && (
              <p>
                <a href={`tel:${contactPhone.replace(/[^+\d]/g, '')}`}>{contactPhone}</a>
              </p>
            )}
            <Link className="text-link" href={en ? '/en/privacy' : '/de/datenschutz'}>
              {en ? 'How your data is handled' : 'So werden Ihre Daten verarbeitet'}
            </Link>
          </aside>
        </div>
      )}
      {overview && (
        <section className="shell business-index">
          {record?.status === 'illustrative' && (
            <p className="review-note">
              {en
                ? 'Review draft · Business details, scope and delivery capability are pending approval.'
                : 'Redaktionsentwurf · Unternehmensdaten, Leistungsumfang und Lieferfähigkeit sind noch zu bestätigen.'}
            </p>
          )}
          {overview === 'audiences' ? (
            <AudienceGrid locale={locale} />
          ) : (
            <ServiceGrid locale={locale} />
          )}
        </section>
      )}
      {record && !overview && (
        <>
          <div className="shell content-layout">
            <article className="prose">
              {(record.status === 'illustrative' || query.preview) && (
                <p className="review-note">
                  {query.preview
                    ? 'Geschützte Redaktionsvorschau · Noch nicht veröffentlicht.'
                    : en
                      ? 'Review draft. Project feasibility, business details and technical statements still need approval.'
                      : record.kind === 'product'
                        ? 'Planungsprofil · Kein freigegebener Katalogartikel. Technische Daten, Lieferant und Bildrechte noch offen.'
                        : 'Redaktionsentwurf zur Prüfung · Kein Nachweis ausgeführter Aufträge oder freigegebener Lieferfähigkeit.'}
                </p>
              )}
              {record.image && (
                <figure>
                  <Image src={record.image.url} alt={record.image.alt} width={1000} height={650} />
                  <figcaption>{record.image.caption}</figcaption>
                </figure>
              )}
              {record.facts && (
                <dl className="fact-list">
                  {record.facts.map((f) => (
                    <div key={f.label}>
                      <dt>{f.label}</dt>
                      <dd>{f.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {record.sections.map((s, i) => (
                <section key={s.heading} id={`abschnitt-${i + 1}`}>
                  <h2>{s.heading}</h2>
                  <p>{s.text}</p>
                  {s.items && (
                    <ul>
                      {s.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
              {(isResource || record.kind === 'product') && <PrintButton />}
              {record.slug === 'nachweise' && (
                <div className="button-row">
                  <Link className="text-link" href="/de/projekte/freigabe-beispiel">
                    Freigabe-Demonstration
                  </Link>
                  <Link className="text-link" href="/de/projekte/nachbestellung-beispiel">
                    Nachbestell-Demonstration
                  </Link>
                </div>
              )}
            </article>
            <aside className="article-aside">
              <div className="business-crosslinks">
                <Link href={`/${locale}/${en ? 'customers' : 'kunden'}`}>
                  {en ? 'All customer groups' : 'Alle Kundengruppen'} →
                </Link>
                <Link href={`/${locale}/${en ? 'services' : 'leistungen'}`}>
                  {en ? 'All services' : 'Alle Leistungen'} →
                </Link>
              </div>
              <p className="eyebrow">{en ? 'On this page' : 'Auf dieser Seite'}</p>
              <nav>
                {record.sections.map((s, i) => (
                  <a key={s.heading} href={`#abschnitt-${i + 1}`}>
                    {s.heading}
                  </a>
                ))}
              </nav>
              <Link
                className="button"
                href={record.ctaHref || (en ? '/en/contact' : '/de/anfrage')}
              >
                {record.ctaLabel || (en ? 'Discuss your project' : 'Ihr Vorhaben besprechen')}
              </Link>
            </aside>
          </div>
          {record.slug === 'teamkleidung' && (
            <section className="shell">
              <div className="index-intro">
                <h2>Welches Profil passt?</h2>
                <p>
                  Sechs Startpunkte für Ihr Briefing.{' '}
                  {isPreview
                    ? 'Die Profile sind Planungsbeispiele, keine freigegebenen Artikel.'
                    : 'Aktuelle Verfügbarkeit und Konditionen werden auf Anfrage geprüft.'}
                </p>
              </div>
              <div className="product-grid">
                {local
                  .filter((r) => r.kind === 'product')
                  .map((r) => (
                    <ContentCard key={r.slug} record={r} />
                  ))}
              </div>
            </section>
          )}
          {record.related?.length ? (
            <section className="section shell">
              <div className="section-heading">
                <h2>{en ? 'A useful next step' : 'Damit können Sie weiterarbeiten.'}</h2>
              </div>
              <div className="article-grid">
                {record.related
                  .map((slug) => local.find((r) => r.slug === slug))
                  .filter((r): r is ContentRecord => !!r)
                  .map((r) => (
                    <ContentCard key={r.slug} record={r} />
                  ))}
              </div>
            </section>
          ) : null}
        </>
      )}
      {processPage && <BuyerFAQ locale={locale} />}
      {listKind && (
        <section className="shell" style={{ paddingBottom: 80 }}>
          <nav className="filter-links" aria-label="Wissensbereiche">
            <Link aria-current={path === 'wissen' ? 'page' : undefined} href="/de/wissen">
              Einkaufsratgeber
            </Link>
            <Link aria-current={path === 'materialien' ? 'page' : undefined} href="/de/materialien">
              Material & Verfahren
            </Link>
            <Link aria-current={path === 'journal' ? 'page' : undefined} href="/de/journal">
              Journal
            </Link>
            <Link href="/de/downloads">Arbeitsblätter</Link>
          </nav>
          <div className="article-grid">
            {local
              .filter((r) => r.kind === listKind)
              .map((r) => (
                <ContentCard record={r} key={r.slug} />
              ))}
          </div>
        </section>
      )}
      {path === 'downloads' && (
        <section className="shell" style={{ paddingBottom: 80 }}>
          <div className="resource-list">
            {[
              {
                title: 'Die Größenliste',
                description: 'Mengen erfassen, Summe prüfen, CSV herunterladen.',
                href: '/de/downloads/groessenliste',
              },
              ...local
                .filter((r) => r.kind === 'resource')
                .map((r) => ({ title: r.title, description: r.description, href: contentPath(r) })),
            ].map((r) => (
              <Link className="resource-row" href={r.href} key={r.href}>
                <div>
                  <h2>{r.title}</h2>
                  <p>{r.description}</p>
                </div>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </section>
      )}
      {path === 'downloads/groessenliste' && (
        <div className="shell" style={{ paddingBottom: 80 }}>
          <SizeWorksheet />
        </div>
      )}
      {path === 'suche' && <Search records={local} query={textParam(query.q)} />}
      {!record &&
        [
          'impressum',
          'datenschutz',
          'cookie-einstellungen',
          'legal',
          'privacy',
          'newsletter',
        ].includes(path) && (
          <div className="shell">
            <UtilityPage slug={path} locale={locale} />
          </div>
        )}
      {['eingang', 'receipt'].includes(path) && (
        <div className="shell utility-content">
          <p>{en ? 'Please keep your reference:' : 'Bitte bewahren Sie Ihre Referenz auf:'}</p>
          <p className="receipt-code">
            {/^TX-\d{4}-[A-F0-9]{8}$/.test(textParam(query.reference))
              ? textParam(query.reference)
              : '—'}
          </p>
          <p>
            {isPreview
              ? en
                ? 'Test mode: no email was sent.'
                : 'Testmodus: Es wurde keine E-Mail versendet.'
              : en
                ? 'Your brief will be reviewed separately.'
                : 'Ihr Briefing wird gesondert geprüft.'}
          </p>
          <Link href={en ? '/en/contact' : '/de/anfrage'}>
            {en ? 'Another enquiry' : 'Weitere Anfrage'}
          </Link>
        </div>
      )}
      {['newsletter/bestaetigen', 'newsletter/abmelden'].includes(path) && (
        <div className="shell utility-content">
          <p>
            {path.endsWith('abmelden')
              ? 'Bestätigen Sie die Abmeldung. Es werden danach keine weiteren Newsletter an diese Adresse gesendet.'
              : 'Bestätigen Sie die Anmeldung mit einem Klick. Ohne Bestätigung bleibt der Newsletter deaktiviert.'}
          </p>
          <form action="/api/newsletter/confirm" method="post">
            <input type="hidden" name="token" value={textParam(query.token)} />
            <input
              type="hidden"
              name="action"
              value={path.endsWith('abmelden') ? 'withdraw' : 'confirm'}
            />
            <button className="button">
              {path.endsWith('abmelden') ? 'Abmeldung bestätigen' : 'Anmeldung bestätigen'}
            </button>
          </form>
        </div>
      )}
      {!isPreview &&
        record?.status === 'approved' &&
        ['knowledge', 'journal'].includes(record.kind) && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: record.title,
                description: record.description,
                url: `${siteURL}${contentPath(record)}`,
                inLanguage: locale,
              }).replace(/</g, '\\u003c'),
            }}
          />
        )}
    </>
  )
}
async function Search({ records, query }: { records: ContentRecord[]; query: string }) {
  let results = searchContent(records, query)
  if (!isPreview && query.trim()) {
    const { rows } = await db.query(
      `SELECT slug FROM app.public_search WHERE locale='de' AND (expires_at IS NULL OR expires_at>now()) AND document @@ websearch_to_tsquery('german',$1) ORDER BY ts_rank(document,websearch_to_tsquery('german',$1)) DESC LIMIT 40`,
      [query],
    )
    const slugs = new Set(rows.map((r) => r.slug))
    results = records.filter((r) => slugs.has(r.slug))
  }
  return (
    <div className="shell" style={{ paddingBottom: 80 }}>
      <form className="search-form" action="/de/suche">
        <label className="sr-only" htmlFor="search-query">
          Suchbegriff
        </label>
        <input
          id="search-query"
          name="q"
          defaultValue={query}
          placeholder="Zum Beispiel: Polo, Logo, Größen …"
          maxLength={120}
          type="search"
        />
        <button className="button">Suchen</button>
      </form>
      {query ? (
        <>
          <p role="status">
            {results.length} Ergebnisse für „{query}“
          </p>
          {results.length ? (
            <div className="result-list">
              {results.map((r) => (
                <article className="result-item" key={r.slug}>
                  <p className="eyebrow">{r.eyebrow}</p>
                  <h2>
                    <Link href={contentPath(r)}>{r.title}</Link>
                  </h2>
                  <p>{r.description}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>Noch keine passende Antwort?</h2>
              <p>Versuchen Sie einen kürzeren Begriff oder beschreiben Sie Ihre Frage direkt.</p>
              <Link className="button secondary" href="/de/anfrage">
                Eine Frage stellen
              </Link>
            </div>
          )}
        </>
      ) : (
        <p>
          Beliebte Einstiege: <Link href="/de/suche?q=Logo">Logo</Link> ·{' '}
          <Link href="/de/suche?q=Muster">Muster</Link> ·{' '}
          <Link href="/de/suche?q=Größen">Größen</Link>
        </p>
      )}
    </div>
  )
}
