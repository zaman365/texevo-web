import { buildConfig, APIError, type CollectionConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { adminOnly, adminField, editorial, hasRole, readContent } from './cms/access'
import { updateSearchProjection, deleteSearchProjection } from './cms/search-projection'
import { databasePoolOptions } from './lib/cloudflare'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const Users: CollectionConfig = {
  slug: 'users',
  auth: { tokenExpiration: 7200, maxLoginAttempts: 5, lockTime: 600000 },
  admin: { useAsTitle: 'email' },
  access: {
    create: adminOnly,
    delete: adminOnly,
    read: ({ req }) =>
      hasRole(req.user, ['admin']) || (req.user ? { id: { equals: req.user.id } } : false),
    update: ({ req }) =>
      hasRole(req.user, ['admin']) || (req.user ? { id: { equals: req.user.id } } : false),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: ['admin', 'editor', 'reviewer', 'sales'],
      access: { create: adminField, update: adminField },
    },
  ],
}
const Content: CollectionConfig = {
  slug: 'content',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'locale', 'approval', '_status'],
    preview: (doc) =>
      `${process.env.SITE_URL || 'http://localhost:3000'}/${doc.locale}/${doc.slug}?preview=${doc.id}`,
  },
  access: { read: readContent, create: editorial, update: editorial, delete: adminOnly },
  versions: { drafts: true, maxPerDoc: 30 },
  hooks: {
    afterChange: [updateSearchProjection],
    afterDelete: [deleteSearchProjection],
    beforeChange: [
      ({ data, originalDoc, req }) => {
        const next = { ...originalDoc, ...data }
        if (data.approval === 'approved' && !hasRole(req.user, ['admin', 'reviewer'])) {
          throw new APIError('A technical reviewer must approve publication.', 403)
        }
        // Every public revision requires a fresh review; editors cannot retain old approval.
        if (originalDoc && !hasRole(req.user, ['admin', 'reviewer'])) data.approval = 'pending'
        if (
          data._status === 'published' &&
          (next.approval !== 'approved' ||
            !next.reviewer ||
            !next.reviewedAt ||
            !next.evidenceNotes)
        ) {
          throw new APIError(
            'Publication needs reviewer, review date, evidence notes and approval.',
            400,
          )
        }
        if (data._status === 'published' && next.evidenceStatus === 'pending')
          throw new APIError('Resolve pending evidence before publication.', 400)
        if (data._status === 'published' && next.kind === 'product' && !next.supplierReference)
          throw new APIError('Products need a verified supplier reference.', 400)
        if (data._status === 'published' && next.imageURL && (!next.imageRights || !next.imageAlt))
          throw new APIError('Images need usage rights and descriptive alt text.', 400)
        return data
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      index: true,
      validate: (value: unknown) =>
        (typeof value === 'string' && /^[a-z0-9]+(?:[/-][a-z0-9]+)*$/.test(value)) ||
        'Use lowercase path segments.',
    },
    { name: 'locale', type: 'select', options: ['de', 'en'], required: true, defaultValue: 'de' },
    {
      name: 'kind',
      type: 'select',
      required: true,
      options: [
        'offer',
        'product',
        'knowledge',
        'journal',
        'material',
        'page',
        'resource',
        'project',
        'evidence',
        'campaign',
      ],
    },
    { name: 'eyebrow', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true, maxLength: 400 },
    {
      name: 'sections',
      type: 'array',
      fields: [
        { name: 'heading', type: 'text', required: true },
        { name: 'text', type: 'textarea', required: true },
        { name: 'items', type: 'array', fields: [{ name: 'text', type: 'text', required: true }] },
      ],
    },
    {
      name: 'facts',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
    { name: 'related', type: 'array', fields: [{ name: 'slug', type: 'text', required: true }] },
    { name: 'ctaLabel', type: 'text' },
    {
      name: 'ctaHref',
      type: 'text',
      validate: (v: unknown) =>
        !v ||
        (typeof v === 'string' && /^\/(de|en)\//.test(v) && !/[\\<>]/.test(v)) ||
        'Use an internal /de/ or /en/ route.',
    },
    { name: 'translation', type: 'text' },
    { name: 'readingMinutes', type: 'number', min: 1 },
    { name: 'author', type: 'text', required: true },
    { name: 'reviewer', type: 'text' },
    { name: 'reviewedAt', type: 'date' },
    { name: 'nextReviewAt', type: 'date' },
    {
      name: 'approval',
      type: 'select',
      defaultValue: 'pending',
      options: ['pending', 'technical-review', 'approved'],
    },
    {
      name: 'evidenceStatus',
      type: 'select',
      defaultValue: 'pending',
      options: ['pending', 'verified', 'illustrative'],
    },
    { name: 'evidenceNotes', type: 'textarea' },
    { name: 'supplierReference', type: 'text' },
    { name: 'issuer', type: 'text' },
    { name: 'scope', type: 'text' },
    { name: 'expiresAt', type: 'date' },
    {
      name: 'imageURL',
      type: 'text',
      admin: {
        description: 'Approved same-origin image path. Keep private documents out of public media.',
      },
      validate: (v: unknown) =>
        !v ||
        (typeof v === 'string' && /^\/images\/[a-zA-Z0-9/_.,-]+$/.test(v)) ||
        'Use a local /images/ path.',
    },
    { name: 'imageAlt', type: 'text' },
    { name: 'imageRights', type: 'textarea' },
    { name: 'imageCaption', type: 'text' },
  ],
  indexes: [{ fields: ['slug', 'locale'], unique: true }],
}
const Experiments: CollectionConfig = {
  slug: 'experiments',
  access: { read: editorial, create: editorial, update: editorial, delete: adminOnly },
  admin: { useAsTitle: 'hypothesis' },
  fields: [
    { name: 'hypothesis', type: 'textarea', required: true },
    { name: 'owner', type: 'text', required: true },
    { name: 'costCeilingEUR', type: 'number', min: 0 },
    { name: 'primaryMetric', type: 'text', required: true },
    { name: 'decision', type: 'textarea' },
  ],
}
export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  admin: { user: 'users', importMap: { baseDir: dirname } },
  routes: { api: '/cms-api', admin: '/admin' },
  collections: [Users, Content, Experiments],
  editor: lexicalEditor(),
  email: () => ({
    name: 'controlled-transactional-gateway',
    defaultFromAddress: process.env.CONTACT_EMAIL || 'preview@example.test',
    defaultFromName: 'TEXEVO',
    sendEmail: async (message) => {
      if (
        process.env.SITE_MODE !== 'live' ||
        !process.env.EMAIL_WEBHOOK_URL ||
        !process.env.EMAIL_WEBHOOK_TOKEN
      )
        throw new Error('Staff email is disabled until the transactional gateway is configured.')
      const response = await fetch(process.env.EMAIL_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.EMAIL_WEBHOOK_TOKEN}`,
        },
        body: JSON.stringify({ type: 'staff-email', message }),
        signal: AbortSignal.timeout(15000),
        redirect: 'error',
      })
      if (!response.ok) throw new Error('staff_email_delivery_failed')
    },
  }),
  db: postgresAdapter({
    pool: databasePoolOptions(),
    push: process.env.NODE_ENV !== 'production',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
})
