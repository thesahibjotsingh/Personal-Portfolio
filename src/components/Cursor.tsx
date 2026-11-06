import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'

/* A trailing ring that swells over links and turns into a labelled disc over
   anything carrying data-cursor="…". Mouse only — touch devices never see it,
   and the native cursor stays visible so nothing is lost if this fails. */
export default function Cursor() {
  const root = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const x = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' })
    const y = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' })

    const onMove = (e: MouseEvent) => {
      el.dataset.ready = 'true'
      x(e.clientX)
      y(e.clientY)
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const tagged = target?.closest<HTMLElement>('[data-cursor]')
      if (tagged) {
        if (label.current) label.current.textContent = tagged.dataset.cursor ?? ''
        el.dataset.state = 'label'
      } else if (target?.closest('a, button, input, textarea, select, label')) {
        el.dataset.state = 'link'
      } else {
        el.dataset.state = ''
      }
    }

    const onLeave = () => {
      el.dataset.ready = 'false'
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      document.documentElement.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div ref={root} className="cursor" aria-hidden="true">
      <div className="cursor-ring" />
      <span ref={label} className="cursor-label" />
    </div>
  )
}
