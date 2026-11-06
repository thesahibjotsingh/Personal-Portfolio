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
   - slides away while you scroll down (you're reading) and back as soon as you
     scroll up (you're looking for something);
   - hidden over the hero, which already has both buttons, and hidden again once
     the Contact section — and the brief itself — is reached.
   Only below 768px; desktop never shows it. */
export default function MobileActionBar() {
  const [pastHero, setPastHero] = useState(false)
  const [inContact, setInContact] = useState(false)
  const [scrollingDown, setScrollingDown] = useState(false)

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

    // direction, with a small dead zone so a wobble doesn't make it flicker
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (y > last + 10) setScrollingDown(true)
      else if (y < last - 10) setScrollingDown(false)
      if (Math.abs(y - last) > 10) last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      hero.kill()
      contact.kill()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const visible = pastHero && !inContact && !scrollingDown

  return (
    <div
      className={`fixed inset-x-4 z-[55] flex gap-2 rounded-full border border-white/10 bg-black/75 p-1 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-300 md:hidden ${
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
        className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[var(--wa-green)]/50 px-3 py-2 text-[13px] font-medium text-[#f4f1ea]"
      >
        <Icon name="whatsapp" className="h-[1.05em] w-[1.05em] text-[var(--wa-green)]" />
        WhatsApp
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
      <a
        href="#contact"
        tabIndex={visible ? 0 : -1}
        className="flex flex-[1.4] items-center justify-center rounded-full bg-carnation px-3 py-2 text-[13px] font-medium text-[#0a0909]"
      >
        Start your brief
      </a>
    </div>
  )
}
