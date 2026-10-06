import { createHmac } from 'node:crypto'
import { db } from './db'
import { siteURL } from './env'

export class RequestError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
  }
}
export function ensureOrigin(request: Request) {
  if (request.headers.get('origin') !== new URL(siteURL).origin)
    throw new RequestError(
      403,
      'Diese Anfrage konnte nicht geprüft werden. Bitte öffnen Sie das Formular erneut.',
    )
}
export async function readLimited(request: Request, max: number) {
  const length = Number(request.headers.get('content-length') || 0)
  if (length > max) throw new RequestError(413, 'Die Anfrage ist zu groß.')
  const reader = request.body?.getReader()
  if (!reader) throw new RequestError(400, 'Die Anfrage ist leer.')
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > max) {
        await reader.cancel()
        throw new RequestError(413, 'Die Anfrage ist zu groß.')
      }
      chunks.push(value)
    }
  } finally {
    reader.releaseLock()
  }
  return Buffer.concat(chunks)
}
export async function rateLimit(request: Request, scope: string, limit = 12, windowSeconds = 3600) {
  const proxyIP =
    process.env.TRUST_PROXY === 'true'
      ? request.headers.get('x-forwarded-for')?.split(',').at(-1)?.trim()
      : null
  const ip = proxyIP || 'shared-untrusted'
  const key = createHmac('sha256', process.env.PAYLOAD_SECRET || '')
    .update(`${scope}:${ip}`)
    .digest('hex')
  const result = await db.query(
    `INSERT INTO app.rate_limits(key,count,expires_at) VALUES($1,1,now()+$2*interval '1 second')
    ON CONFLICT(key) DO UPDATE SET count=CASE WHEN app.rate_limits.expires_at<now() THEN 1 ELSE app.rate_limits.count+1 END,
    expires_at=CASE WHEN app.rate_limits.expires_at<now() THEN now()+$2*interval '1 second' ELSE app.rate_limits.expires_at END RETURNING count`,
    [key, windowSeconds],
  )
  if (result.rows[0].count > limit)
    throw new RequestError(429, 'Zu viele Versuche. Bitte versuchen Sie es später erneut.')
}
export function errorResponse(error: unknown) {
  const known = error instanceof RequestError
  if (!known) {
    // Keep credentials, submitted data, provider messages and stack traces out of logs.
    // Error names/codes and an upstream status are enough to diagnose hosted failures.
    const detail = error as {
      name?: unknown
      code?: unknown
      $metadata?: { httpStatusCode?: unknown }
    } | null
    const safeCode = (value: unknown) =>
      typeof value === 'string' && /^[\w.-]{1,80}$/.test(value) ? value : undefined
    console.error('request_failed', {
      name: safeCode(detail?.name),
      code: safeCode(detail?.code),
      upstreamStatus:
        typeof detail?.$metadata?.httpStatusCode === 'number'
          ? detail.$metadata.httpStatusCode
          : undefined,
    })
  }
  return Response.json(
    {
      error: known
        ? error.message
        : 'Die Übermittlung ist gerade nicht möglich. Ihre Eingaben bleiben erhalten. Bitte versuchen Sie es später erneut.',
    },
    { status: known ? error.status : 503, headers: { 'Cache-Control': 'no-store' } },
  )
}
