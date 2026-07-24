import type { ReactNode } from 'react'

type ProfileOverviewProps = {
  profile: ReactNode
  pinnedRepos: ReactNode
}

export function ProfileOverview({ profile, pinnedRepos }: ProfileOverviewProps) {
  return (
    <section className="grid gap-0 overflow-hidden rounded border border-ctp-surface-1 bg-ctp-mantle lg:grid-cols-3">
      <aside className="border-b border-ctp-surface-1 p-5 sm:p-6 lg:border-b-0">{profile}</aside>

      <div className="min-w-0 space-y-4 p-5 sm:p-6 lg:col-span-2">{pinnedRepos}</div>
    </section>
  )
}
