import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { db } from '../lib/db'
export const updateSearchProjection: CollectionAfterChangeHook = async ({ doc, req }) => {
  // Rebuild from the persisted published document, not an autosaved draft revision.
  const published = await req.payload
    .findByID({ collection: 'content', id: doc.id, draft: false, overrideAccess: true, req })
    .catch(() => null)
  if (!published || published._status !== 'published' || published.approval !== 'approved') {
    await db.query('DELETE FROM app.public_search WHERE content_id=$1', [doc.id])
    return doc
  }
  const body = (published.sections || [])
    .map((s) => `${s.heading} ${s.text} ${(s.items || []).map((i) => i.text).join(' ')}`)
    .join(' ')
  const config = published.locale === 'en' ? 'english' : 'german'
  await db.query(
    `INSERT INTO app.public_search(content_id,locale,slug,kind,title,description,document,expires_at)
    VALUES($1,$2,$3,$4,$5,$6,setweight(to_tsvector($7::regconfig,$5),'A') || setweight(to_tsvector($7::regconfig,$6),'B') || to_tsvector($7::regconfig,$8),$9)
    ON CONFLICT(content_id) DO UPDATE SET locale=EXCLUDED.locale,slug=EXCLUDED.slug,kind=EXCLUDED.kind,title=EXCLUDED.title,description=EXCLUDED.description,document=EXCLUDED.document,expires_at=EXCLUDED.expires_at`,
    [
      published.id,
      published.locale,
      published.slug,
      published.kind,
      published.title,
      published.description,
      config,
      body,
      published.expiresAt || null,
    ],
  )
  return doc
}
export const deleteSearchProjection: CollectionAfterDeleteHook = async ({ id }) => {
  await db.query('DELETE FROM app.public_search WHERE content_id=$1', [id])
}
