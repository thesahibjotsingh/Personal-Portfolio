import { useEffect, useState } from 'react'
import mannequinStill from '../assets/mannequin-poster.jpg'
import mannequinClip from '../assets/mannequin.mp4'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

/* Anchored to the top on desktop: in a short, wide window object-cover crops
   vertically, and centring that crop takes the mannequin's head off. */
const MEDIA_CLASSES =
  'h-full w-full object-cover object-[68%_center] lg:object-[right_top]'
const MEDIA_STYLE = { animation: 'mediaIn 1s cubic-bezier(.22,1,.36,1) both' }

export default function HeroMedia() {
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia(REDUCED_MOTION).matches,
  )

  useEffect(() => {
    const query = window.matchMedia(REDUCED_MOTION)
    const onChange = (event: MediaQueryListEvent) => setReducedMotion(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return (
    <div className="pointer-events-none relative order-2 h-[46svh] w-full overflow-hidden bg-void lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-[73px] lg:z-0 lg:h-auto lg:order-none">
      {reducedMotion ? (
        <img src={mannequinStill} alt="" className={MEDIA_CLASSES} style={MEDIA_STYLE} />
      ) : (
        <video
          src={mannequinClip}
          poster={mannequinStill}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className={MEDIA_CLASSES}
          style={MEDIA_STYLE}
        />
      )}

      {/* stacked layout: fade the band's top edge into the copy above it */}
      <div className="absolute inset-0 bg-gradient-to-b from-void to-30% to-transparent lg:hidden" />

      {/* full-bleed layout: hold the left column dark enough to read on */}
      <div className="absolute inset-0 hidden bg-gradient-to-r from-void via-void/70 to-45% to-transparent lg:block" />

      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-void to-transparent" />
    </div>
  )
}
