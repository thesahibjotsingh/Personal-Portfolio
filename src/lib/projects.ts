import demoPreview from '../assets/demo-preview.webp'
import crostaPreview from '../assets/crosta-preview.webp'
import barkatPreview from '../assets/barkat-preview.webp'
import quickbillPreview from '../assets/quickbill-preview.webp'
import pdfstudioPreview from '../assets/pdfstudio-preview.webp'
import limsPreview from '../assets/lims-preview.webp'
import posMobile from '../assets/pos-mobile.webp'
import crostaMobile from '../assets/crosta-mobile.webp'
import barkatMobile from '../assets/barkat-mobile.webp'
import limsMobile from '../assets/lims-mobile.webp'
import quickbillMobile from '../assets/quickbill-mobile.webp'

/* Every entry is real work. "Live" ones link to the running site; the
   "In development" ones have no public URL yet, so they don't link — and carry
   no invented metrics or client claims. */
export type Project = {
  index: string
  slug: string
  short: string
  tint: string
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
  /* intrinsic pixel size, so the browser reserves the right space before the image loads */
  imageSize: [number, number]
  /* portrait phone screenshot, shown next to the desktop one when present */
  mobileImage?: string
  mobileAlt?: string
  mobileSize?: [number, number]
}

export const PROJECTS: Project[] = [
  {
    index: '01',
    slug: 'cloud-pos',
    short: 'Cloud POS',
    tint: '#3b1f0d',
    fig: 'Fig. 01 — Cloud POS',
    title: 'Custom Cloud-Hosted POS System',
    meta: 'Own product · runs The Crosta',
    status: 'Live',
    blurb: 'A register that syncs across every terminal in real time.',
    tags: ['Firebase', 'Firestore', 'JavaScript', 'Real-time Sync', 'PWA'],
    href: 'https://demo-pos-system.pages.dev/',
    cta: 'View live demo',
    image: demoPreview,
    imageAlt: 'Artisanal POS live demo — menu ordering screen',
    imageSize: [1910, 877],
    mobileImage: posMobile,
    mobileAlt: 'Artisanal POS on a phone — menu and order bar',
    mobileSize: [1180, 2000],
  },
  {
    index: '02',
    slug: 'the-crosta',
    short: 'The Crosta',
    tint: '#33230a',
    fig: 'Fig. 02 — E-Commerce',
    title: 'The Crosta',
    meta: 'thecrosta.com',
    status: 'Live',
    blurb: "An artisanal pizza storefront with a checkout that doesn't fight the customer.",
    tags: ['E-Commerce', 'Custom CMS', 'HTML5', 'CSS3', 'JavaScript', 'Responsive'],
    href: 'https://thecrosta.com',
    cta: 'Visit site',
    image: crostaPreview,
    imageAlt: 'The Crosta e-commerce storefront',
    imageSize: [1891, 869],
    mobileImage: crostaMobile,
    mobileAlt: 'The Crosta on a phone — offers and bottom navigation',
    mobileSize: [1045, 2000],
  },
  {
    index: '03',
    slug: 'barkat-and-company',
    short: 'Barkat & Co.',
    tint: '#0f1c36',
    fig: 'Fig. 03 — Corporate',
    title: 'Barkat & Company',
    meta: 'barkatandcompany.com',
    status: 'Live',
    blurb: 'A corporate platform built for credibility, speed and easy upkeep.',
    tags: ['Corporate Site', 'SEO Structure', 'HTML5', 'CSS3', 'JavaScript', 'Responsive'],
    href: 'https://barkatandcompany.com',
    cta: 'Visit site',
    image: barkatPreview,
    imageAlt: 'Barkat & Company corporate platform',
    imageSize: [1897, 874],
    mobileImage: barkatMobile,
    mobileAlt: 'Barkat & Company on a phone — hero and calls to action',
    mobileSize: [1160, 2000],
  },
  {
    index: '04',
    slug: 'lims-hospital',
    short: 'LIMS Hospital',
    tint: '#0a2c36',
    fig: 'Fig. 04 — Healthcare',
    title: 'LIMS Hospital Platform',
    meta: 'Lifeline Institute, Hisar',
    status: 'In development',
    blurb: 'The web platform for Lifeline Institute of Medical Sciences, Hisar.',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Accessibility'],
    image: limsPreview,
    imageAlt: 'LIMS hospital home page — find a doctor or department',
    imageSize: [1898, 872],
    mobileImage: limsMobile,
    mobileAlt: 'LIMS hospital on a phone — search, quick actions and specialities',
    mobileSize: [1061, 2000],
  },
  {
    index: '05',
    slug: 'quickbill',
    short: 'QuickBill',
    tint: '#0e2244',
    fig: 'Fig. 05 — Billing',
    title: 'QuickBill',
    meta: 'Own product',
    status: 'In development',
    blurb: 'GST quotations and tax invoices for Indian small businesses.',
    tags: ['Next.js', 'TypeScript', 'Firestore', 'Cloudflare'],
    image: quickbillPreview,
    imageAlt: 'QuickBill home screen — quotations, parties and items',
    imageSize: [1895, 873],
    mobileImage: quickbillMobile,
    mobileAlt: 'QuickBill on a phone — quotation shortcuts and recent quotations',
    mobileSize: [1037, 2000],
  },
  {
    index: '06',
    slug: 'pdfstudio',
    short: 'PDFStudio',
    tint: '#341412',
    fig: 'Fig. 06 — Desktop',
    title: 'PDFStudio',
    meta: 'Own product',
    status: 'In development',
    blurb: 'A PDF and document editor that runs on your own machine.',
    tags: ['Python', 'Desktop App', 'PDF Engine', 'Local-first'],
    image: pdfstudioPreview,
    imageAlt: 'PDFStudio home screen — 48 PDF tools',
    imageSize: [1920, 1000],
  },
]
