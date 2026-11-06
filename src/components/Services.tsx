import { useLayoutEffect, useRef } from 'react'
import Reveal from './Reveal'
import SectionLabel from './SectionLabel'
import RegionSwitch from './RegionSwitch'
import Roll from './Roll'
import Icon from './Icon'
import { SERVICES } from '../lib/content'
import { REGIONS, money, type RegionKey } from '../lib/config'
import { useRegion } from '../lib/region'
import { gsap, prefersReducedMotion } from '../lib/motion'

/* One line per step; the Brief is the way in, so it comes first. */
const PROCESS = [
  { step: 'Brief', body: 'Five questions. I reply with a plan and a price range.' },
  { step: 'Design', body: 'Layout agreed on screen before anything is built.' },
  { step: 'Build', body: 'Working software you can click through.' },
  { step: 'Launch', body: 'Deployed, tested on real devices, walked through.' },
]

/* "From" figures only — see REGIONS in lib/config.ts. Websites are charged by
   the page; software is scoped per project. The list follows the visitor's
   region. */
function priceFor(kind: (typeof SERVICES)[number]['price'], region: RegionKey) {
  const r = REGIONS[region]
  const m = (n: number) => money(n, region)
  if (kind === 'page') return { value: m(r.perPage), unit: 'per page', note: `Stores from ${m(r.store)}` }
  if (kind === 'software') return { value: m(r.software), unit: '', note: 'Quoted per project' }
  return { value: '', unit: '', note: 'Quoted after a short call' }
}

export default function Services() {
  const section = useRef<HTMLElement>(null)
  const process = useRef<HTMLOListElement>(null)
  const [region] = useRegion()

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
    })

    /* Each service is a line in an index. As a row crosses the screen its rule
       draws across, and its outlined title fills in left to right, scrubbed to
       the scroll, so the headline "prints" as you read down. The detail and
       price ease in alongside. */
    mm.add('(min-width: 0px)', () => {
      gsap.utils.toArray<HTMLElement>('.svc-row', root).forEach((row) => {
        const trigger = { trigger: row, start: 'top 85%', end: 'top 35%', scrub: 0.5 }
        gsap.fromTo(row.querySelector('.svc-rule'), { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: trigger })
        gsap.fromTo(
          row.querySelector('.svc-fill'),
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', ease: 'none', scrollTrigger: trigger },
        )
        gsap.from(row.querySelectorAll('.svc-fade'), {
          y: 22,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: { trigger: row, start: 'top 75%', once: true },
        })
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section ref={section} id="services" className="px-6 pb-12 pt-4 md:px-10 md:pb-20 md:pt-14">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 lg:grid-cols-[2.5rem_1fr] lg:gap-10">
        <SectionLabel>Services</SectionLabel>

        <div>
          <Reveal>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-5 md:mb-8">
              <h2 className="font-display text-4xl font-normal text-ivory md:text-6xl">
                What I <span className="italic text-carnation-deep">build</span>.
              </h2>
              <RegionSwitch />
            </div>
          </Reveal>

          <ul className="m-0 list-none p-0">
            {SERVICES.map((s) => {
              const price = priceFor(s.price, region)
              const title = 'font-sans text-[clamp(2rem,5.6vw,4.75rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.04em]'
              return (
                <li key={s.title} className="svc-row group relative py-6 md:py-9">
                  {/* the rule: a faint track, with a red line that draws over it */}
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-hairline" />
                  <span
                    aria-hidden="true"
                    className="svc-rule absolute inset-x-0 top-0 h-px origin-left bg-carnation"
                    style={{ transform: 'scaleX(0)' }}
                  />

                  <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10">
                    <div className="lg:col-span-8">
                      <span className="svc-fade font-mono text-[11px] tracking-[0.2em] text-carnation">
                        {s.index} / 0{SERVICES.length}
                      </span>
                      {/* outlined title; an identical solid copy is revealed over it as you scroll */}
                      <h3 className="relative m-0 mt-3 transition-transform duration-500 ease-out group-hover:translate-x-2 md:mt-4">
                        <span className={`${title} block text-transparent [-webkit-text-stroke:1px_rgba(244,241,234,0.4)]`}>
                          {s.title}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`${title} svc-fill pointer-events-none absolute inset-0 block text-ivory`}
                          style={{ clipPath: 'inset(0 100% 0 0)' }}
                        >
                          {s.title}
                        </span>
                      </h3>
                    </div>

                    <div className="svc-fade lg:col-span-4 lg:text-right">
                      <p className="max-w-sm text-[15px] leading-relaxed text-muted lg:ml-auto">{s.line}</p>
                      <p className="mt-4 font-display text-3xl text-ivory transition-colors group-hover:text-carnation md:text-4xl">
                        {price.value ? `from ${price.value}` : 'By quote'}
                        {price.unit && <span className="ml-2 font-sans text-sm text-muted">{price.unit}</span>}
                      </p>
                      <p className="mt-1 text-[12.5px] text-dim">{price.note}</p>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
          <p className="mt-2 text-[12.5px] leading-relaxed text-dim">
            Starting points, not quotes. The final price depends on pages, features and timeline.
          </p>

          <Reveal>
            <h3 className="mb-6 mt-14 font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
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
            <div className="mt-10">
              <a
                href="#contact"
                className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.12em]"
              >
                <Roll>Start your brief</Roll>
                <Icon name="arrow" className="h-3.5 w-3.5" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
