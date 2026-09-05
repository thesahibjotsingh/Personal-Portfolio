import { useEffect, useRef, useState } from 'react'
import statueStill from '../assets/statue-poster.webp'
import statueClip from '../assets/statue.mp4'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const FINE_POINTER = '(pointer: fine)'

/* How much of the clip a full sweep across the viewport scrubs through. */
const SENSITIVITY = 0.8

/* object-contain, not cover: this is a complete figure on a plinth, so any
   cover crop takes off the head or the feet. The clip's background is exactly
   #000 — the same as --color-void — so the letterboxing contain leaves behind
   is invisible against the page. */
/* Opacity is set by the mediaIn keyframe's end state (0.9), not a class here:
   the animation runs fill-mode both, so it wins over any static opacity. */
/* lg:max-h-[66svh] holds the statue at the size it had when the hero was
   78svh. Without it, a full-height hero would scale it up by a third and it
   would start competing with the headline rather than supporting it. */
const MEDIA_CLASSES =
  'h-full w-full object-contain object-center lg:max-h-[66svh] lg:object-right'

/* Dissolve the pedestal into the background instead of letting the section
   boundary guillotine it. Masking the element (rather than overlaying black)
   means it fades against whatever is behind it. */
const BOTTOM_FADE = 'linear-gradient(to bottom, #000 90%, transparent 100%)'
const MEDIA_STYLE = {
  animation: 'mediaIn 1s cubic-bezier(.22,1,.36,1) both',
  maskImage: BOTTOM_FADE,
  WebkitMaskImage: BOTTOM_FADE,
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export default function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia(REDUCED_MOTION).matches,
  )
  /* With a mouse the clip is scrubbed by hand; on touch there is no cursor to
     drive it, so it falls back to playing itself. */
  const [canScrub, setCanScrub] = useState(
    () => window.matchMedia(FINE_POINTER).matches,
  )
  /* iOS Low Power Mode refuses autoplay even for muted inline video, and then
     paints its own play badge over the clip. Swap to the still instead: the
     badge is unreachable behind pointer-events-none, and a phone in Low Power
     Mode has been told to do less, which a static image honours. */
  const [playbackBlocked, setPlaybackBlocked] = useState(false)

  useEffect(() => {
    const motion = window.matchMedia(REDUCED_MOTION)
    const pointer = window.matchMedia(FINE_POINTER)
    const onMotion = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    const onPointer = (e: MediaQueryListEvent) => setCanScrub(e.matches)

    motion.addEventListener('change', onMotion)
    pointer.addEventListener('change', onPointer)
    return () => {
      motion.removeEventListener('change', onMotion)
      pointer.removeEventListener('change', onPointer)
    }
  }, [])

  /* Touch just loops the clip.
     Scroll-scrubbing was tried here and reverted: iOS does not reliably fire
     `seeked` on a paused video, so the in-flight guard latched and the statue
     froze on frame one. Seeking a paused video is unreliable enough on iOS
     that doing this properly needs a decoded frame sequence on a canvas, not
     a <video>. Not worth that weight for a 3-second loop. */
  useEffect(() => {
    if (reducedMotion || canScrub) return
    const video = videoRef.current
    if (!video) return

    let cancelled = false

    const tryPlay = () => {
      video
        .play()
        .catch(() => {
          if (!cancelled) setPlaybackBlocked(true)
        })
    }

    tryPlay()
    video.addEventListener('canplay', tryPlay)
    return () => {
      cancelled = true
      video.removeEventListener('canplay', tryPlay)
    }
  }, [reducedMotion, canScrub])

  useEffect(() => {
    if (reducedMotion || !canScrub) return
    const video = videoRef.current
    if (!video) return

    let prevX: number | null = null
    let targetTime = 0
    let seeking = false

    const onMouseMove = (event: MouseEvent) => {
      if (!video.duration || Number.isNaN(video.duration)) return

      if (prevX === null) {
        prevX = event.clientX
        return
      }

      const delta = event.clientX - prevX
      prevX = event.clientX

      const offset = (delta / window.innerWidth) * SENSITIVITY * video.duration
      targetTime = clamp(targetTime + offset, 0, video.duration)

      /* Only one seek in flight at a time — the decoder drops requests it
         can't keep up with, so chase the latest target from `seeked` instead. */
      if (!seeking) {
        seeking = true
        video.currentTime = targetTime
      }
    }

    const onSeeked = () => {
      if (video.currentTime !== targetTime) {
        video.currentTime = targetTime
      } else {
        seeking = false
      }
    }

    const onLoadedMetadata = () => {
      targetTime = video.currentTime
    }

    video.addEventListener('seeked', onSeeked)
    video.addEventListener('loadedmetadata', onLoadedMetadata)
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [reducedMotion, canScrub])

  return (
    /* Desktop: the box starts at 46% so the figure is scaled down to clear the
       copy column on narrower desktops rather than sitting behind the text. */
    /* lg:flex + items-center centres the capped statue in the taller box,
       rather than pinning it to the top and re-creating the gap underneath */
    <div className="pointer-events-none relative order-2 h-[46svh] w-full overflow-hidden bg-void lg:absolute lg:bottom-0 lg:left-[46%] lg:right-0 lg:top-[var(--nav-h,73px)] lg:z-0 lg:flex lg:h-auto lg:w-auto lg:items-center lg:order-none">
      {reducedMotion || playbackBlocked ? (
        <img src={statueStill} alt="" className={MEDIA_CLASSES} style={MEDIA_STYLE} />
      ) : (
        /* Cursor-scrubbed with a mouse; a plain loop on touch. */
        <video
          ref={videoRef}
          src={statueClip}
          poster={statueStill}
          autoPlay={!canScrub}
          loop={!canScrub}
          muted
          playsInline
          preload="auto"
          className={MEDIA_CLASSES}
          style={MEDIA_STYLE}
        />
      )}

      {/* stacked layout: fade the band's top edge into the copy above it */}
      <div className="absolute inset-0 bg-gradient-to-b from-void to-25% to-transparent lg:hidden" />

      {/* full-bleed layout: soften the figure's left edge toward the copy */}
      <div className="absolute inset-0 hidden bg-gradient-to-r from-void to-30% to-transparent lg:block" />
    </div>
  )
}
