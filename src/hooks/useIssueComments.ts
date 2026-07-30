import type { ResourceUri } from '@atcute/lexicons'
import { listComments, type CommentList } from '../lib/tangled/feed'
import { useCursorList } from './useCursorList'

const INITIAL_COMMENT_LIMIT = 20

export function useIssueComments(issue: ResourceUri, isEnabled = true) {
  const { data, error, hasMore, isLoadingMore, loadMore } = useCursorList(
    isEnabled ? issue : null,
    (options) => listComments(issue, { ...options, order: 'asc' }),
    INITIAL_COMMENT_LIMIT,
  )

  return { comments: data as CommentList | null, error, hasMore, isLoadingMore, loadMore }
}
