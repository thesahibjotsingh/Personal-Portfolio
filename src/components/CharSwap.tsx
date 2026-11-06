import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'

/* Every few seconds one or two random letters tick sideways: the letter slides
   out to the right while an identical copy slides in from the left, each
   clipped to its own box. Only runs while the text is on screen, and never
   for visitors who prefer reduced motion.

   `tracking` is the parent's letter-spacing in em. Each letter's box carries
   it as a margin instead, so the clip edge sits on the glyph's real width and
   negative tracking never shaves the letter. */
export default function CharSwap({
  text,
  tracking = 0,
}: {
  text: string
  tracking?: number
}) {
  const root = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return

    const boxes = Array.from(el.querySelectorAll<HTMLElement>('.cs'))
    if (boxes.length === 0) return

    let visible = false
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    })
    observer.observe(el)

    const OUT = 115 // % — far enough to clear the clip box, with a hair of gap

    const swap = (box: HTMLElement) => {
      const a = box.querySelector('.cs-a')
      const b = box.querySelector('.cs-b')
      if (!a || !b) return
      gsap.fromTo(a, { xPercent: 0 }, { xPercent: OUT, duration: 0.5, ease: 'power2.inOut' })
      gsap.fromTo(
        b,
        { xPercent: -OUT },
        {
          xPercent: 0,
          duration: 0.5,
          ease: 'power2.inOut',
          onComplete: () => {
            // the two copies are the same glyph, so resetting is invisible
            gsap.set(a, { xPercent: 0 })
            gsap.set(b, { xPercent: -OUT })
          },
        },
      )
    }

    const calls: gsap.core.Tween[] = []
    const tick = () => {
      if (visible) {
        const picks = gsap.utils.shuffle([...boxes]).slice(0, Math.random() < 0.5 ? 1 : 2)
        picks.forEach((box, i) => {
          calls.push(gsap.delayedCall(i * (0.15 + Math.random() * 0.15), () => swap(box)))
        })
      }
      calls.push(gsap.delayedCall(3 + Math.random(), tick))
    }
    calls.push(gsap.delayedCall(2.5, tick))

    return () => {
      observer.disconnect()
      calls.forEach((c) => c.kill())
      boxes.forEach((box) => gsap.killTweensOf(box.querySelectorAll('.cs-a, .cs-b')))
    }
  }, [])

  return (
    <span ref={root}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(' ').map((word, w, words) => (
          <span key={w}>
            <span className="inline-block whitespace-nowrap">
              {word.split('').map((char, i) => (
                <span
                  key={i}
                  className="cs"
                  style={{ marginRight: tracking ? `${tracking}em` : undefined }}
                >
                  <span className="cs-a">{char}</span>
                  <span className="cs-b">{char}</span>
                </span>
              ))}
            </span>
            {w < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </span>
  )
}
