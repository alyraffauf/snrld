import type { Did } from '@atcute/lexicons'
import { listPulls, type PullList } from '../lib/tangled/repo'
import { useCursorList } from './useCursorList'

const INITIAL_PULL_LIMIT = 20

export function useRepoPulls(repoDid: Did) {
  const { data, error, hasMore, isLoadingMore, loadMore } = useCursorList(
    repoDid,
    (options) => listPulls(repoDid, options),
    INITIAL_PULL_LIMIT,
  )

  return { pulls: data as PullList | null, error, hasMore, isLoadingMore, loadMore }
}
