import { afterEach, describe, expect, it, vi } from 'vitest'

const context = vi.hoisted(() => ({ env: {} as Record<string, unknown> }))
vi.mock('@opennextjs/cloudflare', () => ({ getCloudflareContext: () => context }))

import { databasePoolOptions } from '../../src/lib/cloudflare'
import { deletePrivate, getPrivate, putPrivate } from '../../src/lib/storage'

afterEach(() => {
  vi.unstubAllEnvs()
  context.env = {}
})

describe('Cloudflare deployment boundaries', () => {
  it('keeps local database configuration and uses fresh Hyperdrive connections on Workers', () => {
    vi.stubEnv('DEPLOY_TARGET', '')
    vi.stubEnv('DATABASE_URL', 'postgres://localhost/texevo_test')
    expect(databasePoolOptions()).toEqual({ connectionString: 'postgres://localhost/texevo_test' })
    vi.stubEnv('DEPLOY_TARGET', 'cloudflare')
    context.env.HYPERDRIVE = { connectionString: 'postgres://hyperdrive/texevo_test' }
    expect(databasePoolOptions()).toEqual({
      connectionString: 'postgres://hyperdrive/texevo_test',
      maxUses: 1,
    })
  })

  it('fails closed instead of using a local database or ephemeral upload filesystem on Workers', async () => {
    vi.stubEnv('DEPLOY_TARGET', 'cloudflare')
    expect(databasePoolOptions).toThrow('hyperdrive_not_configured')
    await expect(putPrivate('test/file', Buffer.from('test'), 'text/plain')).rejects.toThrow(
      'private_storage_not_configured',
    )
    await expect(getPrivate('test/file')).rejects.toThrow('private_storage_not_configured')
    await expect(deletePrivate('test/file')).rejects.toThrow('private_storage_not_configured')
  })

  it('stores private files using the request binding and rejects missing objects', async () => {
    vi.stubEnv('DEPLOY_TARGET', 'cloudflare')
    const bytes = new TextEncoder().encode('private test artwork')
    const bucket = {
      put: vi.fn().mockResolvedValue(undefined),
      get: vi.fn().mockResolvedValue({ arrayBuffer: async () => bytes.buffer }),
      delete: vi.fn().mockResolvedValue(undefined),
    }
    context.env.PRIVATE_UPLOADS = bucket
    await putPrivate('test/file', Buffer.from(bytes), 'image/png')
    expect(bucket.put).toHaveBeenCalledWith('test/file', bytes, {
      httpMetadata: { contentType: 'image/png' },
    })
    expect(await getPrivate('test/file')).toEqual(Buffer.from(bytes))
    await deletePrivate('test/file')
    expect(bucket.delete).toHaveBeenCalledWith('test/file')
    bucket.get.mockResolvedValueOnce(null)
    await expect(getPrivate('test/file')).rejects.toThrow('private_file_not_found')
  })
})
