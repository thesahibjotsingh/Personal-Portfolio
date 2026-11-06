import { PRICING, inr } from './config'

/* The questions and options behind the brief builder. Kept here, away from the
   component, so the wording and ranges can be edited without touching the UI. */

export type TypeKey = 'website' | 'store' | 'software' | 'institution' | 'desktop' | 'other'

export const TYPES: { key: TypeKey; label: string; sub: string }[] = [
  { key: 'website', label: 'Business website', sub: 'A brand or corporate site' },
  { key: 'store', label: 'Online store', sub: 'Sell products online' },
  { key: 'software', label: 'Billing, POS or business software', sub: 'Tools your team runs on' },
  { key: 'institution', label: 'Hospital or institution site', sub: 'Departments, doctors, services' },
  { key: 'desktop', label: 'Desktop software', sub: 'Runs on your own machine' },
  { key: 'other', label: 'Something else', sub: 'Tell me about it' },
]

/* the types that are priced by the page */
export const PAGE_TYPES: TypeKey[] = ['website', 'institution']
/* the types that also ask how big the site is */
export const SIZED_TYPES: TypeKey[] = ['website', 'institution', 'store']

export const PAGES = ['1–5 pages', '6–10 pages', '11–20 pages', '20+ pages', 'Not sure yet']

const PAGE_RANGE: Record<string, [number, number]> = {
  '1–5 pages': [1, 5],
  '6–10 pages': [6, 10],
  '11–20 pages': [11, 20],
  '20+ pages': [20, 30],
}

export const FEATURES: Record<TypeKey, string[]> = {
  website: [
    'Enquiry form',
    'WhatsApp chat button',
    'Blog or news',
    'Photo gallery',
    'Multi-language',
    'SEO setup',
    'Edit content myself',
    'Booking / appointments',
  ],
  store: [
    'Product catalogue',
    'Cart and checkout',
    'UPI and card payments',
    'Order management',
    'Inventory tracking',
    'Discount codes',
    'Customer accounts',
    'Delivery or pickup options',
  ],
  software: [
    'GST billing and invoices',
    'Inventory',
    'Real-time sync across devices',
    'Reports and dashboards',
    'Staff logins and roles',
    'Works offline',
    'Excel import',
    'PDF export and printing',
  ],
  institution: [
    'Department directory',
    'Find a doctor or staff',
    'Online appointments',
    'WhatsApp and call buttons',
    'Multi-language',
    'Patient or member login',
    'Admin panel',
    'Maps and directions',
  ],
  desktop: [
    'Works offline',
    'Edit or convert files',
    'Batch processing',
    'Windows installer',
    'Auto-update',
    'Data stays on the machine',
  ],
  other: ['Web app', 'Works well on phones', 'Admin panel', 'User logins', 'Payments', 'Integrations'],
}

export const TIMELINES = ['As soon as possible', 'Within a month', 'In 1–3 months', 'Flexible']

export const BUDGETS = [
  'Under ₹25,000',
  '₹25,000 – ₹75,000',
  '₹75,000 – ₹2,00,000',
  '₹2,00,000 and above',
  'Not sure — advise me',
]

/* A plain-English pricing line for the budget step, worked out from what the
   visitor has already chosen. Always a starting point, never a quote. */
export function priceHint(type: TypeKey | '', pages: string): string {
  if (!type) return ''
  if (PAGE_TYPES.includes(type)) {
    const range = PAGE_RANGE[pages]
    if (range) {
      return `Websites are charged by the page — from about ${inr(PRICING.perPage)} a page. ${pages} usually comes to roughly ${inr(
        range[0] * PRICING.perPage,
      )} – ${inr(range[1] * PRICING.perPage)}.`
    }
    return `Websites are charged by the page — from about ${inr(PRICING.perPage)} a page — so the page count sets the price.`
  }
  if (type === 'store') {
    return `Online stores start around ${inr(PRICING.store)}, depending on how many products and payment options you need.`
  }
  return `Custom software starts around ${inr(PRICING.software)} and is quoted per project after a short call.`
}
