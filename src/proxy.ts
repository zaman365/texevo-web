import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'node:crypto'

function equal(a: string, b: string) {
  const x = Buffer.from(a)
  const y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const protectedRoute =
    path.startsWith('/admin') ||
    path.startsWith('/cms-api') ||
    path.startsWith('/api/staff') ||
    path.endsWith('/intern') ||
    request.nextUrl.searchParams.has('preview')
  if (protectedRoute) {
    const user = process.env.ADMIN_GATE_USER
    const password = process.env.ADMIN_GATE_PASSWORD
    if (!user || !password)
      return new NextResponse('Administration is not configured.', { status: 503 })
    const auth = request.headers.get('authorization') || ''
    const expected = Buffer.from(`${user}:${password}`).toString('base64')
    if (!equal(auth, `Basic ${expected}`))
      return new NextResponse('Authentication required.', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="TEXEVO staff", charset="UTF-8"',
          'Cache-Control': 'no-store',
        },
      })
  }
  const response = NextResponse.next()
  if (
    process.env.SITE_MODE !== 'live' ||
    protectedRoute ||
    path.includes('/suche') ||
    path.startsWith('/api')
  )
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  if (protectedRoute || path.startsWith('/api'))
    response.headers.set('Cache-Control', 'private, no-store')
  return response
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.svg|images/).*)'] }
