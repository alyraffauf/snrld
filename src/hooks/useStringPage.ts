import type { Handle } from '@atcute/lexicons'
import { useEffect, useState } from 'react'
import { loadStringPage, type StringPageData } from '../lib/stringPage'

export function useStringPage(handle: Handle | null, stringKey?: string) {
  const pageKey = handle === null || stringKey === undefined ? null : `${handle}/${stringKey}`
  const [state, setState] = useState<{
    data?: StringPageData
    error?: Error
    key: string
  } | null>(null)

  useEffect(() => {
    if (handle === null || stringKey === undefined) return
    const ownerHandle = handle
    const recordKey = stringKey
    const currentPageKey = `${ownerHandle}/${recordKey}`
    let isCancelled = false

    async function loadPage() {
      try {
        const data = await loadStringPage(ownerHandle, recordKey)
        if (!isCancelled) setState({ key: currentPageKey, data })
      } catch (caught) {
        if (!isCancelled) {
          setState({
            key: currentPageKey,
            error: caught instanceof Error ? caught : new Error('Unable to load string'),
          })
        }
      }
    }

    void loadPage()
    return () => {
      isCancelled = true
    }
  }, [handle, stringKey])

  const isCurrentRoute = state?.key === pageKey
  return {
    pageData: isCurrentRoute ? (state.data ?? null) : null,
    error: isCurrentRoute ? (state.error ?? null) : null,
  }
}
