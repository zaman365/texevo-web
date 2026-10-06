import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const context = vi.hoisted(() => ({ env: {} as Record<string, unknown> }))
vi.mock('@opennextjs/cloudflare', () => ({ getCloudflareContext: () => context }))

import { databasePoolOptions } from '../../src/lib/cloudflare'
import { deletePrivate, getPrivate, putPrivate } from '../../src/lib/storage'

beforeEach(() => {
  vi.stubEnv('S3_BUCKET', '')
  vi.stubEnv('S3_ACCESS_KEY_ID', '')
  vi.stubEnv('S3_SECRET_ACCESS_KEY', '')
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
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

  it('signs Tigris uploads, reads and deletes through fetch without exposing public access', async () => {
    vi.stubEnv('DEPLOY_TARGET', 'cloudflare')
    vi.stubEnv('S3_BUCKET', 'texevo-private-test')
    vi.stubEnv('S3_ENDPOINT', 'https://t3.storage.dev')
    vi.stubEnv('S3_REGION', 'auto')
    vi.stubEnv('S3_FORCE_PATH_STYLE', 'false')
    vi.stubEnv('S3_ACCESS_KEY_ID', 'test-key')
    vi.stubEnv('S3_SECRET_ACCESS_KEY', 'test-secret')
    const objects = new Map<string, ArrayBuffer>()
    const requests: Request[] = []
    vi.stubGlobal(
      'fetch',
      vi.fn(async (request: Request) => {
        requests.push(request)
        expect(new URL(request.url).hostname).toBe('texevo-private-test.t3.storage.dev')
        expect(request.headers.get('authorization')).toMatch(/^AWS4-HMAC-SHA256 /)
        expect(request.headers.get('x-amz-acl')).toBeNull()
        if (request.method === 'PUT') {
          expect(request.headers.get('content-type')).toBe('image/png')
          objects.set(new URL(request.url).pathname, await request.arrayBuffer())
          return new Response(null, { status: 200 })
        }
        if (request.method === 'DELETE') {
          objects.delete(new URL(request.url).pathname)
          return new Response(null, { status: 204 })
        }
        const object = objects.get(new URL(request.url).pathname)
        return object
          ? new Response(object, { headers: { 'Content-Type': 'image/png' } })
          : new Response('<Error><Code>NoSuchKey</Code></Error>', { status: 404 })
      }),
    )
    const bytes = Buffer.from('private test artwork')
    await putPrivate('test/file', bytes, 'image/png')
    expect(await getPrivate('test/file')).toEqual(bytes)
    await deletePrivate('test/file')
    await expect(getPrivate('test/file')).rejects.toMatchObject({ name: 'NoSuchKey' })
    expect(requests.map((r) => r.method)).toEqual(['PUT', 'GET', 'DELETE', 'GET'])
  })

  it('does not use local files when Tigris rejects access', async () => {
    vi.stubEnv('DEPLOY_TARGET', 'cloudflare')
    vi.stubEnv('S3_BUCKET', 'texevo-private-test')
    vi.stubEnv('S3_ENDPOINT', 'https://t3.storage.dev')
    vi.stubEnv('S3_ACCESS_KEY_ID', 'test-key')
    vi.stubEnv('S3_SECRET_ACCESS_KEY', 'test-secret')
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('<Error><Code>AccessDenied</Code></Error>', { status: 403 })),
    )
    await expect(putPrivate('test/file', Buffer.from('test'), 'text/plain')).rejects.toMatchObject({
      name: 'AccessDenied',
    })
  })

  it('rejects partially configured storage before making a network request', async () => {
    vi.stubEnv('DEPLOY_TARGET', 'cloudflare')
    vi.stubEnv('S3_BUCKET', 'texevo-private-test')
    const fetch = vi.fn()
    vi.stubGlobal('fetch', fetch)
    await expect(putPrivate('test/file', Buffer.from('test'), 'text/plain')).rejects.toThrow(
      'private_storage_not_configured',
    )
    expect(fetch).not.toHaveBeenCalled()
  })
})
