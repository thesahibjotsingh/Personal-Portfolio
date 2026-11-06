import { useLayoutEffect, useRef } from 'react'
import SectionLabel from './SectionLabel'
import Reveal from './Reveal'
import { PILLARS } from '../lib/content'
import portrait from '../assets/portrait.webp'
import { gsap, prefersReducedMotion } from '../lib/motion'

const PORTRAIT_MASK =
  'radial-gradient(ellipse 50% 60% at 56% 48%, #000 22%, rgba(0,0,0,0.72) 38%, rgba(0,0,0,0.4) 55%, rgba(0,0,0,0.15) 72%, transparent 90%)'

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
    <section id="about" className="px-6 py-16 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 lg:grid-cols-[2.5rem_1fr] lg:gap-10">
        <SectionLabel>About</SectionLabel>

        <div>
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-16">
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

            {/* No frame, border or shape: a soft radial mask dissolves the photo
                into the page, so it reads as lit out of the dark. */}
            <Reveal>
              <div className="relative mx-auto aspect-square w-[min(86vw,460px)] lg:mx-0 lg:justify-self-end">
                {/* Tone curve: pulls the light grey wall down towards the page
                    colour while keeping the face bright, so the mask has almost
                    nothing left to fade. */}
                <svg width="0" height="0" className="absolute" aria-hidden="true">
                  <filter id="portrait-curve" colorInterpolationFilters="sRGB">
                    <feComponentTransfer>
                      <feFuncR type="gamma" amplitude="1.2" exponent="2.1" offset="0" />
                      <feFuncG type="gamma" amplitude="1.2" exponent="2.1" offset="0" />
                      <feFuncB type="gamma" amplitude="1.2" exponent="2.1" offset="0" />
                    </feComponentTransfer>
                  </filter>
                </svg>
                <img
                  src={portrait}
                  alt="Portrait of Sahibjot Singh"
                  className="h-full w-full object-cover"
                  style={{
                    WebkitMaskImage: PORTRAIT_MASK,
                    maskImage: PORTRAIT_MASK,
                    filter: 'grayscale(1) url(#portrait-curve)',
                  }}
                />
              </div>
            </Reveal>
          </div>

          <ul className="m-0 mt-20 grid w-full list-none gap-x-10 gap-y-2 p-0 md:grid-cols-3">
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
    </section>
  )
}
