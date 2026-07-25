import type { Did } from '@atcute/lexicons'
import { useEffect, useState } from 'react'
import { countFollows, countFollowsBy } from '../lib/tangled/graph'

export function useProfileFollowCounts(did: Did) {
  const [followers, setFollowers] = useState<number | null>(null)
  const [following, setFollowing] = useState<number | null>(null)

  useEffect(() => {
    let isCancelled = false

    async function loadFollowCounts() {
      try {
        const [followersCount, followingCount] = await Promise.all([
          countFollows(did),
          countFollowsBy(did),
        ])

        if (!isCancelled) {
          setFollowers(followersCount)
          setFollowing(followingCount)
        }
      } catch {
        if (!isCancelled) {
          setFollowers(null)
          setFollowing(null)
        }
      }
    }

    void loadFollowCounts()
    return () => {
      isCancelled = true
    }
  }, [did])

  return { followers, following }
}
