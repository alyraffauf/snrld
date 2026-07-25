import type { Handle } from '@atcute/lexicons'
import { useEffect, useState } from 'react'
import { loadProfilePage, type ProfilePageData } from '../lib/profilePage'

export function useProfilePage(handle: Handle | null) {
  const [state, setState] = useState<{
    data?: ProfilePageData
    error?: Error
    handle: Handle
  } | null>(null)

  useEffect(() => {
    if (handle === null) return
    const profileHandle = handle
    let isCancelled = false

    async function loadPage() {
      try {
        const data = await loadProfilePage(profileHandle)
        if (!isCancelled) setState({ handle: profileHandle, data })
      } catch (caught) {
        if (!isCancelled) {
          setState({
            handle: profileHandle,
            error: caught instanceof Error ? caught : new Error('Unable to load profile'),
          })
        }
      }
    }

    void loadPage()
    return () => {
      isCancelled = true
    }
  }, [handle])

  const isCurrentRoute = state?.handle === handle
  return {
    pageData: isCurrentRoute ? (state.data ?? null) : null,
    error: isCurrentRoute ? (state.error ?? null) : null,
  }
}
