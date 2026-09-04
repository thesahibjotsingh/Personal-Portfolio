export const CONFIG = {
  name: 'Sahibjot Singh',
  wordmark: 'Saheb',
  tagline: 'Code. Craft. Scale.',
  role: 'Full Stack Developer',
  /* placeholder — swap for a real inbox before this is presented as live */
  email: 'studio@saheb.dev',
  /* real — used for the WhatsApp quick-link (wa.me) */
  whatsapp: '919877636100',
  /* placeholders — leave as '#' until real profiles exist rather than
     pointing them at invented destinations (PRODUCT.md principle #4) */
  socials: [
    { label: 'GitHub', href: '#' },
    { label: 'LinkedIn', href: '#' },
    { label: 'X', href: '#' },
  ],
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

export const PROJECT_TYPES = [
  'New POS system',
  'E-commerce platform',
  'Corporate website',
  'Something else',
] as const
