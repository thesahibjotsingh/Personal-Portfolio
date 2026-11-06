import { useLayoutEffect, useRef } from 'react'
import Reveal from './Reveal'
import SectionLabel from './SectionLabel'
import { SERVICES } from '../lib/content'
import { PRICING, inr } from '../lib/config'
import { gsap, prefersReducedMotion } from '../lib/motion'

/* Copy here describes the kinds of work already shown in the Work section —
   no turnaround times, prices or guarantees are promised. */
const PROCESS = [
  { step: 'Scope', body: 'A short call to pin down what you need, who it’s for and what “done” looks like.' },
  { step: 'Design', body: 'Layout and flows agreed on screen before anything is built.' },
  { step: 'Build', body: 'Working software you can click through, not a slide deck about it.' },
  { step: 'Launch', body: 'Deployed, checked on real devices, and walked through with you.' },
]

/* "From" figures only — see PRICING in lib/config.ts. Websites are charged by
   the page; the other two are scoped per project. */
const PRICES = [
  {
    label: 'Websites',
    price: inr(PRICING.perPage),
    unit: 'per page',
    note: 'Charged by the number of pages, so you pay for exactly what the site needs. A 6-page brand site starts around ' +
      inr(6 * PRICING.perPage) + '.',
  },
  {
    label: 'Online stores',
    price: inr(PRICING.store),
    unit: '',
    note: 'Product pages, cart and payments, scoped by the size of the catalogue and the payment options.',
  },
  {
    label: 'Custom software',
    price: inr(PRICING.software),
    unit: '',
    note: 'POS, billing, hospital portals and desktop tools, quoted per project after a short call.',
  },
]

