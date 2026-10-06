'use client'
import { useState } from 'react'
export function NewsletterForm() {
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  return (
    <form
      className="newsletter-form"
      onSubmit={async (event) => {
        event.preventDefault()
        setBusy(true)
        const data = new FormData(event.currentTarget)
        try {
          const response = await fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: data.get('email'),
              consent: data.get('consent') === 'on',
            }),
          })
          const result = await response.json()
          setMessage(result.message || result.error)
        } catch {
          setMessage('Nicht erreichbar. Bitte später erneut versuchen.')
        } finally {
          setBusy(false)
        }
      }}
    >
      <label>
        E-Mail-Adresse
        <input type="email" name="email" autoComplete="email" required maxLength={254} />
      </label>
      <label className="check-label">
        <input type="checkbox" name="consent" required />
        <span>
          Ich möchte den TEXEVO Newsletter per E-Mail erhalten. Ich kann meine Einwilligung
          jederzeit widerrufen. Erst nach Bestätigung meiner E-Mail-Adresse beginnt der Versand.
        </span>
      </label>
      <button className="button" disabled={busy}>
        {busy ? 'Wird übermittelt …' : 'Bestätigungslink anfordern'}
      </button>
      <p role="status">{message}</p>
    </form>
  )
}
