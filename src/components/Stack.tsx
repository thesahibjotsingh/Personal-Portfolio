import SectionLabel from './SectionLabel'
import Reveal from './Reveal'
import firebaseLogo from '../assets/firebase.webp'
import firestoreLogo from '../assets/firestore.webp'
import javascriptLogo from '../assets/javascript.webp'
import html5Logo from '../assets/HTML5.webp'
import css3Logo from '../assets/CSS3_logo.webp'
import pwaLogo from '../assets/pwa.webp'
import emailjsLogo from '../assets/EmailJs.webp'
import cloudflareLogo from '../assets/Cloudflare.webp'

/* Every entry is traceable to something actually shipped or in progress:
   Firebase/Firestore/PWA on the Cloud POS and QuickBill, HTML5/CSS3/JS on
   Crosta and Barkat, EmailJS on this page's contact form, Cloudflare hosting. */
const STACK_ITEMS = [
  { name: 'Firebase', logo: firebaseLogo },
  { name: 'Firestore', logo: firestoreLogo },
  { name: 'JavaScript', logo: javascriptLogo },
  { name: 'HTML5', logo: html5Logo },
  { name: 'CSS3', logo: css3Logo },
  { name: 'PWA', logo: pwaLogo },
  { name: 'EmailJS', logo: emailjsLogo },
  { name: 'Cloudflare', logo: cloudflareLogo },
]

const REVERSED = [...STACK_ITEMS].reverse()

type Items = typeof STACK_ITEMS

export default function Stack() {
  return (
    <section id="stack" className="overflow-hidden py-16 md:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 md:px-8 lg:grid-cols-[2.5rem_1fr] lg:gap-10">
        <SectionLabel>The Toolbench</SectionLabel>
        <Reveal>
          <h2 className="font-display text-4xl font-normal text-ivory md:text-5xl">
            What it's built with.
          </h2>
        </Reveal>
      </div>

      <div className="mt-12 flex flex-col gap-6 md:mt-16 md:gap-8">
        <Row items={STACK_ITEMS} />
        <Row items={REVERSED} reverse />
      </div>
    </section>
  )
}

function Row({ items, reverse = false }: { items: Items; reverse?: boolean }) {
  return (
    <div className={`marquee ${reverse ? 'rev' : ''}`}>
      <div className="marquee-track">
        <Group items={items} />
        <Group items={items} hidden />
      </div>
    </div>
  )
}

function Group({ items, hidden = false }: { items: Items; hidden?: boolean }) {
  return (
    <ul
      className="flex shrink-0 list-none items-center gap-12 p-0 pr-12 md:gap-16 md:pr-16"
      aria-hidden={hidden || undefined}
    >
      {items.map((item) => (
        <li key={item.name} className="flex items-center gap-4">
          <img src={item.logo} alt="" className="h-7 w-7 object-contain md:h-9 md:w-9" />
          <span className="whitespace-nowrap font-sans text-3xl font-light tracking-tight text-ivory/90 md:text-5xl">
            {item.name}
          </span>
          <span className="ml-8 h-1.5 w-1.5 rounded-full bg-carnation md:ml-12" />
        </li>
      ))}
    </ul>
  )
}
