import { parseResourceUri, type Did } from '@atcute/lexicons'
import { isDid } from '@atcute/lexicons/syntax'
import { useEffect, useState } from 'react'
import { resolveActor, type ResolvedActor } from '../lib/actor'
import type { VouchRecord } from '../lib/tangled/graph'

export type ResolvedVouch = { author: ResolvedActor; vouch: VouchRecord }

export function useResolvedVouches(vouches: VouchRecord[]) {
  const [resolvedVouches, setResolvedVouches] = useState<ResolvedVouch[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCancelled = false

    async function loadVouches() {
      setIsLoading(true)
      const authorDids = [
        ...new Set(vouches.map(getVouchAuthorDid).filter((did): did is Did => did !== null)),
      ]
      const results = await Promise.allSettled(
        authorDids.map(async (did): Promise<[Did, ResolvedActor]> => [
          did,
          await resolveActor(did),
        ]),
      )

      if (isCancelled) return

      const authors = new Map(
        results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : [])),
      )
      setResolvedVouches(
        vouches.flatMap((vouch) => {
          const authorDid = getVouchAuthorDid(vouch)
          const author = authorDid === null ? undefined : authors.get(authorDid)
          return author === undefined ? [] : [{ vouch, author }]
        }),
      )
      setIsLoading(false)
    }

    void loadVouches()
    return () => {
      isCancelled = true
    }
  }, [vouches])

  return { resolvedVouches, isLoading }
}

function getVouchAuthorDid(vouch: VouchRecord): Did | null {
  const { repo } = parseResourceUri(vouch.uri)
  return isDid(repo) ? repo : null
}
