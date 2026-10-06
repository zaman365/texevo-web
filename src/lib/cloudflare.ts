import { getCloudflareContext } from '@opennextjs/cloudflare'

type PrivateBucket = {
  put(
    key: string,
    body: Uint8Array,
    options: { httpMetadata: { contentType: string } },
  ): Promise<unknown>
  get(key: string): Promise<{ arrayBuffer(): Promise<ArrayBuffer> } | null>
  delete(key: string): Promise<void>
}

type Bindings = {
  HYPERDRIVE?: { connectionString: string }
  PRIVATE_UPLOADS?: PrivateBucket
}

export function cloudflareBindings(): Bindings | null {
  if (process.env.DEPLOY_TARGET !== 'cloudflare') return null
  return getCloudflareContext().env as unknown as Bindings
}

export function databasePoolOptions() {
  const bindings = cloudflareBindings()
  if (bindings && !bindings.HYPERDRIVE) throw new Error('hyperdrive_not_configured')
  return {
    connectionString: bindings?.HYPERDRIVE?.connectionString || process.env.DATABASE_URL,
    // Workers cannot reuse sockets created in a different request. Hyperdrive
    // maintains the persistent upstream pool; each application checkout is fresh.
    ...(bindings ? { maxUses: 1 } : {}),
  }
}
