export const CONFIG = {
  name: 'Sahibjot Singh',
  wordmark: 'Saheb',
  tagline: 'Code. Craft. Scale.',
  role: 'Full Stack Developer',
  /* the inbox the contact form also delivers to */
  email: 'in.sahibjotsingh@gmail.com',
  /* used for the WhatsApp quick-link (wa.me) */
  whatsapp: '919877636100',
  /* Empty on purpose. These were three dead '#' links; a link that goes
     nowhere reads worse than no link on a site whose argument is that the
     work gets finished. Add an entry here and the icon returns — `Icon`
     still carries github/linkedin/x artwork ready for it.
     Verified if GitHub is ever wanted: https://github.com/thesahibjotsingh */
  socials: [{ label: 'GitHub', href: 'https://github.com/thesahibjotsingh' }] as {
    label: string
    href: string
  }[],
} as const

/* EmailJS keys are publishable by design — the public key is meant to ship
   in client code, and the service is locked to allowed origins in the
   EmailJS dashboard. Inquiries land in in.sahibjotsingh@gmail.com. */
export const EMAILJS = {
  serviceId: 'service_a4bp5r5',
  templateId: 'template_9cvudiv',
  publicKey: 'zYWBXYHaomWMp81NX',
  toEmail: 'in.sahibjotsingh@gmail.com',
} as const

/* Starting points in rupees, set from typical Indian freelance market rates and
   shown as "from" figures, never as quotes. Websites are charged by the page.
   Change a number here and the Services section, the brief builder's hint and
   the contact copy all follow. */
export const PRICING = {
  perPage: 4000,
  store: 60000,
  software: 150000,
} as const

/* ₹1,50,000 style — Indian digit grouping */
export const inr = (amount: number) => `₹${amount.toLocaleString('en-IN')}`
