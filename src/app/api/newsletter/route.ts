import { randomBytes, randomUUID } from 'node:crypto'
import { z } from 'zod'
import { db } from '@/lib/db'
import {
  ensureOrigin,
  errorResponse,
  rateLimit,
  readLimited,
  RequestError,
} from '@/lib/request-security'
import { isPreview, newsletterEnabled, siteURL } from '@/lib/env'
import { newsletterVersion, newsletterWording, tokenHash } from '@/lib/newsletter'
export async function POST(request: Request) {
  try {
    ensureOrigin(request)
    if (isPreview || !newsletterEnabled)
      throw new RequestError(503, 'Die Newsletter-Anmeldung ist noch nicht aktiv.')
    const parsed = z
      .object({ email: z.email().max(254), consent: z.literal(true) })
      .safeParse(JSON.parse((await readLimited(request, 4096)).toString()))
    if (!parsed.success) throw new RequestError(400, 'Bitte E-Mail und Einwilligung prüfen.')
    await rateLimit(request, 'newsletter', 5)
    const id = randomUUID()
    const token = randomBytes(32).toString('base64url')
    const client = await db.connect()
    try {
      await client.query('BEGIN')
      const { rows } = await client.query(
        "INSERT INTO app.subscribers(id,email,token_hash,token_expires_at) VALUES($1,$2,$3,now()+interval '24 hours') ON CONFLICT(email) DO UPDATE SET token_hash=EXCLUDED.token_hash,token_expires_at=EXCLUDED.token_expires_at WHERE app.subscribers.status='pending' AND app.subscribers.token_expires_at<now() RETURNING id",
        [id, parsed.data.email.toLowerCase(), tokenHash(token)],
      )
      if (rows[0]) {
        const subscriberID = rows[0].id
        await client.query(
          "INSERT INTO app.consent_events(subscriber_id,event,wording_version,wording) VALUES($1,'requested',$2,$3)",
          [subscriberID, newsletterVersion, newsletterWording],
        )
        await client.query(
          "INSERT INTO app.outbox(event_key,kind,data) VALUES($1,'newsletter-confirmation',$2)",
          [
            `${subscriberID}:confirm:${tokenHash(token).slice(0, 12)}`,
            {
              subscriberID,
              confirmationURL: `${siteURL}/de/newsletter/bestaetigen?token=${token}`,
            },
          ],
        )
      }
      await client.query('COMMIT')
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
    return Response.json({
      message:
        'Wenn die Adresse neu oder noch unbestätigt ist, wird ein Bestätigungslink versendet. Eine frühere Abmeldung bleibt wirksam.',
    })
  } catch (e) {
    return errorResponse(e)
  }
}
