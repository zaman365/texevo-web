import { z } from 'zod'
import { db } from '@/lib/db'
import { getPrivate } from '@/lib/storage'
import { requireSales } from '@/lib/staff'
import { errorResponse, RequestError } from '@/lib/request-security'
export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await requireSales(request.headers)
    const { id } = await context.params
    if (!z.uuid().safeParse(id).success) throw new RequestError(404, 'Nicht gefunden.')
    const { rows } = await db.query(
      "SELECT * FROM app.uploads WHERE id=$1 AND scan_status='clean'",
      [id],
    )
    if (!rows[0]) throw new RequestError(404, 'Datei nicht freigegeben.')
    const file = rows[0]
    const bytes = await getPrivate(file.storage_key)
    return new Response(new Uint8Array(bytes), {
      headers: {
        'Content-Type': file.mime,
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(file.filename)}`,
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; sandbox",
      },
    })
  } catch (e) {
    return errorResponse(e)
  }
}
