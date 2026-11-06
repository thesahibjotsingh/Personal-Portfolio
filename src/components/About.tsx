import { useLayoutEffect, useRef } from 'react'
import SectionLabel from './SectionLabel'
import Reveal from './Reveal'
import { PILLARS } from '../lib/content'
import { gsap, prefersReducedMotion } from '../lib/motion'

const STATEMENT =
  "I'm Saheb — a full stack developer who builds the whole thing: the interface, the data layer, and the deploy. Software that works the day it ships and keeps working after."

export default function About() {
  const statement = useRef<HTMLParagraphElement>(null)
  const pillars = useRef<HTMLUListElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !statement.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-word',
        { opacity: 0.16 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: statement.current,
            start: 'top 82%',
            end: 'bottom 48%',
            scrub: true,
          },
        },
      )
    }, statement)
    return () => ctx.revert()
  }, [])

  /* Stacked pillars (below 1024px) play out one at a time: each one's red rule
     draws across and its text lifts from dim to full as it reaches the reading
     zone. Scrubbed, so it follows the scroll and reverses on the way up. */
  useLayoutEffect(() => {
    const list = pillars.current
    if (!list || prefersReducedMotion()) return
    const mm = gsap.matchMedia()
    mm.add('(max-width: 1023px)', () => {
      gsap.utils.toArray<HTMLElement>('.pillar', list).forEach((item) => {
        const trigger = { trigger: item, start: 'top 85%', end: 'top 55%', scrub: 0.4 }
        gsap.fromTo(
          item.querySelector('.pillar-body'),
          { opacity: 0.2, y: 14 },
          { opacity: 1, y: 0, ease: 'none', scrollTrigger: trigger },
        )
        gsap.fromTo(
          item.querySelector('.pillar-line'),
          { scaleX: 0 },
          { scaleX: 1, ease: 'none', scrollTrigger: trigger },
        )
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="about" className="px-6 py-16 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 lg:grid-cols-[2.5rem_1fr] lg:gap-10">
        <SectionLabel>About</SectionLabel>

        <div>
          <p
            ref={statement}
            className="max-w-5xl font-sans text-[clamp(1.6rem,3.6vw,3.25rem)] font-light leading-[1.2] tracking-[-0.02em] text-ivory"
          >
            {STATEMENT.split(' ').map((word, i) => (
              <span key={i} className="about-word">
                {word}{' '}
              </span>
            ))}
          </p>

          <ul
            ref={pillars}
            className="m-0 mt-20 grid w-full list-none gap-x-10 gap-y-2 p-0 md:grid-cols-3"
          >
            {PILLARS.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <li className="pillar relative h-full border-t border-hairline py-6">
                  <span
                    aria-hidden="true"
                    className="pillar-line pointer-events-none absolute left-0 top-[-1px] h-px w-full origin-left bg-carnation lg:hidden"
                    style={{ transform: 'scaleX(0)' }}
                  />
                  <div className="pillar-body">
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-carnation">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
