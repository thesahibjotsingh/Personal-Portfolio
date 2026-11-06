import { useLayoutEffect, useRef } from 'react'
import SectionLabel from './SectionLabel'
import { gsap, prefersReducedMotion } from '../lib/motion'

const STATEMENT =
  "I'm Saheb — a full stack developer who builds the whole thing: the interface, the data layer, and the deploy."

export default function About() {
  const statement = useRef<HTMLParagraphElement>(null)

  /* Words brighten one after another as you scroll. The range ends while the
     paragraph is still low on the screen (its bottom edge at 72% of the viewport)
     so that by the time it is centred every word, including the last line, is
     already at full brightness. */
  useLayoutEffect(() => {
    if (prefersReducedMotion() || !statement.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-word',
        { opacity: 0.18 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: statement.current,
            start: 'top 88%',
            end: 'bottom 72%',
            scrub: true,
          },
        },
      )
    }, statement)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" className="relative overflow-hidden px-6 py-16 md:px-10 md:py-32">
      {/* a faint warm glow off the left edge, so the section has depth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-1/4 top-1/2 h-[70vmin] w-[70vmin] -translate-y-1/2 rounded-full opacity-[0.14] blur-3xl"
        style={{ background: 'radial-gradient(closest-side, var(--color-carnation), transparent)' }}
      />
      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 gap-6 lg:grid-cols-[2.5rem_1fr] lg:gap-10">
        <SectionLabel>About</SectionLabel>

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
      </div>
    </section>
  )
}
