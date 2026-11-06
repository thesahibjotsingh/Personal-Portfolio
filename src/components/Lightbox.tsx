import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export type ViewerItem = {
  src: string
  alt: string
  width: number
  height: number
  title: string
  /** a desktop-style screenshot: on a phone it is shown at a readable size and pans sideways */
  wide: boolean
}

/* Click-to-enlarge viewer. The picture is shown whole (never cropped), on a dark
   scrim; Esc, the close button, or a click outside it closes the viewer.
   - rendered into <body>, because the project panels are transformed while they
     stack and a fixed element inside a transformed parent is not fixed any more;
   - the page behind is locked, and data-lenis-prevent stops the smooth-scroll
     library from scrolling it under the viewer;
   - focus goes to the close button on open and back to the screenshot on close. */
export default function Lightbox({ item, onClose }: { item: ViewerItem | null; onClose: () => void }) {
  /* `shown` keeps it mounted through the fade-out; `visible` drives the fade.
     Both are set from frame/timer callbacks, never synchronously in the effect. */
  const [shown, setShown] = useState<ViewerItem | null>(null)
  const [visible, setVisible] = useState(false)
  const closeButton = useRef<HTMLButtonElement>(null)
  const opener = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (item) {
      opener.current = document.activeElement as HTMLElement | null
      const mount = window.setTimeout(() => setShown(item), 0)
      const fade = window.setTimeout(() => setVisible(true), 30)
      return () => {
        window.clearTimeout(mount)
        window.clearTimeout(fade)
      }
    }
    const hide = window.setTimeout(() => setVisible(false), 0)
    const unmount = window.setTimeout(() => {
      setShown(null)
      opener.current?.focus?.({ preventScroll: true })
    }, 200)
    return () => {
      window.clearTimeout(hide)
      window.clearTimeout(unmount)
    }
  }, [item])

  useEffect(() => {
    if (!shown) return
    const html = document.documentElement
    const previous = html.style.overflow
    html.style.overflow = 'hidden'
    closeButton.current?.focus({ preventScroll: true })

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      // the close button is the only control, so Tab simply stays on it
      if (e.key === 'Tab') {
        e.preventDefault()
        closeButton.current?.focus({ preventScroll: true })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      html.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [shown, onClose])

  if (!shown) return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Screenshot: ${shown.title}`}
      data-lenis-prevent
      onClick={onClose}
      className={`fixed inset-0 z-[90] flex cursor-zoom-out items-center overflow-auto bg-black/90 p-4 backdrop-blur-sm transition-opacity duration-200 ease-out md:p-10 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <button
        ref={closeButton}
        type="button"
        onClick={onClose}
        aria-label="Close screenshot"
        className="press fixed right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-ivory transition-colors hover:border-carnation hover:text-carnation md:right-8 md:top-8"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
          <path d="M5 5l14 14M19 5 5 19" />
        </svg>
      </button>

      <figure
        className={`m-auto flex flex-col items-center gap-4 transition-[transform,opacity] duration-200 ease-out ${
          visible ? 'scale-100 opacity-100' : 'scale-[0.97] opacity-0'
        }`}
      >
        <img
          src={shown.src}
          alt={shown.alt}
          width={shown.width || undefined}
          height={shown.height || undefined}
          onClick={(e) => e.stopPropagation()}
          className={`block cursor-default rounded-xl border border-white/10 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] ${
            shown.wide
              ? 'h-[72svh] w-auto max-w-none md:h-auto md:max-h-[86svh] md:max-w-[94vw]'
              : 'h-auto max-h-[86svh] w-auto max-w-[94vw]'
          }`}
        />
        <figcaption className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">
          {shown.title}
          <span className="max-md:hidden"> · Esc to close</span>
          {shown.wide && <span className="md:hidden"> · swipe to look around</span>}
        </figcaption>
      </figure>
    </div>,
    document.body,
  )
}
