'use client'
export function PrintButton() {
  return (
    <button className="button secondary no-print" onClick={() => window.print()}>
      Drucken / als PDF speichern
    </button>
  )
}
