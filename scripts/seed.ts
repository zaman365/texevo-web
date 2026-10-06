import { getPayload } from 'payload'
import config from '../src/payload.config'
import { seedContent } from '../src/content/seed'
if (process.env.SITE_MODE === 'live') throw new Error('Preview seed is disabled in live mode.')
const payload = await getPayload({ config })
const existing = await payload.find({ collection: 'users', limit: 1 })
if (!existing.totalDocs) {
  if (!process.env.SEED_ADMIN_EMAIL || !process.env.SEED_ADMIN_PASSWORD)
    throw new Error('Set local seed admin credentials.')
  await payload.create({
    collection: 'users',
    data: {
      email: process.env.SEED_ADMIN_EMAIL,
      password: process.env.SEED_ADMIN_PASSWORD,
      name: 'Preview administrator',
      role: 'admin',
    },
    overrideAccess: true,
  })
}
for (const record of seedContent) {
  const found = await payload.find({
    collection: 'content',
    where: { and: [{ slug: { equals: record.slug } }, { locale: { equals: record.locale } }] },
    limit: 1,
  })
  if (found.totalDocs) continue
  await payload.create({
    collection: 'content',
    draft: true,
    overrideAccess: true,
    data: {
      ...record,
      approval: 'pending',
      evidenceStatus: 'pending',
      author: record.author || 'Editorial draft',
      sections: record.sections.map((s) => ({ ...s, items: s.items?.map((text) => ({ text })) })),
      related: record.related?.map((slug) => ({ slug })),
      _status: 'draft',
    },
  })
}
console.log(
  `Seeded ${seedContent.length} editorial drafts. Public preview uses clearly labelled fixtures; live mode uses approved CMS records only.`,
)
await payload.destroy()
process.exit(0)
