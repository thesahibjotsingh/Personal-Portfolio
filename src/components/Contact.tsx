import { useEffect, useRef, useState, type FormEvent } from 'react'
import emailjs from '@emailjs/browser'
import Reveal from './Reveal'
import SectionLabel from './SectionLabel'
import Icon, { type IconName } from './Icon'
import { CONFIG, EMAILJS, PROJECT_TYPES } from '../lib/config'

const DEFAULTS = {
  name: '',
  email: '',
  type: PROJECT_TYPES[0] as string,
  message: '',
}

type Toast = { type: 'success' | 'error'; text: string } | null

const LABEL_CLASSES =
  'mb-2 block font-mono text-[10px] uppercase tracking-[0.12em] text-dim'
const FIELD_CLASSES = 'w-full px-3.5 py-3 text-[14px]'

export default function Contact() {
  const [sending, setSending] = useState(false)
  const [toast, setToast] = useState<Toast>(null)
  const [values, setValues] = useState(DEFAULTS)
  const toastTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  const showToast = (type: 'success' | 'error', text: string) => {
    window.clearTimeout(toastTimer.current)
    setToast({ type, text })
    toastTimer.current = window.setTimeout(() => setToast(null), 5000)
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (sending) return

    setSending(true)
    try {
      await emailjs.send(
        EMAILJS.serviceId,
        EMAILJS.templateId,
        {
          name: values.name,
          email: values.email,
          /* project_type is also folded into the message body: the existing
             EmailJS template doesn't reference it yet, and the classification
             is the whole point of the field. */
          project_type: values.type,
          message: `Project type: ${values.type}\n\n${values.message}`,
          title: 'Portfolio Inquiry',
          time: new Date().toLocaleString(),
          to_email: EMAILJS.toEmail,
        },
        EMAILJS.publicKey,
      )
      showToast('success', 'Message sent successfully!')
      setValues(DEFAULTS)
    } catch {
      showToast('error', 'Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section
      id="contact"
      className="px-6 py-14 md:px-8 md:py-16"
    >
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
                  A 20-minute call to scope the platform, the timeline, and whether I'm
                  the right builder for it. No pitch deck, no pressure.
                </p>
              </div>

              <div className="mt-8">
                <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-dim">
                  Quick Links
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
              <form onSubmit={submit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={LABEL_CLASSES} htmlFor="contact-name">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={values.name}
                      onChange={(e) => setValues({ ...values, name: e.target.value })}
                      placeholder="Neha Parmar"
                      className={FIELD_CLASSES}
                    />
                  </div>
                  <div>
                    <label className={LABEL_CLASSES} htmlFor="contact-email">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={values.email}
                      onChange={(e) => setValues({ ...values, email: e.target.value })}
                      placeholder="neha@company.com"
                      className={FIELD_CLASSES}
                    />
                  </div>
                </div>

                <div>
                  <label className={LABEL_CLASSES} htmlFor="contact-type">
                    Project Type
                  </label>
                  <select
                    id="contact-type"
                    value={values.type}
                    onChange={(e) => setValues({ ...values, type: e.target.value })}
                    className={FIELD_CLASSES}
                  >
                    {PROJECT_TYPES.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={LABEL_CLASSES} htmlFor="contact-message">
                    Project Details
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={values.message}
                    onChange={(e) => setValues({ ...values, message: e.target.value })}
                    placeholder="What are you building, and what does it need to do on day one?"
                    className={`${FIELD_CLASSES} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="btn-primary inline-flex items-center gap-2 px-6 py-3.5 font-mono text-[12px] uppercase tracking-[0.12em] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {sending ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-carnation/25 border-t-carnation" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Inquiry
                      <Icon name="arrow" className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </form>
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
