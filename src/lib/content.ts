import firebaseLogo from '../assets/firebase.webp'
import firestoreLogo from '../assets/firestore.webp'
import javascriptLogo from '../assets/javascript.webp'
import html5Logo from '../assets/HTML5.webp'
import css3Logo from '../assets/CSS3_logo.webp'
import pwaLogo from '../assets/pwa.webp'
import emailjsLogo from '../assets/EmailJs.webp'
import cloudflareLogo from '../assets/Cloudflare.webp'

export const SERVICES = [
  {
    index: '01',
    title: 'Web platforms & internal tools',
    body: 'Point-of-sale, billing, dashboards and hospital portals. Real-time data on Firebase, installable as a PWA, built around how the business actually runs.',
  },
  {
    index: '02',
    title: 'Brand sites & storefronts',
    body: 'Sites and online stores designed and built end to end — clear structure, fast loading, search-friendly, and content you can update without a developer.',
  },
  {
    index: '03',
    title: 'Desktop & local-first software',
    body: 'Tools that run on your own machine and keep your files there, like PDFStudio. For work that should not be uploaded to someone else’s server.',
  },
]

export const PILLARS = [
  {
    title: 'Platforms',
    body: 'Cloud POS, GST billing and a hospital web platform — systems people run a business on.',
  },
  {
    title: 'Storefronts & sites',
    body: 'Brand sites and stores designed and built end to end, from layout to launch.',
  },
  {
    title: 'Desktop tools',
    body: 'Local-first software like PDFStudio, for work that should stay on your own machine.',
  },
]

/* Every entry is traceable to something actually shipped or in progress:
   Firebase/Firestore/PWA on the Cloud POS and QuickBill, HTML5/CSS3/JS on
   Crosta and Barkat, EmailJS on this page's contact form, Cloudflare hosting. */
export const STACK_ITEMS = [
  { name: 'Firebase', logo: firebaseLogo },
  { name: 'Firestore', logo: firestoreLogo },
  { name: 'JavaScript', logo: javascriptLogo },
  { name: 'HTML5', logo: html5Logo },
  { name: 'CSS3', logo: css3Logo },
  { name: 'PWA', logo: pwaLogo },
  { name: 'EmailJS', logo: emailjsLogo },
  { name: 'Cloudflare', logo: cloudflareLogo },
]
