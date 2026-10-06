import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { db } from '../src/lib/db'

if (process.env.SITE_MODE === 'live')
  throw new Error('Run verification only against a disposable preview database.')
const payload = await getPayload({ config })
const suffix = randomUUID().slice(0, 8)
const users: number[] = []
const contentIDs: number[] = []
let enquiryID: string | undefined
try {
  const editor = await payload.create({
    collection: 'users',
    overrideAccess: true,
    data: {
      email: `editor-${suffix}@example.test`,
      password: randomUUID(),
      name: 'Test editor',
      role: 'editor',
    },
  })
  users.push(editor.id)
  const reviewer = await payload.create({
    collection: 'users',
    overrideAccess: true,
    data: {
      email: `reviewer-${suffix}@example.test`,
      password: randomUUID(),
      name: 'Test reviewer',
      role: 'reviewer',
    },
  })
  users.push(reviewer.id)
  const draft = await payload.create({
    collection: 'content',
    overrideAccess: false,
    user: editor,
    draft: true,
    data: {
      title: 'Private review fixture',
      slug: `test-${suffix}`,
      locale: 'de',
      kind: 'knowledge',
      eyebrow: 'Test',
      description: 'Not customer content',
      author: 'Test',
      sections: [{ heading: 'Private', text: 'Draft body must not appear publicly.' }],
    },
  })
  contentIDs.push(draft.id)
  const publicDrafts = await payload.find({
    collection: 'content',
    overrideAccess: false,
    where: { id: { equals: draft.id } },
    draft: true,
  })
  assert.equal(publicDrafts.totalDocs, 0, 'anonymous drafts must remain private')
  await assert.rejects(
    payload.update({
      collection: 'content',
      id: draft.id,
      overrideAccess: false,
      user: editor,
      data: {
        _status: 'published',
        approval: 'approved',
        evidenceStatus: 'illustrative',
        reviewer: 'Fake self approval',
        reviewedAt: new Date().toISOString(),
        evidenceNotes: 'Test',
      },
    }),
    /reviewer|review|approval/i,
  )
  await payload.update({
    collection: 'users',
    id: editor.id,
    overrideAccess: false,
    user: editor,
    data: { role: 'admin' },
  })
  assert.equal(
    (await payload.findByID({ collection: 'users', id: editor.id })).role,
    'editor',
    'editor cannot escalate their role',
  )
  await payload.update({
    collection: 'content',
    id: draft.id,
    overrideAccess: false,
    user: reviewer,
    data: {
      _status: 'published',
      approval: 'approved',
      evidenceStatus: 'illustrative',
      reviewer: 'Test reviewer',
      reviewedAt: new Date().toISOString(),
      evidenceNotes: 'Labelled test demonstration only.',
    },
  })
  const publicDocs = await payload.find({
    collection: 'content',
    overrideAccess: false,
    where: { id: { equals: draft.id } },
    draft: false,
  })
  assert.equal(publicDocs.totalDocs, 1, 'approved record should be readable')
  assert.equal(
    (await db.query('SELECT content_id FROM app.public_search WHERE content_id=$1', [draft.id]))
      .rowCount,
    1,
    'published content must enter the public search projection',
  )
  await payload.update({
    collection: 'content',
    id: draft.id,
    overrideAccess: false,
    user: reviewer,
    data: { expiresAt: new Date(Date.now() - 1000).toISOString() },
  })
  assert.equal(
    (
      await payload.find({
        collection: 'content',
        overrideAccess: false,
        where: { id: { equals: draft.id } },
      })
    ).totalDocs,
    0,
    'expired evidence must not be publicly readable',
  )
  console.log(
    'PASS CMS: private drafts, reviewer gate, role escalation, publication, search projection and expiry.',
  )

  // Activate the delivery code only in this process; fetch is replaced before any delivery.
  // No real CRM, email, or newsletter service is contacted by these checks.
  process.env.SITE_MODE = 'live'
  process.env.CRM_WEBHOOK_URL = 'https://gateway.example.test/crm'
  process.env.CRM_WEBHOOK_TOKEN = 'test-only'
  const { deliverOne } = await import('../src/lib/delivery')
  enquiryID = randomUUID()
  await db.query(
    'INSERT INTO app.enquiries(id,reference,idempotency_key,request_hash,brief,notice_version,preview) VALUES($1,$2,$3,$4,$5,$6,false)',
    [enquiryID, `TEST-${suffix}`, randomUUID(), 'test', { email: 'test@example.test' }, 'test'],
  )
  await db.query("INSERT INTO app.outbox(event_key,enquiry_id,kind) VALUES($1,$2,'crm')", [
    `test:${suffix}`,
    enquiryID,
  ])
  const originalFetch = globalThis.fetch
  try {
    globalThis.fetch = async () => new Response('', { status: 503 })
    await deliverOne()
    const failure = (
      await db.query('SELECT status,attempts,last_error FROM app.outbox WHERE enquiry_id=$1', [
        enquiryID,
      ])
    ).rows[0]
    assert.equal(failure.status, 'pending')
    assert.equal(failure.attempts, 1)
    assert.equal(failure.last_error, 'destination_http_503')
    assert.equal(
      (await db.query('SELECT id FROM app.enquiries WHERE id=$1', [enquiryID])).rowCount,
      1,
      'failed delivery must not delete the receipt',
    )
    await db.query('UPDATE app.outbox SET next_attempt_at=now() WHERE enquiry_id=$1', [enquiryID])
    let calls = 0
    globalThis.fetch = async (_url, options) => {
      calls++
      assert.equal(
        (options?.headers as Record<string, string>)['Idempotency-Key'],
        `test:${suffix}`,
      )
      return new Response('{}', { status: 200 })
    }
    await Promise.all([deliverOne(), deliverOne()])
    assert.equal(calls, 1, 'concurrent workers must claim an event once')
    assert.equal(
      (await db.query('SELECT status FROM app.outbox WHERE enquiry_id=$1', [enquiryID])).rows[0]
        .status,
      'delivered',
    )
  } finally {
    globalThis.fetch = originalFetch
  }
  console.log(
    'PASS outbox: outage preserves enquiry, retry succeeds, stable idempotency key, concurrent claim exclusion.',
  )
} finally {
  if (enquiryID) await db.query('DELETE FROM app.enquiries WHERE id=$1', [enquiryID])
  for (const id of contentIDs)
    await payload.delete({ collection: 'content', id, overrideAccess: true })
  for (const id of users) await payload.delete({ collection: 'users', id, overrideAccess: true })
  await payload.destroy()
  await db.end()
}
process.exit(0)
