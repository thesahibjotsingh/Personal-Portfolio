import { useEffect, useLayoutEffect, useRef, type CSSProperties, type RefObject } from 'react'
import Reveal from './Reveal'
import Roll from './Roll'
import CharSwap from './CharSwap'
import SectionLabel from './SectionLabel'
import StatusTag from './StatusTag'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { CONFIG } from '../lib/config'
import { PROJECTS, type Project } from '../lib/projects'

export default function Work() {
  const stack = useRef<HTMLDivElement>(null)

  /* Every panel is sticky, on phones as well as desktop, so the next one slides
     up over the last. As that happens the covered panel shrinks and dims (a
     little less on phones, where there is less room to spare). Titles rise out
     of a mask the first time a panel comes into view. */
  useLayoutEffect(() => {
    const root = stack.current
    if (!root || prefersReducedMotion()) return

    const mm = gsap.matchMedia()

    const stacking = (scale: number) => {
      const panels = gsap.utils.toArray<HTMLElement>('.panel-stack', root)
      panels.forEach((panel, i) => {
        const next = panels[i + 1]
        if (!next) return
        const trigger = { trigger: next, start: 'top bottom', end: 'top top', scrub: true }
        gsap.to(panel.querySelector('.panel-inner'), { scale, ease: 'none', scrollTrigger: trigger })
        gsap.to(panel.querySelector('.panel-dim'), { opacity: 0.7, ease: 'none', scrollTrigger: trigger })
      })
    }
    mm.add('(min-width: 1024px)', () => stacking(0.92))
    mm.add('(max-width: 1023px)', () => stacking(0.95))

    mm.add('(min-width: 0px)', () => {
      gsap.utils.toArray<HTMLElement>('.panel-stack', root).forEach((panel) => {
        gsap.from(panel.querySelectorAll('.pt-word'), {
          yPercent: 115,
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.07,
          scrollTrigger: { trigger: panel, start: 'top 70%', once: true },
        })
        gsap.from(panel.querySelectorAll('.panel-shot'), {
          y: 70,
          opacity: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: panel, start: 'top 70%', once: true },
        })
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section id="work" className="pt-12 md:pt-20">
      <div className="px-6 md:px-10">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 lg:grid-cols-[2.5rem_1fr] lg:gap-10">
          <SectionLabel>Selected Work</SectionLabel>

          <Reveal>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4 md:mb-12">
              <h2 className="font-display text-4xl font-normal text-ivory md:text-6xl">
                Built end to end,{' '}
                <span className="italic text-carnation-deep">in the open</span>.
              </h2>
              <p className="max-w-xs text-[13.5px] leading-relaxed text-muted">
                Three live, three in the workshop.
              </p>
            </div>
          </Reveal>
        </div>
      </div>

      <div ref={stack} className="relative">
        {PROJECTS.map((project) => (
          <Panel key={project.slug} project={project} total={PROJECTS.length} first={project.index === '01'} />
        ))}
      </div>
    </section>
  )
}


/* Phones, desktop-style screenshots only: the strip glides slowly to one end and
   back so the whole screen is revealed without the visitor doing anything.
   - runs only while the strip is on screen, and only below 1024px;
   - any touch, drag or wheel hands control to the visitor; it picks the glide
     up again 2.2s after they stop (flick momentum included);
   - off entirely for visitors who prefer reduced motion. */
function useAutoPan(ref: RefObject<HTMLDivElement | null>, enabled: boolean) {
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled || prefersReducedMotion()) return

    const small = window.matchMedia('(max-width: 1023px)')
    const pos = { x: 0 }
    let tween: gsap.core.Tween | undefined
    let resume: number | undefined
    let visible = false
    let lastSet = -1

    const maxScroll = () => el.scrollWidth - el.clientWidth

    const stop = () => {
      tween?.kill()
      tween = undefined
      window.clearTimeout(resume)
    }

    // glide to whichever end is further away, then turn round and come back
    const run = () => {
      stop()
      const max = maxScroll()
      if (!small.matches || !visible || max <= 8) return
      pos.x = el.scrollLeft
      const target = pos.x < max / 2 ? max : 0
      tween = gsap.to(pos, {
        x: target,
        duration: 1 + (Math.abs(target - pos.x) / max) * 8,
        ease: 'sine.inOut',
        onUpdate: () => {
          lastSet = pos.x
          el.scrollLeft = pos.x
        },
        onComplete: () => {
          resume = window.setTimeout(run, 600)
        },
      })
    }

    const takeOver = () => {
      stop()
      resume = window.setTimeout(run, 2200)
    }

    // a scroll event we did not cause means the visitor is driving
    const onScroll = () => {
      if (Math.abs(el.scrollLeft - lastSet) > 1.5) takeOver()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) resume = window.setTimeout(run, 800)
        else stop()
      },
      { threshold: 0.4 },
    )
    observer.observe(el)

    el.addEventListener('touchstart', takeOver, { passive: true })
    el.addEventListener('pointerdown', takeOver, { passive: true })
    el.addEventListener('wheel', takeOver, { passive: true })
    el.addEventListener('scroll', onScroll, { passive: true })
    small.addEventListener('change', run)

    return () => {
      stop()
      observer.disconnect()
      el.removeEventListener('touchstart', takeOver)
      el.removeEventListener('pointerdown', takeOver)
      el.removeEventListener('wheel', takeOver)
      el.removeEventListener('scroll', onScroll)
      small.removeEventListener('change', run)
    }
  }, [ref, enabled])
}

