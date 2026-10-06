import { timingSafeEqual } from 'node:crypto'
import { z } from 'zod'
import { db } from '@/lib/db'
import { isPreview, siteURL } from '@/lib/env'
import { newsletterVersion, newsletterWording, tokenHash, withdrawalToken } from '@/lib/newsletter'
import { ensureOrigin, errorResponse, readLimited, RequestError } from '@/lib/request-security'
export async function POST(request: Request) {
  try {
    ensureOrigin(request)
    if (isPreview) throw new RequestError(503, 'Newsletter ist in dieser Vorschau deaktiviert.')
    const form = new URLSearchParams((await readLimited(request, 4096)).toString())
    const token = form.get('token') || ''
    const withdraw = form.get('action') === 'withdraw'
    if (!token || token.length > 120) throw new RequestError(400, 'Link ungültig.')
    const client = await db.connect()
    try {
      await client.query('BEGIN')
      let subscriberID: string
      if (withdraw) {
        const id = token.split('.')[0]
        if (!z.uuid().safeParse(id).success) throw new RequestError(400, 'Link ungültig.')
        const expected = withdrawalToken(id)
        if (
          token.length !== expected.length ||
          !timingSafeEqual(Buffer.from(token), Buffer.from(expected))
        )
          throw new RequestError(400, 'Link ungültig.')
        const updated = await client.query(
          "UPDATE app.subscribers SET status='withdrawn',withdrawn_at=now() WHERE id=$1 AND status!='withdrawn' RETURNING id",
          [id],
        )
        subscriberID = updated.rows[0]?.id
      } else {
        const updated = await client.query(
          "UPDATE app.subscribers SET status='confirmed',confirmed_at=now() WHERE token_hash=$1 AND token_expires_at>now() AND status='pending' RETURNING id",
          [tokenHash(token)],
        )
        subscriberID = updated.rows[0]?.id
        if (!subscriberID)
          throw new RequestError(
            400,
            'Dieser Link ist abgelaufen oder bereits verwendet. Eine Abmeldung wird nicht aufgehoben.',
          )
      }
      if (subscriberID) {
        const event = await client.query(
          'INSERT INTO app.consent_events(subscriber_id,event,wording_version,wording) VALUES($1,$2,$3,$4) RETURNING id',
          [
            subscriberID,
            withdraw ? 'withdrawn' : 'confirmed',
            newsletterVersion,
            newsletterWording,
          ],
        )
        await client.query(
          "INSERT INTO app.outbox(event_key,kind,data) VALUES($1,'newsletter-sync',$2)",
          [
            `consent:${event.rows[0].id}`,
            {
              subscriberID,
              unsubscribeURL: `${siteURL}/de/newsletter/abmelden?token=${withdrawalToken(subscriberID)}`,
            },
          ],
        )
        if (withdraw)
          await client.query(
            "UPDATE app.outbox SET status='suppressed' WHERE kind='newsletter-confirmation' AND data->>'subscriberID'=$1 AND status='pending'",
            [subscriberID],
          )
      }
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
    return new Response(
      `<!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>TEXEVO Newsletter</title><body><main><h1>${withdraw ? 'Sie sind abgemeldet.' : 'Ihre Anmeldung ist bestätigt.'}</h1><p>${withdraw ? 'Die Einwilligung wurde widerrufen. Der Versanddienst wird über die Abmeldung informiert.' : 'Vielen Dank für Ihre Bestätigung.'}</p><a href="/de">Zur TEXEVO Startseite</a></main></body></html>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } },
    )
  } catch (e) {
    return errorResponse(e)
  }
}
