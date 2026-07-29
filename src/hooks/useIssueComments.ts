import type { ResourceUri } from '@atcute/lexicons'
import { useEffect, useState } from 'react'
import { listComments, type CommentList } from '../lib/tangled/feed'

const INITIAL_COMMENT_LIMIT = 50

export function useIssueComments(issue: ResourceUri) {
  const [comments, setComments] = useState<CommentList | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isCancelled = false

    async function loadComments() {
      setComments(null)
      setError(null)

      try {
        const result = await listComments(issue, { limit: INITIAL_COMMENT_LIMIT, order: 'asc' })
        if (!isCancelled) setComments(result)
      } catch (caught) {
        if (!isCancelled) {
          setError(caught instanceof Error ? caught : new Error('Unable to load comments.'))
        }
      }
    }

    void loadComments()

    return () => {
      isCancelled = true
    }
  }, [issue])

  return { comments, error }
}
