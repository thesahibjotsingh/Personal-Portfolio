import { useEffect, useRef, useState } from 'react'

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#stack' },
  { label: 'Contact', href: '#contact' },
]

/* The lockup shrinks to ~70% past this scroll depth. */
const COMPACT_AFTER = 80

const WORDMARK_FULL = 'clamp(2.25rem, 3.5vw, 3.5rem)'
const WORDMARK_COMPACT = 'clamp(1.58rem, 2.45vw, 2.45rem)'
const TAGLINE_FULL = 'clamp(0.62rem, 0.8vw, 0.8rem)'
const TAGLINE_COMPACT = 'clamp(0.5rem, 0.58vw, 0.58rem)'

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      setCompact(y > COMPACT_AFTER)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Publish the *expanded* height only. The hero's top offset reads this, and
     letting it track the shrunken header would shift the whole page mid-scroll. */
  useEffect(() => {
    const nav = navRef.current
    if (!nav || compact) return

    const publish = () => {
      document.documentElement.style.setProperty(
        '--nav-h',
        `${Math.round(nav.getBoundingClientRect().height)}px`,
      )
    }

    publish()
    const observer = new ResizeObserver(publish)
    observer.observe(nav)
    return () => observer.disconnect()
  }, [compact])

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed inset-x-0 top-0 z-60 border-b border-hairline transition-colors duration-300 ${
          scrolled ? 'bg-void/85 backdrop-blur-md' : 'bg-void'
        }`}
      >
        <div className="flex items-center justify-between gap-4 px-6 py-4 md:px-8 md:py-5 lg:px-[6vw]">
          <a href="#top" aria-label="Saheb — back to top" className="flex flex-col leading-none">
            <span
              className="font-script font-bold leading-[0.9] text-carnation"
              style={{
                fontSize: compact ? WORDMARK_COMPACT : WORDMARK_FULL,
                transition: 'font-size 250ms ease',
              }}
            >
              Saheb
            </span>
            <span
              className="mt-1 font-sans uppercase leading-none tracking-[0.3em] text-dim"
              style={{
                fontSize: compact ? TAGLINE_COMPACT : TAGLINE_FULL,
                transition: 'font-size 250ms ease',
              }}
            >
              Code. Craft. Scale.
            </span>
          </a>

          <div className="hidden items-center gap-10 min-[900px]:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[0.9375rem] font-medium text-muted transition-colors hover:text-carnation"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-carnation px-6 py-[0.7rem] text-[0.9375rem] font-medium text-carnation transition-colors hover:bg-carnation hover:text-void"
            >
              Let's Talk
              <ArrowUpRight />
            </a>
          </div>

          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex flex-col items-center gap-[5px] min-[900px]:hidden"
          >
            <span
              className={`h-[2px] w-6 bg-ivory transition-all duration-300 ${
                menuOpen ? 'translate-y-[7px] rotate-45' : ''
              }`}
            />
            <span
              className={`h-[2px] w-6 bg-ivory transition-all duration-300 ${
                menuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`h-[2px] w-6 bg-ivory transition-all duration-300 ${
                menuOpen ? '-translate-y-[7px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>

        <div
          className={`overflow-hidden border-t border-hairline bg-void/95 backdrop-blur-md transition-[max-height] duration-300 min-[900px]:hidden ${
            menuOpen ? 'max-h-80' : 'max-h-0 border-t-0'
          }`}
        >
          <div className="flex flex-col gap-6 px-6 py-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-xl font-medium text-muted"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-carnation px-6 py-3 text-[0.9375rem] font-medium text-carnation"
            >
              Let's Talk
              <ArrowUpRight />
            </a>
          </div>
        </div>
      </nav>
    </>
  )
}

function ArrowUpRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}
