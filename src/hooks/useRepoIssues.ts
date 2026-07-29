import type { Did } from '@atcute/lexicons'
import { listIssues, type IssueList } from '../lib/tangled/repo'
import { useCursorList } from './useCursorList'

const INITIAL_ISSUE_LIMIT = 20

export function useRepoIssues(repoDid: Did) {
  const { data, error, hasMore, isLoadingMore, loadMore } = useCursorList(
    repoDid,
    (options) => listIssues(repoDid, options),
    INITIAL_ISSUE_LIMIT,
  )

  return { issues: data as IssueList | null, error, hasMore, isLoadingMore, loadMore }
}
