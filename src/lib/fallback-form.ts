import { categoryLabels } from './brief-schema'
import { audiences, services } from '@/content/business'
const escape = (value: unknown) =>
  String(value ?? '').replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  )
export function fallbackForm(input: Record<string, unknown>, errors: string[], preview: boolean) {
  const en = input.locale === 'en'
  const contextFields = [
    { key: 'audience', label: en ? 'Business type' : 'Unternehmenstyp', options: audiences },
    { key: 'service', label: en ? 'Service' : 'Leistung', options: services },
  ]
    .map(
      ({ key, label, options }) =>
        `<label>${label}<select name="${key}"><option value="">${en ? 'To be discussed' : 'Gemeinsam einordnen'}</option>${options.map((option) => `<option value="${option.id}" ${input[key] === option.id ? 'selected' : ''}>${escape(option[en ? 'en' : 'de'].label)}</option>`).join('')}</select></label>`,
    )
    .join('')
  const fields = [
    ['company', en ? 'Company' : 'Unternehmen'],
    ['name', en ? 'Contact name' : 'Kontaktperson'],
    ['email', 'E-Mail'],
    ['phone', en ? 'Phone (optional)' : 'Telefon (optional)'],
    [
      'reference',
      en ? 'Previous reference (for reorders)' : 'Frühere Referenz (bei Nachbestellungen)',
    ],
    ['quantity', en ? 'Quantity (optional)' : 'Menge (optional)'],
    ['deadline', en ? 'Desired delivery (optional)' : 'Wunschtermin (optional)'],
  ]
  return `<!doctype html><html lang="${en ? 'en' : 'de'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>TEXEVO · ${en ? 'Check your brief' : 'Briefing prüfen'}</title><style>body{font:18px/1.6 system-ui;color:#152a36;background:#f4f3ee;margin:0}main{max-width:700px;margin:auto;padding:32px 20px}label{display:block;margin:20px 0}input,select,textarea,button{box-sizing:border-box;font:inherit;width:100%;padding:12px;border:1px solid #53646d}textarea{min-height:130px}button{background:#b74424;color:white;cursor:pointer}input[type=checkbox]{width:auto}li{color:#92361d}a{color:inherit}:focus-visible{outline:3px solid #27668b;outline-offset:3px}</style></head><body><main><a href="/${en ? 'en/contact' : 'de/anfrage'}">TEXEVO</a><h1>${en ? 'Please check your details.' : 'Bitte prüfen Sie Ihre Angaben.'}</h1><ul role="alert">${errors.map((e) => `<li>${escape(e)}</li>`).join('')}</ul><form method="post" action="/api/enquiries"><input type="hidden" name="idempotencyKey" value="${escape(input.idempotencyKey)}"><input type="hidden" name="locale" value="${en ? 'en' : 'de'}"><label>${en ? 'Project' : 'Vorhaben'}<select name="category">${Object.entries(
    categoryLabels,
  )
    .map(
      ([key, value]) =>
        `<option value="${key}" ${input.category === key ? 'selected' : ''}>${escape(value)}</option>`,
    )
    .join(
      '',
    )}</select></label>${contextFields}<label>${en ? 'Project description' : 'Ihr Vorhaben'}<textarea name="description" required minlength="10" maxlength="5000">${escape(input.description)}</textarea></label>${fields.map(([key, label]) => `<label>${label}<input type="${key === 'email' ? 'email' : 'text'}" name="${key}" maxlength="254" value="${escape(input[key])}" ${['company', 'name', 'email'].includes(key) ? 'required' : ''}></label>`).join('')}<label><input type="checkbox" name="privacy" required ${input.privacy === true ? 'checked' : ''}> ${en ? 'I have read the privacy notice and request handling of this enquiry.' : 'Ich habe den Datenschutzhinweis gelesen und wünsche die Bearbeitung dieser Anfrage.'}</label><a href="/${en ? 'en/privacy' : 'de/datenschutz'}">${en ? 'Privacy notice' : 'Datenschutzhinweis'}</a><p>${preview ? (en ? 'Preview: test enquiries only. No email is sent.' : 'Vorschau: Nur Testanfragen. Kein E-Mail-Versand.') : ''}</p><button>${en ? 'Send enquiry' : 'Anfrage senden'}</button></form></main></body></html>`
}
