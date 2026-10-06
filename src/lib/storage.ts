import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { FetchHttpHandler } from '@smithy/fetch-http-handler'
import { mkdir, readFile, writeFile, unlink } from 'node:fs/promises'
import path from 'node:path'
import { isPreview } from './env'
function privateStore() {
  const bucket = process.env.S3_BUCKET
  if (!bucket) return null
  if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY)
    throw new Error('private_storage_not_configured')
  return {
    bucket,
    client: new S3Client({
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION || 'eu-central-1',
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE !== 'false',
      // Fetch works in both Node and Workers without retaining cross-request
      // Node HTTP sockets. Read runtime credentials only when storage is used.
      requestHandler: new FetchHttpHandler({ requestTimeout: 15000 }),
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      },
    }),
  }
}
function requireLocalPreview() {
  if (!isPreview || process.env.DEPLOY_TARGET === 'cloudflare')
    throw new Error('private_storage_not_configured')
}
function localPath(key: string) {
  if (!/^[a-f0-9-]+\/[a-f0-9-]+$/.test(key)) throw new Error('invalid_storage_key')
  return path.join(process.cwd(), '.data/private-files', key)
}
export async function putPrivate(key: string, data: Buffer, mime: string) {
  const store = privateStore()
  if (store) {
    await store.client.send(
      new PutObjectCommand({
        Bucket: store.bucket,
        Key: key,
        Body: data,
        ContentType: mime,
      }),
    )
    return
  }
  requireLocalPreview()
  const target = localPath(key)
  await mkdir(path.dirname(target), { recursive: true, mode: 0o700 })
  await writeFile(target, data, { mode: 0o600 })
}
export async function getPrivate(key: string) {
  const store = privateStore()
  if (store) {
    const result = await store.client.send(new GetObjectCommand({ Bucket: store.bucket, Key: key }))
    return Buffer.from(await result.Body!.transformToByteArray())
  }
  requireLocalPreview()
  return readFile(localPath(key))
}
export async function deletePrivate(key: string) {
  const store = privateStore()
  if (store) await store.client.send(new DeleteObjectCommand({ Bucket: store.bucket, Key: key }))
  else {
    requireLocalPreview()
    await unlink(localPath(key)).catch(() => {})
  }
}
