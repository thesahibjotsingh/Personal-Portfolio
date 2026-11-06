import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'

/* An oversized call-to-action whose letters spread apart as it scrolls into
   view, then settle. Scrubbed to scroll, so it moves exactly as fast as you do. */
export default function StretchHeading({ text }: { text: string }) {
  const el = useRef<HTMLHeadingElement>(null)

  useLayoutEffect(() => {
    const node = el.current
    if (!node || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { letterSpacing: '-0.09em', opacity: 0.25 },
        {
          letterSpacing: '0.01em',
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: node, start: 'top 95%', end: 'top 35%', scrub: true },
        },
      )
    }, node)

    return () => ctx.revert()
  }, [])

  return (
    <h2
      ref={el}
      className="mb-14 select-none whitespace-nowrap text-center font-sans text-[clamp(3rem,13vw,13rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.05em] text-ivory md:mb-20"
    >
      {text}
    </h2>
  )
}
