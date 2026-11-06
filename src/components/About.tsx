import { useLayoutEffect, useRef } from 'react'
import SectionLabel from './SectionLabel'
import Reveal from './Reveal'
import { PILLARS } from '../lib/content'
import portrait from '../assets/portrait.webp'
import { gsap, prefersReducedMotion } from '../lib/motion'

const STATEMENT =
  "I'm Saheb — a full stack developer who builds the whole thing: the interface, the data layer, and the deploy. Software that works the day it ships and keeps working after."

export default function About() {
  const statement = useRef<HTMLParagraphElement>(null)

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

  return (
    <section id="about" className="px-6 py-16 md:px-8 md:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[2.5rem_1fr] lg:gap-10">
        <SectionLabel>About</SectionLabel>

        <div>
          <p
            ref={statement}
            className="max-w-4xl font-sans text-[clamp(1.6rem,3.6vw,3.25rem)] font-light leading-[1.2] tracking-[-0.02em] text-ivory"
          >
            {STATEMENT.split(' ').map((word, i) => (
              <span key={i} className="about-word">
                {word}{' '}
              </span>
            ))}
          </p>

          <div className="mt-20 flex flex-col items-center">
            <Reveal>
              {/* arch: fully rounded top, softly rounded base */}
              <div className="panel relative aspect-[4/5] w-[min(78vw,340px)] overflow-hidden rounded-b-[2rem] rounded-t-full">
                <img
                  src={portrait}
                  alt="Portrait of Sahibjot Singh"
                  className="h-full w-full object-cover object-[60%_32%]"
                />
                <span className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-black/50 px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ivory backdrop-blur">
                  Sahibjot Singh
                </span>
              </div>
            </Reveal>

            <ul className="m-0 mt-16 grid w-full list-none gap-x-10 gap-y-2 p-0 md:grid-cols-3">
              {PILLARS.map((p, i) => (
                <Reveal key={p.title} delay={i * 90}>
                  <li className="h-full border-t border-hairline py-6">
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-carnation">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.body}</p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
