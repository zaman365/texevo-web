import { hasRole } from '@/cms/access'
import { RequestError } from './request-security'
export async function requireSales(headers: Headers) {
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers })
  if (!hasRole(user, ['admin', 'sales'])) throw new RequestError(403, 'Kein Zugriff auf Anfragen.')
  return user!
}
