import type { Did } from '@atcute/lexicons'
import { queryPipelines } from '../lib/tangled/pipeline'
import { useCursorList } from './useCursorList'

const INITIAL_PIPELINE_LIMIT = 20

export function useRepoPipelines(repoDid: Did, spindle: string) {
  const result = useCursorList(
    `${spindle}:${repoDid}`,
    (options) => queryPipelines(spindle, repoDid, options),
    INITIAL_PIPELINE_LIMIT,
  )
  return {
    pipelines: result.data,
    error: result.error,
    hasMore: result.hasMore,
    isLoadingMore: result.isLoadingMore,
    loadMore: result.loadMore,
  }
}
