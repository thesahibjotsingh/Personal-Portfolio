import { useEffect, useRef, useState } from 'react'
import { PROJECTS } from '../lib/projects'
import { SERVICES, PILLARS, STACK_ITEMS } from '../lib/content'
import { CONFIG } from '../lib/config'
import StatusTag from './StatusTag'
import Roll from './Roll'

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#stack' },
  { label: 'Contact', href: '#contact' },
]

/* The lockup shrinks to ~70% past this scroll depth. */
const COMPACT_AFTER = 80

const WORDMARK_FULL = 'clamp(2.25rem, 3.5vw, 3.5rem)'
const WORDMARK_COMPACT = 'clamp(1.58rem, 2.45vw, 2.45rem)'
/* Sized so the tagline's rendered width sits just under the wordmark's, making
   the pair read as one lockup rather than a wide bar hanging off a narrow word.
   "Saheb" in Dancing Script is only ~114px at full size, so this has to stay
   small — the tracking below was pulled in from 0.3em for the same reason. */
const TAGLINE_FULL = 'clamp(0.4rem, 0.52vw, 0.52rem)'
const TAGLINE_COMPACT = 'clamp(0.32rem, 0.37vw, 0.37rem)'

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [compact, setCompact] = useState(false)
  const [active, setActive] = useState('')

  /* Which section is crossing the middle of the viewport — drives the nav
     highlight and aria-current. The thin band means exactly one wins. */
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1))
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    targets.forEach((t) => observer.observe(t))

    /* above the first section (the hero) nothing should be highlighted */
    const onScroll = () => {
      if (window.scrollY < 120) setActive('')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

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
              className="mt-1 font-sans uppercase leading-none tracking-[0.16em] text-dim"
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
              <NavDropdown
                key={link.label}
                link={link}
                isActive={active === link.href.slice(1)}
                align={link.label === 'Contact' ? 'right' : 'center'}
                width={link.label === 'Skills' ? 'w-[22rem]' : link.label === 'Contact' ? 'w-[20rem]' : 'w-[26rem]'}
              >
                <DropdownContent label={link.label} />
              </NavDropdown>
            ))}
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-carnation px-6 py-[0.7rem] text-[0.9375rem] font-medium text-carnation transition-colors hover:bg-carnation hover:text-void"
            >
              <Roll>Let's Talk</Roll>
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
            menuOpen ? 'max-h-[26rem]' : 'max-h-0 border-t-0'
          }`}
        >
          <div className="flex flex-col gap-6 px-6 py-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                aria-current={active === link.href.slice(1) ? 'true' : undefined}
                className={`text-xl font-medium ${
                  active === link.href.slice(1) ? 'text-ivory' : 'text-muted'
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-carnation px-6 py-3 text-[0.9375rem] font-medium text-carnation"
            >
              <Roll>Let's Talk</Roll>
              <ArrowUpRight />
            </a>
          </div>
        </div>
      </nav>
    </>
  )
}

/* Every desktop nav item opens a menu on hover or keyboard focus. Pure CSS,
   so it needs no state; the pt-5 on the panel is a hover bridge so the
   pointer can cross the gap without the menu closing. */
function NavDropdown({
  link,
  isActive,
  align = 'center',
  width = 'w-[26rem]',
  children,
}: {
  link: { label: string; href: string }
  isActive: boolean
  align?: 'center' | 'right'
  width?: string
  children: React.ReactNode
}) {
  const position = align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2'
  return (
    <div className="group/nav relative">
      <a
        href={link.href}
        aria-haspopup="true"
        aria-current={isActive ? 'true' : undefined}
        className={`inline-flex items-center gap-1.5 text-[0.9375rem] font-medium transition-colors hover:text-carnation group-hover/nav:text-carnation group-focus-within/nav:text-carnation ${
          isActive ? 'text-ivory' : 'text-muted'
        }`}
      >
        {link.label}
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="transition-transform duration-200 group-hover/nav:rotate-180 group-focus-within/nav:rotate-180"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </a>

      <div
        className={`invisible absolute top-full z-10 ${position} ${width} translate-y-1 pt-5 opacity-0 transition duration-200 group-hover/nav:visible group-hover/nav:translate-y-0 group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:translate-y-0 group-focus-within/nav:opacity-100`}
      >
        <div className="glass rounded-xl p-2">{children}</div>
      </div>
    </div>
  )
}

