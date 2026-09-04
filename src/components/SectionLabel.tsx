import type { ReactNode } from 'react'

export default function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="hidden items-start justify-center pt-1 lg:flex">
      <span
        className="whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.3em] text-dim"
        style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
      >
        {children}
      </span>
    </div>
  )
}
