import Reveal from './Reveal'
import SectionLabel from './SectionLabel'
import firebaseLogo from '../assets/firebase.webp'
import firestoreLogo from '../assets/firestore.webp'
import javascriptLogo from '../assets/javascript.webp'
import html5Logo from '../assets/HTML5.webp'
import css3Logo from '../assets/CSS3_logo.webp'
import pwaLogo from '../assets/pwa.webp'
import emailjsLogo from '../assets/EmailJs.webp'
import cloudflareLogo from '../assets/Cloudflare.webp'

/* Every entry here has to be traceable to something actually shipped:
   Firebase/Firestore/JavaScript/PWA are tagged on the Cloud POS card,
   HTML5/CSS3/JavaScript on Crosta and Barkat, EmailJS runs this page's own
   contact form, Cloudflare hosts the Cloud POS demo (pages.dev).
   No aspirational stack — see PRODUCT.md principle #1. */
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

export default function Stack() {
  return (
    <section id="stack" className="section-seam px-6 py-20 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[2.5rem_1fr] lg:gap-10">
        <SectionLabel>The Toolbench</SectionLabel>

        <div>
          <Reveal>
            <h2 className="mb-8 font-display text-4xl text-ivory md:text-5xl">
              What it's built with.
            </h2>
          </Reveal>

          <Reveal delay={80}>
            <ul className="flex list-none flex-wrap gap-3 p-0">
              {STACK_ITEMS.map((item) => (
                <li
                  key={item.name}
                  className="chip panel flex items-center gap-2.5 px-5 py-3"
                >
                  <img
                    src={item.logo}
                    alt=""
                    className="h-5 w-5 flex-shrink-0 object-contain"
                  />
                  <span className="font-mono text-[12.5px] text-ivory">{item.name}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
