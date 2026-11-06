import { useEffect, useState } from 'react'
import { ScrollTrigger } from '../lib/motion'
import { CONFIG } from '../lib/config'
import Icon from './Icon'

const WHATSAPP_HREF = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
  "Hi Saheb, I'd like to discuss a project.",
)}`

/* A floating action bar for phones: WhatsApp in one tap, and a jump to the
   brief. It stays out of the way: hidden over the hero (which already has both
   buttons) and hidden again once the Contact section — and its own form — is
   reached. Only below 768px; desktop never shows it. */
export default function MobileActionBar() {
  const [pastHero, setPastHero] = useState(false)
  const [inContact, setInContact] = useState(false)

  useEffect(() => {
    const hero = ScrollTrigger.create({
      trigger: '#work',
      start: 'top 85%',
      end: 'max',
      onUpdate: (self) => setPastHero(self.progress > 0),
      onRefresh: (self) => setPastHero(self.progress > 0),
    })
    const contact = ScrollTrigger.create({
      trigger: '#contact',
      start: 'top 90%',
      end: 'max',
      onUpdate: (self) => setInContact(self.progress > 0),
      onRefresh: (self) => setInContact(self.progress > 0),
    })
    return () => {
      hero.kill()
      contact.kill()
    }
  }, [])

  const visible = pastHero && !inContact

  return (
    <div
      className={`fixed inset-x-3 z-[55] flex gap-2 rounded-full border border-white/10 bg-black/70 p-1.5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-300 md:hidden ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-6 opacity-0'
      }`}
      style={{ bottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
      aria-hidden={!visible}
    >
      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={visible ? 0 : -1}
        className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[var(--wa-green)]/60 px-4 py-3 text-[14px] font-medium text-[#f4f1ea]"
      >
        <Icon name="whatsapp" className="h-[1.1em] w-[1.1em] text-[var(--wa-green)]" />
        WhatsApp
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <a
        href="#contact"
        tabIndex={visible ? 0 : -1}
        className="flex flex-[1.3] items-center justify-center gap-2 rounded-full bg-carnation px-4 py-3 text-[14px] font-medium text-[#0a0909]"
      >
        Start a project
      </a>
    </div>
  )
}
