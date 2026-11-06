import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import emailjs from '@emailjs/browser'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { EMAILJS } from '../lib/config'
import {
  budgetLabels,
  FEATURES,
  PAGES,
  SIZED_TYPES,
  TIMELINES,
  TYPES,
  priceHint,
  type TypeKey,
} from '../lib/brief'
import Icon from './Icon'
import Roll from './Roll'
import RegionSwitch from './RegionSwitch'
import { useRegion } from '../lib/region'

type Answers = {
  type: TypeKey | ''
  pages: string
  features: string[]
  timeline: string
  budget: string
  name: string
  email: string
  phone: string
  notes: string
}

const EMPTY: Answers = {
  type: '',
  pages: '',
  features: [],
  timeline: '',
  budget: '',
  name: '',
  email: '',
  phone: '',
  notes: '',
}

const STEPS = ['Project', 'Scope', 'Timeline', 'Budget', 'You'] as const
const LAST = STEPS.length - 1

const QUESTIONS = [
  'What are you building?',
  'What does it need?',
  'When do you need it?',
  'What budget are you working with?',
  'Where should I reply?',
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

type Errors = Partial<Record<'name' | 'email', string>>

function canContinue(step: number, a: Answers) {
  if (step === 0) return a.type !== ''
  if (step === 1) return !SIZED_TYPES.includes(a.type as TypeKey) || a.pages !== ''
  if (step === 2) return a.timeline !== ''
  if (step === 3) return a.budget !== ''
  return true
}

/* One option button. Single choices use radio semantics, multiple choices use
   checkbox semantics, so a screen reader announces them correctly. */
function Choice({
  selected,
  onClick,
  role,
  children,
  large = false,
}: {
  selected: boolean
  onClick: () => void
  role: 'radio' | 'checkbox'
  children: ReactNode
  large?: boolean
}) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      onClick={onClick}
      className={`bb-item chip text-left transition-colors ${
        large ? 'px-4 py-3.5' : 'px-3.5 py-2.5'
      } ${selected ? 'border-carnation bg-carnation/10 text-ivory' : 'text-muted'}`}
    >
      {children}
    </button>
  )
}

