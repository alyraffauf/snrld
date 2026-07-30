import { useEffect, useRef, useState } from 'react'

type ResourceState<T> = {
  data?: T
  error?: Error
  key: string
}

export function useDeferredResource<T>(
  key: string | null,
  isEnabled: boolean,
  load: (key: string) => Promise<T>,
) {
  const inFlightRequests = useRef(new Map<string, Promise<T>>())
  const [state, setState] = useState<ResourceState<T> | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state

  useEffect(() => {
    if (key === null || !isEnabled) return
    if (stateRef.current?.key === key && stateRef.current.data !== undefined) return

    let isCancelled = false
    setState({ key })

    const request = getRequest(key, load, inFlightRequests.current)
    void request
      .then((data) => {
        if (!isCancelled) setState({ key, data })
      })
      .catch((caught) => {
        if (!isCancelled) {
          setState({
            key,
            error: caught instanceof Error ? caught : new Error('Unable to load data'),
          })
        }
      })

    return () => {
      isCancelled = true
    }
  }, [isEnabled, key, load])

  const isCurrentResource = state?.key === key
  return {
    data: isCurrentResource ? (state.data ?? null) : null,
    error: isCurrentResource ? (state.error ?? null) : null,
  }
}

function getRequest<T>(
  key: string,
  load: (key: string) => Promise<T>,
  requests: Map<string, Promise<T>>,
) {
  const existingRequest = requests.get(key)
  if (existingRequest !== undefined) return existingRequest

  const request = load(key).finally(() => requests.delete(key))
  requests.set(key, request)
  return request
}
