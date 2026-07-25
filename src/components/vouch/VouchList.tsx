import { parseResourceUri, type Did } from '@atcute/lexicons'
import { isDid } from '@atcute/lexicons/syntax'
import { useEffect, useState } from 'react'
import { getProfile as getBskyProfile } from '../../lib/bsky/actor'
import { getMiniDoc } from '../../lib/microcosm'
import { getProfile } from '../../lib/tangled'
import type { VouchRecord } from '../../lib/tangled/graph'
import { VouchListItem, type VouchAuthor } from './VouchListItem'

type VouchListProps = {
  vouches: VouchRecord[]
}

export function VouchList({ vouches }: VouchListProps) {
  const [authors, setAuthors] = useState<Map<string, VouchAuthor>>(new Map())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadAuthors() {
      setIsLoading(true)

      const authorDids = [
        ...new Set(vouches.map(getVouchAuthorDid).filter((did): did is Did => did !== null)),
      ]

      const resolvedAuthors = await Promise.allSettled(
        authorDids.map(async (did): Promise<[string, VouchAuthor]> => {
          const [miniDoc, profile] = await Promise.all([getMiniDoc(did), getProfile(did)])
          const bskyProfile = await getBskyProfile(miniDoc).catch(() => null)

          return [did, { miniDoc, profile, bskyProfile }]
        }),
      )

      if (cancelled) return

      setAuthors(
        new Map(
          resolvedAuthors.flatMap((result) =>
            result.status === 'fulfilled' ? [result.value] : [],
          ),
        ),
      )
      setIsLoading(false)
    }

    void loadAuthors()

    return () => {
      cancelled = true
    }
  }, [vouches])

  if (isLoading) {
    return <p>Loading vouches...</p>
  }

  const visibleVouches = vouches.filter((vouch) => {
    const authorDid = getVouchAuthorDid(vouch)
    return authorDid !== null && authors.has(authorDid)
  })

  if (visibleVouches.length === 0) {
    return <p>Vouches could not be resolved.</p>
  }

  return (
    <div className="space-y-3">
      {visibleVouches.map((vouch) => {
        const authorDid = getVouchAuthorDid(vouch)
        if (authorDid === null) return null

        const author = authors.get(authorDid)

        if (author === undefined) return null

        return <VouchListItem key={vouch.uri} vouchRecord={vouch} author={author} />
      })}
    </div>
  )
}

function getVouchAuthorDid(vouch: VouchRecord): Did | null {
  const { repo } = parseResourceUri(vouch.uri)
  return isDid(repo) ? repo : null
}
