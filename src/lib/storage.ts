import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { mkdir, readFile, writeFile, unlink } from 'node:fs/promises'
import path from 'node:path'
import { isPreview } from './env'
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
  if (client)
    await client.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }))
  else {
    if (!isPreview) throw new Error('private_storage_not_configured')
    await unlink(localPath(key)).catch(() => {})
  }
}
