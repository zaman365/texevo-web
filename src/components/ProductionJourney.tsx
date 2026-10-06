import Image from 'next/image'
import Link from 'next/link'
import { productionStages, buyerQuestions } from '@/content/journey'
import { enquiryHref, type BusinessLocale } from '@/content/business'

export function ProductionJourney({ locale = 'de' }: { locale?: BusinessLocale }) {
  const en = locale === 'en'
  return (
    <section className="section shell journey-section" id="prozess" aria-labelledby="journey-title">
      <div className="journey-intro">
        <p className="eyebrow">
          {en ? 'A clear route through production' : 'Ein nachvollziehbarer Weg'}
        </p>
        <h2 id="journey-title">
          {en ? (
            <>
              Every stage.
              <br />
              <em>A clear next step.</em>
            </>
          ) : (
            <>
              Jeder Schritt.
              <br />
              <em>Klar durchdacht.</em>
            </>
          )}
        </h2>
        <p>
          {en
            ? 'See what each stage should produce and which decisions move your project forward. Scope, timing and responsibilities are agreed for your order.'
            : 'Erfahren Sie, was in jeder Phase entsteht und welche Entscheidungen Ihr Projekt weiterbringen. Umfang, Termine und Zuständigkeiten werden für Ihren Auftrag vereinbart.'}
        </p>
        <figure className="journey-photo">
          <Image
            src="/images/textile-study.webp"
            alt={
              en
                ? 'Illustrative arrangement of a cotton overshirt, fabric swatches and pattern pieces'
                : 'Illustrative Anordnung aus Baumwoll-Overshirt, Stoffmustern und Schnittteilen'
            }
            width={1536}
            height={1024}
            sizes="(max-width: 767px) 100vw, 36vw"
          />
          <figcaption>
            {en
              ? 'AI-generated textile study · Illustration'
              : 'KI-generierte Textilstudie · Illustration'}
          </figcaption>
        </figure>
        <Link className="text-link" href={en ? '/en/process' : '/de/so-arbeiten-wir'}>
          {en ? 'Read the complete process' : 'Den gesamten Ablauf ansehen'} ↗
        </Link>
      </div>
      <div className="journey-stages">
        {productionStages.map((stage, i) => (
          <details
            className="journey-stage"
            key={stage.id}
            name={`production-journey-${locale}`}
            open={i === 0}
          >
            <summary>
              <span className="stage-number">{String(i + 1).padStart(2, '0')}</span>
              <span>{stage[locale].title}</span>
              <span className="disclosure-mark" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="stage-content">
              <p>{stage[locale].text}</p>
              <dl>
                <div>
                  <dt>{en ? 'The result' : 'Das Ergebnis'}</dt>
                  <dd>{stage[locale].output}</dd>
                </div>
                <div>
                  <dt>{en ? 'The decision' : 'Die Entscheidung'}</dt>
                  <dd>{stage[locale].decision}</dd>
                </div>
              </dl>
              <Link className="text-link" href={enquiryHref(locale, stage.service)}>
                {en ? 'Discuss this step' : 'Diesen Schritt besprechen'} ↗
              </Link>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}

export function BuyerFAQ({ locale = 'de' }: { locale?: BusinessLocale }) {
  const en = locale === 'en'
  return (
    <section className="section shell buyer-faq" id="fragen" aria-labelledby="faq-title">
      <div>
        <p className="eyebrow">{en ? 'Before we begin' : 'Vor dem ersten Gespräch'}</p>
        <h2 id="faq-title">
          {en ? (
            <>
              Good questions.
              <br />
              <em>Clear answers.</em>
            </>
          ) : (
            <>
              Gute Fragen.
              <br />
              <em>Klare Antworten.</em>
            </>
          )}
        </h2>
        <p>
          {en
            ? 'A few useful answers for your first brief. You can leave the rest open.'
            : 'Die wichtigsten Antworten für Ihr erstes Briefing. Alles Weitere dürfen Sie offenlassen.'}
        </p>
        <Link href={en ? '/en/contact' : '/de/kontakt'} className="text-link">
          {en ? 'Ask your question' : 'Ihre Frage stellen'} ↗
        </Link>
      </div>
      <div>
        {buyerQuestions[locale].map(({ question, answer }) => (
          <details className="faq-item" key={question} name={`buyer-faq-${locale}`}>
            <summary>
              {question}
              <span className="disclosure-mark" aria-hidden="true">
                +
              </span>
            </summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
