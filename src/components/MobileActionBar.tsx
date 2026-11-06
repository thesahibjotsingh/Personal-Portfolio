import { useEffect, useState } from 'react'
import { ScrollTrigger } from '../lib/motion'
import { CONFIG } from '../lib/config'
import Icon from './Icon'

const WHATSAPP_HREF = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(
  "Hi Saheb, I'd like to discuss a project.",
)}`

/* A floating action bar for phones: WhatsApp in one tap, and a jump to the
   brief. It is built to stay out of the way:
   - slim, so it covers as little as possible;
   - always there once you are past the hero, so the way to reach me is never
     more than a tap away;
   - hidden over the hero, which already has both buttons, and hidden again once
     the Contact section — and the brief itself — is reached.
   Only below 768px; desktop never shows it. */
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
      className={`fixed inset-x-4 z-[55] flex gap-2.5 transition-[transform,opacity] duration-300 ease-out md:hidden ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-8 opacity-0'
      }`}
      style={{ bottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}
      aria-hidden={!visible}
    >
      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={visible ? 0 : -1}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--wa-green)] px-3 py-3 text-[14px] font-semibold text-[#06210f] transition-transform duration-150 active:scale-[0.97] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.85)]"
      >
        <Icon name="whatsapp" className="h-[1.1em] w-[1.1em]" />
        WhatsApp
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <a
        href="#contact"
        tabIndex={visible ? 0 : -1}
        className="flex flex-[1.4] items-center justify-center rounded-full bg-carnation px-3 py-3 text-[14px] font-semibold text-[#0a0909] transition-transform duration-150 active:scale-[0.97] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.85)]"
      >
        Start your brief
      </a>
    </div>
  )
}
