import { useCallback, useRef, type MouseEvent } from 'react'

/** Feeds the cursor position to the .spot glow as --x / --y. */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  const onMouseMove = useCallback((event: MouseEvent<T>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--x', `${event.clientX - rect.left}px`)
    el.style.setProperty('--y', `${event.clientY - rect.top}px`)
  }, [])

  return { ref, onMouseMove }
}
