import { db } from '@/lib/db'
export async function GET() {
  try {
    await db.query('SELECT 1 FROM app.enquiries LIMIT 1')
    return Response.json({ status: 'ok' }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return Response.json({ status: 'unavailable' }, { status: 503 })
  }
}
