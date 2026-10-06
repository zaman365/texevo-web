import { headers } from 'next/headers'
import Link from 'next/link'
import { db } from '@/lib/db'
import { requireSales } from '@/lib/staff'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Anfragen & Zustellung', robots: { index: false, follow: false } }
export default async function StaffPage() {
  try {
    await requireSales(await headers())
  } catch {
    return (
      <section className="section shell">
        <h1>Anmeldung erforderlich</h1>
        <p>Nur Administration und Vertrieb dürfen Anfragen öffnen.</p>
        <Link className="button" href="/admin/login">
          Zur Anmeldung
        </Link>
      </section>
    )
  }
  const [enquiries, failures, files] = await Promise.all([
    db.query(
      'SELECT id,reference,brief,preview,status,created_at FROM app.enquiries ORDER BY created_at DESC LIMIT 50',
    ),
    db.query(
      "SELECT o.id,o.kind,o.status,o.attempts,o.last_error,o.created_at,e.reference FROM app.outbox o LEFT JOIN app.enquiries e ON e.id=o.enquiry_id WHERE o.status IN ('pending','failed','processing') ORDER BY o.created_at LIMIT 100",
    ),
    db.query(
      'SELECT id,enquiry_id,filename,scan_status FROM app.uploads ORDER BY created_at DESC LIMIT 150',
    ),
  ])
  return (
    <section className="section shell">
      <p className="eyebrow">Geschützter Vertrieb</p>
      <h1>Anfragen & Zustellung</h1>
      <p>Letzte 50 Anfragen. Testanfragen werden nie an externe Dienste weitergeleitet.</p>
      <Link href="/admin">Inhalte verwalten</Link>
      <h2 style={{ marginTop: 40 }}>Offene Zustellungen ({failures.rowCount})</h2>
      {failures.rows.map((event) => (
        <div className="notice" key={event.id}>
          <strong>
            {event.reference || 'Newsletter'} · {event.kind}
          </strong>
          <p>
            {event.status} · {event.attempts} Versuche ·{' '}
            {event.last_error || 'Wartet auf Verarbeitung'}
          </p>
          {event.status === 'failed' && (
            <form action="/api/staff/retry" method="post">
              <input type="hidden" name="id" value={event.id} />
              <button className="button secondary">Zustellung erneut versuchen</button>
            </form>
          )}
        </div>
      ))}
      <h2 style={{ marginTop: 40 }}>Eingegangene Briefings</h2>
      {enquiries.rows.map((entry) => (
        <details className="staff-record" key={entry.id}>
          <summary>
            {entry.reference} · {entry.brief.company} · {entry.preview ? 'TEST' : entry.status}
          </summary>
          <dl className="review-list">
            {Object.entries(entry.brief)
              .filter(([key, value]) => value && key !== 'privacy')
              .map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{String(value)}</dd>
                </div>
              ))}
          </dl>
          <ul>
            {files.rows
              .filter((file) => file.enquiry_id === entry.id)
              .map((file) => (
                <li key={file.id}>
                  {file.scan_status === 'clean' ? (
                    <a href={`/api/staff/files/${file.id}`}>{file.filename}</a>
                  ) : (
                    `${file.filename} · ${file.scan_status} · Download gesperrt`
                  )}
                </li>
              ))}
          </ul>
        </details>
      ))}
    </section>
  )
}
