import { useLayoutEffect, useRef } from 'react'
import Reveal from './Reveal'
import SectionLabel from './SectionLabel'
import { SERVICES } from '../lib/content'
import { gsap, prefersReducedMotion } from '../lib/motion'

/* Copy here describes the kinds of work already shown in the Work section —
   no turnaround times, prices or guarantees are promised. */
const PROCESS = [
  { step: 'Scope', body: 'A short call to pin down what you need, who it’s for and what “done” looks like.' },
  { step: 'Design', body: 'Layout and flows agreed on screen before anything is built.' },
  { step: 'Build', body: 'Working software you can click through, not a slide deck about it.' },
  { step: 'Launch', body: 'Deployed, checked on real devices, and walked through with you.' },
]

export default function Services() {
  const process = useRef<HTMLOListElement>(null)

  /* The process plays out in order as you scroll. On desktop a red line draws
     left to right and each step comes alive the moment the line reaches it:
     its marker pops, its text lifts from dim to full. Scrubbed, so it runs
     exactly as fast as you scroll, and runs backwards on the way up. Below
     1024px the four steps simply rise in one after another. */
  useLayoutEffect(() => {
    const list = process.current
    if (!list || prefersReducedMotion()) return

    const mm = gsap.matchMedia()
    const bodies = gsap.utils.toArray<HTMLElement>('.proc-body', list)
    const dots = gsap.utils.toArray<HTMLElement>('.proc-dot', list)

    mm.add('(min-width: 1024px)', () => {
      gsap.set(bodies, { opacity: 0.2, y: 18 })
      gsap.set(dots, { scale: 0 })

      const total = 3
      const tl = gsap.timeline({
        scrollTrigger: { trigger: list, start: 'top 78%', end: 'bottom 40%', scrub: 0.5 },
      })
      tl.fromTo(
        '.proc-line',
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', duration: total },
        0,
      )
      // each step sits at i/4 of the width, so it wakes when the line gets there
      bodies.forEach((body, i) => {
        const at = (i / bodies.length) * total
        tl.to(dots[i], { scale: 1, duration: 0.3, ease: 'back.out(2.5)' }, at)
        tl.to(body, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, at)
      })
    })

    mm.add('(max-width: 1023px)', () => {
      gsap.from(bodies, {
        opacity: 0,
        y: 24,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: list, start: 'top 85%', once: true },
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section id="services" className="px-6 py-14 md:px-10 md:py-24">
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
                <li className="group grid gap-4 border-t border-hairline py-8 lg:grid-cols-12 lg:gap-14 lg:py-10">
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

          <ol
            ref={process}
            className="relative m-0 grid list-none gap-0 p-0 md:grid-cols-2 lg:grid-cols-4"
          >
            {/* the track, and the red line that draws along it (desktop only) */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-0 right-0 top-0 hidden h-px bg-hairline lg:block"
            />
            <span
              aria-hidden="true"
              className="proc-line pointer-events-none absolute left-0 right-0 top-0 hidden h-px origin-left bg-carnation lg:block"
              style={{ transform: 'scaleX(0)' }}
            />

            {PROCESS.map((p, i) => (
              <li
                key={p.step}
                className="relative h-full border-t border-hairline py-6 pr-8 lg:border-t-0"
              >
                <span
                  aria-hidden="true"
                  className="proc-dot absolute -top-[5px] left-0 hidden h-[11px] w-[11px] rounded-full bg-carnation lg:block"
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
        </div>
      </div>
    </section>
  )
}
