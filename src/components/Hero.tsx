import { useEffect, useState } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'
import HeroMedia from './HeroMedia'
import Roll from './Roll'
import CharSwap from './CharSwap'
import Icon from './Icon'
import { CONFIG } from '../lib/config'

const step = (i: number) => ({ transitionDelay: `${140 + i * 110}ms` })

const WHATSAPP_HREF = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
  "Hi Saheb, I'd like to discuss a project.",
)}`

/* Buttons share every dimension so the pair reads as a matched set; only
   border and text colour separate primary from secondary. */
const BUTTON_BASE =
  'inline-flex items-center justify-center gap-2 rounded-[3px] border px-7 py-[0.9rem] text-[0.9375rem] font-medium transition-colors duration-200 max-[479px]:w-full xl:px-8 xl:py-[1.05rem] xl:text-[1rem]'

export default function Hero() {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  /* As the hero scrolls away its text lifts and fades, so the next section
     arrives over a settled frame instead of a hard cut. Each piece moves on its
     own (rather than one wrapper) so the headline can stay behind the statue
     while the buttons stay in front of it. */
  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.to('.hero-fade', {
        yPercent: -14,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: '#top', start: 'top top', end: '75% top', scrub: true },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="top"
      className={`relative flex min-h-svh flex-col overflow-hidden pt-[var(--nav-h,73px)] ${
        entered ? 'hero-in' : ''
      }`}
    >
      {/* the headline (z-0) sits BEHIND the statue (z-10); the intro text and
          buttons (z-30) sit in front of it so they always stay readable */}
      <HeroMedia />
      {/* the page opens in black and the hero surfaces out of it */}
      <div className="hero-curtain" aria-hidden="true" />

      <div className="relative order-1 flex flex-1 flex-col justify-center px-6 pb-6 pt-4 md:px-10 lg:pb-24 lg:pl-[6vw] lg:pr-[3vw]">
        <p
          className="hero-step relative z-30 font-mono text-[0.8rem] uppercase tracking-[0.2em] text-dim xl:text-[0.875rem]"
          style={step(0)}
        >
          <span className="hero-fade inline-block">Hello, I'm Saheb.</span>
        </p>

        <h1
          /* Sized by the narrower of width and height so three lines always fit
             a short window; the longest line ends where the statue begins. */
          className="hero-step relative z-0 mt-5 font-sans text-[clamp(2.5rem,min(6.5vw,13svh),8.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.045em] text-ivory"
          style={step(1)}
        >
          <span className="hero-fade block">
            <CharSwap text="Websites that" tracking={-0.045} />{' '}
            <br className="hidden md:inline" />
            <CharSwap text="make your business" tracking={-0.045} />{' '}
            <br className="hidden md:inline" />
            <span className="text-carnation">
              <CharSwap text="impossible to ignore." tracking={-0.045} />
            </span>
          </span>
        </h1>

        <p
          className="hero-step relative z-30 mt-5 max-w-[52ch] lg:max-w-[min(52ch,40vw)] text-[1.0625rem] leading-[1.6] text-muted xl:text-[1.1875rem]"
          style={step(2)}
        >
          <span className="hero-fade block">
            I build the whole product — the interface, the data behind it and the deploy — for
            brands that need to be taken seriously online.
          </span>
        </p>

        <div className="hero-step relative z-30 mt-6" style={step(3)}>
          <div className="hero-fade flex flex-wrap items-center gap-4">
          <a
            href="#work"
            className={`${BUTTON_BASE} border-carnation text-carnation hover:bg-carnation hover:text-void`}
          >
            <Roll>View My Work</Roll>
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
            <span className="relative z-10">
              <Roll>Book a Call</Roll>
            </span>
          </a>
          </div>
        </div>
      </div>

      {/* bottom strip: availability · scroll cue · tagline */}
      <div
        className="hero-step relative z-30 order-3 flex items-center justify-between gap-4 border-t border-hairline px-6 py-4 md:px-10 lg:absolute lg:inset-x-0 lg:bottom-0"
        style={step(4)}
      >
        <p className="flex items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim">
          <span
            className="inline-block h-2 w-2 rounded-full bg-carnation"
            style={{ animation: 'availPulse 2.2s ease-in-out infinite' }}
            aria-hidden="true"
          />
          Available for new projects
        </p>

        <a
          href="#work"
          className="hidden items-center gap-3 font-mono text-[10.5px] uppercase tracking-[0.2em] text-dim transition-colors hover:text-ivory md:inline-flex"
        >
          <span className="scroll-cue-line" aria-hidden="true" />
          <Roll>Scroll</Roll>
        </a>

        <p className="hidden font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim sm:block">
          {CONFIG.tagline}
        </p>
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
