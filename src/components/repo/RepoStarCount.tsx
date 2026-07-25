import type { Did } from '@atcute/lexicons'
import { useEffect, useState } from 'react'
import { IconStar } from '@tabler/icons-react'
import { countStars } from '../../lib/tangled/feed'

type RepoStarCountProps = {
  repoDid?: Did
}

export function RepoStarCount({ repoDid }: RepoStarCountProps) {
  const [stars, setStars] = useState<number | null>(null)
  const [starsFailed, setStarsFailed] = useState(false)

  useEffect(() => {
    if (repoDid === undefined) return

    let cancelled = false
    setStars(null)
    setStarsFailed(false)

    countStars(repoDid)
      .then((count) => {
        if (!cancelled) setStars(count)
      })
      .catch(() => {
        if (!cancelled) setStarsFailed(true)
      })

    return () => {
      cancelled = true
    }
  }, [repoDid])

  if (repoDid === undefined) return null

  return (
    <span className="shrink-0 font-mono text-sm leading-4 tabular-nums text-ctp-yellow">
      <IconStar
        size={16}
        stroke={1.75}
        aria-hidden="true"
        className="mr-1 inline-block align-middle text-current"
      />
      {starsFailed ? '—' : (stars ?? '…')}
    </span>
  )
}
