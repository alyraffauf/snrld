import type { Handle } from '@atcute/lexicons'
import { useEffect, useState } from 'react'
import { loadRepoPage, type RepoPageData } from '../lib/repoPage'

type RepoPageState = {
  data?: RepoPageData
  error?: Error
  key: string
}

export function useRepoPage(handle: Handle | null, repoKey?: string) {
  const pageKey = handle === null || repoKey === undefined ? null : `${handle}/${repoKey}`
  const [state, setState] = useState<RepoPageState | null>(null)

  useEffect(() => {
    if (handle === null || repoKey === undefined) return
    const ownerHandle = handle
    const repositoryKey = repoKey
    const currentPageKey = `${ownerHandle}/${repositoryKey}`
    let isCancelled = false

    async function loadPage() {
      try {
        const data = await loadRepoPage(ownerHandle, repositoryKey)
        if (isCancelled) return

        setState({ key: currentPageKey, data })
      } catch (caught) {
        if (!isCancelled) {
          setState({
            key: currentPageKey,
            error: caught instanceof Error ? caught : new Error('Unable to load repository'),
          })
        }
      }
    }

    void loadPage()
    return () => {
      isCancelled = true
    }
  }, [handle, repoKey])

  const isCurrentRoute = state?.key === pageKey
  return {
    pageData: isCurrentRoute ? (state.data ?? null) : null,
    error: isCurrentRoute ? (state.error ?? null) : null,
  }
}
