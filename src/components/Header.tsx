'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { BusinessNav } from './BusinessNav'

export function Header({ locale, preview }: { locale: 'de' | 'en'; preview: boolean }) {
  const [open, setOpen] = useState(false)
  const path = usePathname()
  const menuButton = useRef<HTMLButtonElement>(null)
  const header = useRef<HTMLElement>(null)
  const closePanels = () =>
    header.current
      ?.querySelectorAll('details[open]')
      .forEach((detail) => detail.removeAttribute('open'))
  const english = locale === 'en'
  useEffect(() => {
    setOpen(false)
    closePanels()
  }, [path])
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (header.current && !header.current.contains(event.target as Node)) {
        closePanels()
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [])
  const links = english
    ? [['Contact', '/en/contact']]
    : [
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
            href={english ? '/de' : '/en/services'}
            lang={english ? 'de' : 'en'}
            aria-label={english ? 'Deutsche Startseite' : 'English services overview'}
          >
            {english ? 'DE' : 'EN'}
          </Link>
        </div>
      </div>
      <header
        className="site-header"
        ref={header}
        onClick={(event) => {
          if ((event.target as HTMLElement).closest('a')) {
            setOpen(false)
            closePanels()
          }
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) closePanels()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            const detail = (e.target as HTMLElement).closest('details[open]')
            if (detail) {
              detail.removeAttribute('open')
              detail.querySelector('summary')?.focus()
            } else {
              closePanels()
              setOpen(false)
              menuButton.current?.focus()
            }
          }
        }}
      >
        <Link
          className="wordmark"
          href={english ? '/en/services' : '/de'}
          aria-label={english ? 'TEXEVO overview' : 'TEXEVO Startseite'}
        >
          TEXEVO<span aria-hidden="true">/</span>
        </Link>
        <nav className="desktop-nav" aria-label={english ? 'Main navigation' : 'Hauptnavigation'}>
          <BusinessNav locale={locale} />
          {links.map(([label, href]) => (
            <Link key={href} aria-current={path === href ? 'page' : undefined} href={href}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          {!english && (
            <Link className="search-link" href="/de/suche" aria-label="Website durchsuchen">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="m16 16 5 5" />
              </svg>
            </Link>
          )}
          <Link className="button compact" href={english ? '/en/contact' : '/de/anfrage'}>
            {english ? 'Start a brief' : 'Projekt anfragen'}
          </Link>
          <button
            ref={menuButton}
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => {
              closePanels()
              setOpen(!open)
            }}
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
            <BusinessNav locale={locale} />
            {links.map(([label, href]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
            {!english && (
              <>
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
