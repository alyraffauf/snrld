import type { Did } from '@atcute/lexicons'
import { useCallback } from 'react'
import { countStars } from '../lib/tangled/feed'
import { useDeferredResource } from './useDeferredResource'

export function useRepoStarCount(repoDid?: Did, isEnabled = true) {
  const loadStarCount = useCallback((): Promise<number> => {
    if (repoDid === undefined) throw new Error('Repository DID is required')

    return countStars(repoDid)
  }, [repoDid])
  const key = isEnabled ? (repoDid ?? null) : null
  const { data: starCount, error } = useDeferredResource(key, true, loadStarCount)

  return { starCount, hasFailed: error !== null }
}