function Panel({
  project,
  total,
  first,
}: {
  project: Project
  total: number
  first: boolean
}) {
  const linkProps = project.href
    ? {
        href: project.href,
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-label': `${project.cta} — ${project.title} (opens in a new tab)`,
        'data-cursor': 'View project →',
      }
    : {}
  const Wrapper = (project.href ? 'a' : 'div') as 'a'
  const shot = useRef<HTMLDivElement>(null)
  useAutoPan(shot, !project.mobileImage)

  return (
    <>
      {/* Anchor target. The panels are sticky, so once you are past one its own
          position reads as "top of the screen" and a link to it would go
          nowhere. This zero-height marker sits in normal flow at the panel's
          slot instead, so links such as the nav's project menu always work. */}
      <span id={project.slug} aria-hidden="true" className="block h-0" />
    <article
      className={`panel-stack group sticky top-0 h-svh min-h-svh overflow-hidden ${
        first ? '' : 'border-t border-hairline'
      }`}
      /* The first panel fades up out of the page colour so there is no hard
         edge under the section heading. Later panels keep a crisp top edge —
         that edge is what reads as one card sliding over another. */
      style={{
        background: `${
          first ? 'linear-gradient(to bottom, var(--color-void) 0%, transparent 38%), ' : ''
        }radial-gradient(120% 90% at 50% 0%, ${project.tint}, var(--color-void) 72%)`,
      }}
    >
      <Wrapper
        {...linkProps}
        className="panel-inner relative flex h-full origin-top flex-col gap-4 px-6 pb-[4.5rem] pt-[calc(var(--nav-h,74px)+0.5rem)] md:px-10 md:pb-8 lg:gap-6 lg:pb-0"
      >
        <div className="flex w-full items-center justify-between gap-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
            <span className="text-carnation">{project.index}</span> / 0{total}
            <span className="ml-4 hidden sm:inline">{project.fig}</span>
          </span>
          <span className="flex items-center gap-4">
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-dim sm:inline">
              {project.meta}
            </span>
            <StatusTag status={project.status} />
          </span>
        </div>

        {/* The screenshot gets nearly the full page width on desktop. Width and
            height are both capped and the image keeps its own proportions, so
            nothing is cropped; it is never drawn larger than its own pixels. */}
        <div
          ref={shot}
          className={`panel-shot flex min-h-0 flex-1 items-center gap-4 [-ms-overflow-style:none] [scrollbar-width:none] lg:flex-none lg:items-start lg:justify-center lg:overflow-visible [&::-webkit-scrollbar]:hidden ${
            /* phones with a mobile screenshot: just show it, centred. Without
               one, fall back to the desktop shot as a swipeable strip. */
            project.mobileImage ? 'justify-center' : 'justify-start overflow-x-auto'
          }`}
          style={
            {
              /* desktop height: whichever is tighter — the room on screen, or the
                 width cap (a desktop shot is about 2.17 : 1) */
              '--shot-h': 'min(calc(100svh - 12rem), calc(min(1200px, 88vw) / 2.17))',
            } as CSSProperties
          }
        >
          {/* Each device gets its own screenshot: the desktop one from 1024px up,
              the phone one below that. Both keep their own proportions — nothing
              is cropped or stretched. */}
          <img
            src={project.image}
            alt={project.imageAlt}
            width={project.imageSize[0]}
            height={project.imageSize[1]}
            loading="lazy"
            decoding="async"
            className={`h-[min(34svh,290px)] w-auto max-w-none shrink-0 rounded-t-xl border border-hairline shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] lg:block lg:h-[var(--shot-h)] ${
              project.mobileImage ? 'hidden' : ''
            }`}
          />
          {project.mobileImage && (
            <img
              src={project.mobileImage}
              alt={project.mobileAlt}
              width={project.mobileSize?.[0]}
              height={project.mobileSize?.[1]}
              loading="lazy"
              decoding="async"
              className="h-full max-h-[540px] w-auto max-w-full shrink-0 rounded-[1.25rem] border border-hairline shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] lg:hidden"
            />
          )}
        </div>
        {!project.mobileImage && (
          <p className="-mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-dim lg:hidden">
            Gliding across · touch to take over
          </p>
        )}

        {/* fades the lower edge of the screenshot into the panel so the title reads */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[46%] bg-gradient-to-t from-black/90 via-black/50 to-transparent lg:block"
        />

        <div className="flex flex-col gap-3 lg:gap-6 lg:absolute lg:inset-x-10 lg:bottom-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="lg:max-w-[62%]">
            <h3 className="m-0 font-sans text-[clamp(2rem,8.5vw,3rem)] lg:text-[clamp(3rem,8vw,8.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.045em] text-ivory">
              {project.short.split(' ').map((word, i) => (
                <span key={i} className="mr-[0.2em] inline-block overflow-hidden align-bottom">
                  <span className="pt-word inline-block">
                    <CharSwap text={word} tracking={-0.045} />
                  </span>
                </span>
              ))}
            </h3>
            {project.title !== project.short && (
              <p className="mt-3 hidden text-[15px] text-muted sm:block">{project.title}</p>
            )}
          </div>

          <div className="lg:max-w-md lg:rounded-xl lg:border lg:border-white/10 lg:bg-black/45 lg:p-5 lg:backdrop-blur-md">
            <p className="text-[14px] leading-snug text-muted lg:text-[15px] lg:leading-relaxed">{project.blurb}</p>
            <div className="mt-3 flex-wrap gap-2 max-lg:hidden lg:mt-4 lg:flex">
              {project.tags.map((t, ti) => (
                <span
                  key={t}
                  className={`chip px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-dim ${
                    ti >= 3 ? 'max-lg:hidden' : ''
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
            {project.href ? (
              <Cue label={project.cta ?? 'Visit'} />
            ) : (
              <a
                href={`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
                  `Hi Saheb, I'd like a walkthrough of ${project.title}.`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-[11px] lg:mt-5 uppercase tracking-[0.12em] text-ivory transition-colors hover:text-carnation"
              >
                <Roll>Request a walkthrough</Roll>
                <span className="sr-only"> of {project.title} (opens WhatsApp in a new tab)</span>
              </a>
            )}
          </div>
        </div>
      </Wrapper>

      {/* darkens as the next panel slides over this one */}
      <div className="panel-dim pointer-events-none absolute inset-0 bg-black opacity-0" />
    </article>
    </>
  )
}

function Cue({ label }: { label: string }) {
  return (
    <span className="mt-3 inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-[11px] lg:mt-5 uppercase tracking-[0.12em] text-ivory transition-colors group-hover:text-carnation">
      <Roll>{label}</Roll>
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M7 17 17 7M9 7h8v8" />
      </svg>
    </span>
  )
}
