import { useEffect } from 'react'
import { ScrollTrigger, prefersReducedMotion } from '../lib/motion'

/* The page is dark throughout, then turns light while the Contact section (and
   the footer after it) is on screen. A ScrollTrigger from the middle of the
   viewport to the very end of the page owns the state, so it also resolves
   correctly if the page loads already scrolled down, and flips back when you
   scroll up. Off for phones and for reduced motion, which stay dark. */
export default function ThemeSwitch() {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const root = document.documentElement
    const mm = window.matchMedia('(min-width: 768px)')
    let trigger: ScrollTrigger | undefined

    const apply = (light: boolean) => {
      if (light) root.setAttribute('data-theme', 'light')
      else root.removeAttribute('data-theme')
    }

    const setup = () => {
      trigger?.kill()
      apply(false)
      if (!mm.matches) return
      /* Driven by progress, not isActive: at the exact last pixel of the page
         ScrollTrigger reports the trigger as no longer active, which would
         flip the theme back to dark right at the bottom. Any progress past the
         start line (including the finished state) means "light". */
      const sync = (self: ScrollTrigger) => apply(self.progress > 0)
      trigger = ScrollTrigger.create({
        trigger: '#contact',
        start: 'top 55%',
        end: 'max',
        onUpdate: sync,
        onRefresh: sync,
      })
    }

    setup()
    mm.addEventListener('change', setup)
    return () => {
      mm.removeEventListener('change', setup)
      trigger?.kill()
      apply(false)
    }
  }, [])

  return null
}
