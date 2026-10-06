import { createHash, createHmac } from 'node:crypto'
export const newsletterWording =
  'Ich möchte den TEXEVO Newsletter per E-Mail erhalten. Ich kann meine Einwilligung jederzeit widerrufen. Erst nach Bestätigung meiner E-Mail-Adresse beginnt der Versand.'
export const newsletterVersion = 'newsletter-2026-10-06-v1'
export const tokenHash = (token: string) => createHash('sha256').update(token).digest('hex')
export const withdrawalToken = (id: string) =>
  `${id}.${createHmac('sha256', process.env.PAYLOAD_SECRET || '')
    .update(`unsubscribe:${id}`)
    .digest('hex')}`
