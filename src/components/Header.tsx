'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

export function Header({ locale, preview }: { locale: 'de' | 'en'; preview: boolean }) {
  const [open, setOpen] = useState(false)
  const path = usePathname()
  const menuButton = useRef<HTMLButtonElement>(null)
  const english = locale === 'en'
  useEffect(() => {
    setOpen(false)
  }, [path])
  const links = english
    ? [
        ['Private label', '/en/private-label'],
        ['Sourcing office', '/en/sourcing-office'],
        ['Contact', '/en/contact'],
      ]
    : [
        ['Textilien', '/de/teamkleidung'],
        ['So arbeiten wir', '/de/so-arbeiten-wir'],
        ['Wissen', '/de/wissen'],
        ['Über TEXEVO', '/de/ueber-uns'],
      ]
  return (
    <>
      {preview && (
        <div className="preview-bar">
          {english
            ? 'Review preview · Business details and content awaiting approval. Test enquiries only.'
            : 'Entwurf zur Prüfung · Unternehmensdaten und Inhalte noch nicht freigegeben. Nur Testanfragen.'}
        </div>
      )}
      <div className="utility-bar">
        <span>
          {english ? 'Textiles. Thought through together.' : 'Textilien. Gemeinsam durchdacht.'}
        </span>
        <div>
          {!english && <Link href="/de/nachbestellen">Nachbestellen</Link>}
          <Link
            href={english ? '/de' : '/en/private-label'}
            lang={english ? 'de' : 'en'}
            aria-label={english ? 'Deutsche Startseite' : 'English production overview'}
          >
            {english ? 'DE' : 'EN'}
          </Link>
        </div>
      </div>
      <header
        className="site-header"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setOpen(false)
            menuButton.current?.focus()
          }
        }}
      >
        <Link
          className="wordmark"
          href={english ? '/en/private-label' : '/de'}
          aria-label="TEXEVO Startseite"
        >
          TEXEVO<span aria-hidden="true">/</span>
        </Link>
        <nav className="desktop-nav" aria-label={english ? 'Main navigation' : 'Hauptnavigation'}>
          {links.map(([label, href]) => (
            <Link key={href} aria-current={path === href ? 'page' : undefined} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link
            className="search-link"
            href={english ? '/en/contact' : '/de/suche'}
            aria-label={english ? 'Contact' : 'Website durchsuchen'}
          >
            {english ? (
              'Contact'
            ) : (
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m16 16 5 5" />
              </svg>
            )}
          </Link>
          <Link className="button compact" href={english ? '/en/contact' : '/de/anfrage'}>
            {english ? 'Start a brief' : 'Projekt anfragen'}
          </Link>
          <button
            ref={menuButton}
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(!open)}
          >
            {open ? (english ? 'Close' : 'Schließen') : english ? 'Menu' : 'Menü'}
          </button>
        </div>
        {open && (
          <nav
            id="mobile-menu"
            className="mobile-nav"
            aria-label={english ? 'Mobile navigation' : 'Mobile Navigation'}
          >
            {links.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
            {!english && (
              <>
                <Link href="/de/private-label">Private Label</Link>
                <Link href="/de/sourcing-office">Sourcing Office</Link>
                <Link href="/de/nachbestellen">Nachbestellen</Link>
                <Link href="/de/suche">Suche</Link>
              </>
            )}
          </nav>
        )}
      </header>
    </>
  )
}
