import { db } from '@/lib/db'
import { requireSales } from '@/lib/staff'
import { ensureOrigin, errorResponse, readLimited, RequestError } from '@/lib/request-security'
import { siteURL } from '@/lib/env'
export async function POST(request: Request) {
  try {
    ensureOrigin(request)
    await requireSales(request.headers)
    const data = new URLSearchParams((await readLimited(request, 1024)).toString())
    const id = data.get('id') || ''
    if (!/^\d+$/.test(id)) throw new RequestError(400, 'Ungültige Referenz.')
    await db.query(
      "UPDATE app.outbox SET status='pending',attempts=0,next_attempt_at=now(),last_error=NULL WHERE id=$1 AND status='failed'",
      [id],
    )
    return Response.redirect(`${siteURL}/de/intern`, 303)
  } catch (e) {
    return errorResponse(e)
  }
}
