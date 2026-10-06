import { randomUUID, timingSafeEqual } from 'node:crypto'
import { z } from 'zod'
import { db } from '@/lib/db'
import { uploadToken } from '@/lib/enquiries'
import { detectFile, validFilename, cleanFilename, MAX_FILE_BYTES } from '@/lib/file-policy'
import { putPrivate, deletePrivate } from '@/lib/storage'
import {
  ensureOrigin,
  errorResponse,
  rateLimit,
  readLimited,
  RequestError,
} from '@/lib/request-security'
export const runtime = 'nodejs'
export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    ensureOrigin(request)
    const { id } = await context.params
    if (!z.uuid().safeParse(id).success) throw new RequestError(404, 'Nicht gefunden.')
    const { rows } = await db.query(
      "SELECT idempotency_key FROM app.enquiries WHERE id=$1 AND created_at>now()-interval '24 hours'",
      [id],
    )
    const token = request.headers.get('authorization')?.replace(/^Bearer /, '') || ''
    const expected = rows[0] ? uploadToken(id, rows[0].idempotency_key) : ''
    if (
      !expected ||
      token.length !== expected.length ||
      !timingSafeEqual(Buffer.from(token), Buffer.from(expected))
    )
      throw new RequestError(403, 'Upload-Berechtigung fehlt oder ist abgelaufen.')
    const slotString = new URL(request.url).searchParams.get('slot') || ''
    if (!/^[012]$/.test(slotString))
      throw new RequestError(400, 'Maximal drei Dateien pro Anfrage.')
    await rateLimit(request, 'upload', 30)
    const existing = await db.query('SELECT id FROM app.uploads WHERE enquiry_id=$1 AND slot=$2', [
      id,
      Number(slotString),
    ])
    if (existing.rowCount)
      return Response.json({ stored: true }, { headers: { 'Cache-Control': 'no-store' } })
    let name: string
    try {
      name = cleanFilename(decodeURIComponent(request.headers.get('x-file-name') || ''))
    } catch {
      throw new RequestError(400, 'Ungültiger Dateiname.')
    }
    const bytes = await readLimited(request, MAX_FILE_BYTES)
    const mime = detectFile(bytes)
    if (!bytes.length || !mime || !validFilename(name, mime))
      throw new RequestError(
        415,
        'Nur echte PDF-, PNG- und JPEG-Dateien mit passender Dateiendung werden angenommen.',
      )
    const fileID = randomUUID()
    const key = `${id}/${fileID}`
    await putPrivate(key, bytes, mime)
    try {
      await db.query(
        'INSERT INTO app.uploads(id,enquiry_id,slot,storage_key,filename,mime,bytes) VALUES($1,$2,$3,$4,$5,$6,$7)',
        [fileID, id, Number(slotString), key, name, mime, bytes.length],
      )
    } catch (e) {
      await deletePrivate(key)
      if ((e as { code?: string }).code !== '23505') throw e
    }
    return Response.json(
      { stored: true, status: 'quarantined' },
      { status: 201, headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (e) {
    return errorResponse(e)
  }
}