export default function Services() {
  const section = useRef<HTMLElement>(null)
  const process = useRef<HTMLOListElement>(null)

  /* The process plays out in order as you scroll, scrubbed so it runs exactly
     as fast as you scroll and backwards on the way up.
     - Desktop (≥1024px): a red line draws left to right and each step wakes as
       the line reaches it.
     - Below that the steps stack, so the line runs down the left edge instead:
       it draws downwards and each step lights up as it reaches the reading
       zone; the service rows above do the same, one by one. */
  useLayoutEffect(() => {
    const list = process.current
    const root = section.current
    if (!list || !root || prefersReducedMotion()) return

    const mm = gsap.matchMedia()
    const bodies = gsap.utils.toArray<HTMLElement>('.proc-body', list)
    const dots = gsap.utils.toArray<HTMLElement>('.proc-dot', list)

    mm.add('(min-width: 1024px)', () => {
      gsap.set(bodies, { opacity: 0.2, y: 18 })
      gsap.set(dots, { scale: 0 })

      const total = 3
      const tl = gsap.timeline({
        /* Starts as the list enters and is fully played by the time its top
           reaches mid-screen, so every step is lit while you're still reading. */
        scrollTrigger: { trigger: list, start: 'top 88%', end: 'top 48%', scrub: 0.4 },
      })
      tl.fromTo('.proc-line', { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: total }, 0)
      // each step sits at i/4 of the width, so it wakes when the line gets there
      bodies.forEach((body, i) => {
        const at = (i / bodies.length) * total
        tl.to(dots[i], { scale: 1, duration: 0.3, ease: 'back.out(2.5)' }, at)
        tl.to(body, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, at)
      })
    })

    mm.add('(max-width: 1023px)', () => {
      // the rail draws down the left as the whole list scrolls through the reading zone
      gsap.fromTo(
        '.proc-rail-fill',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: { trigger: list, start: 'top 70%', end: 'bottom 60%', scrub: 0.4 },
        },
      )
      // each step: marker pops, text lifts to full as it reaches the reading zone
      bodies.forEach((body, i) => {
        const trigger = { trigger: body, start: 'top 82%', end: 'top 58%', scrub: 0.4 }
        gsap.fromTo(body, { opacity: 0.2, y: 14 }, { opacity: 1, y: 0, ease: 'none', scrollTrigger: trigger })
        gsap.fromTo(dots[i], { scale: 0 }, { scale: 1, ease: 'none', scrollTrigger: trigger })
      })

      // service rows: dim until they reach the reading zone, then full
      gsap.utils.toArray<HTMLElement>('.svc-row', root).forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0.25 },
          {
            opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger: row, start: 'top 85%', end: 'top 55%', scrub: 0.4 },
          },
        )
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section ref={section} id="services" className="px-6 py-14 md:px-10 md:py-24">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 lg:grid-cols-[2.5rem_1fr] lg:gap-10">
        <SectionLabel>Services</SectionLabel>

        <div>
          <Reveal>
            <h2 className="mb-12 max-w-3xl font-display text-4xl font-normal text-ivory md:mb-16 md:text-6xl">
              What I <span className="italic text-carnation-deep">build</span>.
            </h2>
          </Reveal>

          <ul className="m-0 list-none p-0">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <li className="svc-row group grid gap-4 border-t border-hairline py-8 lg:grid-cols-12 lg:gap-14 lg:py-10">
                  <div className="flex items-baseline gap-5 lg:col-span-6">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-carnation">
                      {s.index}
                    </span>
                    <h3 className="font-sans text-2xl font-light tracking-tight text-ivory transition-colors group-hover:text-carnation md:text-4xl">
                      {s.title}
                    </h3>
                  </div>
                  <p className="max-w-xl text-[15.5px] leading-relaxed text-muted md:text-[17px] lg:col-span-6">
                    {s.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal>
            <h3 className="mb-8 mt-20 font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
              How a project runs
            </h3>
          </Reveal>

          <ol ref={process} className="relative m-0 grid list-none gap-0 p-0 lg:grid-cols-4">
            {/* desktop: the track, and the red line that draws along it */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-0 right-0 top-0 hidden h-px bg-hairline lg:block"
            />
            <span
              aria-hidden="true"
              className="proc-line pointer-events-none absolute left-0 right-0 top-0 hidden h-px origin-left bg-carnation lg:block"
              style={{ transform: 'scaleX(0)' }}
            />
            {/* below desktop: the same idea as a vertical rail down the left */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 left-[5px] top-3 w-px bg-hairline lg:hidden"
            />
            <span
              aria-hidden="true"
              className="proc-rail-fill pointer-events-none absolute bottom-3 left-[5px] top-3 w-px origin-top bg-carnation lg:hidden"
              style={{ transform: 'scaleY(0)' }}
            />

            {PROCESS.map((p, i) => (
              <li key={p.step} className="relative h-full py-6 pl-9 lg:pl-0 lg:pr-8">
                <span
                  aria-hidden="true"
                  className="proc-dot absolute left-0 top-[2.1rem] h-[11px] w-[11px] rounded-full bg-carnation lg:-top-[5px]"
                />
                <div className="proc-body">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-carnation">
                    0{i + 1}
                  </span>
                  <h4 className="mt-3 font-display text-2xl text-ivory">{p.step}</h4>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <Reveal>
            <h3 className="mb-8 mt-20 font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
              How it's priced
            </h3>
          </Reveal>
          <div className="grid gap-0 md:grid-cols-3">
            {PRICES.map((p, i) => (
              <Reveal key={p.label} delay={i * 80}>
                <div className="h-full border-t border-hairline py-6 pr-8">
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-carnation">
                    {p.label}
                  </p>
                  <p className="mt-3 font-display text-3xl text-ivory md:text-4xl">
                    from {p.price}
                    {p.unit && <span className="ml-2 text-base text-muted">{p.unit}</span>}
                  </p>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-muted">{p.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-dim">
            Starting points, not quotes. The final price depends on the pages, the features and the
            timeline.
          </p>
        </div>
      </div>
    </section>
  )
}
