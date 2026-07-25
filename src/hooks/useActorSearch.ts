import { useEffect, useState } from 'react'
import { searchBlueskyActors, type BlueskyActorSearchResult } from '../lib/bsky/actorSearch'

const MINIMUM_QUERY_LENGTH = 2
const SEARCH_DEBOUNCE_MS = 180

export function useActorSearch(input: string) {
  const [results, setResults] = useState<BlueskyActorSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const query = input.trim()
    if (query.length < MINIMUM_QUERY_LENGTH) {
      setResults([])
      setIsSearching(false)
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setIsSearching(true)
      try {
        setResults(await searchBlueskyActors(query, controller.signal))
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setResults([])
        }
      } finally {
        if (!controller.signal.aborted) setIsSearching(false)
      }
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      controller.abort()
      window.clearTimeout(timeout)
    }
  }, [input])

  return { results, isSearching }
}
