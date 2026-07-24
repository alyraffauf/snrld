import type { ReactNode } from 'react'

type ProfileOverviewProps = {
  children: ReactNode
}

export function ProfileOverview({ children }: ProfileOverviewProps) {
  return (
    <section aria-labelledby="pinned-repos" className="space-y-4">
      {children}
    </section>
  )
}
