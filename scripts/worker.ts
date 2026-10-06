import sharp from 'sharp'
import { db } from '../src/lib/db'
import { deliverOne } from '../src/lib/delivery'
import { getPrivate, putPrivate, deletePrivate } from '../src/lib/storage'
for (let n = 0; n < 50 && (await deliverOne()); n++) {
  /* bounded batch, run once a minute */
}
if (process.env.SCAN_URL && process.env.SCAN_TOKEN) {
  await db.query(
    "UPDATE app.uploads SET scan_status='quarantined' WHERE scan_status='scanning' AND scanned_at<now()-interval '5 minutes'",
  )
  for (let n = 0; n < 10; n++) {
    const claim = await db.query(
      "UPDATE app.uploads SET scan_status='scanning',scan_attempts=scan_attempts+1,scanned_at=now() WHERE id=(SELECT id FROM app.uploads WHERE scan_status='quarantined' AND scan_attempts<3 ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 1) RETURNING *",
    )
    const file = claim.rows[0]
    if (!file) break
    try {
      if (new URL(process.env.SCAN_URL).protocol !== 'https:') throw new Error('https_required')
      const bytes = await getPrivate(file.storage_key)
      const response = await fetch(process.env.SCAN_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.SCAN_TOKEN}`,
          'Content-Type': 'application/octet-stream',
        },
        body: new Uint8Array(bytes),
        signal: AbortSignal.timeout(60000),
        redirect: 'error',
      })
      if (!response.ok) throw new Error('scan_failed')
      const result = await response.json()
      if (result.status !== 'clean' && result.status !== 'infected')
        throw new Error('invalid_verdict')
      if (result.status === 'clean' && file.mime.startsWith('image/')) {
        // Re-encode only after scanning; discard EXIF and other unnecessary metadata.
        const image = sharp(bytes, { limitInputPixels: 40000000 })
        const clean =
          file.mime === 'image/png'
            ? await image.png().toBuffer()
            : await image.jpeg({ quality: 92 }).toBuffer()
        await putPrivate(file.storage_key, clean, file.mime)
      }
      if (result.status === 'infected') await deletePrivate(file.storage_key)
      await db.query('UPDATE app.uploads SET scan_status=$1,scanned_at=now() WHERE id=$2', [
        result.status,
        file.id,
      ])
    } catch {
      await db.query(
        "UPDATE app.uploads SET scan_status=CASE WHEN scan_attempts>=3 THEN 'error' ELSE 'quarantined' END WHERE id=$1",
        [file.id],
      )
    }
  }
}
await db.query('DELETE FROM app.rate_limits WHERE expires_at<now()')
const stuck = await db.query(
  "SELECT count(*)::int AS count FROM app.outbox WHERE status IN ('pending','failed','processing') AND created_at<now()-interval '15 minutes'",
)
if (stuck.rows[0].count && process.env.ALERT_WEBHOOK_URL) {
  await fetch(process.env.ALERT_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: 'texevo_delivery_backlog', count: stuck.rows[0].count }),
    signal: AbortSignal.timeout(10000),
    redirect: 'error',
  }).catch(() => console.error('alert_failed'))
}
console.log('Worker batch complete.')
await db.end()
