import type { Handle } from '@atcute/lexicons'
import { useCallback } from 'react'
import { loadRepoPage, type RepoPageData } from '../lib/repoPage'
import { useDeferredResource } from './useDeferredResource'

export function useRepoPage(handle: Handle | null, repoKey?: string) {
  const pageKey = handle === null || repoKey === undefined ? null : `${handle}/${repoKey}`
  const loadPage = useCallback((): Promise<RepoPageData> => {
    if (handle === null || repoKey === undefined) {
      throw new Error('Repository identity is required')
    }

    return loadRepoPage(handle, repoKey)
  }, [handle, repoKey])
  const { data, error } = useDeferredResource(pageKey, true, loadPage)

  return {
    pageData: data,
    error,
  }
}
