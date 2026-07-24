import type { ReactNode } from 'react'

type ProfileOverviewProps = {
  profile: ReactNode
  pinnedRepos: ReactNode
}

export function ProfileOverview({ profile, pinnedRepos }: ProfileOverviewProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div>{profile}</div>
      <section className="lg:col-span-2">{pinnedRepos}</section>
    </div>
  )
}
