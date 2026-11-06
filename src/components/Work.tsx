import { useLayoutEffect, useRef } from 'react'
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

  /* Desktop: every panel is sticky, so the next one slides up over the last.
     As that happens the covered panel shrinks and dims. Titles rise out of a
     mask the first time a panel comes into view. Below 1024px the panels are
     plain stacked sections and only the title reveal runs. */
  useLayoutEffect(() => {
    const root = stack.current
    if (!root || prefersReducedMotion()) return

    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      const panels = gsap.utils.toArray<HTMLElement>('.panel-stack', root)
      panels.forEach((panel, i) => {
        const next = panels[i + 1]
        if (!next) return
        const trigger = { trigger: next, start: 'top bottom', end: 'top top', scrub: true }
        gsap.to(panel.querySelector('.panel-inner'), {
          scale: 0.92,
          ease: 'none',
          scrollTrigger: trigger,
        })
        gsap.to(panel.querySelector('.panel-dim'), {
          opacity: 0.7,
          ease: 'none',
          scrollTrigger: trigger,
        })
      })
    })

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
    <section id="work" className="pt-14 md:pt-24">
      <div className="px-6 md:px-10">
        <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 lg:grid-cols-[2.5rem_1fr] lg:gap-10">
          <SectionLabel>Selected Work</SectionLabel>

          <Reveal>
            <div className="mb-14 flex flex-wrap items-end justify-between gap-4 md:mb-20">
              <h2 className="font-display text-4xl font-normal text-ivory md:text-6xl">
                Built end to end,{' '}
                <span className="italic text-carnation-deep">in the open</span>.
              </h2>
              <p className="max-w-xs text-[13.5px] leading-relaxed text-muted">
                Three platforms live today, three more in the workshop — a hospital site, a
                billing suite and a desktop PDF editor.
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

  return (
    <article
      id={project.slug}
      className={`panel-stack group relative min-h-svh overflow-hidden lg:sticky lg:top-0 lg:h-svh ${
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
        className="panel-inner relative flex h-full min-h-svh flex-col gap-6 px-6 pb-10 pt-[calc(var(--nav-h,74px)+1.5rem)] md:px-10 lg:min-h-0 lg:origin-top lg:pb-0"
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
        <div className="panel-shot flex justify-start overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] lg:items-start lg:justify-center lg:overflow-visible [&::-webkit-scrollbar]:hidden">
          {/* Phones: the screenshot keeps its proportions but is shown at a
              readable height, so it is wider than the screen and swipes sideways
              — nothing is cropped or shrunk to a thumbnail. */}
          <img
            src={project.image}
            alt={project.imageAlt}
            className="h-[min(36svh,260px)] w-auto max-w-none shrink-0 rounded-t-xl border border-hairline shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] lg:h-auto lg:max-h-[calc(100svh_-_12rem)] lg:max-w-[min(1200px,88vw)]"
          />
        </div>
        <p className="-mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-dim lg:hidden">
          Swipe to see the full screen →
        </p>

        {/* fades the lower edge of the screenshot into the panel so the title reads */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[46%] bg-gradient-to-t from-black/90 via-black/50 to-transparent lg:block"
        />

        <div className="flex flex-col gap-6 lg:absolute lg:inset-x-10 lg:bottom-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="lg:max-w-[62%]">
            <h3 className="m-0 font-sans text-[clamp(3rem,8vw,8.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.045em] text-ivory">
              {project.short.split(' ').map((word, i) => (
                <span key={i} className="mr-[0.2em] inline-block overflow-hidden align-bottom">
                  <span className="pt-word inline-block">
                    <CharSwap text={word} tracking={-0.045} />
                  </span>
                </span>
              ))}
            </h3>
            <p className="mt-3 text-[15px] text-muted">{project.title}</p>
          </div>

          <div className="lg:max-w-md lg:rounded-xl lg:border lg:border-white/10 lg:bg-black/45 lg:p-5 lg:backdrop-blur-md">
            <p className="text-[15px] leading-relaxed text-muted">{project.blurb}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="chip px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-dim"
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
                className="mt-5 inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.12em] text-ivory transition-colors hover:text-carnation"
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
  )
}

function Cue({ label }: { label: string }) {
  return (
    <span className="mt-5 inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.12em] text-ivory transition-colors group-hover:text-carnation">
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
