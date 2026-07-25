import type { Did } from '@atcute/lexicons'
import { useEffect, useState } from 'react'
import { listIssues, type IssueList } from '../lib/tangled/repo'

const INITIAL_ISSUE_LIMIT = 20

export function useRepoIssues(repoDid: Did) {
  const [issues, setIssues] = useState<IssueList | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadIssues() {
      setError(null)
      try {
        const result = await listIssues(repoDid, { limit: INITIAL_ISSUE_LIMIT })
        setIssues(result)
      } catch (caught) {
        setError(caught instanceof Error ? caught : new Error('Unable to load issues.'))
      }
    }

    void loadIssues()
  }, [repoDid])
  return { issues, error }
}
