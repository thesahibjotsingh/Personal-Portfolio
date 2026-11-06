import firebaseLogo from '../assets/firebase.webp'
import firestoreLogo from '../assets/firestore.webp'
import javascriptLogo from '../assets/javascript.webp'
import html5Logo from '../assets/HTML5.webp'
import css3Logo from '../assets/CSS3_logo.webp'
import pwaLogo from '../assets/pwa.webp'
import cloudflareLogo from '../assets/Cloudflare.webp'

/* The three things I build. `price` says how the row is priced: websites by the
   page, software by the project. Figures come from REGIONS in config.ts. */
export const SERVICES = [
  {
    index: '01',
    title: 'Web platforms & internal tools',
    line: 'POS, billing, dashboards and portals, built around how your business runs.',
    price: 'software',
  },
  {
    index: '02',
    title: 'Brand sites & storefronts',
    line: 'Sites and online stores, designed and built end to end.',
    price: 'page',
  },
  {
    index: '03',
    title: 'Desktop & local-first software',
    line: 'Tools that run on your own machine and keep your files there.',
    price: 'quote',
  },
] as const

/* What the work is actually built with: every entry appears in a project card
   above. Items with a logo file show it; the rest get a monogram. */
export type StackItem = { name: string; logo?: string; mark?: string }

export const STACK_ITEMS: StackItem[] = [
  { name: 'Next.js', mark: 'N' },
  { name: 'React', mark: 'Re' },
  { name: 'TypeScript', mark: 'TS' },
  { name: 'Tailwind CSS', mark: 'Tw' },
  { name: 'Firebase', logo: firebaseLogo },
  { name: 'Firestore', logo: firestoreLogo },
  { name: 'Python', mark: 'Py' },
  { name: 'JavaScript', logo: javascriptLogo },
  { name: 'HTML5', logo: html5Logo },
  { name: 'CSS3', logo: css3Logo },
  { name: 'PWA', logo: pwaLogo },
  { name: 'Cloudflare', logo: cloudflareLogo },
]
