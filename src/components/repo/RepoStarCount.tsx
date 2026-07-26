import type { Did } from '@atcute/lexicons'
import { IconStar } from '@tabler/icons-react'
import { useRepoStarCount } from '../../hooks/useRepoStarCount'
import { RepoActionControl } from './RepoActionControl'

type RepoStarCountProps = {
  repoDid?: Did
  variant?: 'count' | 'action'
}

export function RepoStarCount({ repoDid, variant = 'count' }: RepoStarCountProps) {
  const { starCount, hasFailed } = useRepoStarCount(repoDid)

  if (repoDid === undefined) return null

  const count = hasFailed ? '—' : (starCount ?? '…')

  if (variant === 'action') {
    return (
      <RepoActionControl ariaLabel="Star repository" count={count} countLabel={`${count} stars`}>
        <IconStar size={16} stroke={1.75} aria-hidden="true" className="text-ctp-yellow" />
      </RepoActionControl>
    )
  }

  return (
    <span className="shrink-0 font-mono text-sm leading-4 tabular-nums text-ctp-yellow">
      <IconStar
        size={16}
        stroke={1.75}
        aria-hidden="true"
        className="mr-1 inline-block align-middle text-current"
      />
      {count}
    </span>
  )
}
