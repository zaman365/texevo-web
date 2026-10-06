import { briefSchema } from '@/lib/brief-schema'
import { saveEnquiry } from '@/lib/enquiries'
import {
  ensureOrigin,
  errorResponse,
  rateLimit,
  readLimited,
  RequestError,
} from '@/lib/request-security'
import { siteURL } from '@/lib/env'
import { isPreview } from '@/lib/env'
import { fallbackForm } from '@/lib/fallback-form'
export const runtime = 'nodejs'
export async function POST(request: Request) {
  try {
    ensureOrigin(request)
    const data = await readLimited(request, 32768)
    const isJSON = request.headers.get('content-type')?.includes('application/json')
    let input: unknown
    if (isJSON) {
      try {
        input = JSON.parse(data.toString('utf8'))
      } catch {
        throw new RequestError(400, 'Ungültige Anfrage.')
      }
    } else {
      const form = new URLSearchParams(data.toString('utf8'))
      input = { ...Object.fromEntries(form), privacy: form.get('privacy') === 'on' }
    }
    const parsed = briefSchema.safeParse(input)
    if (!parsed.success) {
      if (!isJSON)
        return new Response(
          fallbackForm(
            input as Record<string, unknown>,
            parsed.error.issues.map((i) => i.message),
            isPreview,
          ),
          {
            status: 400,
            headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
          },
        )
      return Response.json(
        {
          error: 'Bitte prüfen Sie die markierten Angaben.',
          fields: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }
    await rateLimit(request, 'enquiry', 30)
    const result = await saveEnquiry(parsed.data)
    if (!isJSON)
      return Response.redirect(
        `${siteURL}/${parsed.data.locale}/${parsed.data.locale === 'de' ? 'eingang' : 'receipt'}?reference=${encodeURIComponent(result.reference)}`,
        303,
      )
    return Response.json(result, { status: 201, headers: { 'Cache-Control': 'no-store' } })
  } catch (e) {
    return errorResponse(e)
  }
}
