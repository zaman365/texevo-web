import { getPayload } from 'payload'
import config from '../src/payload.config'
import { db } from '../src/lib/db'
const missing: string[] = []
for (const key of [
  'SITE_URL',
  'DATABASE_URL',
  'PAYLOAD_SECRET',
  'ADMIN_GATE_USER',
  'ADMIN_GATE_PASSWORD',
  'LEGAL_ENTITY',
  'LEGAL_ADDRESS',
  'LEGAL_REPRESENTATIVE',
  'CONTACT_EMAIL',
  'PRIVACY_CONTACT',
  'CRM_WEBHOOK_URL',
  'CRM_WEBHOOK_TOKEN',
  'EMAIL_WEBHOOK_URL',
  'EMAIL_WEBHOOK_TOKEN',
  'ALERT_WEBHOOK_URL',
  'S3_BUCKET',
  'S3_ENDPOINT',
  'S3_REGION',
  'S3_ACCESS_KEY_ID',
  'S3_SECRET_ACCESS_KEY',
  'SCAN_URL',
  'SCAN_TOKEN',
])
  if (!process.env[key]) missing.push(key)
for (const key of [
  'LEGAL_REVIEWED',
  'CONTENT_APPROVED',
  'ADMIN_MFA_CONFIRMED',
  'RESTORE_REHEARSED',
])
  if (process.env[key] !== 'true') missing.push(`${key}=true after human verification`)
if (!process.env.SITE_URL?.startsWith('https://')) missing.push('HTTPS public origin')
if ((process.env.PAYLOAD_SECRET?.length || 0) < 32)
  missing.push('PAYLOAD_SECRET minimum 32 characters')
const payload = await getPayload({ config })
const published = await payload.find({
  collection: 'content',
  limit: 500,
  draft: false,
  where: { and: [{ _status: { equals: 'published' } }, { approval: { equals: 'approved' } }] },
  overrideAccess: true,
})
for (const slug of [
  'teamkleidung',
  'private-label',
  'sourcing-office',
  'so-arbeiten-wir',
  'muster',
  'nachweise',
  'partner',
  'ueber-uns',
  'impressum',
  'datenschutz',
])
  if (!published.docs.some((d) => d.slug === slug && d.locale === 'de'))
    missing.push(`Approved German page: ${slug}`)
for (const [kind, minimum] of [
  ['product', 6],
  ['knowledge', 6],
  ['journal', 3],
  ['material', 6],
] as const)
  if (published.docs.filter((d) => d.kind === kind && d.locale === 'de').length < minimum)
    missing.push(`${minimum} approved German ${kind} records`)
if (process.env.NEWSLETTER_ENABLED === 'true')
  for (const key of ['NEWSLETTER_WEBHOOK_URL', 'NEWSLETTER_WEBHOOK_TOKEN'])
    if (!process.env[key]) missing.push(key)
await payload.destroy()
await db.end()
if (missing.length) {
  console.error(
    'Public launch is blocked. Preview remains usable.\n' + missing.map((x) => `- ${x}`).join('\n'),
  )
  process.exit(1)
}
console.log(
  'Configuration checks passed. This does not replace independent legal, accessibility, security or restore acceptance.',
)
process.exit(0)
