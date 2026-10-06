import Image from 'next/image'
import Link from 'next/link'
import { ContentCard } from './ContentCard'
import { AudienceGrid, ServiceGrid } from './BusinessOverview'
import { ProductionJourney, BuyerFAQ } from './ProductionJourney'
import { TextileIcon } from './TextileIcon'
import { productionStages } from '@/content/journey'
import { enquiryHref, type BusinessLocale } from '@/content/business'
import type { ContentRecord } from '@/content/types'
import { isPreview } from '@/lib/env'

export function Home({
  content,
  locale = 'de',
}: {
  content: ContentRecord[]
  locale?: BusinessLocale
}) {
  const en = locale === 'en'
  const t = (de: string, english: string) => (en ? english : de)
  return (
    <div className="studio-home">
      <section className="studio-hero shell" aria-labelledby="home-title">
        <div className="studio-hero-top">
          <div>
            <p className="eyebrow">
              <span className="status-dot" />{' '}
              {t('TEXEVO / Bekleidung für Marken & Handel', 'TEXEVO / Apparel for brands & trade')}
            </p>
            <h1 id="home-title">
              {t('Ihre Marke.', 'Your brand.')}
              <br />
              <span>{t('Vom Stoff', 'From fabric')}</span>
              <br />
              <em>{t('zur Serie.', 'to collection.')}</em>
            </h1>
          </div>
          <div className="studio-hero-intro">
            <p>
              {t(
                'Gute Bekleidung beginnt mit einer klaren Verbindung.',
                'Good apparel starts with a clear connection.',
              )}
            </p>
            <p>
              {t(
                'Private-Label-Kollektionen, individuelle Produktion und wiederkehrende Belieferung. TEXEVO bringt Produktentwicklung, Beschaffung und Bekleidungslieferung in einen verständlichen Ablauf.',
                'Private-label collections, custom production and repeat supply. TEXEVO connects product development, sourcing and garment supply through a clearly defined process.',
              )}
            </p>
            <div className="button-row">
              <Link className="button" href={enquiryHref(locale)}>
                {t('Bekleidung anfragen', 'Discuss garment supply')}{' '}
                <span aria-hidden="true">↗</span>
              </Link>
              <a className="text-link" href="#leistungen">
                {t('Leistungen entdecken', 'Explore services')} ↓
              </a>
            </div>
            <span className="hero-footnote">
              {t(
                'Für etablierte Marken, Importeure und Großhandel.',
                'For established brands, importers and wholesalers.',
              )}
            </span>
          </div>
        </div>
        <div className="collection-board">
          <div className="board-toolbar">
            <span>
              <span className="board-symbol" aria-hidden="true">
                T/
              </span>{' '}
              TEXEVO <span className="toolbar-divider">/</span>{' '}
              {t('Der Weg zum Produkt', 'The route to your product')}
            </span>
            <span className="quiet-badge">{t('Ablaufbeispiel', 'Illustrative workflow')}</span>
          </div>
          <div className="board-content">
            <figure className="hero-visual">
              <Image
                src="/images/textile-study.webp"
                alt={t(
                  'Illustrative Textilstudie mit sandfarbenem Overshirt, Stoffmustern und Schnittteilen',
                  'Illustrative textile study with a sand overshirt, fabric swatches and pattern pieces',
                )}
                width={1536}
                height={1024}
                preload
                sizes="(max-width: 767px) 100vw, 60vw"
              />
              <figcaption>
                {t(
                  'KI-generierte Textilstudie · Kein Produkt- oder Liefernachweis.',
                  'AI-generated textile study · Not product or supply evidence.',
                )}
              </figcaption>
            </figure>
            <div className="product-notes">
              <p className="eyebrow">
                {t(
                  'Aus einzelnen Entscheidungen wird ein Produkt',
                  'Small decisions. A considered product.',
                )}
              </p>
              <h2>
                {t('Ein Briefing.', 'One brief.')}
                <br />
                <em>{t('Ein gemeinsamer Faden.', 'A shared direction.')}</em>
              </h2>
              <div className="sample-note">
                <TextileIcon kind="development" />
                <div>
                  <strong>{t('Spezifikation', 'Specification')}</strong>
                  <span>{t('Material, Passform & Ausstattung', 'Materials, fit & finishing')}</span>
                </div>
                <span className="note-index">01</span>
              </div>
              <div className="sample-note">
                <TextileIcon kind="quality" />
                <div>
                  <strong>{t('Muster & Freigabe', 'Samples & approval')}</strong>
                  <span>
                    {t('Prüfen. Kommentieren. Festhalten.', 'Review. Comment. Document.')}
                  </span>
                </div>
                <span className="note-index">02</span>
              </div>
              <div className="sample-note">
                <TextileIcon kind="logistics" />
                <div>
                  <strong>{t('Serie & Nachlieferung', 'Production & repeat supply')}</strong>
                  <span>
                    {t('Auf einer klaren Referenz aufbauen', 'Build on a clear reference')}
                  </span>
                </div>
                <span className="note-index">03</span>
              </div>
              <a href="#prozess" className="text-link">
                {t('So greifen die Schritte ineinander', 'Explore the connected steps')} ↗
              </a>
            </div>
          </div>
          <div
            className="board-stages"
            aria-label={t('Produktionsphasen im Überblick', 'Production stages at a glance')}
          >
            {productionStages.map((stage, i) => (
              <span key={stage.id}>
                <small>{String(i + 1).padStart(2, '0')}</small>
                {stage[locale].short}
                {i < 6 && (
                  <span className="stage-arrow" aria-hidden="true">
                    →
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      <nav className="section-index shell" aria-label={t('Auf der Startseite', 'On this page')}>
        <span>{t('TEXEVO entdecken', 'Explore TEXEVO')}</span>
        <a href="#kundengruppen">{t('Für wen', 'Who we serve')}</a>
        <a href="#leistungen">{t('Leistungen', 'Services')}</a>
        <a href="#zusammenarbeit">{t('Zusammenarbeit', 'Working together')}</a>
        <a href="#prozess">{t('Ablauf', 'Process')}</a>
        <a href="#fragen">{t('Fragen', 'Questions')}</a>
      </nav>

      <section className="section shell" id="kundengruppen">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              {t('Ihr Geschäft gibt die Richtung vor', 'Built around your business')}
            </p>
            <h2>
              {t('Viele Anforderungen.', 'Different needs.')}
              <br />
              <em>{t('Ein klarer Textilfokus.', 'A clear apparel focus.')}</em>
            </h2>
          </div>
          <Link className="text-link" href={`/${locale}/${en ? 'customers' : 'kunden'}`}>
            {t('Alle Kundengruppen', 'All customer groups')} ↗
          </Link>
        </div>
        <p className="section-lead">
          {t(
            'Im Mittelpunkt stehen etablierte europäische Modemarken und der Textilhandel. Dazu kommen ausgewählte Retail- und Online-Programme sowie Bekleidung für Teams und Communities.',
            'Established European fashion brands and the apparel trade are our focus, alongside selected retail and online programmes, uniforms and community merchandise.',
          )}
        </p>
        <AudienceGrid locale={locale} />
      </section>

      <section className="services-surface" id="leistungen">
        <div className="section shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">{t('Das Angebot', 'Our offer')}</p>
              <h2>
                {t('Bekleidung im Mittelpunkt.', 'Garment supply at the centre.')}
                <br />
                <em>{t('Kompetenz in jedem Detail.', 'Care in every detail.')}</em>
              </h2>
            </div>
            <Link className="text-link" href={`/${locale}/${en ? 'services' : 'leistungen'}`}>
              {t('Alle Leistungen', 'All services')} ↗
            </Link>
          </div>
          <ServiceGrid locale={locale} />
        </div>
      </section>

      <section className="section shell collaboration-section" id="zusammenarbeit">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              {t('So passt TEXEVO zu Ihrem Einkauf', 'A working model that fits')}
            </p>
            <h2>
              {t('Ihre Ware. Ihr Projekt.', 'Your products. Your project.')}
              <br />
              <em>{t('Klare Verantwortlichkeiten.', 'Clear responsibilities.')}</em>
            </h2>
          </div>
          <p>
            {t(
              'Entscheidend ist, wer was übernimmt. Das legen wir vor dem ersten Auftrag gemeinsam fest.',
              'The important question is who takes responsibility for what. We agree that before the first assignment.',
            )}
          </p>
        </div>
        <div className="working-models">
          <article className="working-model primary-model">
            <span className="eyebrow">01 / {t('Unser Hauptgeschäft', 'Our core business')}</span>
            <h3>{t('Sie kaufen Bekleidung.', 'You buy garments.')}</h3>
            <p>
              {t(
                'TEXEVO liefert die vereinbarten Kleidungsstücke. Spezifikation, Mengen, Ausstattung und Lieferbedingungen bilden die Grundlage Ihres Angebots.',
                'TEXEVO supplies the agreed garments. Specifications, quantities, finishing and delivery terms form the basis of your quotation.',
              )}
            </p>
            <dl>
              <div>
                <dt>{t('Abrechnung', 'Pricing')}</dt>
                <dd>{t('Großhandelspreis je Kleidungsstück', 'Wholesale price per garment')}</dd>
              </div>
              <div>
                <dt>{t('Passend für', 'Suitable for')}</dt>
                <dd>
                  {t(
                    'Kollektionen, Großmengen & Nachlieferprogramme',
                    'Collections, bulk orders & repeat supply',
                  )}
                </dd>
              </div>
            </dl>
            <Link className="text-link" href={enquiryHref(locale)}>
              {t('Warenbedarf besprechen', 'Discuss garment supply')} ↗
            </Link>
          </article>
          <article className="working-model">
            <span className="eyebrow">
              02 / {t('Separates Service-Mandat', 'Separate service mandate')}
            </span>
            <h3>{t('Sie erweitern Ihren Einkauf.', 'You extend your buying team.')}</h3>
            <p>
              {t(
                'Sie beauftragen die Fabrik direkt. TEXEVO begleitet einen definierten Teil Ihrer Beschaffung oder Produktion – projektbezogen oder fortlaufend.',
                'You contract the factory directly. TEXEVO supports a defined part of sourcing or production, for a single project or on an ongoing basis.',
              )}
            </p>
            <dl>
              <div>
                <dt>{t('Abrechnung', 'Pricing')}</dt>
                <dd>
                  {t(
                    'Projekt- oder Monatshonorar nach Vereinbarung',
                    'Agreed project or monthly fee',
                  )}
                </dd>
              </div>
              <div>
                <dt>{t('Passend für', 'Suitable for')}</dt>
                <dd>
                  {t(
                    'Lieferantenportfolio, Kategorien & Programme',
                    'Supplier portfolios, categories & programmes',
                  )}
                </dd>
              </div>
            </dl>
            <Link className="text-link" href={enquiryHref(locale, 'office')}>
              {t('Mandat besprechen', 'Discuss a mandate')} ↗
            </Link>
          </article>
        </div>
      </section>

      <ProductionJourney locale={locale} />

      <section className="clarity-band">
        <div className="shell">
          <p className="eyebrow">
            {t('Was einen guten Ablauf trägt', 'What makes a process work')}
          </p>
          <div className="clarity-grid">
            {[
              [
                t('Eine belastbare Referenz.', 'A reliable reference.'),
                t(
                  'Spezifikation, Musterstand und Freigaben nachvollziehbar dokumentieren.',
                  'Keep specifications, sample versions and approvals documented.',
                ),
              ],
              [
                t('Vereinbarte Meilensteine.', 'Agreed milestones.'),
                t(
                  'Entscheidungen, Zuständigkeiten und offene Punkte frühzeitig abstimmen.',
                  'Agree decisions, responsibilities and open questions early.',
                ),
              ],
              [
                t('Ein sauberer Anschluss.', 'A considered next order.'),
                t(
                  'Folgeaufträge auf vorhandenen Referenzen und neu bestätigten Konditionen aufbauen.',
                  'Build repeat orders on existing references and newly confirmed terms.',
                ),
              ],
            ].map(([title, text], i) => (
              <div key={title}>
                <span>0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section shell preparation-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              {t('Gut vorbereitet ins Gespräch', 'Prepare for a useful conversation')}
            </p>
            <h2>
              {t('Weniger offene Fragen.', 'A little preparation.')}
              <br />
              <em>{t('Ein besserer Anfang.', 'A better first brief.')}</em>
            </h2>
          </div>
          <Link className="text-link" href="/de/wissen">
            {t('Zur Werkmappe', 'Buyer resources in German')} ↗
          </Link>
        </div>
        <div className="article-grid">
          {(en
            ? ['product-development', 'quality-support', 'delivery-coordination']
            : ['wissen/lagerware-oder-produktion', 'wissen/musterfreigabe', 'wissen/logo-dateien']
          )
            .map((slug) => content.find((r) => r.locale === locale && r.slug === slug))
            .filter((r): r is ContentRecord => !!r)
            .map((record) => (
              <ContentCard key={record.slug} record={record} />
            ))}
        </div>
        <div className="resource-links">
          <Link href="/de/materialien">
            {t('Material & Verfahren', 'Materials & techniques (DE)')} ↗
          </Link>
          <Link href="/de/downloads">
            {t('Checklisten & Arbeitsblätter', 'Checklists & worksheets (DE)')} ↗
          </Link>
          <Link href="/de/downloads/groessenliste">
            {t('Interaktive Größenliste', 'Interactive size worksheet (DE)')} ↗
          </Link>
        </div>
      </section>

      <BuyerFAQ locale={locale} />
      <section className="studio-closing shell">
        <div>
          <p className="eyebrow">
            {t('Der nächste Schritt ist ein Gespräch', 'The next step is a conversation')}
          </p>
          <h2>
            {t('Was möchten Sie', 'What would you like')}
            <br />
            <em>{t('auf den Weg bringen?', 'to bring to life?')}</em>
          </h2>
          <p>
            {t(
              'Produktgruppe, ungefähre Menge und Ihre offenen Fragen reichen für den Anfang.',
              'A product category, a rough quantity and your open questions are enough to start.',
            )}
          </p>
        </div>
        <div>
          <Link className="button" href={enquiryHref(locale)}>
            {t('Projekt beschreiben', 'Describe your project')} ↗
          </Link>
          <p>
            {isPreview
              ? t(
                  'Vorschau · Bitte nur Testdaten verwenden.',
                  'Preview · Please use test data only.',
                )
              : t(
                  'Ohne Kundenkonto. Unverbindlich anfragen.',
                  'No account needed. Enquire without commitment.',
                )}
          </p>
        </div>
      </section>
    </div>
  )
}
