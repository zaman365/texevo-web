import Image from 'next/image'
import Link from 'next/link'
import { ContentCard } from './ContentCard'
import { AudienceGrid, ServiceGrid } from './BusinessOverview'
import type { ContentRecord } from '@/content/types'
import { isPreview } from '@/lib/env'
export function Home({ content }: { content: ContentRecord[] }) {
  return (
    <>
      <section className="home-hero shell">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="short-rule" />
            B2B-Bekleidung für Marken & Handel.
          </p>
          <h1>
            Ihre Marke.
            <br />
            Ihr Sortiment.
            <br />
            <em>Unser Fokus.</em>
          </h1>
          <p className="hero-description">
            Private-Label-Kollektionen, individuelle Produktion und fertige Bekleidung für Ihr
            Geschäft. Von der ersten Entwicklung bis zur wiederkehrenden Belieferung.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/de/anfrage?category=production&service=supply">
              Bekleidung anfragen <span aria-hidden="true">↗</span>
            </Link>
            <span>Für etablierte Modemarken, Importeure und Großhandel.</span>
          </div>
          <Link className="text-link" href="/de/leistungen">
            Alle Leistungen im Überblick
          </Link>
        </div>
        <figure className="hero-visual">
          <Image
            src="/images/fabric-study.jpg"
            alt="Gefaltete Stoffe in mehreren Farben als textile Materialstudie"
            width={1000}
            height={1250}
            priority
            sizes="(max-width: 767px) 100vw, 48vw"
          />
          <div className="photo-label">
            <span>Material. Farbe. Gefühl.</span>
            <span>
              Jede Entscheidung beginnt
              <br />
              mit genauem Hinsehen.
            </span>
          </div>
          <figcaption>
            Materialstudie · Foto: Moonstarious Project / Unsplash
            <br />
            Illustrationsfoto, kein TEXEVO Produkt- oder Liefernachweis.
          </figcaption>
        </figure>
      </section>
      <section className="process-strip shell" aria-label="Unser Ablauf">
        {[
          ['01', 'Entwickeln', 'Spezifikation & Muster'],
          ['02', 'Produzieren', 'Bekleidung & Ausstattung'],
          ['03', 'Weiterdenken', 'Lieferung & Folgeaufträge'],
        ].map(([n, title, detail]) => (
          <Link href="/de/so-arbeiten-wir" key={n}>
            <span className="process-number">{n}</span>
            <div>
              <h2>{title}</h2>
              <p>{detail}</p>
            </div>
            <span aria-hidden="true">↗</span>
          </Link>
        ))}
      </section>
      <section className="section shell" id="kundengruppen">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Für wen wir arbeiten</p>
            <h2>
              Ihr Geschäft.
              <br />
              Der passende Textilpartner.
            </h2>
          </div>
          <Link className="text-link" href="/de/kunden">
            Alle Kundengruppen →
          </Link>
        </div>
        <p className="section-lead">
          Unser Schwerpunkt liegt auf etablierten europäischen Modemarken und dem Textilhandel. Dazu
          kommen ausgewählte Retail- und Online-Programme sowie Bekleidung für Teams und
          Communities.
        </p>
        <AudienceGrid />
      </section>
      <section className="section shell services-section" id="leistungen">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Was wir für Sie übernehmen</p>
            <h2>
              Bekleidung im Mittelpunkt.
              <br />
              Service, wo er weiterhilft.
            </h2>
          </div>
          <Link className="text-link" href="/de/leistungen">
            Alle Leistungen →
          </Link>
        </div>
        <ServiceGrid />
      </section>
      <section className="material-feature">
        <div className="shell material-inner">
          <div className="material-type">
            <span className="eyebrow">Die kleine Materialbibliothek</span>
            <span className="giant-serif">
              Stoff für
              <br />
              <em>gute Fragen.</em>
            </span>
            <Link href="/de/materialien" className="button light">
              Material & Verfahren entdecken
            </Link>
          </div>
          <div className="material-notes">
            <p className="eyebrow">Nicht nur eine Frage der Farbe.</p>
            <h2>
              Wie fühlt es sich an?
              <br />
              Wie wird es genutzt?
              <br />
              Was muss es aushalten?
            </h2>
            <p>
              Ein Bildschirm zeigt einen Ausschnitt. Unsere Materialeinträge helfen, die richtigen
              Eigenschaften zu prüfen – und zu erkennen, wann ein echtes Muster nötig ist.
            </p>
            <div className="material-links">
              <Link href="/de/materialien/pique">01 / Piqué</Link>
              <Link href="/de/materialien/jersey">02 / Jersey</Link>
              <Link href="/de/materialien/stick">03 / Stick</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Wissen, das weiterhilft</p>
            <h2>
              Vor der Anfrage.
              <br />
              Schon einen Schritt weiter.
            </h2>
          </div>
          <Link className="text-link" href="/de/wissen">
            Alle Einkaufsratgeber
          </Link>
        </div>
        <div className="article-grid">
          {content
            .filter((r) => r.kind === 'knowledge')
            .slice(0, 3)
            .map((r) => (
              <ContentCard key={r.slug} record={r} />
            ))}
        </div>
      </section>
      <section className="brief-banner shell">
        <div>
          <p className="eyebrow">Noch nicht alles geklärt?</p>
          <h2>
            Ein guter Anfang
            <br />
            braucht kein fertiges Briefing.
          </h2>
          <p>Einsatz, grobe Menge und Ihre offenen Fragen reichen für den ersten Schritt.</p>
        </div>
        <div>
          <Link className="button" href="/de/anfrage">
            Projekt beschreiben <span aria-hidden="true">↗</span>
          </Link>
          <p>
            {isPreview
              ? 'Vorschau: Nur mit Testdaten ausprobieren.'
              : 'Ohne Kundenkonto. Ohne Bestellverpflichtung.'}
          </p>
        </div>
      </section>
    </>
  )
}
