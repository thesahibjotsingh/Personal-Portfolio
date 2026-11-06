import { CONFIG } from '../lib/config'

const SECTION_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  return (
    /* same hairline the navbar carries on its underside, so the page opens and
       closes on an identical rule */
    <footer data-scope="light" className="border-t border-hairline bg-void px-6 py-12 text-ivory md:px-10">
      <div className="mx-auto grid max-w-[1600px] gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <span className="font-script text-4xl font-bold text-carnation">
            {CONFIG.wordmark}
          </span>
          <p className="mt-3 max-w-xs text-[14px] leading-relaxed text-muted">
            {CONFIG.name} — {CONFIG.role}. Platforms, storefronts and software, built end
            to end.
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
            Explore
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
            {SECTION_LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="text-[14px] text-muted transition-colors hover:text-ivory"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h2 className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-dim">
            Reach me
          </h2>
          <ul className="m-0 flex list-none flex-col gap-2.5 p-0 text-[14px]">
            <li>
              <a
                href={`mailto:${CONFIG.email}`}
                className="text-muted transition-colors hover:text-ivory"
              >
                {CONFIG.email}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${CONFIG.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-ivory"
              >
                WhatsApp
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            {CONFIG.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-ivory"
                >
                  {s.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-[1600px] flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
        <p className="font-mono text-[11px] text-dim">
          © {new Date().getFullYear()} {CONFIG.name}. Built by hand.
        </p>
        <a
          href="#top"
          className="font-mono text-[11px] uppercase tracking-[0.12em] text-dim transition-colors hover:text-ivory"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  )
}
