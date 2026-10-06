import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { mkdir, readFile, writeFile, unlink } from 'node:fs/promises'
import path from 'node:path'
import { isPreview } from './env'
import { cloudflareBindings } from './cloudflare'
const configured = !!process.env.S3_BUCKET
const client = configured
  ? new S3Client({
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION || 'eu-central-1',
      forcePathStyle: true,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
      },
    })
  : null
function localPath(key: string) {
  if (!/^[a-f0-9-]+\/[a-f0-9-]+$/.test(key)) throw new Error('invalid_storage_key')
  return path.join(process.cwd(), '.data/private-files', key)
}
export async function putPrivate(key: string, data: Buffer, mime: string) {
  const bindings = cloudflareBindings()
  if (bindings) {
    if (!bindings.PRIVATE_UPLOADS) throw new Error('private_storage_not_configured')
    await bindings.PRIVATE_UPLOADS.put(key, new Uint8Array(data), {
      httpMetadata: { contentType: mime },
    })
    return
  }
  if (client) {
    await client.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: data,
        ContentType: mime,
      }),
    )
    return
  }
  if (!isPreview) throw new Error('private_storage_not_configured')
  const target = localPath(key)
  await mkdir(path.dirname(target), { recursive: true, mode: 0o700 })
  await writeFile(target, data, { mode: 0o600 })
}
export async function getPrivate(key: string) {
  const bindings = cloudflareBindings()
  if (bindings) {
    if (!bindings.PRIVATE_UPLOADS) throw new Error('private_storage_not_configured')
    const object = await bindings.PRIVATE_UPLOADS.get(key)
    if (!object) throw new Error('private_file_not_found')
    return Buffer.from(await object.arrayBuffer())
  }
  if (client) {
    const result = await client.send(
      new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }),
    )
    return Buffer.from(await result.Body!.transformToByteArray())
  }
  if (!isPreview) throw new Error('private_storage_not_configured')
  return readFile(localPath(key))
}
export async function deletePrivate(key: string) {
  const bindings = cloudflareBindings()
  if (bindings) {
    if (!bindings.PRIVATE_UPLOADS) throw new Error('private_storage_not_configured')
    await bindings.PRIVATE_UPLOADS.delete(key)
    return
  }
  if (client)
    await client.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }))
  else {
    if (!isPreview) throw new Error('private_storage_not_configured')
    await unlink(localPath(key)).catch(() => {})
  }
}
