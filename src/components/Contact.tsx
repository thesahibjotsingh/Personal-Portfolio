import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'
import StretchHeading from './StretchHeading'
import SectionLabel from './SectionLabel'
import BriefBuilder from './BriefBuilder'
import Icon, { type IconName } from './Icon'
import { CONFIG } from '../lib/config'

type Toast = { type: 'success' | 'error'; text: string } | null

export default function Contact() {
  const [toast, setToast] = useState<Toast>(null)
  const toastTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const showToast = (type: 'success' | 'error', text: string) => {
    window.clearTimeout(toastTimer.current)
    setToast({ type, text })
    toastTimer.current = window.setTimeout(() => setToast(null), 5000)
  }

  return (
    <section
      id="contact"
      className="border-t border-hairline bg-void px-6 py-14 text-ivory md:px-8 md:py-24"
    >
      <StretchHeading text="Let's build" />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[2.5rem_1fr] lg:gap-10">
        <SectionLabel>Get In Touch</SectionLabel>

        <div className="grid gap-5 md:grid-cols-5">
          <Reveal className="md:col-span-2">
            <div className="panel relative flex h-full flex-col justify-between p-6 md:p-8">
              <CornerMarks />
              <div>
                <h2 className="font-display text-3xl text-ivory md:text-4xl">
                  Tell me what you're{' '}
                  <span className="italic text-carnation-deep">building</span>.
                </h2>
                <p className="mt-4 text-[14px] leading-relaxed text-muted">
                  Five quick questions, so my first reply is useful. No pitch deck, no pressure.
                </p>
              </div>

              <div className="mt-8">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
                  Prefer to talk? Quick links
                </div>
                <div className="flex items-center gap-3">
                  <QuickLink href={`mailto:${CONFIG.email}`} label="Email" icon="mail" />
                  <QuickLink
                    href={`https://wa.me/${CONFIG.whatsapp}`}
                    label="WhatsApp (opens in a new tab)"
                    icon="whatsapp"
                    external
                  />
                  {CONFIG.socials.map((social) => (
                    <QuickLink
                      key={social.label}
                      href={social.href}
                      label={social.label}
                      icon={social.label.toLowerCase() as IconName}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="md:col-span-3" delay={100}>
            <div className="panel relative h-full p-6 md:p-8">
              <CornerMarks />
              <BriefBuilder onResult={showToast} />
            </div>
          </Reveal>
        </div>
      </div>

      <ToastBanner toast={toast} onClose={() => setToast(null)} />
    </section>
  )
}

function QuickLink({
  href,
  label,
  icon,
  external = false,
}: {
  href: string
  label: string
  icon: IconName
  external?: boolean
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="chip flex h-10 w-10 items-center justify-center text-ivory"
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      <Icon name={icon} className="h-4 w-4" />
    </a>
  )
}

function ToastBanner({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  if (!toast) return null
  const accent = toast.type === 'error' ? '#fb7185' : '#7ed49a'

  return (
    <div
      className="fixed bottom-6 right-6 z-60 w-[calc(100%-3rem)] max-w-sm"
      role="status"
      aria-live="polite"
    >
      <div
        className="glass relative flex items-start gap-3 p-4"
        style={{ borderColor: accent }}
      >
        <span
          className="mt-1 h-2 w-2 flex-shrink-0 rounded-full"
          style={{ background: accent }}
        />
        <p className="flex-1 text-[13px] leading-snug text-ivory">{toast.text}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="flex-shrink-0 font-mono text-base leading-none text-dim transition-colors hover:text-ivory"
        >
          ×
        </button>
      </div>
    </div>
  )
}

function CornerMarks() {
  return (
    <>
      <span className="corner-mark tl" />
      <span className="corner-mark tr" />
      <span className="corner-mark bl" />
      <span className="corner-mark br" />
    </>
  )
}
