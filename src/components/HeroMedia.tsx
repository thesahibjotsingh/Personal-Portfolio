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
  'h-full max-h-[86%] w-auto max-w-full object-contain object-center lg:max-h-full'

/* Dissolve the pedestal into the background instead of letting the section
   boundary guillotine it. Masking the element (rather than overlaying black)
   means it fades against whatever is behind it. */
const BOTTOM_FADE = 'linear-gradient(to bottom, #000 90%, transparent 100%)'
const BASE_STYLE = {
  animation: 'mediaIn 1s cubic-bezier(.22,1,.36,1) both',
  maskImage: BOTTOM_FADE,
  WebkitMaskImage: BOTTOM_FADE,
}

/* Two ways to lose the clip's black background:
   - cut-out: an SVG filter turns luminance into alpha, so the statue is truly
     transparent and the headline can sit BEHIND it (desktop Chrome/Edge/Firefox);
   - blend: `lighten` lets the page colour win wherever the clip is black. The
     text then reads in front of the statue instead of behind it, which is fine
     on phones (nothing overlaps) and is the safe fallback for WebKit.
   iPhone browsers (all WebKit) and desktop Safari don't apply that SVG filter
   to video, which left a black rectangle around the statue — so they get the
   blend. `?nocutout` forces the fallback for testing. */
function supportsCutout() {
  if (new URLSearchParams(window.location.search).has('nocutout')) return false
  if (!window.matchMedia('(min-width: 1024px)').matches) return false
  const ua = navigator.userAgent
  const iOS = /iP(hone|ad|od)/.test(ua)
  const safari = /^((?!chrome|android|crios|fxios|edg).)*safari/i.test(ua)
  return !(iOS || safari)
}

const mediaStyle = (cutout: boolean) =>
  cutout
    ? { ...BASE_STYLE, filter: 'url(#statue-cutout)' }
    : { ...BASE_STYLE, mixBlendMode: 'lighten' as const }

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export default function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [cutout] = useState(supportsCutout)
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
    <div className={`pointer-events-none relative order-2 flex h-[46svh] items-end justify-center ${
        /* z-index creates a stacking context, which would isolate the video from
           the page behind it and stop the lighten blend from working — so it is
           only set when the cut-out filter (not the blend) is in use. */
        cutout ? 'lg:z-10' : ''
      } lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-[var(--nav-h,73px)] lg:order-none lg:h-auto lg:items-center lg:justify-end lg:pb-[5.5rem] lg:pr-[0.5vw]`}>
      {/* Luminance becomes alpha: bright marble stays opaque, the black backdrop
          (and compression noise near black) drops to nothing. Dark folds in the
          marble sit well above the threshold, so the figure stays solid. */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <filter id="statue-cutout" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  6 6 6 0 -0.4"
          />
        </filter>
      </svg>

      {reducedMotion || playbackBlocked ? (
        <img src={statueStill} alt="" className={MEDIA_CLASSES} style={mediaStyle(cutout)} />
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
          style={mediaStyle(cutout)}
        />
      )}
    </div>
  )
}
