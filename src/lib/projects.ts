import demoPreview from '../assets/demo-preview.webp'
import crostaPreview from '../assets/crosta-preview.webp'
import barkatPreview from '../assets/barkat-preview.webp'
import quickbillPreview from '../assets/quickbill-preview.webp'
import pdfstudioPreview from '../assets/pdfstudio-preview.webp'
import limsPreview from '../assets/lims-preview.webp'

/* Every entry is real work. "Live" ones link to the running site; the
   "In development" ones have no public URL yet, so they don't link — and carry
   no invented metrics or client claims. */
export type Project = {
  index: string
  slug: string
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

export const PROJECTS: Project[] = [
  {
    index: '01',
    slug: 'cloud-pos',
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
    slug: 'the-crosta',
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
    slug: 'barkat-and-company',
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
    slug: 'lims-hospital',
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
    slug: 'quickbill',
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
    slug: 'pdfstudio',
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