function MenuRow({
  href,
  title,
  sub,
  tag,
  external = false,
}: {
  href: string
  title: string
  sub?: string
  tag?: React.ReactNode
  external?: boolean
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="flex items-center justify-between gap-4 rounded-lg px-3 py-2.5 transition-colors hover:bg-ivory/10 focus-visible:bg-ivory/10"
    >
      <span className="min-w-0">
        <span className="block truncate text-[14px] font-medium text-ivory">{title}</span>
        {sub && (
          <span className="block truncate font-mono text-[10px] uppercase tracking-[0.1em] text-dim">
            {sub}
          </span>
        )}
      </span>
      {tag}
    </a>
  )
}

function MenuFooter({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="mt-1 flex items-center justify-between rounded-lg border-t border-hairline px-3 pb-1.5 pt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-dim transition-colors hover:text-carnation"
    >
      {label}
      <ArrowUpRight />
    </a>
  )
}

function DropdownContent({ label }: { label: string }) {
  switch (label) {
    case 'Work':
      return (
        <>
          <ul className="m-0 list-none p-0">
            {PROJECTS.map((p) => (
              <li key={p.slug}>
                <MenuRow
                  href={`#${p.slug}`}
                  title={p.title}
                  sub={p.meta}
                  tag={<StatusTag status={p.status} />}
                />
              </li>
            ))}
          </ul>
          <MenuFooter href="#work" label="View all work" />
        </>
      )
    case 'Services':
      return (
        <>
          <ul className="m-0 list-none p-0">
            {SERVICES.map((s) => (
              <li key={s.title}>
                <MenuRow href="#services" title={s.title} sub={`Service ${s.index}`} />
              </li>
            ))}
          </ul>
          <MenuFooter href="#services" label="How a project runs" />
        </>
      )
    case 'About':
      return (
        <>
          <ul className="m-0 list-none p-0">
            {PILLARS.map((p) => (
              <li key={p.title}>
                <MenuRow href="#about" title={p.title} sub={p.body} />
              </li>
            ))}
          </ul>
          <MenuFooter href="#about" label="More about me" />
        </>
      )
    case 'Skills':
      return (
        <>
          <ul className="m-0 grid list-none grid-cols-2 gap-1 p-0">
            {STACK_ITEMS.map((t) => (
              <li key={t.name}>
                <a
                  href="#stack"
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition-colors hover:bg-ivory/10 focus-visible:bg-ivory/10"
                >
                  <img src={t.logo} alt="" className="h-5 w-5 object-contain" />
                  <span className="text-[14px] text-ivory">{t.name}</span>
                </a>
              </li>
            ))}
          </ul>
          <MenuFooter href="#stack" label="Full toolbench" />
        </>
      )
    case 'Contact':
      return (
        <>
          <ul className="m-0 list-none p-0">
            <li>
              <MenuRow href={`mailto:${CONFIG.email}`} title="Email" sub={CONFIG.email} />
            </li>
            <li>
              <MenuRow
                href={`https://wa.me/${CONFIG.whatsapp}`}
                title="WhatsApp"
                sub="Message me directly"
                external
              />
            </li>
            {CONFIG.socials.map((s) => (
              <li key={s.label}>
                <MenuRow href={s.href} title={s.label} sub="Code and projects" external />
              </li>
            ))}
          </ul>
          <MenuFooter href="#contact" label="Send an inquiry" />
        </>
      )
    default:
      return null
  }
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
