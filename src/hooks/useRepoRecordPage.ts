import type { Handle } from '@atcute/lexicons'
import { useEffect, useState } from 'react'

type LoadRecordPage<TPageData> = (
  repoOwnerHandle: Handle,
  repoKey: string,
  recordOwnerHandle: Handle,
  recordKey: string,
) => Promise<TPageData>

type UseRepoRecordPageOptions<TPageData> = {
  loadPage: LoadRecordPage<TPageData>
  recordKey: string | undefined
  recordOwnerHandle: Handle | null
  repoKey: string | undefined
  repoOwnerHandle: Handle | null
}

type PageState<TPageData> = {
  data?: TPageData
  error?: Error
  key: string
}

export function useRepoRecordPage<TPageData>({
  loadPage,
  recordKey,
  recordOwnerHandle,
  repoKey,
  repoOwnerHandle,
}: UseRepoRecordPageOptions<TPageData>) {
  const route = getRecordRoute(repoOwnerHandle, repoKey, recordOwnerHandle, recordKey)
  const pageKey = route?.key ?? null
  const [state, setState] = useState<PageState<TPageData> | null>(null)

  useEffect(() => {
    const currentRoute = getRecordRoute(repoOwnerHandle, repoKey, recordOwnerHandle, recordKey)
    if (currentRoute === null) return

    let isCancelled = false

    void loadPage(
      currentRoute.repoOwnerHandle,
      currentRoute.repoKey,
      currentRoute.recordOwnerHandle,
      currentRoute.recordKey,
    )
      .then((data) => {
        if (!isCancelled) setState({ key: currentRoute.key, data })
      })
      .catch((caught) => {
        if (!isCancelled) {
          setState({
            key: currentRoute.key,
            error: caught instanceof Error ? caught : new Error('Unable to load record'),
          })
        }
      })

    return () => {
      isCancelled = true
    }
  }, [loadPage, recordKey, recordOwnerHandle, repoKey, repoOwnerHandle])

  const isCurrentPage = state?.key === pageKey
  return {
    error: isCurrentPage ? (state.error ?? null) : null,
    pageData: isCurrentPage ? (state.data ?? null) : null,
  }
}

type RecordRoute = {
  key: string
  recordKey: string
  recordOwnerHandle: Handle
  repoKey: string
  repoOwnerHandle: Handle
}

function getRecordRoute(
  repoOwnerHandle: Handle | null,
  repoKey: string | undefined,
  recordOwnerHandle: Handle | null,
  recordKey: string | undefined,
): RecordRoute | null {
  if (
    repoOwnerHandle === null ||
    repoKey === undefined ||
    recordOwnerHandle === null ||
    recordKey === undefined
  ) {
    return null
  }

  return {
    key: `${repoOwnerHandle}/${repoKey}/${recordOwnerHandle}/${recordKey}`,
    recordKey,
    recordOwnerHandle,
    repoKey,
    repoOwnerHandle,
  }
}
