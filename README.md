# Saheb — portfolio

The portfolio site of Sahibjot Singh, a full stack developer: live at
<https://personal-portfolio-5lb.pages.dev>.

A single-page site built with React 19, TypeScript, Vite and Tailwind CSS v4. Motion is GSAP
(ScrollTrigger) with Lenis for smooth scrolling. It deploys to Cloudflare Pages straight from the
`main` branch.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run lint
```

## Where things live

| Path | What it is |
| --- | --- |
| `src/components/` | One file per section (`Hero`, `Work`, `Services`, `About`, `Stack`, `Contact`, `Footer`) plus the nav and small effects |
| `src/lib/projects.ts` | The six projects: copy, status, screenshots (desktop and phone) |
| `src/lib/config.ts` | Contact details, EmailJS settings and the **price lists per region** (India, US, Canada) |
| `src/lib/brief.ts` | The questions and options behind the five-step brief form |
| `src/lib/region.ts` | Which price list a visitor sees (country from `/api/geo`, with a browser fallback) |
| `functions/api/geo.js` | Cloudflare Pages Function that returns the visitor's country, and nothing else |
| `public/_headers` | Security headers and long-lived caching for hashed assets |
| `public/404.html` | The not-found page (also stops unknown URLs returning the home page as a 200) |

## Notes

- Prices are "from" figures, kept in one table in `src/lib/config.ts`; the Services section, the
  contact copy and the brief form's budget bands all read from it.
- The brief form delivers through EmailJS (publishable keys, locked to allowed origins in the EmailJS
  dashboard). The whole brief is folded into the template's `message` field.
- Screenshots are shown whole, never cropped; phones get the phone screenshot where one exists.
- `prefers-reduced-motion` turns off the scroll animation, smooth scrolling and the letter swaps.
