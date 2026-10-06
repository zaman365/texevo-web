import { describe, expect, it } from 'vitest'
import { briefSchema } from '../../src/lib/brief-schema'
import { cleanFilename, detectFile, validFilename } from '../../src/lib/file-policy'
import { searchContent } from '../../src/lib/content'
import { seedContent } from '../../src/content/seed'
const valid = {
  idempotencyKey: '57419123-d7e1-4f23-96bb-e0cc1a2fd8ad',
  category: 'team',
  company: 'Test GmbH',
  name: 'Test Person',
  email: 'person@example.test',
  description: '100 Polos für unser Team',
  privacy: true,
}
describe('brief boundary', () => {
  it('accepts unknown quantities without inventing a minimum', () => {
    expect(briefSchema.parse({ ...valid, quantity: 'noch offen' }).quantity).toBe('noch offen')
  })
  it('requires contact and a privacy acknowledgement', () => {
    for (const change of [
      { email: 'invalid' },
      { privacy: false },
      { company: '' },
      { description: 'short' },
    ])
      expect(briefSchema.safeParse({ ...valid, ...change }).success).toBe(false)
  })
  it('requires a prior reference for reorder', () => {
    expect(briefSchema.safeParse({ ...valid, category: 'reorder' }).success).toBe(false)
    expect(
      briefSchema.safeParse({ ...valid, category: 'reorder', reference: 'TX-TEST-123' }).success,
    ).toBe(true)
  })
  it('rejects honeypots and excessive text', () => {
    expect(briefSchema.safeParse({ ...valid, website: 'spam' }).success).toBe(false)
    expect(briefSchema.safeParse({ ...valid, description: 'a'.repeat(5001) }).success).toBe(false)
  })
})
describe('file boundary', () => {
  it('does not accept HTML or SVG disguised as an image', () => {
    expect(detectFile(Buffer.from('<svg onload="evil()"/>'))).toBeNull()
    expect(validFilename('logo.svg', 'image/png')).toBe(false)
  })
  it('requires matching extension and recognises allowed signatures', () => {
    expect(detectFile(Buffer.from('%PDF-1.7\n'))).toBe('application/pdf')
    expect(validFilename('logo.JPG', 'image/jpeg')).toBe(true)
    expect(validFilename('document.exe', 'application/pdf')).toBe(false)
  })
  it('removes traversal, controls and header punctuation', () => {
    expect(cleanFilename('../../a\r\n".png')).toBe('a___.png')
  })
})
describe('public preview content', () => {
  it('has distinct localized routes and no fabricated approved records', () => {
    expect(new Set(seedContent.map((r) => `${r.locale}/${r.slug}`)).size).toBe(seedContent.length)
    expect(seedContent.every((r) => r.status === 'illustrative')).toBe(true)
  })
  it('searches German accents and returns useful results and empty states', () => {
    expect(searchContent(seedContent, 'Größen')[0].slug).toContain('groessen')
    expect(searchContent(seedContent, 'Polo').length).toBeGreaterThan(0)
    expect(searchContent(seedContent, 'nonexistentxyz')).toEqual([])
  })
})
