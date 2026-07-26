import { parseResourceUri, type Handle, type ResourceUri } from '@atcute/lexicons'
import { useEffect, useMemo, useState } from 'react'
import { resolveMiniDoc } from '../lib/actor'

type RecordWithUri = {
  uri: ResourceUri
}

type AuthorsState = {
  authors: Map<string, Handle>
  error: Error | null
  key: string
}

export function useRecordAuthors(records: readonly RecordWithUri[]) {
  const authorDids = useMemo(
    () => [...new Set(records.map(({ uri }) => parseResourceUri(uri).repo))],
    [records],
  )
  const authorsKey = [...authorDids].sort().join(',')
  const [state, setState] = useState<AuthorsState | null>(null)

  useEffect(() => {
    let isCancelled = false

    void Promise.allSettled(
      authorDids.map(async (did) => [did, (await resolveMiniDoc(did)).handle] as const),
    ).then((results) => {
      if (isCancelled) return

      const authors = new Map<string, Handle>()
      const failedResolutions = results.filter((result) => result.status === 'rejected')
      for (const result of results) {
        if (result.status === 'fulfilled') authors.set(...result.value)
      }

      setState({
        authors,
        error:
          failedResolutions.length > 0
            ? new Error('Some record authors could not be resolved')
            : null,
        key: authorsKey,
      })
    })

    return () => {
      isCancelled = true
    }
  }, [authorDids, authorsKey])

  const isCurrentList = state?.key === authorsKey
  return {
    authors: isCurrentList ? (state.authors ?? null) : null,
    error: isCurrentList ? (state.error ?? null) : null,
  }
}
