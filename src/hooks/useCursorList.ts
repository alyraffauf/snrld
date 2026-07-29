import { useCallback, useEffect, useRef, useState } from 'react'

type CursorList<T> = {
  cursor?: string
  items: T[]
}

type CursorListOptions = {
  cursor?: string
  limit: number
}

type CursorListState<T> = {
  data?: CursorList<T>
  error?: Error
  key: string
}

export function useCursorList<T>(
  key: string | null,
  load: (options: CursorListOptions) => Promise<CursorList<T>>,
  limit: number,
) {
  const [state, setState] = useState<CursorListState<T> | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const loadRef = useRef(load)
  loadRef.current = load

  useEffect(() => {
    if (key === null) return

    let isCancelled = false
    setState({ key })

    void loadRef
      .current({ limit })
      .then((data) => {
        if (!isCancelled) setState({ key, data })
      })
      .catch((caught) => {
        if (!isCancelled) {
          setState({
            key,
            error: caught instanceof Error ? caught : new Error('Unable to load list'),
          })
        }
      })

    return () => {
      isCancelled = true
    }
  }, [key, limit])

  const isCurrentList = state?.key === key
  const data = isCurrentList ? (state.data ?? null) : null
  const error = isCurrentList ? (state.error ?? null) : null

  const loadMore = useCallback(async () => {
    if (key === null || data?.cursor === undefined || isLoadingMore) return

    setIsLoadingMore(true)
    try {
      const nextPage = await loadRef.current({ cursor: data.cursor, limit })
      setState((currentState) => {
        if (currentState?.key !== key || currentState.data === undefined) return currentState

        return {
          key,
          data: {
            items: [...currentState.data.items, ...nextPage.items],
            cursor: nextPage.cursor,
          },
        }
      })
    } catch (caught) {
      setState((currentState) => {
        if (currentState?.key !== key || currentState.data === undefined) return currentState

        return {
          key,
          data: currentState.data,
          error: caught instanceof Error ? caught : new Error('Unable to load more items'),
        }
      })
    } finally {
      setIsLoadingMore(false)
    }
  }, [data?.cursor, isLoadingMore, key, limit])

  return {
    data,
    error,
    hasMore: data?.cursor !== undefined,
    isLoadingMore,
    loadMore,
  }
}
