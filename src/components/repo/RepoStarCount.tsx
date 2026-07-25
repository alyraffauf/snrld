import type { Did } from '@atcute/lexicons'
import { IconStar } from '@tabler/icons-react'
import { useRepoStarCount } from '../../hooks/useRepoStarCount'

type RepoStarCountProps = {
  repoDid?: Did
}

export function RepoStarCount({ repoDid }: RepoStarCountProps) {
  const { starCount, hasFailed } = useRepoStarCount(repoDid)

  if (repoDid === undefined) return null

  return (
    <span className="shrink-0 font-mono text-sm leading-4 tabular-nums text-ctp-yellow">
      <IconStar
        size={16}
        stroke={1.75}
        aria-hidden="true"
        className="mr-1 inline-block align-middle text-current"
      />
      {hasFailed ? '—' : (starCount ?? '…')}
    </span>
  )
}
