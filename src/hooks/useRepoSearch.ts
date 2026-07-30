import { useEffect, useState } from 'react'
import { searchRepos, type Repo } from '../lib/tangled'

const MINIMUM_QUERY_LENGTH = 2
const SEARCH_DEBOUNCE_MS = 180

type SearchState = {
  query: string
  results: Repo[]
}

type UseRepoSearchOptions = {
  limit?: number
  minimumQueryLength?: number
}

export function useRepoSearch(input: string, options: UseRepoSearchOptions = {}) {
  const { limit = 8, minimumQueryLength = MINIMUM_QUERY_LENGTH } = options
  const [state, setState] = useState<SearchState>({ query: '', results: [] })
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const query = input.trim()
    if (query.length < minimumQueryLength) {
      setState({ query, results: [] })
      setIsSearching(false)
      setError(null)
      return
    }

    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      setIsSearching(true)
      setError(null)
      try {
        setState({ query, results: await searchRepos(query, controller.signal, limit) })
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setState({ query, results: [] })
          setError(error instanceof Error ? error : new Error('Could not search repositories.'))
        }
      } finally {
        if (!controller.signal.aborted) setIsSearching(false)
      }
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      controller.abort()
      window.clearTimeout(timeout)
    }
  }, [input, limit, minimumQueryLength])

  const query = input.trim()
  const hasCurrentResults = state.query === query
  const isPending = query.length >= minimumQueryLength && !hasCurrentResults

  return {
    results: hasCurrentResults ? state.results : [],
    isSearching: isSearching || isPending,
    error: hasCurrentResults ? error : null,
  }
}
