import Reveal from './Reveal'
import SectionLabel from './SectionLabel'
import { SERVICES } from '../lib/content'

/* Copy here describes the kinds of work already shown in the Work section —
   no turnaround times, prices or guarantees are promised. */
const PROCESS = [
  { step: 'Scope', body: 'A short call to pin down what you need, who it’s for and what “done” looks like.' },
  { step: 'Design', body: 'Layout and flows agreed on screen before anything is built.' },
  { step: 'Build', body: 'Working software you can click through, not a slide deck about it.' },
  { step: 'Launch', body: 'Deployed, checked on real devices, and walked through with you.' },
]

export default function Services() {
  return (
    <section id="services" className="px-6 py-14 md:px-10 md:py-24">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 lg:grid-cols-[2.5rem_1fr] lg:gap-10">
        <SectionLabel>Services</SectionLabel>

        <div>
          <Reveal>
            <h2 className="mb-12 max-w-3xl font-display text-4xl font-normal text-ivory md:mb-16 md:text-6xl">
              What I <span className="italic text-carnation-deep">build</span>.
            </h2>
          </Reveal>

          <ul className="m-0 list-none p-0">
            {SERVICES.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <li className="group grid gap-4 border-t border-hairline py-8 lg:grid-cols-12 lg:gap-14 lg:py-10">
                  <div className="flex items-baseline gap-5 lg:col-span-6">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-carnation">
                      {s.index}
                    </span>
                    <h3 className="font-sans text-2xl font-light tracking-tight text-ivory transition-colors group-hover:text-carnation md:text-4xl">
                      {s.title}
                    </h3>
                  </div>
                  <p className="max-w-xl text-[15.5px] leading-relaxed text-muted md:text-[17px] lg:col-span-6">
                    {s.body}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>

          <Reveal>
            <h3 className="mb-8 mt-20 font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
              How a project runs
            </h3>
          </Reveal>
          <ol className="m-0 grid list-none gap-0 p-0 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((p, i) => (
              <Reveal key={p.step} delay={i * 80}>
                <li className="h-full border-t border-carnation/40 py-6 pr-8">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-carnation">
                    0{i + 1}
                  </span>
                  <h4 className="mt-3 font-display text-2xl text-ivory">{p.step}</h4>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{p.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