export default function BriefBuilder({
  onResult,
}: {
  onResult: (kind: 'success' | 'error', text: string) => void
}) {
  const [region] = useRegion()
  const [step, setStep] = useState(0)
  const [a, setA] = useState<Answers>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  /* Hidden field real visitors never see; bots that fill every input do. */
  const [trap, setTrap] = useState('')

  /* The budget bands are written in the visitor's currency, so a band picked
     under another region's list no longer matches and simply counts as unset. */
  const budgets = budgetLabels(region)
  const budget = budgets.includes(a.budget) ? a.budget : ''

  const dir = useRef(1)
  const content = useRef<HTMLDivElement>(null)
  const heading = useRef<HTMLHeadingElement>(null)
  const first = useRef(true)

  /* Each step slides in from the side you're travelling towards, with its
     options rising in one after another. Skipped for reduced motion. */
  useEffect(() => {
    const el = content.current
    if (!el) return
    if (first.current) {
      first.current = false
      return
    }
    heading.current?.focus({ preventScroll: true })
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, x: dir.current * 28 },
        { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' },
      )
      gsap.from('.bb-item', {
        opacity: 0,
        y: 12,
        duration: 0.45,
        ease: 'power2.out',
        stagger: 0.035,
        delay: 0.08,
      })
    }, el)
    return () => ctx.revert()
  }, [step, sent])

  const set = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setA((prev) => ({ ...prev, [key]: value }))
    if (key === 'name' || key === 'email') {
      setErrors((prev) => {
        if (!(key in prev)) return prev
        const next = { ...prev }
        delete next[key as 'name' | 'email']
        return next
      })
    }
  }

  const pickType = (type: TypeKey) => {
    // a new project type has different options, so earlier scope answers reset
    setA((prev) => (prev.type === type ? prev : { ...prev, type, pages: '', features: [] }))
  }

  const toggleFeature = (f: string) =>
    setA((prev) => ({
      ...prev,
      features: prev.features.includes(f)
        ? prev.features.filter((x) => x !== f)
        : [...prev.features, f],
    }))

  const go = (n: number, direction: number) => {
    dir.current = direction
    setStep(n)
  }

  const typeLabel = TYPES.find((t) => t.key === a.type)?.label ?? ''

  const submit = async () => {
    if (sending) return

    const found: Errors = {}
    if (!a.name.trim()) found.name = 'Tell me your name.'
    if (!a.email.trim()) found.email = 'Add an email so I can reply.'
    else if (!EMAIL_RE.test(a.email.trim())) found.email = "That email doesn't look right."
    setErrors(found)
    if (found.name || found.email) {
      document.getElementById(found.name ? 'bb-name' : 'bb-email')?.focus()
      return
    }

    /* a filled trap is a bot: pretend it worked and send nothing */
    if (trap) {
      setSent(true)
      return
    }

    const message = [
      `Project type: ${typeLabel}`,
      a.pages ? `Size: ${a.pages}` : null,
      `Features: ${a.features.length ? a.features.join(', ') : 'none picked'}`,
      `Timeline: ${a.timeline}`,
      `Budget: ${budget}`,
      a.phone.trim() ? `WhatsApp / phone: ${a.phone.trim()}` : null,
      a.notes.trim() ? `\nNotes:\n${a.notes.trim()}` : null,
    ]
      .filter(Boolean)
      .join('\n')

    setSending(true)
    try {
      await emailjs.send(
        EMAILJS.serviceId,
        EMAILJS.templateId,
        {
          name: a.name.trim(),
          email: a.email.trim(),
          reply_to: a.email.trim(),
          project_type: typeLabel,
          /* the existing template renders `message`, so the whole brief is folded
             into it; the individual fields are sent too for any template that
             wants them */
          message,
          title: 'Portfolio Brief',
          time: new Date().toLocaleString(),
          to_email: EMAILJS.toEmail,
          pages: a.pages,
          features: a.features.join(', '),
          timeline: a.timeline,
          budget: a.budget,
          phone: a.phone.trim(),
        },
        EMAILJS.publicKey,
      )
      setSent(true)
      onResult('success', 'Brief sent. Thanks — I will reply to you soon.')
    } catch {
      onResult('error', "Couldn't send your brief. Try again, or email me directly.")
    } finally {
      setSending(false)
    }
  }

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (step < LAST) {
      if (canContinue(step, { ...a, budget })) go(step + 1, 1)
    } else {
      void submit()
    }
  }

  const restart = () => {
    setA(EMPTY)
    setErrors({})
    setTrap('')
    setSent(false)
    dir.current = -1
    setStep(0)
  }

  const features = a.type ? FEATURES[a.type] : []
  const sized = SIZED_TYPES.includes(a.type as TypeKey)
  const ok = canContinue(step, { ...a, budget })

  if (sent) {
    return (
      <div ref={content} className="py-4" aria-live="polite">
        <p className="bb-item font-mono text-[10px] uppercase tracking-[0.2em] text-carnation">
          Brief received
        </p>
        <h3
          ref={heading}
          tabIndex={-1}
          className="bb-item mt-3 font-display text-3xl text-ivory outline-none md:text-4xl"
        >
          Thanks, {a.name.trim().split(' ')[0] || 'friend'}. That's everything I need.
        </h3>
        <p className="bb-item mt-4 max-w-md text-[14.5px] leading-relaxed text-muted">
          I'll read it properly and reply to {a.email.trim() || 'you'} — usually with a few questions
          and a rough plan. If it's urgent, message me on WhatsApp.
        </p>
        <dl className="bb-item mt-6 grid gap-x-8 gap-y-3 text-[13px] sm:grid-cols-2">
          {[
            ['Project', typeLabel],
            ['Timeline', a.timeline],
            ['Budget', budget],
            ...(a.pages ? [['Size', a.pages]] : []),
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-dim">{k}</dt>
              <dd className="mt-0.5 text-ivory">{v}</dd>
            </div>
          ))}
        </dl>
        <button
          type="button"
          onClick={restart}
          className="bb-item mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-dim transition-colors hover:text-carnation"
        >
          Send another brief
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* progress: one segment per step, filling as you go */}
      <div className="mb-6">
        <div className="flex items-baseline justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.18em]">
          <span className="text-carnation" aria-live="polite">
            Step {step + 1} / {STEPS.length}
          </span>
          <span className="text-dim">{STEPS[step]}</span>
        </div>
        <div className="mt-3 flex gap-1.5" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span key={s} className="relative h-[2px] flex-1 overflow-hidden bg-hairline">
              <span
                className="absolute inset-0 origin-left bg-carnation transition-transform duration-500"
                style={{ transform: `scaleX(${i <= step ? 1 : 0})` }}
              />
            </span>
          ))}
        </div>
      </div>

      <div ref={content} className="min-h-[19rem]">
        <h3
          ref={heading}
          tabIndex={-1}
          className="font-display text-2xl text-ivory outline-none md:text-3xl"
        >
          {QUESTIONS[step]}
        </h3>

        {step === 0 && (
          <div role="radiogroup" aria-label="Project type" className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {TYPES.map((t) => (
              <Choice
                key={t.key}
                large
                role="radio"
                selected={a.type === t.key}
                onClick={() => pickType(t.key)}
              >
                <span className="block text-[14.5px] font-medium text-ivory">{t.label}</span>
                <span className="mt-0.5 block text-[12.5px] text-dim">{t.sub}</span>
              </Choice>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="mt-6 space-y-6">
            {sized && (
              <div>
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
                  Roughly how big?
                </p>
                <div role="radiogroup" aria-label="Size" className="flex flex-wrap gap-2">
                  {PAGES.map((p) => (
                    <Choice
                      key={p}
                      role="radio"
                      selected={a.pages === p}
                      onClick={() => set('pages', p)}
                    >
                      <span className="text-[13.5px]">{p}</span>
                    </Choice>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
                Pick any that apply
              </p>
              <div role="group" aria-label="Features" className="flex flex-wrap gap-2">
                {features.map((f) => (
                  <Choice
                    key={f}
                    role="checkbox"
                    selected={a.features.includes(f)}
                    onClick={() => toggleFeature(f)}
                  >
                    <span className="text-[13.5px]">{f}</span>
                  </Choice>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div role="radiogroup" aria-label="Timeline" className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {TIMELINES.map((t) => (
              <Choice
                key={t}
                large
                role="radio"
                selected={a.timeline === t}
                onClick={() => set('timeline', t)}
              >
                <span className="text-[14.5px] text-ivory">{t}</span>
              </Choice>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="mt-6">
            <div role="radiogroup" aria-label="Budget" className="grid gap-2.5 sm:grid-cols-2">
              {budgets.map((b) => (
                <Choice
                  key={b}
                  large
                  role="radio"
                  selected={budget === b}
                  onClick={() => set('budget', b)}
                >
                  <span className="text-[14.5px] text-ivory">{b}</span>
                </Choice>
              ))}
            </div>
            <p className="bb-item mt-5 border-l border-carnation/60 pl-4 text-[13px] leading-relaxed text-muted">
              {priceHint(a.type, a.pages, region)}{' '}
              <span className="text-dim">A starting point, not a quote.</span>
            </p>
            <RegionSwitch className="bb-item mt-4" />
          </div>
        )}

        {step === LAST && (
          <div className="mt-6 space-y-5">
            {/* hidden trap for bots */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="bb-website">Leave this field empty</label>
              <input
                id="bb-website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={trap}
                onChange={(e) => setTrap(e.target.value)}
              />
            </div>

            <div className="bb-item grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="bb-name"
                  className="mb-2 block font-mono text-[10px] uppercase tracking-[0.12em] text-dim"
                >
                  Name
                </label>
                <input
                  id="bb-name"
                  type="text"
                  required
                  autoComplete="name"
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? 'bb-name-error' : undefined}
                  value={a.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Neha Parmar"
                  className="w-full px-3.5 py-3 text-[14px]"
                />
                {errors.name && (
                  <p id="bb-name-error" role="alert" className="mt-1.5 text-[12px] text-[var(--err)]">
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="bb-email"
                  className="mb-2 block font-mono text-[10px] uppercase tracking-[0.12em] text-dim"
                >
                  Email
                </label>
                <input
                  id="bb-email"
                  type="email"
                  required
                  autoComplete="email"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? 'bb-email-error' : undefined}
                  value={a.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="neha@company.com"
                  className="w-full px-3.5 py-3 text-[14px]"
                />
                {errors.email && (
                  <p id="bb-email-error" role="alert" className="mt-1.5 text-[12px] text-[var(--err)]">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="bb-item">
              <label
                htmlFor="bb-phone"
                className="mb-2 block font-mono text-[10px] uppercase tracking-[0.12em] text-dim"
              >
                WhatsApp number <span className="normal-case tracking-normal">(optional)</span>
              </label>
              <input
                id="bb-phone"
                type="tel"
                autoComplete="tel"
                value={a.phone}
                onChange={(e) => set('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-3 text-[14px]"
              />
            </div>

            <div className="bb-item">
              <label
                htmlFor="bb-notes"
                className="mb-2 block font-mono text-[10px] uppercase tracking-[0.12em] text-dim"
              >
                Anything else? <span className="normal-case tracking-normal">(optional)</span>
              </label>
              <textarea
                id="bb-notes"
                rows={3}
                value={a.notes}
                onChange={(e) => set('notes', e.target.value)}
                placeholder="What it needs to do on day one, a site you like, a deadline…"
                className="w-full resize-none px-3.5 py-3 text-[14px]"
              />
            </div>

            <p className="bb-item text-[12px] leading-relaxed text-dim">
              Used only to reply to you.{' '}
              <a href="/privacy" className="underline decoration-dotted underline-offset-2 hover:text-ivory">
                Privacy
              </a>
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => go(step - 1, -1)}
            className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim transition-colors hover:text-ivory"
          >
            ← Back
          </button>
        ) : (
          <span />
        )}

        <button
          type="submit"
          disabled={!ok || sending}
          className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {sending ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-carnation/25 border-t-carnation" />
              Sending...
            </>
          ) : (
            <>
              <Roll>{step === LAST ? 'Send brief' : 'Continue'}</Roll>
              <Icon name="arrow" className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
