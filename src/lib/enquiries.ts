import { createHash, createHmac, randomUUID } from 'node:crypto'
import { db } from './db'
import { noticeVersion, type Brief } from './brief-schema'
import { isPreview } from './env'
import { RequestError } from './request-security'

export function uploadToken(id: string, key: string) {
  return createHmac('sha256', process.env.PAYLOAD_SECRET || '')
    .update(`upload:v1:${id}:${key}`)
    .digest('hex')
}
export async function saveEnquiry(brief: Brief) {
  const { idempotencyKey, website: _honeypot, ...body } = brief
  const digest = createHash('sha256').update(JSON.stringify(body)).digest('hex')
  const id = randomUUID()
  const reference = `TX-${new Date().getUTCFullYear()}-${id.slice(0, 8).toUpperCase()}`
  const client = await db.connect()
  try {
    await client.query('BEGIN')
    const { rows } = await client.query(
      `INSERT INTO app.enquiries(id,reference,idempotency_key,request_hash,brief,notice_version,preview)
      VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(idempotency_key) DO NOTHING RETURNING id,reference`,
      [id, reference, idempotencyKey, digest, body, noticeVersion, isPreview],
    )
    let receipt = rows[0]
    if (!receipt) {
      const existing = await client.query(
        'SELECT id,reference,request_hash FROM app.enquiries WHERE idempotency_key=$1',
        [idempotencyKey],
      )
      if (existing.rows[0]?.request_hash !== digest)
        throw new RequestError(
          409,
          'Diese Formularfassung wurde bereits übermittelt. Öffnen Sie für eine neue Anfrage ein neues Formular.',
        )
      receipt = existing.rows[0]
    } else {
      for (const kind of ['acknowledgement', 'crm'])
        await client.query(
          'INSERT INTO app.outbox(event_key,enquiry_id,kind,status) VALUES($1,$2,$3,$4)',
          [`${id}:${kind}`, id, kind, isPreview ? 'suppressed' : 'pending'],
        )
    }
    await client.query('COMMIT')
    return {
      id: receipt.id as string,
      reference: receipt.reference as string,
      uploadToken: uploadToken(receipt.id, idempotencyKey),
      preview: isPreview,
    }
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}
