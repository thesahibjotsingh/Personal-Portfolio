import { useEffect, useState } from 'react'
import HeroMedia from './HeroMedia'

const step = (i: number) => ({ transitionDelay: `${140 + i * 110}ms` })

export default function Hero() {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <section
      id="top"
      className={`relative flex min-h-svh flex-col overflow-hidden pt-[72px] lg:block ${
        entered ? 'hero-in' : ''
      }`}
    >
      <HeroMedia />

      <div className="relative z-10 order-1 flex flex-1 items-center px-6 py-10 md:px-8 lg:min-h-[calc(100svh-72px)] lg:py-0 lg:pl-[6vw] lg:pr-0">
        <div className="w-full lg:w-[46%]">
          <p
            className="hero-step font-mono text-[0.8rem] uppercase tracking-[0.2em] text-dim"
            style={step(0)}
          >
            Hello, I'm
          </p>

          <h1
            className="hero-step mt-5 font-display text-[clamp(2.5rem,5.2vw,4rem)] font-normal leading-[1.1] tracking-[-0.02em] text-ivory"
            style={step(1)}
          >
            Saheb,{' '}
            <em className="italic text-carnation-deep">I build digital experiences</em>
            <br />
            that deliver real impact<span className="text-carnation-deep">.</span>
          </h1>

          <p
            className="hero-step mt-5 max-w-[46ch] text-[1.0625rem] leading-[1.75] text-muted"
            style={step(2)}
          >
            Full Stack Developer specializing in Firebase-powered web applications. I
            help businesses streamline operations, engage customers, and grow online.
          </p>

          <div
            className="hero-step mt-8 flex flex-wrap items-center gap-7"
            style={step(3)}
          >
            <a
              href="#work"
              className="inline-flex items-center gap-[0.6rem] rounded-[3px] border border-carnation px-7 py-[0.9rem] text-[0.9375rem] font-medium text-carnation transition-colors hover:bg-carnation hover:text-void"
            >
              View My Work
              <ArrowUpRight />
            </a>

            <a
              href="#work"
              className="group inline-flex items-center gap-[0.6rem] text-[0.9rem] text-muted transition-colors hover:text-carnation"
            >
              Scroll to explore
              <ArrowDown />
            </a>
          </div>

          <p
            className="hero-step mt-10 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-dim"
            style={step(4)}
          >
            <span
              className="inline-block h-2 w-2 rounded-full bg-carnation"
              style={{ animation: 'availPulse 2.2s ease-in-out infinite' }}
              aria-hidden="true"
            />
            Available for new projects
          </p>
        </div>
      </div>
    </section>
  )
}

function ArrowUpRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}

function ArrowDown() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ animation: 'bob 2s ease-in-out infinite' }}
    >
      <path d="M12 5v14M19 12l-7 7-7-7" />
    </svg>
  )
}
