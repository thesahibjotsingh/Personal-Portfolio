/* Text-roll hover: the label slides up and out while an identical copy slides
   in from below. Triggered by hovering or focusing the nearest link or button
   (see .roll in index.css). The visible copies are aria-hidden; screen readers
   get the label once, from the sr-only span. */
export default function Roll({ children }: { children: string }) {
  return (
    <span className="roll">
      <span className="sr-only">{children}</span>
      <span className="roll-a" aria-hidden="true">
        {children}
      </span>
      <span className="roll-b" aria-hidden="true">
        {children}
      </span>
    </span>
  )
}
