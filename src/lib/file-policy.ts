import path from 'node:path'
export const MAX_FILE_BYTES = 20 * 1024 * 1024
export function detectFile(buffer: Buffer): string | null {
  if (buffer.subarray(0, 5).toString() === '%PDF-') return 'application/pdf'
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  )
    return 'image/png'
  if (buffer.length >= 3 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255)
    return 'image/jpeg'
  return null
}
export function validFilename(name: string, mime: string) {
  const ext = path.extname(name).toLowerCase()
  return (
    { 'application/pdf': ['.pdf'], 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'] }[mime] ||
    []
  ).includes(ext)
}
export function cleanFilename(name: string) {
  return (
    path
      .basename(name.replace(/\\/g, '/'))
      .replace(/[^\p{L}\p{N}._ -]/gu, '_')
      .slice(0, 120) || 'attachment'
  )
}
