import { useLayoutEffect, useRef } from 'react'
import Reveal from './Reveal'
import SectionLabel from './SectionLabel'
import { gsap, prefersReducedMotion } from '../lib/motion'
import demoPreview from '../assets/demo-preview.webp'
import crostaPreview from '../assets/crosta-preview.webp'
import barkatPreview from '../assets/barkat-preview.webp'
import quickbillPreview from '../assets/quickbill-preview.webp'
import pdfstudioPreview from '../assets/pdfstudio-preview.webp'
import limsPreview from '../assets/lims-preview.webp'

/* Every entry is real work. "Live" ones link to the running site; the
   "In development" ones have no public URL yet, so they don't link — and carry
   no invented metrics or client claims. */
type Project = {
  index: string
  fig: string
  title: string
  meta: string
  status: 'Live' | 'In development'
  blurb: string
  tags: string[]
  href?: string
  cta?: string
  image: string
  imageAlt: string
}

const PROJECTS: Project[] = [
  {
    index: '01',
    fig: 'Fig. 01 — Cloud POS',
    title: 'Custom Cloud-Hosted POS System',
    meta: 'Own product',
    status: 'Live',
    blurb:
      'A register that syncs across every terminal in real time — order queues, inventory and receipts, built on Firebase so a dropped connection never means a lost sale.',
    tags: ['Firebase', 'Firestore', 'JavaScript', 'Real-time Sync', 'PWA'],
    href: 'https://demo-pos-system.pages.dev/',
    cta: 'View live demo',
    image: demoPreview,
    imageAlt: 'Artisanal POS live demo — menu ordering screen',
  },
  {
    index: '02',
    fig: 'Fig. 02 — E-Commerce',
    title: 'The Crosta',
    meta: 'thecrosta.com',
    status: 'Live',
    blurb:
      "An artisanal food brand's storefront — product storytelling, a checkout that doesn't fight the customer, and a design system built around the product photography.",
    tags: ['E-Commerce', 'Custom CMS', 'HTML5', 'CSS3', 'JavaScript', 'Responsive'],
    href: 'https://thecrosta.com',
    cta: 'Visit site',
    image: crostaPreview,
    imageAlt: 'The Crosta e-commerce storefront',
  },
  {
    index: '03',
    fig: 'Fig. 03 — Corporate',
    title: 'Barkat & Company',
    meta: 'barkatandcompany.com',
    status: 'Live',
    blurb:
      'A corporate web platform built for credibility first — clear service architecture, fast load times, and a content structure the client can maintain without a developer.',
    tags: ['Corporate Site', 'SEO Structure', 'HTML5', 'CSS3', 'JavaScript', 'Responsive'],
    href: 'https://barkatandcompany.com',
    cta: 'Visit site',
    image: barkatPreview,
    imageAlt: 'Barkat & Company corporate platform',
  },
  {
    index: '04',
    fig: 'Fig. 04 — Healthcare',
    title: 'LIMS Hospital Platform',
    meta: 'Lifeline Institute, Hisar',
    status: 'In development',
    blurb:
      "The web platform for Lifeline Institute of Medical Sciences — a department-by-department services directory, quick actions for patients, and a structure built to grow across every service the hospital offers.",
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Accessibility'],
    image: limsPreview,
    imageAlt: 'LIMS hospital home page — find a doctor or department',
  },
  {
    index: '05',
    fig: 'Fig. 05 — Billing',
    title: 'QuickBill',
    meta: 'Own product',
    status: 'In development',
    blurb:
      'A Tally-style GST quotation and tax-invoice generator for Indian small businesses — a tested calculation engine, financial-year numbering, and Firestore sync that switches on with a single credential.',
    tags: ['Next.js', 'TypeScript', 'Firestore', 'Cloudflare'],
    image: quickbillPreview,
    imageAlt: 'QuickBill home screen — quotations, parties and items',
  },
  {
    index: '06',
    fig: 'Fig. 06 — Desktop',
    title: 'PDFStudio',
    meta: 'Own product',
    status: 'In development',
    blurb:
      'A PDF and document editor that runs on your own machine — a Python engine behind a desktop interface, built for editing files without handing them to a web service.',
    tags: ['Python', 'Desktop App', 'PDF Engine', 'Local-first'],
    image: pdfstudioPreview,
    imageAlt: 'PDFStudio home screen — 48 PDF tools',
  },
]

