/* Small Live / In development pill, used wherever a project is listed. */
export default function StatusTag({ status }: { status: 'Live' | 'In development' }) {
  const live = status === 'Live'
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] ${
        live
          ? 'border-[var(--wa-green)]/40 text-[var(--wa-green)]'
          : 'border-carnation/40 text-carnation'
      }`}
    >
      <span
        className={`h-1 w-1 rounded-full ${live ? 'bg-[var(--wa-green)]' : 'bg-carnation'}`}
        aria-hidden="true"
      />
      {status}
    </span>
  )
}
