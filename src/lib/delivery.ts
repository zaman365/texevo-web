import { randomUUID } from 'node:crypto'
import { db } from './db'
import { isPreview, siteURL } from './env'
export function retryDelay(attempt: number) {
  return Math.min(21600, 30 * 2 ** Math.min(attempt, 10))
}
export async function deliverOne() {
  if (isPreview) return false
  const token = randomUUID()
  const claim = await db.query(
    `UPDATE app.outbox SET status='processing',attempts=attempts+1,lease_until=now()+interval '90 seconds',lease_token=$1
    WHERE id=(SELECT id FROM app.outbox WHERE (status='pending' AND next_attempt_at<=now()) OR (status='processing' AND lease_until<now()) ORDER BY id FOR UPDATE SKIP LOCKED LIMIT 1) RETURNING *`,
    [token],
  )
  const event = claim.rows[0]
  if (!event) return false
  try {
    let body: Record<string, unknown>
    let url: string | undefined
    let secret: string | undefined
    if (event.enquiry_id) {
      const result = await db.query(
        'SELECT id,reference,brief,preview,created_at FROM app.enquiries WHERE id=$1',
        [event.enquiry_id],
      )
      const enquiry = result.rows[0]
      if (!enquiry || enquiry.preview) {
        await db.query("UPDATE app.outbox SET status='suppressed' WHERE id=$1 AND lease_token=$2", [
          event.id,
          token,
        ])
        return true
      }
      body = {
        type: event.kind,
        opportunityID: enquiry.id,
        reference: enquiry.reference,
        submittedAt: enquiry.created_at,
        brief: enquiry.brief,
        staffURL: `${siteURL}/de/intern`,
        promotional: false,
      }
      url = event.kind === 'crm' ? process.env.CRM_WEBHOOK_URL : process.env.EMAIL_WEBHOOK_URL
      secret =
        event.kind === 'crm' ? process.env.CRM_WEBHOOK_TOKEN : process.env.EMAIL_WEBHOOK_TOKEN
    } else {
      const result = await db.query('SELECT * FROM app.subscribers WHERE id=$1', [
        event.data.subscriberID,
      ])
      const subscriber = result.rows[0]
      if (!subscriber) throw new Error('subscriber_missing')
      if (event.kind === 'newsletter-confirmation' && subscriber.status !== 'pending') {
        await db.query("UPDATE app.outbox SET status='suppressed' WHERE id=$1 AND lease_token=$2", [
          event.id,
          token,
        ])
        return true
      }
      // Always read current consent, never replay a stale confirmed state after withdrawal.
      const revision = await db.query(
        'SELECT max(id)::text AS version FROM app.consent_events WHERE subscriber_id=$1',
        [subscriber.id],
      )
      body = {
        ...event.data,
        type: event.kind,
        email: subscriber.email,
        status: subscriber.status,
        subscriberID: subscriber.id,
        consentVersion: revision.rows[0].version,
      }
      url =
        event.kind === 'newsletter-confirmation'
          ? process.env.EMAIL_WEBHOOK_URL
          : process.env.NEWSLETTER_WEBHOOK_URL
      secret =
        event.kind === 'newsletter-confirmation'
          ? process.env.EMAIL_WEBHOOK_TOKEN
          : process.env.NEWSLETTER_WEBHOOK_TOKEN
    }
    if (!url || !secret) throw new Error('destination_not_configured')
    if (new URL(url).protocol !== 'https:') throw new Error('https_required')
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret}`,
        'Idempotency-Key': event.event_key,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
      redirect: 'error',
    })
    if (!response.ok) throw new Error(`destination_http_${response.status}`)
    await db.query(
      "UPDATE app.outbox SET status='delivered',delivered_at=now(),last_error=NULL,lease_until=NULL,data='{}' WHERE id=$1 AND lease_token=$2",
      [event.id, token],
    )
  } catch (e) {
    const code =
      e instanceof Error &&
      /^(destination_not_configured|https_required|destination_http_\d+|subscriber_missing)$/.test(
        e.message,
      )
        ? e.message
        : 'delivery_failed'
    await db.query(
      "UPDATE app.outbox SET status=$1,next_attempt_at=now()+$2*interval '1 second',last_error=$3,lease_until=NULL WHERE id=$4 AND lease_token=$5",
      [
        event.attempts >= 8 ? 'failed' : 'pending',
        retryDelay(event.attempts),
        code,
        event.id,
        token,
      ],
    )
  }
  return true
}