export default function Work() {
  return (
    <section id="work" className="px-6 py-14 md:px-10 md:py-24">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 lg:grid-cols-[2.5rem_1fr] lg:gap-10">
        <SectionLabel>Selected Work</SectionLabel>

        <div>
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

          <div>
            {PROJECTS.map((project) => (
              <ProjectRow key={project.title} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectRow({ project }: { project: Project }) {
  const root = useRef<HTMLElement>(null)

  /* Two scrubbed motions: the frame opens up from an inset clip as it enters,
     and the media inside drifts against the scroll for depth. */
  useLayoutEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.pr-frame',
        { clipPath: 'inset(14% 10% 14% 10%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 38%', scrub: true },
        },
      )
      /* The whole frame drifts, not the picture inside it — screenshots are
         shown whole, never cropped or scaled past their edges. */
      gsap.fromTo(
        '.pr-frame',
        { yPercent: -3 },
        {
          yPercent: 3,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    }, el)

    return () => ctx.revert()
  }, [])

  const linkProps = project.href
    ? {
        href: project.href,
        target: '_blank',
        rel: 'noopener noreferrer',
        'aria-label': `${project.cta} — ${project.title} (opens in a new tab)`,
        'data-cursor': 'View',
      }
    : {}
  const Wrapper = (project.href ? 'a' : 'div') as 'a'

  return (
    <article ref={root} className="group border-t border-hairline py-10 md:py-20">
      {/* Image first, full width; the copy sits underneath in two columns.
          flex-col-reverse keeps the text earlier in the DOM for screen readers. */}
      <Wrapper {...linkProps} className="flex flex-col-reverse gap-8 md:gap-12">
        <div>
          <Reveal className="grid gap-8 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
            <span className="stroke-num font-display text-7xl leading-none md:text-8xl">
              {project.index}
            </span>

            <div className="mt-6 flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-carnation">
                {project.fig}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
                {project.meta}
              </span>
            </div>

            <h3 className="mt-3 flex flex-wrap items-center gap-3 font-display text-3xl font-normal text-ivory md:text-4xl">
              {project.title}
            </h3>
            <StatusBadge status={project.status} />
            </div>

            <div className="lg:col-span-7">
            <p className="max-w-3xl text-[15.5px] leading-relaxed text-muted md:text-[17px]">
              {project.blurb}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="chip px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.08em] text-dim"
                >
                  {t}
                </span>
              ))}
            </div>

            {project.href && <VisitCue label={project.cta ?? 'Visit'} />}
            </div>
          </Reveal>
        </div>

        <div>
          {/* Natural height, no fixed aspect: screenshots are shown whole. */}
          <div className="pr-frame panel relative overflow-hidden rounded-t-xl">
            <img src={project.image} alt={project.imageAlt} className="block h-auto w-full" />
          </div>
        </div>
      </Wrapper>
    </article>
  )
}

function StatusBadge({ status }: { status: Project['status'] }) {
  const live = status === 'Live'
  return (
    <span className="mt-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
      <span
        className={`h-1.5 w-1.5 rounded-full ${live ? 'bg-[var(--wa-green)]' : 'bg-carnation'}`}
        aria-hidden="true"
      />
      {status}
    </span>
  )
}

function VisitCue({ label }: { label: string }) {
  return (
    <span className="underline-grow mt-6 inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.12em] text-ivory transition-colors group-hover:text-carnation">
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
