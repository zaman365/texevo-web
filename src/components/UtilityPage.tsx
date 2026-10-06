import Link from 'next/link'
import { contactEmail, contactPhone, isPreview, newsletterEnabled } from '@/lib/env'
import { NewsletterForm } from './NewsletterForm'
export function UtilityPage({ slug, locale }: { slug: string; locale: 'de' | 'en' }) {
  const en = locale === 'en'
  if (slug === 'impressum' || slug === 'legal')
    return (
      <div className="utility-content">
        <div className="notice">
          <p>
            {en
              ? 'Legal details pending approval. This is a review preview and is not ready for public commercial launch.'
              : 'Die rechtlichen Unternehmensdaten sind noch zu bestätigen. Diese Vorschau ist nicht für den öffentlichen geschäftlichen Start freigegeben.'}
          </p>
        </div>
        <dl>
          {[
            [en ? 'Legal entity' : 'Unternehmen', process.env.LEGAL_ENTITY],
            [en ? 'Business address' : 'Anschrift', process.env.LEGAL_ADDRESS],
            [
              en ? 'Representative' : 'Vertretungsberechtigte Person',
              process.env.LEGAL_REPRESENTATIVE,
            ],
            [en ? 'Register details' : 'Registerangaben', process.env.LEGAL_REGISTER],
            [
              en ? 'VAT identification' : 'Umsatzsteuer-ID, sofern erforderlich',
              process.env.LEGAL_VAT_ID,
            ],
            ['E-Mail', contactEmail],
            [en ? 'Telephone' : 'Telefon', contactPhone],
          ].map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value || (en ? 'Pending confirmation' : 'Noch zu bestätigen')}</dd>
            </div>
          ))}
        </dl>
      </div>
    )
  if (slug === 'datenschutz' || slug === 'privacy')
    return (
      <div className="utility-content">
        <div className="notice">
          <p>
            {en
              ? 'Draft privacy information. Controller details, processors and retention rules need review before public use. Please submit test data only in this preview.'
              : 'Entwurf der Datenschutzinformation. Verantwortliche Stelle, Auftragsverarbeiter und Aufbewahrung müssen vor öffentlicher Nutzung geprüft werden. Bitte in dieser Vorschau nur Testdaten verwenden.'}
          </p>
        </div>
        <h2>{en ? 'Your enquiry' : 'Ihre Anfrage'}</h2>
        <p>
          {en
            ? 'The form stores company, contact details and the project information you choose to submit. A reference lets staff identify the enquiry. Optional files are stored privately and are unavailable to staff until scanned. An enquiry does not subscribe you to marketing.'
            : 'Das Formular speichert Unternehmen, Kontaktangaben und die von Ihnen eingegebenen Projektdaten. Eine Referenz ermöglicht die Zuordnung. Optionale Dateien werden privat gespeichert und bleiben bis zur Sicherheitsprüfung für Mitarbeitende gesperrt. Eine Anfrage meldet Sie nicht für Werbung an.'}
        </p>
        <h2>{en ? 'Processing in this preview' : 'Verarbeitung in dieser Vorschau'}</h2>
        <p>
          {isPreview
            ? en
              ? 'Test submissions remain in the configured preview database. No acknowledgement email, CRM transfer or newsletter dispatch is triggered by a preview enquiry.'
              : 'Testanfragen bleiben in der eingerichteten Vorschaudatenbank. Die Anfrage löst weder E-Mail-Versand noch CRM-Übertragung oder Newsletter-Versand aus.'
            : en
              ? 'Enquiries are handed to the configured service email and CRM processors. Their identities, processing terms and international access must be documented in the approved notice.'
              : 'Anfragen werden an die eingerichteten E-Mail- und CRM-Dienste übergeben. Deren Identität, Verarbeitung und internationale Zugriffe müssen im freigegebenen Datenschutzhinweis konkret benannt sein.'}
        </p>
        <h2>{en ? 'Storage and external content' : 'Speicherung und externe Inhalte'}</h2>
        <p>
          {en
            ? 'Fonts and the illustration are served from this website. The public pages do not load advertising trackers or external embeds. Form inputs are kept in the current page only until submitted; no draft is stored in browser storage. Administration uses authentication cookies.'
            : 'Schriften und Illustrationsfoto werden von dieser Website ausgeliefert. Die öffentlichen Seiten laden keine Werbetracker oder externen Einbettungen. Formulareingaben bleiben bis zum Absenden nur auf der aktuellen Seite; es wird kein Entwurf im Browserspeicher angelegt. Die Administration nutzt Anmelde-Cookies.'}
        </p>
        <h2>{en ? 'Retention and requests' : 'Aufbewahrung und Anliegen'}</h2>
        <p>
          {en
            ? 'Deletion periods and any statutory exceptions must be approved before launch. Contact details for access, correction or deletion requests are pending.'
            : 'Löschfristen und etwaige gesetzliche Ausnahmen sind vor dem Start freizugeben. Die Kontaktstelle für Auskunft, Berichtigung oder Löschung ist noch zu bestätigen.'}
        </p>
        <p>
          {process.env.PRIVACY_CONTACT ||
            contactEmail ||
            (en ? 'Privacy contact pending.' : 'Datenschutzkontakt noch offen.')}
        </p>
      </div>
    )
  if (slug === 'cookie-einstellungen')
    return (
      <div className="utility-content">
        <h2>Keine optionalen Cookies aktiv.</h2>
        <p>
          Die öffentlichen Seiten verwenden keine Analyse- oder Werbecookies. Schriftdateien und
          Bilder liegen auf derselben Website. Es gibt derzeit keine optionalen Dienste, für die
          eine Cookie-Auswahl nötig wäre.
        </p>
        <p>
          Die Administration verwendet notwendige Anmelde-Cookies. Vor dem Einsatz zusätzlicher
          Tracking-Dienste oder externer Einbettungen müssen Information und erforderliche
          Einwilligungssteuerung ergänzt werden.
        </p>
        <Link className="text-link" href="/de/datenschutz">
          Datenschutzhinweis lesen
        </Link>
      </div>
    )
  if (slug === 'newsletter')
    return (
      <div className="utility-content">
        <p>
          Gelegentliche Hinweise zu Material, Beschaffung und Freigaben. Die Anmeldung ist
          unabhängig von einer Anfrage.
        </p>
        {newsletterEnabled && !isPreview ? (
          <NewsletterForm />
        ) : (
          <div className="notice">
            <strong>Die Newsletter-Anmeldung ist noch nicht aktiv.</strong>
            <p>
              Versanddienst, Einwilligungstext und Abmeldeprozess werden vor dem Start freigegeben.
              Hier werden derzeit keine Newsletter-Adressen gesammelt.
            </p>
          </div>
        )}
        <Link href="/de/wissen" className="text-link">
          Die Einkaufsratgeber ohne Anmeldung lesen
        </Link>
      </div>
    )
  return null
}
