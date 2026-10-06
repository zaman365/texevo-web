'use client'
import { useState } from 'react'
import { PrintButton } from './PrintButton'
const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', 'Weitere']
export function SizeWorksheet() {
  const [values, setValues] = useState<Record<string, string>>({})
  const [target, setTarget] = useState('')
  const total = Object.values(values).reduce((n, v) => n + (Number(v) || 0), 0)
  const valid =
    Object.values(values).every((v) => !v || /^\d+$/.test(v)) && (!target || /^\d+$/.test(target))
  const matches = !target || Number(target) === total
  function download() {
    const csv =
      '\uFEFFGröße;Anzahl\r\n' +
      sizes.map((s) => `${s};${values[s] || 0}`).join('\r\n') +
      `\r\nGesamt;${total}\r\n`
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'texevo-groessenliste.csv'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return (
    <div className="worksheet">
      <p>
        Nur Mengen je Größe erfassen, keine Namen. Die verfügbaren Größen und Maße werden am
        konkreten Artikel geprüft. Ihre Eingaben bleiben auf dieser Seite und werden nicht
        gespeichert.
      </p>
      <label>
        Geplante Gesamtmenge
        <input
          type="number"
          min="0"
          max="100000"
          step="1"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
        />
      </label>
      <div className="size-grid">
        {sizes.map((s) => (
          <label key={s}>
            {s}
            <input
              type="number"
              min="0"
              max="100000"
              step="1"
              value={values[s] || ''}
              onChange={(e) => setValues({ ...values, [s]: e.target.value })}
            />
          </label>
        ))}
      </div>
      <div className="worksheet-total" role="status">
        <strong>Summe: {total} Stück</strong>
        <span>
          {!valid
            ? 'Bitte nur ganze, nicht negative Mengen eingeben.'
            : matches
              ? 'Die Mengen sind erfasst.'
              : `Die Summe weicht um ${Math.abs(Number(target) - total)} Stück von der geplanten Menge ab.`}
        </span>
      </div>
      <div className="button-row">
        <button className="button" disabled={!valid || !matches} onClick={download}>
          Größenliste herunterladen
        </button>
        <PrintButton />
        <button
          className="text-button"
          onClick={() => {
            setValues({})
            setTarget('')
          }}
        >
          Leeren
        </button>
      </div>
    </div>
  )
}
