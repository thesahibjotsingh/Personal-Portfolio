import { REGIONS, type RegionKey } from '../lib/config'
import { useRegion } from '../lib/region'

const ORDER: RegionKey[] = ['IN', 'US', 'CA']

/* "Prices shown in ₹ INR · $ USD · C$ CAD". Detection can be wrong (a VPN, a
   traveller), so the visitor can always pick their own currency. */
export default function RegionSwitch({ className = '' }: { className?: string }) {
  const [region, setRegion] = useRegion()

  return (
    <div
      role="group"
      aria-label="Currency"
      className={`flex flex-wrap items-center gap-x-3 gap-y-2 ${className}`}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-dim">
        Prices in
      </span>
      <div className="flex gap-1.5">
        {ORDER.map((key) => {
          const r = REGIONS[key]
          const active = key === region
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              onClick={() => setRegion(key)}
              className={`chip px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-[0.08em] transition-colors ${
                active ? 'border-carnation bg-carnation/10 text-ivory' : 'text-dim'
              }`}
            >
              {r.symbol} {r.code}
            </button>
          )
        })}
      </div>
    </div>
  )
}
