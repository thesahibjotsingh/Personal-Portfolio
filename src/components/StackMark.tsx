import type { StackItem } from '../lib/content'

/* A stack item's icon: its logo when there is one, otherwise a small monogram
   tile so every entry still has a mark of the same size. */
export default function StackMark({
  item,
  className = '',
}: {
  item: StackItem
  className?: string
}) {
  if (item.logo) {
    return <img src={item.logo} alt="" className={`object-contain ${className}`} />
  }
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center rounded-md border border-hairline font-mono text-[10px] font-medium text-ivory md:text-xs ${className}`}
    >
      {item.mark}
    </span>
  )
}
