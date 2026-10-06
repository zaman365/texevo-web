'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { briefSchema, categoryLabels } from '@/lib/brief-schema'
import { audiences, services } from '@/content/business'
type Receipt = { id: string; reference: string; uploadToken: string; preview: boolean }
type Props = {
  locale: 'de' | 'en'
  preview: boolean
  idempotencyKey: string
  category?: string
  audience?: string
  service?: string
  product?: string
  short?: boolean
  source?: string
  medium?: string
  campaign?: string
}
export function BriefForm(props: Props) {
  const en = props.locale === 'en'
  const t = (de: string, english: string) => (en ? english : de)
  const [enhanced, setEnhanced] = useState(false)
  const [short, setShort] = useState(!!props.short)
  const [step, setStep] = useState(1)
  const [values, setValues] = useState<Record<string, string>>({
    category: props.category || 'production',
    audience: audiences.some((a) => a.id === props.audience) ? props.audience! : '',
    service: services.some((s) => s.id === props.service) ? props.service! : '',
    product: props.product || '',
    company: '',
    name: '',
    email: '',
    description: '',
    quantity: '',
    deadline: '',
    reference: '',
    phone: '',
    destination: '',
    budget: '',
    colour: '',
    decoration: '',
    sizes: '',
    techPack: '',
    scope: '',
    callback: '',
    website: '',
  })
  const [privacy, setPrivacy] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [failure, setFailure] = useState('')
  const [busy, setBusy] = useState(false)
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [uploadStates, setUploadStates] = useState<Record<number, string>>({})
  const heading = useRef<HTMLHeadingElement>(null)
  const errorSummary = useRef<HTMLDivElement>(null)
  const receiptRef = useRef<HTMLDivElement>(null)
  const submitLock = useRef(false)
  useEffect(() => setEnhanced(true), [])
  useEffect(() => {
    if (step !== 1) heading.current?.focus()
  }, [step])
  useEffect(() => {
    if (Object.keys(errors).length || failure) errorSummary.current?.focus()
  }, [errors, failure])
  useEffect(() => {
    if (receipt) receiptRef.current?.focus()
  }, [receipt])
  const update = (key: string, value: string) => {
    setValues((v) => ({ ...v, [key]: value }))
    setErrors((e) => {
      const next = { ...e }
      delete next[key]
      return next
    })
  }
  function input(
    key: string,
    label: string,
    options: {
      type?: string
      placeholder?: string
      help?: string
      required?: boolean
      autoComplete?: string
      full?: boolean
    } = {},
  ) {
    return (
      <label className={options.full ? 'span-full' : undefined} htmlFor={key}>
        {label}
        {!options.required && <span className="field-help"> {t('(optional)', '(optional)')}</span>}
        <input
          id={key}
          name={key}
          type={options.type || 'text'}
          value={values[key] || ''}
          onChange={(e) => update(key, e.target.value)}
          maxLength={key === 'email' ? 254 : 400}
          placeholder={options.placeholder}
          autoComplete={options.autoComplete}
          required={options.required}
          aria-invalid={!!errors[key]}
          aria-describedby={errors[key] ? `${key}-error` : options.help ? `${key}-help` : undefined}
        />
        {options.help && (
          <span id={`${key}-help`} className="field-help">
            {options.help}
          </span>
        )}
        {errors[key] && (
          <span id={`${key}-error`} className="field-error">
            {errors[key]}
          </span>
        )}
      </label>
    )
  }
  function validate(targetStep?: number) {
    const result = briefSchema.safeParse({
      ...values,
      locale: props.locale,
      idempotencyKey: props.idempotencyKey,
      privacy,
      source: props.source || '',
      medium: props.medium || '',
      campaign: props.campaign || '',
    })
    const relevant =
      targetStep === 1
        ? ['category', 'audience', 'service']
        : targetStep === 2
          ? ['description', 'reference']
          : targetStep === 3
            ? ['company', 'name', 'email', 'phone', 'privacy']
            : null
    const next: Record<string, string> = {}
    if (!result.success)
      for (const issue of result.error.issues) {
        const key = String(issue.path[0])
        if (!relevant || relevant.includes(key))
          next[key] = en
            ? key === 'privacy'
              ? 'Please acknowledge the privacy notice.'
              : `Please check ${key}.`
            : issue.message
      }
    setErrors(next)
    return Object.keys(next).length === 0
  }
  function next() {
    if (validate(step)) setStep((s) => s + 1)
  }
  async function upload(file: File, slot: number, saved: Receipt) {
    setUploadStates((s) => ({ ...s, [slot]: 'uploading' }))
    try {
      const response = await fetch(`/api/enquiries/${saved.id}/files?slot=${slot}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${saved.uploadToken}`,
          'Content-Type': file.type,
          'X-File-Name': encodeURIComponent(file.name),
        },
        body: file,
      })
      if (!response.ok) throw new Error('upload')
      setUploadStates((s) => ({ ...s, [slot]: 'saved' }))
    } catch {
      setUploadStates((s) => ({ ...s, [slot]: 'failed' }))
    }
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    if (!enhanced) return
    event.preventDefault()
    if (!short && step < 4) {
      next()
      return
    }
    if (submitLock.current) return
    if (!validate()) {
      setShort(true)
      return
    }
    submitLock.current = true
    setBusy(true)
    setFailure('')
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          privacy,
          locale: props.locale,
          idempotencyKey: props.idempotencyKey,
          source: props.source || '',
          medium: props.medium || '',
          campaign: props.campaign || '',
        }),
      })
      const result = await response.json()
      if (!response.ok) {
        if (result.fields)
          setErrors(
            Object.fromEntries(
              Object.entries(result.fields).map(([key, value]) => [key, (value as string[])[0]]),
            ),
          )
        throw new Error(
          result.error || t('Die Übermittlung ist fehlgeschlagen.', 'Submission failed.'),
        )
      }
      setReceipt(result)
      for (const [slot, file] of files.entries()) await upload(file, slot, result)
    } catch (error) {
      setFailure(
        error instanceof Error
          ? error.message
          : t(
              'Verbindung fehlgeschlagen. Bitte erneut versuchen.',
              'Connection failed. Please try again.',
            ),
      )
    } finally {
      setBusy(false)
      submitLock.current = false
    }
  }
  if (receipt)
    return (
      <div className="receipt" ref={receiptRef} tabIndex={-1}>
        <p className="eyebrow">
          {receipt.preview
            ? t('Testanfrage gespeichert', 'Test enquiry saved')
            : t('Anfrage gespeichert', 'Enquiry saved')}
        </p>
        <h2>
          {t('Danke. Ihr Briefing ist angekommen.', 'Thank you. Your brief has been received.')}
        </h2>
        <p>{t('Ihre Referenz', 'Your reference')}</p>
        <p className="receipt-code">{receipt.reference}</p>
        <p>
          {receipt.preview
            ? t(
                'Diese Vorschau speichert Ihre Testanfrage lokal. Es werden keine E-Mails versendet und keine Kundenanfragen weitergeleitet.',
                'This preview stores your test enquiry locally. No email is sent and no customer enquiry is forwarded.',
              )
            : t(
                'Ihre Anfrage wird geprüft. Das ist noch keine Auftragsannahme, Preis- oder Lieferzusage. Die Eingangsbestätigung wird separat versendet.',
                'Your enquiry will be reviewed. This is not an order acceptance, price or delivery commitment. A service acknowledgement is sent separately.',
              )}
        </p>
        {files.length > 0 && (
          <ul className="upload-list">
            {files.map((file, slot) => (
              <li key={slot}>
                {file.name}:{' '}
                {uploadStates[slot] === 'saved' ? (
                  t(
                    'privat gespeichert; Sicherheitsprüfung ausstehend',
                    'saved privately; security scan pending',
                  )
                ) : uploadStates[slot] === 'failed' ? (
                  <>
                    {t(
                      'Upload fehlgeschlagen. Die Textanfrage bleibt gespeichert.',
                      'Upload failed. Your text brief remains saved.',
                    )}{' '}
                    <button className="text-button" onClick={() => upload(file, slot, receipt)}>
                      {t('Erneut versuchen', 'Retry')}
                    </button>
                  </>
                ) : (
                  t('wird übertragen …', 'uploading …')
                )}
              </li>
            ))}
          </ul>
        )}
        <p>
          {t(
            'Bitte bewahren Sie die Referenz für Rückfragen auf.',
            'Please keep this reference for follow-up.',
          )}
        </p>
        <Link className="button secondary" href={en ? '/en' : '/de'}>
          {t('Zur Startseite', 'Back to overview')}
        </Link>
      </div>
    )
  const show = (n: number) => !enhanced || short || step === n
  const options = [
    [
      'production',
      'Bekleidung & Private Label',
      'Garment supply & private label',
      'Kollektionen, Großmengen, Nachlieferung',
      'Collections, bulk orders, repeat supply',
    ],
    [
      'team',
      'Teamkleidung & Merchandise',
      'Teamwear & merchandise',
      'Mitarbeiterkleidung, Vereins- und Markenartikel',
      'Staff clothing, club and branded apparel',
    ],
    [
      'sourcing',
      'Sourcing & Produktionsbegleitung',
      'Sourcing & production support',
      'Laufendes Mandat oder Projekt',
      'Ongoing mandate or project',
    ],
    [
      'other',
      'Andere Textilanfrage',
      'Another textile project',
      'Bedarf gemeinsam einordnen',
      'Let’s understand your needs',
    ],
  ]
  if (['sample', 'reorder', 'partner'].includes(values.category))
    options.push([
      values.category,
      categoryLabels[values.category],
      values.category === 'sample'
        ? 'Development & samples'
        : values.category === 'reorder'
          ? 'Reorder'
          : 'Partner enquiry',
      'Passend zu Ihrem Vorhaben',
      'For your project',
    ])
  return (
    <form
      action="/api/enquiries"
      method="post"
      className="brief-form"
      noValidate={enhanced}
      onSubmit={submit}
    >
      <input type="hidden" name="idempotencyKey" value={props.idempotencyKey} />
      <input type="hidden" name="locale" value={props.locale} />
      <label className="hp" aria-hidden="true">
        Website
        <input
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => update('website', e.target.value)}
        />
      </label>
      {enhanced && (
        <>
          <div className="button-row">
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setShort(!short)
                setStep(1)
              }}
            >
              {short
                ? t('Zum geführten Briefing', 'Use guided brief')
                : t('Lieber das Kurzformular?', 'Prefer the short form?')}
            </button>
          </div>
          {!short && (
            <ol className="form-steps" aria-label={t('Formularschritte', 'Form steps')}>
              {[
                t('Vorhaben', 'Project'),
                t('Bedarf', 'Details'),
                t('Kontakt', 'Contact'),
                t('Prüfen', 'Review'),
              ].map((label, i) => (
                <li key={label} aria-current={step === i + 1 ? 'step' : undefined}>
                  <span>0{i + 1}</span>
                  {label}
                </li>
              ))}
            </ol>
          )}
        </>
      )}
      {(Object.keys(errors).length > 0 || failure) && (
        <div className="notice error" role="alert" tabIndex={-1} ref={errorSummary}>
          <strong>
            {failure || t('Bitte prüfen Sie Ihre Angaben.', 'Please check your details.')}
          </strong>
          {Object.entries(errors).length > 0 && (
            <ul>
              {Object.entries(errors).map(([key, value]) => (
                <li key={key}>
                  <a href={`#${key}`} onClick={() => setShort(true)}>
                    {value}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div className="form-step" hidden={!show(1)}>
        <h2 tabIndex={-1} ref={step === 1 ? heading : undefined}>
          {t('Was möchten Sie beschaffen?', 'What are you planning?')}
        </h2>
        <p>
          {t(
            'Wählen Sie den passendsten Einstieg. Den Rest klären wir gemeinsam.',
            'Choose the closest starting point. Open questions are welcome.',
          )}
        </p>
        <div className="choice-grid">
          {options.map(([value, de, english, helpDe, helpEn]) => (
            <label className="choice" key={value}>
              <input
                id={value === values.category ? 'category' : undefined}
                type="radio"
                name="category"
                value={value}
                checked={values.category === value}
                onChange={() => update('category', value)}
              />
              <span>
                <strong>{t(de, english)}</strong>
                <small>{t(helpDe, helpEn)}</small>
              </span>
            </label>
          ))}
        </div>
        <div className="form-grid business-form-context">
          <label htmlFor="audience">
            {t('Ihr Unternehmenstyp (optional)', 'Your business type (optional)')}
            <select
              id="audience"
              name="audience"
              value={values.audience}
              onChange={(event) => update('audience', event.target.value)}
            >
              <option value="">{t('Noch offen / andere', 'Open / another type')}</option>
              {audiences.map((a) => (
                <option key={a.id} value={a.id}>
                  {a[props.locale].label}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="service">
            {t('Gewünschte Leistung (optional)', 'Service of interest (optional)')}
            <select
              id="service"
              name="service"
              value={values.service}
              onChange={(event) => update('service', event.target.value)}
            >
              <option value="">{t('Gemeinsam einordnen', 'Help me decide')}</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s[props.locale].label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
      <div className="form-step" hidden={!show(2)}>
        <h2 tabIndex={-1} ref={step === 2 ? heading : undefined}>
          {t('Was soll Ihr Projekt erreichen?', 'Tell us what your project needs.')}
        </h2>
        <p>
          {t(
            'Grobe Angaben reichen. „Noch offen“ ist eine hilfreiche Antwort.',
            'Rough details are enough. “Not decided yet” is a useful answer.',
          )}
        </p>
        <div className="form-grid">
          <label className="span-full" htmlFor="description">
            {t('Ihr Vorhaben und offene Fragen', 'Your project and open questions')}
            <textarea
              id="description"
              name="description"
              value={values.description}
              onChange={(e) => update('description', e.target.value)}
              required
              minLength={10}
              maxLength={5000}
              placeholder={t(
                'Zum Beispiel: eine Private-Label-Kollektion, ein Nachlieferprogramm oder Unterstützung bei einem Produktionsprojekt. Mengen und Details dürfen noch offen sein.',
                'For example: around 100 polos for our service team, chest logo. Material and sizes still open.',
              )}
              aria-invalid={!!errors.description}
              aria-describedby={errors.description ? 'description-error' : undefined}
            />
            {errors.description && (
              <span id="description-error" className="field-error">
                {errors.description}
              </span>
            )}
          </label>
          {input('quantity', t('Ungefähre Menge', 'Approximate quantity'), {
            placeholder: t('z. B. 100 Stück / noch offen', 'e.g. 100 pieces / not yet decided'),
          })}
          {input('deadline', t('Gewünschter Wareneingang', 'Desired delivery'), {
            placeholder: t('Datum oder noch offen', 'Date or not yet decided'),
          })}
          {!short && (
            <>
              {input('destination', t('Lieferziel', 'Delivery destination'))}
              {input('budget', t('Budgetrahmen', 'Budget range'))}
              {values.category === 'team' && (
                <>
                  {input('product', t('Kleidungsstück / Auswahlprofil', 'Garment / profile'))}
                  {input('colour', t('Wunschfarbe', 'Preferred colour'))}
                  {input('decoration', t('Logo und Position', 'Logo and position'))}
                  {input('sizes', t('Größenverteilung', 'Size distribution'), {
                    help: t(
                      'Nur Mengen je Größe; keine Mitarbeiternamen.',
                      'Quantities per size only; no employee names.',
                    ),
                  })}
                </>
              )}
              {values.category === 'production' && (
                <>
                  {input(
                    'techPack',
                    t('Tech-Pack / Entwicklungsstand', 'Tech pack / development stage'),
                  )}
                  {input(
                    'scope',
                    t('Modelle, Farben und Zielmarkt', 'Styles, colours and target market'),
                  )}
                </>
              )}
              {values.category === 'sourcing' &&
                input('scope', t('Gewünschter Leistungsumfang', 'Required service scope'), {
                  full: true,
                })}
            </>
          )}
          {values.category === 'reorder' &&
            input(
              'reference',
              t('Frühere Auftrags- oder Musterreferenz', 'Previous order or sample reference'),
              { required: true, full: true },
            )}
        </div>
      </div>
      <div className="form-step" hidden={!show(3)}>
        <h2 tabIndex={-1} ref={step === 3 ? heading : undefined}>
          {t('An wen dürfen wir uns wenden?', 'Who should we contact?')}
        </h2>
        <div className="form-grid">
          {input('company', t('Unternehmen', 'Company'), {
            required: true,
            autoComplete: 'organization',
          })}
          {input('name', t('Kontaktperson', 'Contact name'), {
            required: true,
            autoComplete: 'name',
          })}
          {input('email', 'E-Mail', { required: true, type: 'email', autoComplete: 'email' })}
          {input('phone', t('Telefon', 'Phone'), { type: 'tel', autoComplete: 'tel' })}
          {input('callback', t('Gewünschtes Rückruffenster', 'Preferred callback time'), {
            help: t(
              'Nur falls Sie telefonisch kontaktiert werden möchten.',
              'Only if you would like a phone call.',
            ),
            full: true,
          })}
        </div>
        <label className="check-label" htmlFor="privacy">
          <input
            id="privacy"
            name="privacy"
            type="checkbox"
            checked={privacy}
            onChange={(e) => setPrivacy(e.target.checked)}
            required
            aria-invalid={!!errors.privacy}
          />
          <span>
            {t('Ich habe den ', 'I have read the ')}
            <Link href={`/${props.locale}/${en ? 'privacy' : 'datenschutz'}`} target="_blank">
              {t('Datenschutzhinweis', 'privacy notice')}
            </Link>
            {t(
              ' gelesen. Meine Angaben dürfen zur Bearbeitung dieser Anfrage verwendet werden. Damit abonniere ich keinen Newsletter.',
              '. My details may be used to handle this enquiry. This does not subscribe me to a newsletter.',
            )}
          </span>
        </label>
        {errors.privacy && <p className="field-error">{errors.privacy}</p>}
      </div>
      <div className="form-step" hidden={!show(4)}>
        <h2 tabIndex={-1} ref={step === 4 ? heading : undefined}>
          {t('Ein letzter Blick auf Ihr Briefing.', 'Review your brief.')}
        </h2>
        {enhanced && !short && (
          <dl className="review-list">
            {[
              ['Vorhaben / Project', categoryLabels[values.category] || values.category],
              [
                'Unternehmenstyp / Business type',
                audiences.find((a) => a.id === values.audience)?.[props.locale].label ||
                  t('Noch offen', 'Open'),
              ],
              [
                'Leistung / Service',
                services.find((s) => s.id === values.service)?.[props.locale].label ||
                  t('Gemeinsam einordnen', 'To be discussed'),
              ],
              ['Beschreibung / Brief', values.description],
              ['Menge / Quantity', values.quantity || t('Noch offen', 'Open')],
              ['Kontakt / Contact', `${values.company} · ${values.name} · ${values.email}`],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        )}
        {enhanced && (
          <label>
            {t(
              'Logo oder Referenz anhängen (optional)',
              'Attach artwork or a reference (optional)',
            )}
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              multiple
              onChange={(e) => {
                const selection = Array.from(e.target.files || [])
                if (
                  selection.length > 3 ||
                  selection.some(
                    (f) =>
                      f.size > 20 * 1024 * 1024 ||
                      !['application/pdf', 'image/png', 'image/jpeg'].includes(f.type),
                  )
                ) {
                  setFailure(
                    t(
                      'Bitte höchstens 3 PDF-, PNG- oder JPEG-Dateien mit je maximal 20 MB wählen.',
                      'Choose up to 3 PDF, PNG or JPEG files, no more than 20 MB each.',
                    ),
                  )
                  e.target.value = ''
                  setFiles([])
                } else {
                  setFailure('')
                  setFiles(selection)
                }
              }}
            />
            <span className="field-help">
              PDF, PNG, JPEG ·{' '}
              {t(
                'bis zu 3 Dateien, je 20 MB. Private Ablage, Zugriff erst nach Sicherheitsprüfung. Andere Originalformate nach Abstimmung.',
                'up to 3 files, 20 MB each. Private storage; access only after a security scan. Other original formats by arrangement.',
              )}
            </span>
          </label>
        )}
        {props.preview && (
          <p className="review-note">
            {t(
              'Vorschau: Verwenden Sie bitte nur Testdaten. Es werden keine E-Mails versendet und keine verbindlichen Anfragen weitergeleitet.',
              'Preview: please use test data only. No email is sent and no real enquiry is forwarded.',
            )}
          </p>
        )}
        <p className="field-help">
          {t(
            'Eine Anfrage ist keine Bestellung. Preise, Verfügbarkeit und Termine werden gesondert bestätigt.',
            'An enquiry is not an order. Prices, availability and dates require separate confirmation.',
          )}
        </p>
      </div>
      <div className="form-controls">
        {enhanced && !short && step > 1 ? (
          <button
            type="button"
            className="button secondary"
            onClick={() => setStep((s) => s - 1)}
            disabled={busy}
          >
            {t('Zurück', 'Back')}
          </button>
        ) : (
          <span />
        )}
        {enhanced && !short && step < 4 ? (
          <button
            key="next-step"
            type="button"
            className="button"
            onClick={(event) => {
              event.preventDefault()
              next()
            }}
          >
            {t('Weiter', 'Continue')}
          </button>
        ) : (
          <button key="submit-brief" type="submit" className="button" disabled={busy}>
            {busy
              ? t('Wird gespeichert …', 'Saving …')
              : props.preview
                ? t('Testanfrage senden', 'Send test enquiry')
                : t('Anfrage senden', 'Send enquiry')}
          </button>
        )}
      </div>
    </form>
  )
}
