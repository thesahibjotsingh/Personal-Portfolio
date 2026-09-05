import { useEffect, useState } from 'react'
import HeroMedia from './HeroMedia'
import Icon from './Icon'
import { CONFIG } from '../lib/config'

const step = (i: number) => ({ transitionDelay: `${140 + i * 110}ms` })

const WHATSAPP_HREF = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
  "Hi Saheb, I'd like to discuss a project.",
)}`

/* Buttons share every dimension so the pair reads as a matched set; only
   border and text colour separate primary from secondary. */
const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 rounded-[3px] border px-7 py-[0.9rem] text-[0.9375rem] font-medium transition-colors duration-200 max-[479px]:w-full'

export default function Hero() {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <section
      id="top"
      /* Full height on desktop so the copy centres against the real screen.
         At 78svh the hero ended 222px short of the fold and all that space
         pooled underneath, leaving the composition top-heavy. The statue is
         capped in HeroMedia so it doesn't grow into the extra room. */
      className={`relative flex min-h-svh flex-col overflow-hidden pt-[var(--nav-h,73px)] lg:block lg:min-h-svh ${
        entered ? 'hero-in' : ''
      }`}
    >
      <HeroMedia />

      {/* tighter vertical rhythm on phones so the statue reaches the first screen */}
      <div className="relative z-10 order-1 flex flex-1 items-center px-6 py-6 md:px-8 md:py-10 lg:min-h-[calc(100svh-var(--nav-h,73px))] lg:py-0 lg:pl-[6vw] lg:pr-0">
        <div className="w-full lg:w-[46%]">
          <p
            className="hero-step flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-dim"
            style={step(0)}
          >
            <span
              className="inline-block h-2 w-2 rounded-full bg-carnation"
              style={{ animation: 'availPulse 2.2s ease-in-out infinite' }}
              aria-hidden="true"
            />
            Available for new projects
          </p>

          <p
            className="hero-step mt-5 font-mono text-[0.8rem] uppercase tracking-[0.2em] text-dim"
            style={step(1)}
          >
            Hello, I'm Saheb.
          </p>

          {/* Previous treatment, kept so the all-caps version can be reverted:
              <h1 className="... font-display text-[clamp(2.25rem,5.2vw,4rem)] leading-[1.1] tracking-[-0.02em]">
                Saheb, <em className="italic text-carnation-deep">I build digital
                <span className="text-[1.25em] ...">experiences</span></em><br />
                that deliver real impact<span className="text-carnation-deep">.</span>
              </h1> */}
          <h1
            className="hero-step mt-4 font-sans text-[clamp(1.95rem,4vw,3.15rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-ivory md:mt-5"
            style={step(2)}
          >
            {/* Breaks are explicit above 768px so the lines ascend in length
                (short, medium, longest) instead of wrapping long/short/longest.
                text-wrap: balance would even them out and kill that shape.
                Below 768px they collapse and the text wraps naturally. */}
            Websites that{' '}
            <br className="hidden md:inline" />
            make your business{' '}
            <br className="hidden md:inline" />
            <span className="text-carnation">impossible to ignore.</span>
          </h1>

          <p
            /* 52ch, not 46: at 46 the last line orphaned "look ancient." */
            className="hero-step mt-5 max-w-[52ch] text-[1.0625rem] leading-[1.6] text-muted md:leading-[1.75]"
            style={step(3)}
          >
            I engineer platforms for ambitious brands that establish absolute trust,
            generate leads, and make your competition look ancient.
          </p>

          <div className="hero-step mt-8 flex flex-wrap items-center gap-4" style={step(4)}>
            <a
              href="#work"
              className={`${BUTTON_BASE} border-carnation text-carnation hover:bg-carnation hover:text-void`}
            >
              View My Work
              <ArrowUpRight />
            </a>

            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book a call with Saheb on WhatsApp"
              className={`${BUTTON_BASE} btn-whatsapp`}
            >
              {/* lifted above the shine sweep, which sits at z-index 0 */}
              <Icon name="whatsapp" className="relative z-10 h-[1.1em] w-[1.1em] shrink-0" />
              <span className="relative z-10">Book a Call</span>
            </a>
          </div>
        </div>
      </div>
    </section>
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
