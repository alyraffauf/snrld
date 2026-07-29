import type { Handle } from '@atcute/lexicons'
import type { $output as RepoTreeResponse } from '@atcute/tangled/types/repo/tree'
import { useEffect, useState } from 'react'
import { loadRepoPage, type RepoPageData } from '../lib/repoPage'
import { getRepoTree } from '../lib/tangled/repo'

type RepoPageState = {
  data?: RepoPageData
  error?: Error
  key: string
  rootTree?: RepoTreeResponse
  rootTreeError?: Error
}

export function useRepoPage(handle: Handle | null, repoKey?: string, shouldLoadTree = true) {
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
        if (!shouldLoadTree) return

        try {
          const rootTree = await getRepoTree(data.repo)
          if (!isCancelled) setState({ key: currentPageKey, data, rootTree })
        } catch (caught) {
          if (!isCancelled) {
            setState({
              key: currentPageKey,
              data,
              rootTreeError:
                caught instanceof Error ? caught : new Error('Unable to load repository contents'),
            })
          }
        }
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
  }, [handle, repoKey, shouldLoadTree])

  const isCurrentRoute = state?.key === pageKey
  return {
    pageData: isCurrentRoute ? (state.data ?? null) : null,
    error: isCurrentRoute ? (state.error ?? null) : null,
    rootTree: isCurrentRoute ? (state.rootTree ?? null) : null,
    rootTreeError: isCurrentRoute ? (state.rootTreeError ?? null) : null,
  }
}
