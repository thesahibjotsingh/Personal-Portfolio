import { CONFIG } from '../lib/config'

export default function Footer() {
  return (
    /* same hairline the navbar carries on its underside, so the page opens and
       closes on an identical rule */
    <footer className="border-t border-hairline px-6 py-8 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
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
