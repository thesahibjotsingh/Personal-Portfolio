import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'

/* An oversized call-to-action whose letters start bunched together and spread
   out to their resting places as it scrolls into view. Each letter moves with a
   transform (no layout, so it stays smooth) and the text stays fully opaque the
   whole way, so it never looks washed out while the page theme is changing. */
export default function StretchHeading({ text }: { text: string }) {
  const el = useRef<HTMLHeadingElement>(null)

  useLayoutEffect(() => {
    const node = el.current
    if (!node || prefersReducedMotion()) return

    const letters = Array.from(node.querySelectorAll<HTMLElement>('.sh-letter'))
    const mid = (letters.length - 1) / 2

    const ctx = gsap.context(() => {
      gsap.fromTo(
        letters,
        {
          // pull every letter towards the centre by 0.1em per step from it
          x: (i: number) => (i - mid) * -0.1 * parseFloat(getComputedStyle(node).fontSize),
        },
        {
          x: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: node,
            start: 'top 95%',
            end: 'top 45%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )
    }, node)

    return () => ctx.revert()
  }, [])

  return (
    <h2
      ref={el}
      className="mb-8 select-none whitespace-nowrap text-center font-sans text-[clamp(3rem,13vw,13rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.02em] text-ivory md:mb-12"
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split('').map((char, i) => (
          <span key={i} className="sh-letter inline-block will-change-transform">
            {char === ' ' ? ' ' : char}
          </span>
        ))}
      </span>
    </h2>
  )
}
