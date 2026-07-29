import type { Did } from '@atcute/lexicons'
import { IconStar } from '@tabler/icons-react'
import { useRepoStarCount } from '../../hooks/useRepoStarCount'
import { useElementVisibility } from '../../hooks/useElementVisibility'
import { RepoActionControl } from './RepoActionControl'

type RepoStarCountProps = {
  repoDid?: Did
  variant?: 'count' | 'action'
}

export function RepoStarCount({ repoDid, variant = 'count' }: RepoStarCountProps) {
  const { elementRef, isVisible } = useElementVisibility()
  const { starCount, hasFailed } = useRepoStarCount(repoDid, isVisible)

  if (repoDid === undefined) return null

  const count = hasFailed ? '—' : (starCount ?? '…')

  if (variant === 'action') {
    return (
      <span ref={elementRef}>
        <RepoActionControl ariaLabel="Star repository" count={count} countLabel={`${count} stars`}>
          <IconStar size={16} stroke={1.75} aria-hidden="true" className="text-ctp-yellow" />
        </RepoActionControl>
      </span>
    )
  }

  return (
    <span ref={elementRef}>
      <span
        className="inline-flex shrink-0 items-center gap-1 font-mono text-sm leading-none tabular-nums text-ctp-yellow"
        aria-label={`${count} stars`}
      >
        <IconStar size={16} stroke={1.75} aria-hidden="true" />
        {count}
      </span>
    </span>
  )
}
