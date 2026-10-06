import Image from 'next/image'
import Link from 'next/link'
import { ContentCard } from './ContentCard'
import type { ContentRecord } from '@/content/types'
import { isPreview } from '@/lib/env'
export function Home({ content }: { content: ContentRecord[] }) {
  return (
    <>
      <section className="home-hero shell">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="short-rule" />
            Für Unternehmen. Für Ihr Team.
          </p>
          <h1>
            Ihr Team.
            <br />
            Ihr Stoff.
            <br />
            <em>Ihr nächster Schritt.</em>
          </h1>
          <p className="hero-description">
            Polos, Shirts und Hoodies passend zu Einsatz, Größen und Veredelung. Gemeinsam
            ausgewählt. Klar freigegeben.
          </p>
          <div className="hero-actions">
            <Link className="button" href="/de/anfrage?category=team">
              Teamkleidung anfragen <span aria-hidden="true">↗</span>
            </Link>
            <span>Auch für Anfragen um 100 Stück.</span>
          </div>
          <Link className="text-link" href="/de/private-label">
            Eine eigene Kollektion? Private Label entdecken
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
          ['01', 'Auswählen', 'Material & Passform'],
          ['02', 'Freigeben', 'Muster & Veredelung'],
          ['03', 'Dokumentieren', 'Eine klare Referenz'],
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
      <section className="section shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Ihr Bedarf bestimmt den Weg</p>
            <h2>Was haben Sie vor?</h2>
          </div>
          <p>
            Ein fokussierter Einstieg.
            <br />
            Die richtigen Fragen für Ihr Projekt.
          </p>
        </div>
        <div className="route-grid">
          {content
            .filter((r) => r.locale === 'de' && r.kind === 'offer')
            .map((r, i) => (
              <ContentCard key={r.slug} record={r} number={i + 1} />
            ))}
        </div>
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
