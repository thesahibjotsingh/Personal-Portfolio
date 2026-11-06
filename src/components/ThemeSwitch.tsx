import { useEffect } from 'react'
import { ScrollTrigger } from '../lib/motion'

/* Contact and the footer are a light "sheet" (data-scope="light") that scrolls
   up over the dark page. The one thing that still has to follow along is the
   fixed nav: once the sheet reaches it, the nav takes the same light scope, so
   its text and bar stay readable over the light content. Only the nav changes
   (a small element, on a short CSS transition), never the whole page.

   Driven by progress rather than isActive, so it stays light through the very
   last pixel of the page. */
export default function ThemeSwitch() {
  useEffect(() => {
    const nav = document.querySelector('nav')
    if (!nav) return

    const trigger = ScrollTrigger.create({
      trigger: '#contact',
      start: 'top 90px',
      end: 'max',
      onUpdate: (self) => {
        if (self.progress > 0) nav.setAttribute('data-scope', 'light')
        else nav.removeAttribute('data-scope')
      },
      onRefresh: (self) => {
        if (self.progress > 0) nav.setAttribute('data-scope', 'light')
        else nav.removeAttribute('data-scope')
      },
    })

    return () => {
      trigger.kill()
      nav.removeAttribute('data-scope')
    }
  }, [])

  return null
}
