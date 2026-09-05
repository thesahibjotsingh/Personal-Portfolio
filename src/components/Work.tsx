import Reveal from './Reveal'
import SectionLabel from './SectionLabel'
import { useSpotlight } from '../hooks/useSpotlight'
import demoPreview from '../assets/demo-preview.webp'
import crostaPreview from '../assets/crosta-preview.webp'
import barkatPreview from '../assets/barkat-preview.webp'

/* Every card here is real shipped work, linked to its live site — see PRODUCT.md
   principle #1: no invented clients, metrics, or testimonials. */
const COMPACT_STUDIES = [
  {
    fig: 'Fig. 02 — E-Commerce',
    title: 'The Crosta',
    tag: 'thecrosta.com',
    blurb:
      "An artisanal food brand's storefront — product storytelling, a checkout that doesn't fight the customer, and a design system built around the product photography.",
    tags: ['E-Commerce', 'Custom CMS', 'HTML5', 'CSS3', 'JavaScript', 'Responsive'],
    href: 'https://thecrosta.com',
    image: crostaPreview,
    imageAlt: 'The Crosta e-commerce storefront',
    delay: 90,
  },
  {
    fig: 'Fig. 03 — Corporate',
    title: 'Barkat & Company',
    tag: 'barkatandcompany.com',
    blurb:
      'A corporate web platform built for credibility first — clear service architecture, fast load times, and a content structure the client can maintain without a developer.',
    tags: ['Corporate Site', 'SEO Structure', 'HTML5', 'CSS3', 'JavaScript', 'Responsive'],
    href: 'https://barkatandcompany.com',
    image: barkatPreview,
    imageAlt: 'Barkat & Company corporate platform',
    delay: 170,
  },
]

export default function Work() {
  return (
    <section id="work" className="border-t border-hairline px-6 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[2.5rem_1fr] lg:gap-10">
        <SectionLabel>Featured Work</SectionLabel>

        <div>
          <Reveal>
            <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-4xl text-ivory md:text-5xl">
                Three platforms,{' '}
                <span className="italic text-carnation-deep">shipped</span>.
              </h2>
              <p className="max-w-xs text-[13.5px] leading-relaxed text-muted">
                A points-of-sale system built from scratch, and two brands whose entire web
                presence was designed and built end to end.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2">
            <FeaturedStudy />
            {COMPACT_STUDIES.map((study) => (
              <CompactStudy key={study.title} {...study} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturedStudy() {
  const { ref, onMouseMove } = useSpotlight<HTMLDivElement>()

  return (
    <Reveal className="md:col-span-2">
      <a
        href="https://demo-pos-system.pages.dev/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open the Cloud POS live demo (opens in a new tab)"
        className="group block h-full"
      >
        <div
          ref={ref}
          onMouseMove={onMouseMove}
          className="spot panel relative flex h-full cursor-pointer flex-col justify-between overflow-hidden rounded-t-xl transition-transform duration-300 hover:-translate-y-1"
        >
          <CornerMarks />
          <img
            src={demoPreview}
            alt="Artisanal POS live demo — menu ordering screen"
            className="mb-4 h-56 w-full rounded-t-xl border-b border-carnation/20 object-cover object-top transition-transform duration-300 group-hover:scale-[1.02] md:h-72"
          />
          <div className="flex flex-1 flex-col justify-between px-6 pb-6 md:px-8 md:pb-8">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-carnation">
                  Fig. 01 — Cloud POS
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
                  Own Product
                </span>
              </div>
              <h3 className="mt-3 font-display text-3xl text-ivory md:text-4xl">
                Custom Cloud-Hosted POS System
              </h3>
              <p className="mt-3 max-w-lg text-[14.5px] leading-relaxed text-muted">
                A register that syncs across every terminal in real time — order queues,
                inventory and receipts, built on Firebase so a dropped connection never
                means a lost sale.
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                {['Firebase', 'Firestore', 'JavaScript', 'Real-time Sync', 'PWA'].map(
                  (tag) => (
                    <TagPill key={tag}>{tag}</TagPill>
                  ),
                )}
              </div>
              <VisitCue label="View Live Demo" />
            </div>
          </div>
        </div>
      </a>
    </Reveal>
  )
}

type CompactStudyProps = (typeof COMPACT_STUDIES)[number]

function CompactStudy({
  fig,
  title,
  tag,
  blurb,
  tags,
  href,
  image,
  imageAlt,
  delay,
}: CompactStudyProps) {
  const { ref, onMouseMove } = useSpotlight<HTMLDivElement>()

  return (
    <Reveal delay={delay}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${title} (opens in a new tab)`}
        className="group block h-full"
      >
        <div
          ref={ref}
          onMouseMove={onMouseMove}
          className="spot panel relative flex h-full min-h-[280px] cursor-pointer flex-col justify-between overflow-hidden rounded-t-xl transition-transform duration-300 hover:-translate-y-1"
        >
          <CornerMarks />
          <img
            src={image}
            alt={imageAlt}
            className="mb-4 h-48 w-full rounded-t-xl border-b border-carnation/20 object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="flex flex-1 flex-col justify-between px-6 pb-6">
            <div>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-carnation">
                  {fig}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
                  {tag}
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl text-ivory">{title}</h3>
              <p className="mt-2.5 text-[13.5px] leading-relaxed text-muted">{blurb}</p>
            </div>

            <div className="mt-5">
              <div className="mb-4 flex flex-wrap gap-2">
                {tags.map((t) => (
                  <TagPill key={t}>{t}</TagPill>
                ))}
              </div>
              <VisitCue label="Visit Site" />
            </div>
          </div>
        </div>
      </a>
    </Reveal>
  )
}

function TagPill({ children }: { children: string }) {
  return (
    <span className="chip px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-dim">
      {children}
    </span>
  )
}

function VisitCue({ label }: { label: string }) {
  return (
    <span className="underline-grow inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.12em] text-ivory transition-colors group-hover:text-carnation">
      {label}
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

function CornerMarks() {
  return (
    <>
      <span className="corner-mark tl" />
      <span className="corner-mark tr" />
      <span className="corner-mark bl" />
      <span className="corner-mark br" />
    </>
  )
}
