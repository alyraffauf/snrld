import type { Did } from '@atcute/lexicons'
import { useEffect, useState } from 'react'
import { listPulls, type PullList } from '../lib/tangled/repo'

const INITIAL_PULL_LIMIT = 20

export function useRepoPulls(repoDid: Did) {
  const [pulls, setPulls] = useState<PullList | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadPulls() {
      setError(null)
      try {
        const result = await listPulls(repoDid, { limit: INITIAL_PULL_LIMIT })
        setPulls(result)
      } catch (caught) {
        setError(caught instanceof Error ? caught : new Error('Unable to load pulls.'))
      }
    }

    void loadPulls()
  }, [repoDid])

  return { pulls, error }
}
