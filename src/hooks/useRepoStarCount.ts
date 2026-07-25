import type { Did } from '@atcute/lexicons'
import { useEffect, useState } from 'react'
import { countStars } from '../lib/tangled/feed'

export function useRepoStarCount(repoDid?: Did) {
  const [starCount, setStarCount] = useState<number | null>(null)
  const [hasFailed, setHasFailed] = useState(false)

  useEffect(() => {
    setStarCount(null)
    setHasFailed(false)
    if (repoDid === undefined) return

    let isCancelled = false
    countStars(repoDid)
      .then((count) => {
        if (!isCancelled) setStarCount(count)
      })
      .catch(() => {
        if (!isCancelled) setHasFailed(true)
      })

    return () => {
      isCancelled = true
    }
  }, [repoDid])

  return { starCount, hasFailed }
}
