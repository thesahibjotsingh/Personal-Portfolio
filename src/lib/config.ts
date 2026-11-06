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

/* Where a visitor is decides which price list they see. These are the
   "starting from" figures shown on the page, set per market rather than
   converted from one number, and websites are charged by the page everywhere.
   Edit any number here and the Services section, the contact copy and the
   brief builder's budget options all follow. India is the home market; the
   United States and Canada get their own lists, and everyone else sees the
   US one in dollars. */
export type RegionKey = 'IN' | 'US' | 'CA'

export const REGIONS: Record<
  RegionKey,
  {
    name: string
    code: string
    symbol: string
    /* digit grouping: ₹1,50,000 in India, $150,000 elsewhere */
    grouping: string
    perPage: number
    store: number
    software: number
    /* the three cut-offs between the four budget bands */
    budgetSteps: [number, number, number]
  }
> = {
  IN: {
    name: 'India',
    code: 'INR',
    symbol: '₹',
    grouping: 'en-IN',
    perPage: 4000,
    store: 60000,
    software: 150000,
    budgetSteps: [25000, 75000, 200000],
  },
  US: {
    name: 'the United States',
    code: 'USD',
    symbol: '$',
    grouping: 'en-US',
    perPage: 75,
    store: 1200,
    software: 3000,
    budgetSteps: [500, 1500, 4000],
  },
  CA: {
    name: 'Canada',
    code: 'CAD',
    symbol: 'C$',
    grouping: 'en-US',
    perPage: 100,
    store: 1600,
    software: 4000,
    budgetSteps: [700, 2000, 5500],
  },
}

export const money = (amount: number, region: RegionKey) =>
  `${REGIONS[region].symbol}${amount.toLocaleString(REGIONS[region].grouping)}`
