import { useEffect, useRef, useState } from 'react'
import statueStill from '../assets/statue-poster.jpg'
import statueClip from '../assets/statue.mp4'

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const FINE_POINTER = '(pointer: fine)'

/* How much of the clip a full sweep across the viewport scrubs through. */
const SENSITIVITY = 0.8

/* object-contain, not cover: this is a complete figure on a plinth, so any
   cover crop takes off the head or the feet. The clip's background is exactly
   #000 — the same as --color-void — so the letterboxing contain leaves behind
   is invisible against the page. */
const MEDIA_CLASSES = 'h-full w-full object-contain object-center lg:object-right'
const MEDIA_STYLE = { animation: 'mediaIn 1s cubic-bezier(.22,1,.36,1) both' }

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

  /* Touch has no cursor, so scroll drives the clip instead — the same
     scrub, mapped onto the gesture the device actually has. */
  useEffect(() => {
    if (reducedMotion || canScrub) return
    const video = videoRef.current
    const section = video?.closest('section')
    if (!video || !section) return

    let frame = 0
    let targetTime = 0
    let seeking = false
    let cancelled = false
    let detach = () => {}

    const sync = () => {
      frame = 0
      if (!video.duration || Number.isNaN(video.duration)) return

      const travel = section.offsetHeight
      if (travel <= 0) return

      const progress = clamp(window.scrollY / travel, 0, 1)
      targetTime = progress * video.duration

      /* skip no-op seeks; on iOS every seek costs a repaint */
      if (!seeking && Math.abs(video.currentTime - targetTime) > 0.02) {
        seeking = true
        video.currentTime = targetTime
      }
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(sync)
    }

    const onSeeked = () => {
      if (Math.abs(video.currentTime - targetTime) > 0.01) {
        video.currentTime = targetTime
      } else {
        seeking = false
      }
    }

    const takeScrollControl = () => {
      video.addEventListener('seeked', onSeeked)
      window.addEventListener('scroll', onScroll, { passive: true })
      sync()
      detach = () => {
        video.removeEventListener('seeked', onSeeked)
        window.removeEventListener('scroll', onScroll)
      }
    }

    /* iOS will not paint a seeked frame on a video that has never played — it
       drops the poster and renders nothing. Play one frame and pause before
       taking scroll control; if playback is blocked outright, loop instead so
       the hero is never a black rectangle. */
    video
      .play()
      .then(() => {
        if (cancelled) return
        /* let one frame actually reach the compositor before pausing —
           play() resolving is not by itself proof anything was painted */
        requestAnimationFrame(() => {
          if (cancelled) return
          video.pause()
          takeScrollControl()
        })
      })
      .catch(() => {
        if (cancelled) return
        video.loop = true
        video.play().catch(() => {})
      })

    return () => {
      cancelled = true
      if (frame) cancelAnimationFrame(frame)
      detach()
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
    <div className="pointer-events-none relative order-2 h-[46svh] w-full overflow-hidden bg-void lg:absolute lg:bottom-0 lg:left-[46%] lg:right-0 lg:top-[73px] lg:z-0 lg:h-auto lg:w-auto lg:order-none">
      {reducedMotion ? (
        <img src={statueStill} alt="" className={MEDIA_CLASSES} style={MEDIA_STYLE} />
      ) : (
        /* Never self-playing: the cursor drives it on desktop, scroll on touch. */
        <video
          ref={videoRef}
          src={statueClip}
          poster={statueStill}
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
