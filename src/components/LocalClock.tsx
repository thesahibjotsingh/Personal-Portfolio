import { useEffect, useState } from 'react'

/* The visitor's own local time, ticking once every 15 seconds. */
export default function LocalClock({ className = '' }: { className?: string }) {
  const format = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  const [time, setTime] = useState(format)

  useEffect(() => {
    const id = window.setInterval(() => setTime(format()), 15000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <span
      className={`items-baseline gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-dim ${className}`}
    >
      Local <span className="tabular-nums text-ivory">{time}</span>
    </span>
  )
}
