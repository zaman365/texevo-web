import { z } from 'zod'
export const categories = [
  'team',
  'production',
  'sourcing',
  'sample',
  'reorder',
  'partner',
  'other',
] as const
export const categoryLabels: Record<string, string> = {
  team: 'Teamkleidung',
  production: 'Private Label',
  sourcing: 'Sourcing-Begleitung',
  sample: 'Muster',
  reorder: 'Nachbestellung',
  partner: 'Partneranfrage',
  other: 'Andere Textilanfrage',
}
export const noticeVersion = 'enquiry-2026-10-06-v1'
const optionalText = (max: number) => z.string().trim().max(max).optional().default('')
export const briefSchema = z
  .object({
    idempotencyKey: z.uuid(),
    locale: z.enum(['de', 'en']).default('de'),
    category: z.enum(categories),
    company: z.string().trim().min(2, 'Bitte Unternehmen angeben.').max(160),
    name: z.string().trim().min(2, 'Bitte Kontaktperson angeben.').max(120),
    email: z.email('Bitte gültige E-Mail-Adresse angeben.').max(254),
    phone: optionalText(60),
    description: z
      .string()
      .trim()
      .min(10, 'Bitte beschreiben Sie Ihr Vorhaben in mindestens 10 Zeichen.')
      .max(5000),
    quantity: optionalText(100),
    deadline: optionalText(100),
    destination: optionalText(200),
    budget: optionalText(100),
    product: optionalText(100),
    colour: optionalText(100),
    decoration: optionalText(300),
    sizes: optionalText(400),
    techPack: optionalText(100),
    scope: optionalText(500),
    reference: optionalText(120),
    callback: optionalText(200),
    source: optionalText(100),
    medium: optionalText(100),
    campaign: optionalText(100),
    privacy: z.literal(true, { error: 'Bitte bestätigen Sie den Datenschutzhinweis.' }),
    website: z.string().max(0).optional().default(''),
  })
  .superRefine((value, ctx) => {
    if (value.category === 'reorder' && !value.reference)
      ctx.addIssue({
        code: 'custom',
        path: ['reference'],
        message: 'Bitte eine frühere Auftrags- oder Musterreferenz angeben.',
      })
  })
export type Brief = z.infer<typeof briefSchema>
